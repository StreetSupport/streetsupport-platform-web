import {
  generateCanonicalUrl,
  generateSEOMetadata,
  generateLocationSEOMetadata,
  generateOrganisationSEOMetadata,
  generateFAQStructuredData,
  generateLocalBusinessStructuredData,
  generateServiceStructuredData,
  generateBreadcrumbStructuredData
} from '@/utils/seo';

describe('SEO Utilities', () => {
  describe('generateCanonicalUrl', () => {
    it('should generate correct canonical URLs', () => {
      expect(generateCanonicalUrl('about')).toBe('https://streetsupport.net/about');
      expect(generateCanonicalUrl('/about')).toBe('https://streetsupport.net/about');
      expect(generateCanonicalUrl('')).toBe('https://streetsupport.net');
      expect(generateCanonicalUrl('find-help/organisations')).toBe('https://streetsupport.net/find-help/organisations');
    });
  });

  describe('generateSEOMetadata', () => {
    it('should generate basic SEO metadata', () => {
      const metadata = generateSEOMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: 'test',
        keywords: ['test', 'seo']
      });

      expect(metadata.title).toBe('Test Page | Street Support Network');
      expect(metadata.description).toBe('Test description');
      expect(metadata.alternates?.canonical).toBe('https://streetsupport.net/test');
      expect(metadata.keywords).toContain('test');
      expect(metadata.keywords).toContain('seo');
      expect(metadata.keywords).toContain('homelessness support'); // Default keyword
    });

    it('should generate OpenGraph metadata', () => {
      const metadata = generateSEOMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: 'test'
      });

      expect(metadata.openGraph?.title).toBe('Test Page | Street Support Network');
      expect(metadata.openGraph?.description).toBe('Test description');
      expect(metadata.openGraph?.url).toBe('https://streetsupport.net/test');
      expect(metadata.openGraph?.siteName).toBe('Street Support Network');
      expect(metadata.openGraph?.locale).toBe('en_GB');
    });

    it('should generate Twitter metadata', () => {
      const metadata = generateSEOMetadata({
        title: 'Test Page',
        description: 'Test description'
      });

      expect(metadata.twitter?.card).toBe('summary_large_image');
      expect(metadata.twitter?.title).toBe('Test Page | Street Support Network');
      expect(metadata.twitter?.description).toBe('Test description');
      expect(metadata.twitter?.site).toBe('@StreetSupport');
    });

    it('should handle noIndex and noFollow directives', () => {
      const metadata = generateSEOMetadata({
        title: 'Private Page',
        noIndex: true,
        noFollow: true
      });

      expect(metadata.robots).toBe('noindex, nofollow');
    });
  });

  describe('generateLocationSEOMetadata', () => {
    it('should generate location-specific metadata', () => {
      const metadata = generateLocationSEOMetadata('Manchester', 'manchester');

      expect(metadata.title).toBe('Street Support Manchester | Street Support Network');
      expect(metadata.description).toContain('Manchester');
      expect(metadata.description).toContain('homelessness support services');
      expect(metadata.alternates?.canonical).toBe('https://streetsupport.net/manchester');
    });

    it('should generate advice page metadata', () => {
      const metadata = generateLocationSEOMetadata('Manchester', 'manchester', 'advice');

      expect(metadata.title).toBe('Emergency Advice - Street Support Manchester | Street Support Network');
      expect(metadata.description).toContain('Emergency advice');
      expect(metadata.alternates?.canonical).toBe('https://streetsupport.net/manchester/advice');
    });

    it('should generate SWEP page metadata', () => {
      const metadata = generateLocationSEOMetadata('Manchester', 'manchester', 'swep');

      expect(metadata.title).toBe('Severe Weather Emergency Protocol - Street Support Manchester | Street Support Network');
      expect(metadata.description).toContain('Severe Weather Emergency Protocol');
      expect(metadata.alternates?.canonical).toBe('https://streetsupport.net/manchester/swep');
    });

    it('should use location-specific OG image', () => {
      const metadata = generateLocationSEOMetadata('Manchester', 'manchester');

      expect(metadata.openGraph?.images?.[0].url).toBe('/assets/img/og/street-support-manchester.jpg');
      expect(metadata.openGraph?.images?.[0].alt).toBe('Street Support Manchester');
    });
  });

  describe('generateOrganisationSEOMetadata', () => {
    it('should generate organisation metadata', () => {
      const metadata = generateOrganisationSEOMetadata('Test Charity', 'test-charity', 'Helping people in need', 'Manchester');

      expect(metadata.title).toBe('Test Charity - Find Help | Street Support Network');
      expect(metadata.description).toContain('Test Charity');
      expect(metadata.description).toContain('Helping people in need');
      expect(metadata.alternates?.canonical).toBe('https://streetsupport.net/find-help/organisation/test-charity');
      expect(metadata.keywords).toContain('test charity');
      expect(metadata.keywords).toContain('manchester homeless services');
    });

    it('should handle organisation without description', () => {
      const metadata = generateOrganisationSEOMetadata('Test Charity', 'test-charity');

      expect(metadata.description).toContain('Test Charity provides support services');
      expect(metadata.description).not.toContain('undefined');
    });
  });

  describe('Structured Data Generators', () => {
    describe('generateFAQStructuredData', () => {
      it('should generate FAQ structured data', () => {
        const faqs = [
          { question: 'What is Street Support?', answer: 'A network connecting people with homelessness support.' },
          { question: 'How can I help?', answer: 'You can volunteer, donate, or refer services.' }
        ];

        const structuredData = generateFAQStructuredData(faqs);

        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('FAQPage');
        expect(structuredData.mainEntity).toHaveLength(2);
        expect(structuredData.mainEntity[0]['@type']).toBe('Question');
        expect(structuredData.mainEntity[0].name).toBe('What is Street Support?');
        expect(structuredData.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
      });
    });

    describe('generateLocalBusinessStructuredData', () => {
      it('should generate local business structured data', () => {
        const org = {
          name: 'Test Charity',
          description: 'Helping people in need',
          address: '123 Test Street, Manchester',
          telephone: '0161 123 4567',
          email: 'info@testcharity.org',
          website: 'https://testcharity.org',
          latitude: 53.4808,
          longitude: -2.2426
        };

        const structuredData = generateLocalBusinessStructuredData(org);

        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('NonprofitOrganization');
        expect(structuredData.name).toBe('Test Charity');
        expect(structuredData.address['@type']).toBe('PostalAddress');
        expect(structuredData.geo['@type']).toBe('GeoCoordinates');
        expect(structuredData.telephone).toBe('0161 123 4567');
        expect(structuredData.email).toBe('info@testcharity.org');
      });
    });

    describe('generateServiceStructuredData', () => {
      it('should generate service structured data', () => {
        const service = {
          name: 'Emergency Accommodation',
          description: 'Immediate housing for people experiencing homelessness',
          provider: 'Test Charity',
          serviceType: 'Accommodation',
          areaServed: 'Manchester',
          availableChannel: 'https://testcharity.org/emergency-help'
        };

        const structuredData = generateServiceStructuredData(service);

        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('Service');
        expect(structuredData.provider.name).toBe('Test Charity');
        expect(structuredData.areaServed.name).toBe('Manchester');
      });
    });

    describe('generateBreadcrumbStructuredData', () => {
      it('should generate breadcrumb structured data', () => {
        const breadcrumbs = [
          { name: 'Home', url: 'https://streetsupport.net/' },
          { name: 'Find Help', url: 'https://streetsupport.net/find-help' },
          { name: 'Organisation', url: 'https://streetsupport.net/find-help/organisation/test' }
        ];

        const structuredData = generateBreadcrumbStructuredData(breadcrumbs);

        expect(structuredData['@context']).toBe('https://schema.org');
        expect(structuredData['@type']).toBe('BreadcrumbList');
        expect(structuredData.itemListElement).toHaveLength(3);
        expect(structuredData.itemListElement[0].position).toBe(1);
        expect(structuredData.itemListElement[0].name).toBe('Home');
        expect(structuredData.itemListElement[2].position).toBe(3);
      });
    });
  });
});