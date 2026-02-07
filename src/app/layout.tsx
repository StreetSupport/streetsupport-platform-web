import React, { ReactNode } from 'react';
import { Metadata } from 'next';
// import Script from 'next/script'; // Unused import
import './globals.css';

import Nav from '../components/partials/Nav';
import SiteFooter from '../components/partials/SiteFooter';
import { LocationProvider } from '../contexts/LocationContext';
import { CookieConsentProvider } from '../contexts/CookieConsentContext';
import FindHelpStateCleanup from '../components/FindHelp/FindHelpStateCleanup';
import ConditionalGoogleAnalytics from '../components/analytics/ConditionalGoogleAnalytics';
import { CookieConsentBanner, CookiePreferencesModal } from '../components/CookieConsent';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://streetsupport.net";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Street Support Network - Connecting people experiencing homelessness with local support',
    template: '%s | Street Support Network'
  },
  description: 'Street Support Network connects people experiencing homelessness with local support services. Find help, donate, volunteer, and access resources in your area.',
  keywords: [
    'homelessness support',
    'street support',
    'homeless help',
    'charity',
    'volunteering',
    'donations',
    'social support',
    'community help',
    'housing support',
    'crisis support'
  ],
  authors: [{ name: 'Street Support Network' }],
  creator: 'Street Support Network',
  publisher: 'Street Support Network',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Street Support Network - Connecting people experiencing homelessness with local support',
    description: 'Street Support Network connects people experiencing homelessness with local support services. Find help, donate, volunteer, and access resources in your area.',
    url: baseUrl,
    siteName: 'Street Support Network',
    images: [
      {
        url: '/assets/img/og/street-support.jpg',
        width: 1200,
        height: 630,
        alt: 'Street Support Network'
      }
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Street Support Network',
    description: 'Street Support Network connects people experiencing homelessness with local support services.',
    site: '@StreetSupport',
    creator: '@StreetSupport',
    images: ['/assets/img/og/street-support.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#1f2937',
    'msapplication-TileColor': '#1f2937',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Language': 'en-GB',
    copyright: 'Street Support Network',
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    "name": "Street Support Network",
    "alternateName": "Street Support",
    "url": baseUrl,
    "logo": `${baseUrl}/assets/img/logo.png`,
    "description": "Street Support Network connects people experiencing homelessness with local support services.",
    "foundingDate": "2015",
    "legalName": "Street Support Network Ltd",
    "taxID": "1177546",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "General Enquiries",
      "email": "info@streetsupport.net"
    },
    "sameAs": [
      "https://www.facebook.com/streetsupport",
      "https://bsky.app/profile/streetsupport.net",
      "https://github.com/StreetSupport"
    ],
    "nonprofitStatus": "Nonprofit501c3",
    "mission": "To make it easier for people experiencing homelessness to get support, and to make it easier for people and organisations to give support."
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* Preload LCP hero image for faster discovery */}
        <link rel="preload" as="image" href="/assets/img/home-header-background.png" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Enhanced Google Maps performance */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        <link rel="dns-prefetch" href="//maps.gstatic.com" />
        <link rel="dns-prefetch" href="//csi.gstatic.com" />
        
        {/* DNS Prefetch for common external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData)
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-brand-a">
          Skip to main content
        </a>
        <CookieConsentProvider>
          <ConditionalGoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          <LocationProvider>
            <FindHelpStateCleanup />
            <Nav />
            <div id="main-content" />
            {children}
            <SiteFooter />
          </LocationProvider>
          <CookieConsentBanner />
          <CookiePreferencesModal />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
