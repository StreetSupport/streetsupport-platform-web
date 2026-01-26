'use client';

import React from 'react';
import { BannerProps } from '@/types/banners';
import Banner from './Banner';

interface BannerContainerProps {
  banners: BannerProps[];
  className?: string;
}

const BannerContainer: React.FC<BannerContainerProps> = ({
  banners,
  className = ''
}) => {
  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="bg-brand-i">
      <div className="banner-container space-y-0">
        {banners.map((banner, index) => (
          <Banner
            key={banner.id || `banner-${index}`}
            {...banner}
            className={className}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerContainer;
