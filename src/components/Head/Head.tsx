import React from 'react';
import Head from 'next/head';
import Script from 'next/script';

interface HeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string[];
  author?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const defaultTitle = "Street Support Network - Connecting people experiencing homelessness with local support";
const defaultDescription = "Street Support Network connects people experiencing homelessness with local support services. Find help, donate, volunteer, and access resources in your area.";
const defaultOgImage = "/assets/img/og/street-support.jpg";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://streetsupport.net";

export default function CustomHead({
  title,
  description = defaultDescription,
  ogImage = defaultOgImage,
  canonicalUrl,
  keywords = [],
  author = "Street Support Network",
  articlePublishedTime,
  articleModifiedTime,
  noIndex = false,
  structuredData
}: HeadProps) {
  const pageTitle = title ? `${title} | Street Support Network` : defaultTitle;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  const fullCanonicalUrl = canonicalUrl || baseUrl;
  
  const defaultKeywords = [
    "homelessness support",
    "street support",
    "homeless help",
    "charity",
    "volunteering",
    "donations",
    "social support",
    "community help",
    "housing support",
    "crisis support"
  ];
  
  const allKeywords = [...defaultKeywords, ...keywords].join(", ");

  // Default structured data for organization
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    "name": "Street Support Network",
    "alternateName": "Street Support",
    "url": baseUrl,
    "logo": `${baseUrl}/assets/img/logo.png`,
    "description": defaultDescription,
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
    <Head>
      {/* Basic Meta Tags */}
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      
      {/* Title and Description */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={articlePublishedTime ? "article" : "website"} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="Street Support Network" />
      <meta property="og:locale" content="en_GB" />
      
      {/* Article specific OG tags */}
      {articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@StreetSupport" />
      <meta name="twitter:creator" content="@StreetSupport" />
      
      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#1f2937" />
      <meta name="msapplication-TileColor" content="#1f2937" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://maps.googleapis.com" />
      
      {/* DNS Prefetch for common external resources */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || organizationStructuredData)
        }}
      />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Language */}
      <meta httpEquiv="Content-Language" content="en-GB" />
      
      {/* Copyright */}
      <meta name="copyright" content="Street Support Network" />
      
      {/* Verification tags (to be added when available) */}
      {/* <meta name="google-site-verification" content="..." /> */}
      {/* <meta name="msvalidate.01" content="..." /> */}
      
      {/* Google Maps JS API */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker&map_ids=8364b1415f1ab88dc38e401b`}
        async
        defer
      />
    </Head>
  );
}