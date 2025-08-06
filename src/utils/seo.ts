import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://streetsupport.net';
const siteName = 'Street Support Network';
const defaultDescription = 'Street Support Network connects people experiencing homelessness with local support services. Find help, donate, volunteer, and access resources in your area.';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  locale?: string;
}

/**
 * Generate canonical URL for a given path
 */
export function generateCanonicalUrl(path: string): string {
  // Remove leading slash if present and ensure clean URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
}

/**
 * Generate comprehensive metadata object
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description = defaultDescription,
    keywords = [],
    path = '',
    image,
    imageAlt,
    noIndex = false,
    noFollow = false,
    canonicalUrl,
    publishedTime,
    modifiedTime,
    author,
    section,
    locale = 'en_GB'
  } = config;

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Connecting people experiencing homelessness with local support`;
  const canonical = canonicalUrl || generateCanonicalUrl(path);
  const ogImage = image || '/assets/img/og/street-support.jpg';
  const ogImageAlt = imageAlt || 'Street Support Network';

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [...new Set([...keywords, 'homelessness support', 'street support', 'homeless help', 'charity', 'volunteering'])],
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      site: '@StreetSupport',
      creator: '@StreetSupport',
      images: [ogImage],
    },
  };

  // Add robots directive if specified
  if (noIndex || noFollow) {
    const robots: string[] = [];
    if (noIndex) robots.push('noindex');
    if (noFollow) robots.push('nofollow');
    metadata.robots = robots.join(', ');
  }

  // Add article metadata for news/blog content
  if (publishedTime || modifiedTime || author || section) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
    };
  }

  return metadata;
}

/**
 * Generate location-specific SEO metadata
 */
export function generateLocationSEOMetadata(locationName: string, locationSlug: string, pageType: 'main' | 'advice' | 'swep' = 'main'): Metadata {
  const pageTitles = {
    main: `Street Support ${locationName}`,
    advice: `Emergency Advice - Street Support ${locationName}`,
    swep: `Severe Weather Emergency Protocol - Street Support ${locationName}`
  };

  const pageDescriptions = {
    main: `Find homelessness support services, emergency help, and volunteer opportunities in ${locationName}. Connect with local organisations and resources to help people experiencing homelessness.`,
    advice: `Emergency advice and support for people experiencing homelessness in ${locationName}. Find immediate help, contact information, and safety resources.`,
    swep: `Severe Weather Emergency Protocol information and emergency accommodation in ${locationName}. Find immediate help during extreme weather conditions.`
  };

  const pageKeywords = {
    main: [`homelessness support ${locationName.toLowerCase()}`, `homeless help ${locationName.toLowerCase()}`, `${locationName.toLowerCase()} street support`, 'local homeless services', 'volunteer opportunities'],
    advice: [`emergency help ${locationName.toLowerCase()}`, `homeless emergency ${locationName.toLowerCase()}`, 'crisis support', 'immediate assistance'],
    swep: [`severe weather ${locationName.toLowerCase()}`, 'emergency accommodation', 'extreme weather help', 'swep', 'weather emergency']
  };

  const path = pageType === 'main' ? locationSlug : `${locationSlug}/${pageType}`;

  // Check if location-specific OG image exists, fallback to default
  const locationOGImage = `/assets/img/og/street-support-${locationSlug}.jpg`;
  
  return generateSEOMetadata({
    title: pageTitles[pageType],
    description: pageDescriptions[pageType],
    keywords: pageKeywords[pageType],
    path,
    image: locationOGImage,
    imageAlt: `Street Support ${locationName}`,
  });
}

/**
 * Generate organisation-specific SEO metadata
 */
export function generateOrganisationSEOMetadata(orgName: string, orgSlug: string, description?: string, location?: string): Metadata {
  const title = `${orgName} - Find Help`;
  const metaDescription = description 
    ? `${orgName} provides support services for people experiencing homelessness. ${description.substring(0, 120)}...`
    : `${orgName} provides support services for people experiencing homelessness${location ? ` in ${location}` : ''}. Find contact details, opening hours, and services available.`;

  const keywords = [
    orgName.toLowerCase(),
    'homeless services',
    'support organisation',
    'homelessness help',
    ...(location ? [`${location.toLowerCase()} homeless services`] : [])
  ];

  return generateSEOMetadata({
    title,
    description: metaDescription,
    keywords,
    path: `find-help/organisation/${orgSlug}`,
    imageAlt: `${orgName} - Street Support Network`,
  });
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate Local Business structured data for organisations
 */
export function generateLocalBusinessStructuredData(org: {
  name: string;
  description?: string;
  address?: string;
  telephone?: string;
  email?: string;
  website?: string;
  openingHours?: string[];
  latitude?: number;
  longitude?: number;
}) {
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
    name: org.name,
    description: org.description,
  };

  if (org.address) {
    structuredData.address = {
      '@type': 'PostalAddress',
      streetAddress: org.address,
      addressCountry: 'GB'
    };
  }

  if (org.latitude && org.longitude) {
    structuredData.geo = {
      '@type': 'GeoCoordinates',
      latitude: org.latitude,
      longitude: org.longitude
    };
  }

  if (org.telephone) structuredData.telephone = org.telephone;
  if (org.email) structuredData.email = org.email;
  if (org.website) structuredData.url = org.website;
  if (org.openingHours) structuredData.openingHours = org.openingHours;

  return structuredData;
}

/**
 * Generate Service structured data
 */
export function generateServiceStructuredData(service: {
  name: string;
  description: string;
  provider: string;
  serviceType: string;
  areaServed?: string;
  availableChannel?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider
    },
    serviceType: service.serviceType,
    areaServed: service.areaServed ? {
      '@type': 'City',
      name: service.areaServed
    } : undefined,
    availableChannel: service.availableChannel ? {
      '@type': 'ServiceChannel',
      serviceUrl: service.availableChannel
    } : undefined
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}