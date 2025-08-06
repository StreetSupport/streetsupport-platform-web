import Link from 'next/link';
import { Metadata } from 'next';
import locations from '@/data/locations.json';
import { notFound } from 'next/navigation';
import Hero from '@/components/ui/Hero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SwepBanner from '@/components/ui/SwepBanner';
import LocationFindHelp from '@/components/Location/LocationFindHelp';
import LocationStatistics from '@/components/Location/LocationStatistics';
import LocationNews from '@/components/Location/LocationNews';
import EmergencyContactSection from '@/components/Location/EmergencyContactSection';
import SupporterLogos from '@/components/Location/SupporterLogos';
import { SwepData } from '@/types';
import { isSwepActive } from '@/utils/swep';
import swepPlaceholderData from '@/data/swep-fallback.json';
import { generateLocationSEOMetadata } from '@/utils/seo';

export const dynamic = 'force-dynamic';

// Helper function to get location background image
function getLocationBackgroundImage(slug: string): string {
  // Map of available location images
  const locationImages = [
    'birmingham', 'blackpool', 'bolton', 'bournemouth-pier-tile', 'bradford',
    'brighton-and-hove', 'bury', 'cambridgeshire', 'chelmsford', 'coventry',
    'derbyshire', 'dudley', 'edinburgh', 'exeter', 'glasgow', 'leeds',
    'liverpool', 'luton', 'manchester', 'nottingham', 'oldham', 'portsmouth',
    'reading', 'rochdale', 'salford', 'sandwell', 'solihull', 'southampton',
    'stockport', 'tameside', 'trafford', 'wakefield', 'walsall',
    'wigan-and-leigh', 'wolverhampton'
  ];

  // Special cases for slug mapping
  const slugMapping: { [key: string]: string } = {
    'bournemouth': 'bournemouth-pier-tile',
    'wigan-leigh': 'wigan-and-leigh',
    'bradford': 'bradford',
    'exeter': 'exeter',
    'portsmouth': 'portsmouth'
  };

  // Check if we have a specific mapping first
  const mappedSlug = slugMapping[slug] || slug;
  
  // Check if the image exists in our available images
  if (locationImages.includes(mappedSlug)) {
    return `/assets/img/locations/${mappedSlug}.png`;
  }
  
  // Fallback to default background
  return `/assets/img/home-header-background.png`;
}

// Helper function to get location contact email
function getLocationContactEmail(slug: string): string {
  // West Midlands locations
  const westMidlandsLocations = [
    'birmingham', 'coventry', 'dudley', 'sandwell', 'solihull', 'walsall', 'wolverhampton'
  ];
  
  // Greater Manchester locations
  const greaterManchesterLocations = [
    'manchester', 'bolton', 'bury', 'oldham', 'rochdale', 'salford', 
    'stockport', 'tameside', 'trafford', 'wigan-and-leigh'
  ];
  
  if (westMidlandsLocations.includes(slug)) {
    return 'westmidlands@streetsupport.net';
  }
  
  if (greaterManchesterLocations.includes(slug)) {
    return 'greatermanchester@streetsupport.net';
  }
  
  // Default to location-specific email
  return `${slug}@streetsupport.net`;
}

// @ts-expect-error Next dynamic param inference workaround
export async function generateMetadata(props): Promise<Metadata> {
  const { slug } = await props.params;

  const location = locations.find(
    (loc) => loc.slug === slug && loc.isPublic
  );

  if (!location) {
    return {
      title: 'Location Not Found | Street Support Network',
      description: 'The requested location page could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  return generateLocationSEOMetadata(location.name, slug, 'main');
}

// @ts-expect-error Next dynamic param inference workaround
export default async function LocationPage(props) {
  const { slug } = await props.params;

  const location = locations.find(
    (loc) => loc.slug === slug && loc.isPublic
  );

  if (!location) {
    notFound();
  }

  const locationImage = getLocationBackgroundImage(slug);
  const homeBackground = "/assets/img/home-header-background.png";
  const contactEmail = getLocationContactEmail(slug);
  
  // Get SWEP placeholder data - this will be replaced with CMS integration later
  const swepEntry = swepPlaceholderData.find(
    (entry: SwepData) => entry.locationSlug === slug
  );
  
  // Only use SWEP data if it's currently active
  const swepData = swepEntry && isSwepActive(swepEntry) ? swepEntry : null;

  // Generate structured data for the location
  const locationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": location.name,
    "description": `Street Support services and information for ${location.name}. Find homelessness support, emergency help, and local resources.`,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location.latitude,
      "longitude": location.longitude
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.name,
      "addressCountry": "GB"
    },
    "url": `https://streetsupport.net/${slug}`,
    "additionalType": "City",
    "containsPlace": {
      "@type": "Organization",
      "name": `Street Support ${location.name}`,
      "description": `Local Street Support Network services in ${location.name}`,
      "url": `https://streetsupport.net/${slug}`,
      "areaServed": {
        "@type": "City",
        "name": location.name
      },
      "serviceType": "Homelessness Support Services"
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://streetsupport.net/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": location.name,
        "item": `https://streetsupport.net/${slug}`
      }
    ]
  };

  return (
    <main>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />

      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: location.name, current: true }
        ]} 
      />

      <Hero
        backgroundImage={homeBackground}
        overlayImage={locationImage !== homeBackground ? locationImage : undefined}
        locationSlug={slug}
        title={`Street Support ${location.name}`}
        subtitle={`Connecting people and organisations locally, to tackle homelessness in ${location.name}.`}
        ctaText="Find Help"
        ctaLink="/find-help"
      />

      {/* SWEP Banner - displays only when active */}
      {swepData && (
        <SwepBanner swepData={swepData} locationSlug={slug} />
      )}

      <EmergencyContactSection locationName={location.name} locationSlug={slug} />

      {/* Find Help Tools */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Find Support in {location.name}
            </h2>
            <p className="text-body max-w-3xl mx-auto">
              Search for support services available near you. Use the filters below to find specific types of help, and see what&apos;s available on the map.
            </p>
          </div>
          <LocationFindHelp 
            locationName={location.name}
            latitude={location.latitude}
            longitude={location.longitude}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <LocationStatistics 
            locationSlug={slug}
            locationName={location.name}
          />
          <LocationNews 
            locationSlug={slug}
            locationName={location.name}
          />
        </div>
      </section>

      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
          <p className="mb-4">
            If you&apos;d like to get involved or have suggestions, please contact us at{' '}
            <a href={`mailto:${contactEmail}`} className="text-brand-a hover:text-brand-b underline">{contactEmail}</a>.
          </p>
          <p>
            We are looking for businesses and organisations to{' '}
            <Link href="/give-help/business-support/" className="text-brand-a hover:text-brand-b underline">support us</Link> so we can keep improving this resource.
          </p>
        </div>
      </section>

      {/* Supporter Logos Section */}
      <SupporterLogos locationSlug={slug} />
    </main>
  );
}
