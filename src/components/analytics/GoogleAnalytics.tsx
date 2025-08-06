'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Only load analytics in production or when explicitly enabled
  const shouldLoadAnalytics = process.env.NODE_ENV === 'production' || 
                              process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

  if (!measurementId || !shouldLoadAnalytics) {
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `
        }}
      />
    </>
  );
}

// Helper function for tracking page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

// Helper function for tracking custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Service Discovery Flow Tracking
export const trackServiceSearch = (query: string, location?: string) => {
  trackEvent('search', 'service_discovery', `${query}${location ? ` | ${location}` : ''}`, query.length);
};

export const trackServiceFilter = (filterType: string, filterValue: string) => {
  trackEvent('filter_applied', 'service_discovery', `${filterType}: ${filterValue}`);
};

export const trackServiceCardClick = (serviceId: string, organisationName: string, category: string) => {
  trackEvent('service_click', 'service_discovery', `${organisationName} | ${category}`, serviceId ? parseInt(serviceId.replace(/\D/g, ''), 10) || undefined : undefined);
};

export const trackOrganisationView = (organisationSlug: string, organisationName: string, fromContext?: string) => {
  trackEvent('organisation_view', 'user_journey', `${organisationName}${fromContext ? ` | from: ${fromContext}` : ''}`, organisationSlug ? organisationSlug.length : undefined);
};

// Critical User Action Tracking
export const trackSwepBannerClick = (locationSlug: string) => {
  trackEvent('swep_banner_click', 'emergency_information', `SWEP Info: ${locationSlug}`);
};

export const trackFindHelpCTA = (pageLocation: string, ctaContext?: string) => {
  trackEvent('find_help_cta', 'conversion', `${pageLocation}${ctaContext ? ` | ${ctaContext}` : ''}`);
};

export const trackEmergencyContact = (contactType: 'streetlink' | '999' | 'emergency_phone', context?: string) => {
  trackEvent('emergency_contact', 'critical_action', `${contactType}${context ? ` | ${context}` : ''}`);
};

// File Download Tracking
export const trackFileDownload = (fileName: string, fileType: string, context?: string) => {
  trackEvent('file_download', 'resource_access', `${fileName}${context ? ` | ${context}` : ''}`, fileName.length);
};

// External Link Tracking
export const trackExternalLink = (url: string, linkText: string, context?: string) => {
  const domain = new URL(url).hostname;
  trackEvent('external_link_click', 'navigation', `${domain} | ${linkText}${context ? ` | ${context}` : ''}`);
};

// Location-Based Analytics
export const trackLocationSelection = (locationName: string, selectionMethod: 'dropdown' | 'geolocation' | 'postcode') => {
  trackEvent('location_selection', 'user_preference', `${locationName} | method: ${selectionMethod}`);
};

export const trackPostcodeSearch = (postcode: string, success: boolean) => {
  // Anonymise postcode for privacy (keep first 2-3 chars)
  const anonymisedPostcode = postcode.substring(0, Math.min(3, postcode.length)) + '***';
  trackEvent('postcode_search', 'location_discovery', `${anonymisedPostcode} | success: ${success}`);
};

// Content Performance Tracking
export const trackResourceAccess = (resourceType: string, resourceName: string) => {
  trackEvent('resource_access', 'content_engagement', `${resourceType}: ${resourceName}`);
};

export const trackSocialShare = (platform: string, pageTitle: string) => {
  trackEvent('social_share', 'content_sharing', `${platform} | ${pageTitle}`);
};

// User Journey Milestones
export const trackUserJourneyMilestone = (milestone: string, context?: string) => {
  trackEvent('user_milestone', 'user_journey', `${milestone}${context ? ` | ${context}` : ''}`);
};

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}