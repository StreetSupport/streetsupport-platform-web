import React from 'react';
import BannerContainer from './BannerContainer';
import { BannerProps } from '@/types/banners';

interface BannerWrapperProps {
  locationSlug: string;
}

async function BannerWrapper({ locationSlug }: BannerWrapperProps) {
  try {
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
    const banners: BannerProps[] = data.banners || [];

    if (banners.length === 0) {
      return null;
    }

    return <BannerContainer banners={banners} />;
  } catch (error) {
    console.error('[BannerWrapper] Error fetching/rendering banners:', error);
    return null;
  }
}

export default BannerWrapper;
