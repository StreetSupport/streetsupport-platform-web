'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocation } from '@/contexts/LocationContext';

import LazyMarkdownContent from '@/components/ui/LazyMarkdownContent';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';
import { formatDistance } from '@/utils/openingTimes';
import { buildOrganisationUrl } from '@/utils/buildServiceUrl';
import type { ServiceGroup } from '@/types';

interface GroupedServiceCardProps {
  group: ServiceGroup;
  isDescriptionOpen?: boolean;
  onToggleDescription?: () => void;
}

const GroupedServiceCard = React.memo(function GroupedServiceCard({
  group,
  isDescriptionOpen = false,
  onToggleDescription
}: GroupedServiceCardProps) {
  const { location } = useLocation();
  const searchParams = useSearchParams();
  
  const destination = buildOrganisationUrl(group.orgSlug || '', location, searchParams ?? undefined);

  const decodedOrgName = group.orgName;
  
  const distanceText = formatDistance(group.distance);

  const formattedCategories = [...new Set(group.categories)].map(cat => 
    getCategoryName(cat)
  );

  // Get unique subcategories - this should represent the actual number of different services
  const uniqueSubcategories = [...new Set(group.subcategories)];
  
  // Create a mapping from subcategory to its parent category using the services data
  const subcategoryToCategoryMap = new Map<string, string>();
  group.services.forEach(service => {
    subcategoryToCategoryMap.set(service.subCategory, service.category);
  });
  
  const formattedSubcategories = uniqueSubcategories.map(subcat => {
    const parentCategory = subcategoryToCategoryMap.get(subcat);
    return parentCategory ? getSubCategoryName(parentCategory, subcat) : subcat;
  });

  const decodedDescription = group.orgDescription || '';
  const shouldTruncate = decodedDescription.length > 100;


  const [isLoading, setIsLoading] = useState(false);

  return (
    <Link
      href={destination}
      onClick={() => setIsLoading(true)}
      className={`card card-compact${isLoading ? ' card-loading' : ''}`}
      aria-label={`View details for ${decodedOrgName}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {group.isVerified && <VerifiedBadge />}
          
          {/* Service count indicator - use unique subcategories count for accurate service types */}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {uniqueSubcategories.length} service{uniqueSubcategories.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Distance */}
        {distanceText && (
          <span className="text-xs !text-black">{distanceText}</span>
        )}
      </div>

      {/* Organization name - prominent */}
      <h2 className="text-lg font-semibold mb-2 !text-black">{decodedOrgName}</h2>

      {/* Categories */}
      {formattedCategories.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium !text-black mb-1">Categories:</p>
          <div className="flex flex-wrap gap-1">
            {formattedCategories.map((cat, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories */}
      {formattedSubcategories.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium !text-black mb-1">Services:</p>
          <div className="flex flex-wrap gap-1">
            {formattedSubcategories.map((subcat, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium !bg-brand-n !text-white"
              >
                {subcat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Organization Description */}
      {group.orgDescription && (
        <div className="mb-3">
          <div>
            <LazyMarkdownContent
              content={isDescriptionOpen ? group.orgDescription : decodedDescription.slice(0, 100) + '...'}
              className="text-sm mb-2 !text-black"
            />
            {shouldTruncate && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleDescription?.();
                }}
                className="btn-base btn-tertiary btn-sm transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-sm"
              >
                {isDescriptionOpen ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Placeholder for service details */}
      <div className="text-xs !text-black mt-2 pt-2 border-t border-gray-200">
        Click to view full organisation details and services
      </div>
    </Link>
  );
});

export default GroupedServiceCard;
