'use client';

import React from 'react';
import Link from 'next/link';

import MarkdownContent from '@/components/ui/MarkdownContent';
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
  onNavigate?: () => void;
}

export default function GroupedServiceCard({ 
  group, 
  isDescriptionOpen = false, 
  onToggleDescription, 
  onNavigate
}: GroupedServiceCardProps) {
  const destination = group.orgSlug
    ? `/find-help/organisation/${group.orgSlug}`
    : '#';

  const decodedOrgName = decodeText(group.orgName);
  
  // Format distance
  const distanceText = formatDistance(group.distance);

  // Get unique categories and format them
  const formattedCategories = [...new Set(group.categories)].map(cat => 
    categoryKeyToName[cat] || cat
  );

  // Get unique subcategories and format them
  const formattedSubcategories = [...new Set(group.subcategories)].map(subcat => 
    subCategoryKeyToName[subcat] || subcat
  );

  // Handle description truncation
  const decodedDescription = group.orgDescription ? decodeText(group.orgDescription) : '';
  const shouldTruncate = decodedDescription.length > 100;
  const displayDescription = shouldTruncate && !isDescriptionOpen
    ? decodedDescription.slice(0, 100) + '...'
    : decodedDescription;


  return (
    <Link
      href={destination}
      onClick={onNavigate}
      className="relative block border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-a"
      aria-label={`View details for ${decodedOrgName}`}
    >
      {/* Top row with verified icon and distance */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {/* ✅ Verified badge */}
          {group.isVerified && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800"
              title="Verified Service"
            >
              <svg
                className="w-3 h-3 text-green-600"
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
          
          {/* Service count indicator */}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {group.services.length} service{group.services.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Distance */}
        {distanceText && (
          <span className="text-xs text-gray-500">{distanceText}</span>
        )}
      </div>

      {/* Organization name - prominent */}
      <h2 className="text-lg font-semibold mb-2">{decodedOrgName}</h2>

      {/* Categories */}
      {formattedCategories.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Categories:</p>
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
          <p className="text-xs font-medium text-gray-500 mb-1">Services:</p>
          <div className="flex flex-wrap gap-1">
            {formattedSubcategories.map((subcat, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
          {shouldTruncate && !isDescriptionOpen ? (
            <div>
              <p className="text-sm text-gray-800 mb-1">{displayDescription}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleDescription?.();
                }}
                className="text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Read more
              </button>
            </div>
          ) : (
            <div>
              <MarkdownContent content={group.orgDescription} className="prose-sm" />
              {shouldTruncate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleDescription?.();
                  }}
                  className="text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Placeholder for service details */}
      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
        Click to view full organisation details and services
      </div>
    </Link>
  );
}