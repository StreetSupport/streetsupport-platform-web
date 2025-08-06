import { NextResponse } from 'next/server';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://streetsupport.net';

export async function GET() {
  // Get current date for lastmod
  const currentDate = new Date().toISOString();
  
  // Load locations data
  let locationsData;
  try {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'src', 'data', 'locations.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    locationsData = JSON.parse(fileContents);
  } catch {
    // Fallback to import if fs approach fails
    locationsData = (await import('../../../data/locations.json')).default;
  }

  // Static pages with their priority and change frequency
  const staticPages = [
    { 
      url: '', 
      lastmod: currentDate, 
      changefreq: 'daily', 
      priority: '1.0' 
    },
    { 
      url: '/find-help', 
      lastmod: currentDate, 
      changefreq: 'daily', 
      priority: '0.9' 
    },
    { 
      url: '/find-help/organisations', 
      lastmod: currentDate, 
      changefreq: 'daily', 
      priority: '0.8' 
    },
    {
      url: '/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/about/our-team',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/about/our-trustees',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/about/impact',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/about/jobs',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      url: '/resources',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/resources/alternative-giving',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/resources/branding',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/resources/charters',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/resources/effective-volunteering',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/resources/marketing',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/resources/partnership-comms',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/resources/street-feeding-groups',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/resources/user-guides',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/news',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/contact',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/accessibility',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.5'
    },
    {
      url: '/about/privacy-and-data',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    },
    {
      url: '/about/privacy-and-data/privacy-policy',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    },
    {
      url: '/about/privacy-and-data/terms-and-conditions',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    },
    {
      url: '/about/privacy-and-data/cookie-policy',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    },
    {
      url: '/about/privacy-and-data/data-protection-policy',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    },
    {
      url: '/about/privacy-and-data/ai-governance',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    },
    {
      url: '/about/privacy-and-data/ai-and-environment',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    }
  ];

  // Generate location pages from the locations data
  
  interface LocationData {
    slug: string;
    isPublic: boolean;
  }

  const locationPages = locationsData
    .filter((location: LocationData) => location.isPublic)
    .flatMap((location: LocationData) => [
      {
        url: `/${location.slug}`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '0.8'
      },
      {
        url: `/${location.slug}/advice`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      }
    ]);

  // Combine all URLs
  const allPages = [...staticPages, ...locationPages];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  });
}