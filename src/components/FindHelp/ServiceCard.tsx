'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocation } from '@/contexts/LocationContext';

import type { ServiceWithDistance } from '@/types';
import LazyMarkdownContent from '@/components/ui/LazyMarkdownContent';
import { decodeText } from '@/utils/htmlDecode';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';
import { formatDistance } from '@/utils/openingTimes';
import openingTimesCache from '@/utils/openingTimesCache';
import { trackServiceCardClick } from '@/components/analytics/GoogleAnalytics';

interface ServiceCardProps {
  service: ServiceWithDistance;
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  onCardClick?: () => void;
}

const ServiceCard = React.memo(function ServiceCard({ service, isOpen, onToggle, isLoading = false, onCardClick }: ServiceCardProps) {
  const { location } = useLocation();
  const searchParams = useSearchParams();
  
  // Memoize expensive computations to prevent recalculation on every render
  const memoizedData = useMemo(() => {
    // Build destination URL with location context
    let destination = '#';
    
    if (service.organisation?.slug) {
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
      searchParams?.forEach((value, key) => {
        if (!params.has(key)) {
          params.set(key, value);
        }
      });
      
      destination = `/find-help/organisation/${service.organisation.slug}${params.toString() ? `?${params.toString()}` : ''}`;
    }

    const decodedDescription = decodeText(service.description);
    const decodedName = decodeText(service.name);
    const decodedOrgName = decodeText(service.organisation?.name || '');

    const preview =
      decodedDescription.length > 120
        ? decodedDescription.slice(0, 120) + '...'
        : decodedDescription;

    // Get formatted category and subcategory names
    const categoryName = getCategoryName(service.category);
    const subCategoryName = getSubCategoryName(service.category, service.subCategory);
    const formattedCategory = `${categoryName} > ${subCategoryName}`;

    // Get opening status using cache to avoid expensive recalculations
    const openingStatus = openingTimesCache.getOpeningStatus(service);
    
    const distanceText = formatDistance(service.distance);

    return {
      destination,
      decodedDescription,
      decodedName,
      decodedOrgName,
      preview,
      formattedCategory,
      categoryName,
      subCategoryName,
      openingStatus,
      distanceText
    };
  }, [service, location, searchParams]);

  const {
    destination,
    decodedDescription,
    decodedName,
    decodedOrgName,
    preview,
    categoryName,
    subCategoryName,
    openingStatus,
    distanceText
  } = memoizedData;

  return (
    <Link
      href={destination}
      onClick={() => {
        // Track service card click for analytics
        trackServiceCardClick(
          service.id?.toString() || 'unknown',
          decodedOrgName,
          categoryName
        );
        
        if (onCardClick) {
          onCardClick();
        }
      }}
      className={`card card-compact ${isLoading ? 'loading-card' : ''}`}
      aria-label={`View details for ${decodedName}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {service.organisation?.isVerified && (
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
          
          {openingStatus.isOpen && (
            <span className="service-tag open">
              Open Now
            </span>
          )}
          
          {/* Appointment Only indicator */}
          {openingStatus.isAppointmentOnly && (
            <span className="service-tag limited">
              Appointment Only
            </span>
          )}
        </div>
        
        {/* Distance */}
        {distanceText && (
          <span className="text-caption !text-black">{distanceText}</span>
        )}
      </div>

      {/* Show organization name as primary title */}
      {decodedOrgName && (
        <h2 className="card-title !text-black">{decodedOrgName}</h2>
      )}

      {/* Only show service name if it's different from organization name */}
      {decodedName && decodedName !== decodedOrgName && (
        <h3 className="text-base font-medium mb-1 !text-black">{decodedName}</h3>
      )}

      {/* Category and subcategory pills */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {categoryName}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium !bg-brand-n !text-white">
            {subCategoryName}
          </span>
        </div>
      </div>

      <div className="!text-black mb-2">
        <LazyMarkdownContent 
          content={isOpen ? service.description : preview} 
          className="text-sm !text-black" 
        />
      </div>
      
      {decodedDescription.length > 120 && (
        <div className="mb-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onToggle();
            }}
            onMouseDown={(e) => {
              // Prevent Link from capturing the click
              e.stopPropagation();
            }}
            className="btn-base btn-tertiary btn-sm transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-sm relative z-10"
          >
            {isOpen ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {service.openTimes && service.openTimes.length > 0 && !service.isOpen247 ? (
        <div className="mt-3">
          <p className="text-small font-semibold mb-1 !text-black">Opening Times:</p>
          <ul className="list-disc pl-5 text-sm !text-black">
            {(() => {
              // Group opening times by day and consolidate multiple sessions
              // Database uses Monday-first indexing: 0=Monday, ..., 6=Sunday
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const dayGroups = new Map();
              
              const formatTime = (time: number) => {
                if (isNaN(time)) return '00:00';
                const str = time.toString().padStart(4, '0');
                return `${str.slice(0, 2)}:${str.slice(2)}`;
              };
              
              // Group slots by day
              service.openTimes.forEach((slot) => {
                const dayIndex = Number(slot.day);
                const startTime = Number(slot.start);
                const endTime = Number(slot.end);
                
                if (dayIndex >= 0 && dayIndex <= 6) {
                  const dayName = days[dayIndex];
                  if (!dayGroups.has(dayName)) {
                    dayGroups.set(dayName, []);
                  }
                  dayGroups.get(dayName).push({
                    start: formatTime(startTime),
                    end: formatTime(endTime)
                  });
                }
              });
              
              // Sort days in proper order and format consolidated times
              const orderedDays = days.filter(day => dayGroups.has(day));
              
              return orderedDays.map((dayName) => {
                const slots = dayGroups.get(dayName);
                const timeRanges = slots.map((slot: { start: string; end: string }) => `${slot.start} – ${slot.end}`).join(', ');
                
                return (
                  <li key={dayName}>
                    {dayName}: {timeRanges}
                  </li>
                );
              });
            })()}
          </ul>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-caption !text-black">No opening times available</p>
        </div>
      )}

      {!openingStatus.isOpen && openingStatus.nextOpen && (
        <div className="text-small mt-2 !text-black">
          Next open: {openingStatus.nextOpen.day} {openingStatus.nextOpen.time}
        </div>
      )}
    </Link>
  );
});

export default ServiceCard;
