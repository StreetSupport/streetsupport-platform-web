'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocation } from '@/contexts/LocationContext';

import type { ServiceWithDistance } from '@/types';
import LazyMarkdownContent from '@/components/ui/LazyMarkdownContent';
import { decodeText } from '@/utils/htmlDecode';
import { categoryKeyToName, subCategoryKeyToName } from '@/utils/categoryLookup';
import { formatDistance } from '@/utils/openingTimes';
import openingTimesCache from '@/utils/openingTimesCache';

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
      searchParams.forEach((value, key) => {
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
    const categoryName = categoryKeyToName[service.category] || service.category;
    const subCategoryName = subCategoryKeyToName[service.subCategory] || service.subCategory;
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
    formattedCategory,
    openingStatus,
    distanceText
  } = memoizedData;

  return (
    <Link
      href={destination}
      onClick={() => {
        if (onCardClick) {
          onCardClick();
        }
      }}
      className={`relative block border-2 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-a ${
        isLoading 
          ? 'border-transparent animate-pulse' 
          : 'border-gray-200'
      }`}
      aria-label={`View details for ${decodedName}`}
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
        <div className="flex items-center gap-2">
          {service.organisation?.isVerified && (
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
          
          {openingStatus.isOpen && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Open Now
            </span>
          )}
          
          {/* Appointment Only indicator */}
          {openingStatus.isAppointmentOnly && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Appointment Only
            </span>
          )}
        </div>
        
        {/* Distance */}
        {distanceText && (
          <span className="text-xs text-gray-500">{distanceText}</span>
        )}
      </div>

      {/* Show organization name as primary title */}
      {decodedOrgName && (
        <h2 className="text-lg font-semibold mb-1">{decodedOrgName}</h2>
      )}

      {/* Only show service name if it's different from organization name */}
      {decodedName && decodedName !== decodedOrgName && (
        <h3 className="text-md font-medium mb-1 text-gray-700">{decodedName}</h3>
      )}

      <p className="text-sm text-gray-600 mb-2">{formattedCategory}</p>

      <div className="text-gray-800 mb-2">
        {isOpen ? (
          <LazyMarkdownContent content={service.description} className="prose-sm" />
        ) : (
          <p>{preview}</p>
        )}
      </div>
      
      {decodedDescription.length > 120 && (
        <div className="mb-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            className="text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer"
          >
            {isOpen ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {service.openTimes && service.openTimes.length > 0 ? (
        <div className="mt-3">
          <p className="font-semibold text-sm mb-1">Opening Times:</p>
          <ul className="list-disc pl-5 text-sm">
            {(() => {
              // Group opening times by day and consolidate multiple sessions
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
          <p className="text-xs text-gray-500">No opening times available</p>
        </div>
      )}

      {!openingStatus.isOpen && openingStatus.nextOpen && (
        <div className="text-sm mt-2 text-gray-600">
          Next open: {openingStatus.nextOpen.day} {openingStatus.nextOpen.time}
        </div>
      )}
    </Link>
  );
});

export default ServiceCard;
