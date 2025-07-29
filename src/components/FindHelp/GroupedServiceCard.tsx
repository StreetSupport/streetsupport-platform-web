'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocation } from '@/contexts/LocationContext';

import LazyMarkdownContent from '@/components/ui/LazyMarkdownContent';
import { decodeText } from '@/utils/htmlDecode';
import { categoryKeyToName, subCategoryKeyToName } from '@/utils/categoryLookup';
import { formatDistance } from '@/utils/openingTimes';
import type { ServiceWithDistance } from '@/types';

interface ServiceGroup {
  orgId: string;
  orgName: string;
  orgSlug: string;
  isVerified: boolean;
  orgDescription?: string;
  services: ServiceWithDistance[];
  categories: string[];
  subcategories: string[];
  distance: number;
}

interface GroupedServiceCardProps {
  group: ServiceGroup;
  isDescriptionOpen?: boolean;
  onToggleDescription?: () => void;
  isLoading?: boolean;
  onCardClick?: () => void;
}

const GroupedServiceCard = React.memo(function GroupedServiceCard({ 
  group, 
  isDescriptionOpen = false, 
  onToggleDescription,
  isLoading = false,
  onCardClick
}: GroupedServiceCardProps) {
  const { location } = useLocation();
  const searchParams = useSearchParams();
  
  // Build destination URL with location context
  let destination = '#';
  
  if (group.orgSlug) {
    const params = new URLSearchParams();
    
    // Add location context if available
    if (location?.lat && location?.lng) {
      params.set('lat', location.lat.toString());
      params.set('lng', location.lng.toString());
      if (location.radius) {
        params.set('radius', location.radius.toString());
      }
    }
    
    // Add current search parameters if available
    searchParams.forEach((value, key) => {
      if (!params.has(key)) {
        params.set(key, value);
      }
    });
    
    destination = `/find-help/organisation/${group.orgSlug}${params.toString() ? `?${params.toString()}` : ''}`;
  }

  const decodedOrgName = decodeText(group.orgName);
  
  const distanceText = formatDistance(group.distance);

  const formattedCategories = [...new Set(group.categories)].map(cat => 
    categoryKeyToName[cat] || cat
  );

  // Get unique subcategories - this should represent the actual number of different services
  const uniqueSubcategories = [...new Set(group.subcategories)];
  const formattedSubcategories = uniqueSubcategories.map(subcat => 
    subCategoryKeyToName[subcat] || subcat
  );

  const decodedDescription = group.orgDescription ? decodeText(group.orgDescription) : '';
  const shouldTruncate = decodedDescription.length > 100;
  const displayDescription = shouldTruncate && !isDescriptionOpen
    ? decodedDescription.slice(0, 100) + '...'
    : decodedDescription;


  return (
    <Link
      href={destination}
      onClick={() => {
        if (onCardClick) {
          onCardClick();
        }
      }}
      className={`card card-compact ${isLoading ? 'animate-pulse border-transparent' : ''}`}
      aria-label={`View details for ${decodedOrgName}`}
      style={isLoading ? {
        backgroundImage: `
          linear-gradient(white, white),
          conic-gradient(from 0deg, #10b981 0deg, #10b981 60deg, rgba(16, 185, 129, 0.3) 90deg, transparent 120deg, transparent 240deg, rgba(16, 185, 129, 0.3) 270deg, #10b981 300deg, #10b981 360deg)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        animation: 'loading-border 1.5s ease-in-out infinite'
      } : {}}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {group.isVerified && (
            <span
              className="service-tag verified"
              title="Verified Service"
            >
              <svg
                className="w-3 h-3 text-brand-b"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">Verified</span>
            </span>
          )}
          
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
              content={isDescriptionOpen ? group.orgDescription : displayDescription} 
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
