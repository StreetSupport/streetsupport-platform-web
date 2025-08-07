import { GET } from '@/app/api/sitemap/route';

describe('/api/sitemap', () => {
  it('should return a valid XML sitemap', async () => {
    const response = await GET();
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');

    // Check XML structure
    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(text).toContain('</urlset>');

    // Check for homepage
    expect(text).toContain('<loc>https://streetsupport.net</loc>');

    // Check for key pages
    expect(text).toContain('<loc>https://streetsupport.net/find-help</loc>');
    expect(text).toContain('<loc>https://streetsupport.net/about</loc>');
    expect(text).toContain('<loc>https://streetsupport.net/resources</loc>');

    // Check for location pages
    expect(text).toContain('<loc>https://streetsupport.net/manchester</loc>');
    expect(text).toContain('<loc>https://streetsupport.net/manchester/advice</loc>');

    // Check for proper XML elements
    expect(text).toContain('<lastmod>');
    expect(text).toContain('<changefreq>');
    expect(text).toContain('<priority>');

    // Check priorities are set correctly
    expect(text).toContain('<priority>1.0</priority>'); // Homepage
    expect(text).toContain('<priority>0.9</priority>'); // Find Help
    expect(text).toContain('<priority>0.8</priority>'); // Location pages
  });

  it('should include all public locations', async () => {
    const response = await GET();
    const text = await response.text();

    // Load the same locations data that the sitemap uses
    let locationsData;
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'src', 'data', 'locations.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      locationsData = JSON.parse(fileContents);
    } catch {
      locationsData = (await import('../../src/data/locations.json')).default;
    }

    // Get all public locations from the data
    const publicLocations = locationsData
      .filter((location: any) => location.isPublic)
      .map((location: any) => location.slug);

    // Check that all public locations are included
    publicLocations.forEach((location: string) => {
      expect(text).toContain(`<loc>https://streetsupport.net/${location}</loc>`);
      expect(text).toContain(`<loc>https://streetsupport.net/${location}/advice</loc>`);
    });
  });

  it('should have proper changefreq and priority values', async () => {
    const response = await GET();
    const text = await response.text();

    // Homepage should have highest priority and daily updates
    const homepageMatch = text.match(/<url>\s*<loc>https:\/\/streetsupport\.net<\/loc>(.*?)<\/url>/s);
    expect(homepageMatch).toBeTruthy();
    expect(homepageMatch![1]).toContain('<priority>1.0</priority>');
    expect(homepageMatch![1]).toContain('<changefreq>daily</changefreq>');

    // Privacy policy should have low priority and yearly updates
    const privacyMatch = text.match(/<url>\s*<loc>https:\/\/streetsupport\.net\/about\/privacy-and-data\/privacy-policy<\/loc>(.*?)<\/url>/s);
    expect(privacyMatch).toBeTruthy();
    expect(privacyMatch![1]).toContain('<priority>0.4</priority>');
    expect(privacyMatch![1]).toContain('<changefreq>yearly</changefreq>');
  });

  it('should have valid lastmod dates', async () => {
    const response = await GET();
    const text = await response.text();

    const lastmodMatches = text.match(/<lastmod>(.*?)<\/lastmod>/g);
    expect(lastmodMatches).toBeTruthy();
    expect(lastmodMatches!.length).toBeGreaterThan(0);

    // Check that lastmod dates are valid ISO format
    lastmodMatches!.forEach(match => {
      const dateString = match.replace(/<\/?lastmod>/g, '');
      expect(() => new Date(dateString)).not.toThrow();
      expect(new Date(dateString).getTime()).toBeGreaterThan(0);
    });
  });
});