'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocation } from '@/contexts/LocationContext';

import type { ServiceWithDistance } from '@/types';
import LazyMarkdownContent from '@/components/ui/LazyMarkdownContent';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import OpeningTimesList from '@/components/ui/OpeningTimesList';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';
import { formatDistance } from '@/utils/openingTimes';
import { buildOrganisationUrl } from '@/utils/buildServiceUrl';
import openingTimesCache from '@/utils/openingTimesCache';
import { trackServiceCardClick } from '@/components/analytics/GoogleAnalytics';

interface ServiceCardProps {
  service: ServiceWithDistance;
  isOpen: boolean;
  onToggle: () => void;
}

const ServiceCard = React.memo(function ServiceCard({ service, isOpen, onToggle }: ServiceCardProps) {
  const { location } = useLocation();
  const searchParams = useSearchParams();
  
  const serviceData = useMemo(() => {
    const decodedDescription = service.description;
    const decodedName = service.name;
    const decodedOrgName = service.organisation?.name || '';
    const shouldTruncate = decodedDescription.length > 120;
    const preview = shouldTruncate
      ? decodedDescription.slice(0, 120) + '...'
      : decodedDescription;
    const categoryName = getCategoryName(service.category);
    const subCategoryName = getSubCategoryName(service.category, service.subCategory);
    const openingStatus = openingTimesCache.getOpeningStatus(service);
    const distanceText = formatDistance(service.distance);
    const is24Hour = service.isOpen247 || (service.openTimes && service.openTimes.some((slot) => {
      const startTime = Number(slot.start);
      const endTime = Number(slot.end);
      return startTime === 0 && endTime === 2359;
    }));

    return {
      decodedDescription,
      decodedName,
      decodedOrgName,
      preview,
      shouldTruncate,
      categoryName,
      subCategoryName,
      openingStatus,
      distanceText,
      is24Hour
    };
  }, [service]);

  const destination = useMemo(
    () => buildOrganisationUrl(service.organisation?.slug || '', location, searchParams ?? undefined),
    [service.organisation?.slug, location, searchParams]
  );

  const {
    decodedName,
    decodedOrgName,
    shouldTruncate,
    categoryName,
    subCategoryName,
    openingStatus,
    distanceText,
    is24Hour
  } = serviceData;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Link
      href={destination}
      onClick={() => {
        setIsLoading(true);
        trackServiceCardClick(
          service.id?.toString() || 'unknown',
          decodedOrgName,
          categoryName
        );
      }}
      className={`card card-compact${isLoading ? ' card-loading' : ''}`}
      aria-label={`View details for ${decodedName}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {service.organisation?.isVerified && <VerifiedBadge />}
          
          {is24Hour ? (
            <span className="service-tag always-open">
              Open 24/7
            </span>
          ) : (
            <>
              {openingStatus.isOpen && (
                <span className="service-tag open">
                  Open Now
                </span>
              )}
              {openingStatus.isAppointmentOnly && (
                <span className="service-tag limited">
                  Appointment Only
                </span>
              )}
            </>
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
        {(() => {
          const content = isOpen ? service.description : serviceData.preview;
          const hasMarkup = /[#*_[\]<>|`~]/.test(content);
          return hasMarkup ? (
            <LazyMarkdownContent content={content} className="text-sm !text-black" />
          ) : (
            <p className="text-sm !text-black">{content}</p>
          );
        })()}
      </div>

      {shouldTruncate && (
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

      {is24Hour ? null : service.openTimes && service.openTimes.length > 0 ? (
        <div className="mt-3">
          <p className="text-small font-semibold mb-1 !text-black">Opening Times:</p>
          <OpeningTimesList openTimes={service.openTimes} />
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
