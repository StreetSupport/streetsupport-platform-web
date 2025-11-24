'use client';

import React, { useState, useEffect } from 'react';
import SwepBanner from './SwepBanner';
import { SwepData } from '@/types';

interface SwepBannerWrapperProps {
  locationSlug: string;
}

export default function SwepBannerWrapper({ locationSlug }: SwepBannerWrapperProps) {
  const [swepData, setSwepData] = useState<SwepData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSwepData() {
      try {
        const response = await fetch(`/api/locations/${locationSlug}/swep`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data.swep && result.data.isActive) {
          setSwepData(result.data.swep);
        } else {
          setSwepData(null);
        }
      } catch (error) {
        console.error('Failed to fetch SWEP data:', error);
        setSwepData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSwepData();
  }, [locationSlug]);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (!swepData) {
    return null; // Don't show banner if no active SWEP data
  }

  return <SwepBanner swepData={swepData} locationSlug={locationSlug} />;
}