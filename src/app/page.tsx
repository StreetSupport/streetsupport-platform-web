import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import HomepageMap from '@/components/Homepage/HomepageMap';
import LocationDropdown from '@/components/Homepage/LocationDropdown';
import Hero from '@/components/ui/Hero';
import { generateSEOMetadata } from '@/utils/seo';

async function getStatistics() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stats`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Return default values if fetch fails
    return {
      organisations: 0,
      services: 0,
      partnerships: 0
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: '',
    description: 'Street Support Network connects people experiencing homelessness with local support services across the UK. Find help, donate, volunteer, and access resources in your area.',
    keywords: [
      'homelessness support UK',
      'street support',
      'homeless help',
      'find homeless services',
      'donate to homeless',
      'volunteer homeless services',
      'crisis support',
      'emergency accommodation',
      'rough sleeping help'
    ],
    path: '',
    image: '/assets/img/og/street-support.jpg',
    imageAlt: 'Street Support Network - Connecting people with local support'
  });
}

export default async function Home() {
  const stats = await getStatistics();

  // Enhanced structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Street Support Network",
    "alternateName": "Street Support",
    "url": "https://streetsupport.net",
    "description": "Street Support Network connects people experiencing homelessness with local support services across the UK.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://streetsupport.net/find-help?query={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "Street Support Network",
      "@id": "https://streetsupport.net/#organization",
      "url": "https://streetsupport.net",
      "logo": "https://streetsupport.net/assets/img/logo.png",
      "description": "Street Support Network connects people experiencing homelessness with local support services.",
      "foundingDate": "2015",
      "nonprofitStatus": "Nonprofit501c3",
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "knowsAbout": [
        "Homelessness Support",
        "Emergency Accommodation",
        "Food Banks",
        "Crisis Support",
        "Volunteer Coordination"
      ],
      "serviceArea": {
        "@type": "Country",
        "name": "United Kingdom"
      }
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageStructuredData)
        }}
      />

      {/* Hero Section */}
      <Hero
        backgroundImage="/assets/img/home-header-background.png"
        title="Working Together to Tackle Homelessness"
        subtitle="Find support services near you."
        ctaText="Find Help"
        ctaLink="/find-help"
      />

      {/* Where we are section */}
      <section className="section-spacing px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="heading-2">
                Where we are
              </h2>
              <p className="text-body">
                Street Support Network is currently active in several locations across the UK.
              </p>
              <p className="text-body mb-6">
                Want to see what is happening near you? Select a location from the dropdown below or click on the map.
              </p>
              <LocationDropdown />
            </div>
            <div className="w-full">
              <HomepageMap />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-spacing px-4 bg-brand-a text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2 text-brand-d">{stats.organisations}</div>
              <div className="text-xl md:text-2xl font-light">Organisations</div>
              <div className="text-lg md:text-xl font-light text-brand-k">Listed</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2 text-brand-d">{stats.services}</div>
              <div className="text-xl md:text-2xl font-light">Services</div>
              <div className="text-lg md:text-xl font-light text-brand-k">Provided</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2 text-brand-d">{stats.partnerships}</div>
              <div className="text-xl md:text-2xl font-light">Homelessness Partnerships</div>
              <div className="text-lg md:text-xl font-light text-brand-k">Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="section-spacing px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-3 mb-4">
            In collaboration with...
          </h2>
          <div className="h-1 w-24 bg-brand-d mx-auto mb-8"></div>
          
          {/* Homeless Link Logo */}
          <div className="mb-8">
            <a 
              href="https://homelesslink.org.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105"
              title="Visit Homeless Link website"
            >
              <Image
                src="/assets/icons/homeless-link.svg"
                alt="Homeless Link"
                width={300}
                height={120}
                className="mx-auto"
                priority
              />
            </a>
          </div>
          
          <p className="text-body mb-6 max-w-2xl mx-auto">
            We are looking for businesses and supporters to{' '}
            <Link href="/give-help/business-support/" className="text-brand-a hover:text-brand-b underline font-medium">
              partner with us in the mission to tackle homelessness
            </Link>.
          </p>
          <p className="text-body max-w-2xl mx-auto">
            If you share our vision of a society without homelessness, please{' '}
            <Link href="/contact" className="text-brand-a hover:text-brand-b underline font-medium">
              get in touch
            </Link>.
          </p>
        </div>
      </section>
    </main>
  );
}