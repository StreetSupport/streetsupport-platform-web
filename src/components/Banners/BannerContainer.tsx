'use client';

import React from 'react';
import { AnyBannerProps, GivingCampaignProps, PartnershipCharterProps, ResourceProjectProps } from '@/types/banners';
import { validateBannerProps } from '@/utils/bannerUtils';
import GivingCampaignBanner from './GivingCampaignBanner';
import PartnershipCharterBanner from './PartnershipCharterBanner';
import ResourceProjectBanner from './ResourceProjectBanner';

interface BannerContainerProps {
  banners: AnyBannerProps[];
  locationSlug?: string;
  maxDisplay?: number;
  className?: string;
  onBannerError?: (error: string, bannerId?: string) => void;
}

/**
 * Container component that renders the appropriate banner template based on templateType
 * This component will be used by the CMS to dynamically display banners on location pages
 */
const BannerContainer: React.FC<BannerContainerProps> = ({
  banners,
  locationSlug,
  maxDisplay = 3,
  className = '',
  onBannerError
}) => {
  // Filter and sort banners
  const activeBanners = banners
    .filter(banner => {
      // Only show active banners
      if (banner.isActive === false) return false;
      
      // Filter by location if specified
      if (locationSlug && banner.locationSlug && banner.locationSlug !== locationSlug) {
        return false;
      }
      
      // Validate banner props
      const validation = validateBannerProps(banner);
      if (!validation.isValid) {
        onBannerError?.(
          `Banner validation failed: ${validation.errors.join(', ')}`,
          banner.id
        );
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by priority (higher first), then by creation date
      if (a.priority !== undefined && b.priority !== undefined) {
        return b.priority - a.priority;
      }
      if (a.priority !== undefined) return -1;
      if (b.priority !== undefined) return 1;
      
      // Fallback to ID comparison for consistent ordering
      return (a.id || '').localeCompare(b.id || '');
    })
    .slice(0, maxDisplay); // Limit number of displayed banners

  if (activeBanners.length === 0) {
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
          onBannerError?.(
            `Unknown banner template type: ${banner.templateType}`,
            banner.id
          );
          return null;
      }
    } catch (error) {
      onBannerError?.(
        `Error rendering banner: ${error instanceof Error ? error.message : 'Unknown error'}`,
        banner.id
      );
      return null;
    }
  };

  return (
    <div className="banner-container space-y-8">
      {activeBanners.map(renderBanner)}
    </div>
  );
};

/**
 * Hook for managing banner state in CMS context
 * This would be used by CMS components to manage banner operations
 */
export const useBanners = (_locationSlug: string) => {
  const [banners, setBanners] = React.useState<AnyBannerProps[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // In a real CMS implementation, this would fetch from an API
  const fetchBanners = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with actual API call
      // const response = await fetch(`/api/banners?location=${locationSlug}`);
      // const data = await response.json();
      // setBanners(data.banners || []);
      
      // For now, return empty array
      setBanners([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBanner = React.useCallback(async (banner: AnyBannerProps) => {
    try {
      // Validate banner before adding
      const validation = validateBannerProps(banner);
      if (!validation.isValid) {
        throw new Error(`Invalid banner: ${validation.errors.join(', ')}`);
      }

      // This would be replaced with actual API call
      // const response = await fetch('/api/banners', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(banner)
      // });
      
      setBanners(prev => [...prev, { ...banner, id: Date.now().toString() }]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add banner');
    }
  }, []);

  const updateBanner = React.useCallback(async (id: string, updates: Partial<AnyBannerProps>) => {
    try {
      setBanners(prev => 
        prev.map(banner => 
          banner.id === id ? { ...banner, ...updates } : banner
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update banner');
    }
  }, []);

  const deleteBanner = React.useCallback(async (id: string) => {
    try {
      setBanners(prev => prev.filter(banner => banner.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete banner');
    }
  }, []);

  const toggleBannerVisibility = React.useCallback(async (id: string) => {
    try {
      setBanners(prev => 
        prev.map(banner => 
          banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to toggle banner visibility');
    }
  }, []);

  React.useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    loading,
    error,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerVisibility,
    refetch: fetchBanners
  };
};

export default BannerContainer;