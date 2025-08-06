'use client';

import React from 'react';
import Link from 'next/link';
import { SwepData } from '@/types';
import { trackSwepBannerClick } from '@/components/analytics/GoogleAnalytics';

interface SwepBannerProps {
  swepData: SwepData;
  locationSlug: string;
}

export default function SwepBanner({ swepData, locationSlug }: SwepBannerProps) {
  // Check if SWEP is currently active
  const now = new Date();
  const activeFrom = new Date(swepData.swepActiveFrom);
  const activeUntil = new Date(swepData.swepActiveUntil);
  const isActive = now >= activeFrom && now <= activeUntil;

  // Don't render if not active
  if (!isActive) {
    return null;
  }

  return (
    <div className="swep-banner bg-brand-g text-white py-4 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-brand-g rounded-full"></div>
              </div>
              <h2 className="text-lg font-bold">Severe Weather Emergency Protocol (SWEP) Active</h2>
            </div>
            <p className="text-red-100">{swepData.shortMessage}</p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={`/${locationSlug}/swep`}
              onClick={() => trackSwepBannerClick(locationSlug)}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-g font-semibold rounded-md hover:bg-red-50 active:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-g"
            >
              View SWEP Information
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}