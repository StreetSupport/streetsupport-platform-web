import React from 'react';
import BannerContainer from './BannerContainer';
import { AnyBannerProps } from '@/types/banners';

interface BannerWrapperProps {
  locationSlug: string;
}

/**
 * Server component that fetches and displays banners for a location
 * Fetches up to 6 active banners sorted by priority
 */
async function BannerWrapper({ locationSlug }: BannerWrapperProps) {
  try {
    // Fetch banners from API - no caching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/banners?location=${locationSlug}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error(`[BannerWrapper] Failed to fetch banners for ${locationSlug}:`, response.status);
      return null;
    }

    const data = await response.json();
    const banners: AnyBannerProps[] = data.banners || [];

    // If no banners, don't render anything
    if (banners.length === 0) {
      return null;
    }

    // Render banners
    return (
      <BannerContainer
        banners={banners}
        locationSlug={locationSlug}
        maxDisplay={6}
      />
    );
  } catch (error) {
    console.error('[BannerWrapper] Error fetching/rendering banners:', error);
    return null;
  }
}

export default BannerWrapper;
