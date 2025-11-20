'use client';

import React from 'react';
import { AnyBannerProps, GivingCampaignProps, PartnershipCharterProps, ResourceProjectProps } from '@/types/banners';
import GivingCampaignBanner from './GivingCampaignBanner';
import PartnershipCharterBanner from './PartnershipCharterBanner';
import ResourceProjectBanner from './ResourceProjectBanner';

interface BannerContainerProps {
  banners: AnyBannerProps[];
  locationSlug?: string;
  maxDisplay?: number;
  className?: string;
}

/**
 * Container component that renders the appropriate banner template based on templateType
 * This component will be used by the CMS to dynamically display banners on location pages
 */
const BannerContainer: React.FC<BannerContainerProps> = ({
  banners,
  className = ''
}) => {

  if (banners.length === 0) {
    return null;
  }

  const renderBanner = (banner: AnyBannerProps, index: number) => {
    const key = banner.id || `banner-${index}`;
    const bannerClassName = `banner-${banner.templateType} ${className}`;

    try {
      switch (banner.templateType) {
        case 'giving-campaign':
          return (
            <GivingCampaignBanner
              key={key}
              {...(banner as GivingCampaignProps)}
              className={bannerClassName}
            />
          );

        case 'partnership-charter':
          return (
            <PartnershipCharterBanner
              key={key}
              {...(banner as PartnershipCharterProps)}
              className={bannerClassName}
            />
          );

        case 'resource-project':
          return (
            <ResourceProjectBanner
              key={key}
              {...(banner as ResourceProjectProps)}
              className={bannerClassName}
            />
          );

        default:
          console.error(`[BannerContainer] Unknown banner template type: ${(banner as unknown as { templateType?: string }).templateType}`, (banner as unknown as { id?: string }).id);
          return null;
      }
    } catch (error) {
      console.error(`[BannerContainer] Error rendering banner: ${error instanceof Error ? error.message : 'Unknown error'}`, banner.id);
      return null;
    }
  };

  return (
    <div className="bg-brand-i">
      <div className="banner-container space-y-0">
        {banners.map(renderBanner)}
      </div>
    </div>
  );
};

export default BannerContainer;