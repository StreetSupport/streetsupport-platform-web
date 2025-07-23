'use client';

import React from 'react';
import Link from 'next/link';

import type { ServiceWithDistance } from '@/types';
import LazyMarkdownContent from '@/components/ui/LazyMarkdownContent';
import { decodeText } from '@/utils/htmlDecode';
import { categoryKeyToName, subCategoryKeyToName } from '@/utils/categoryLookup';
import { isServiceOpenNow, formatDistance } from '@/utils/openingTimes';

interface ServiceCardProps {
  service: ServiceWithDistance;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

const ServiceCard = React.memo(function ServiceCard({ service, isOpen, onToggle, onNavigate }: ServiceCardProps) {
  const destination = service.organisation?.slug
    ? `/find-help/organisation/${service.organisation.slug}`
    : '#';

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

  // Get opening status
  const openingStatus = isServiceOpenNow(service);
  
  // Format distance
  const distanceText = formatDistance(service.distance);

  return (
    <Link
      href={destination}
      onClick={onNavigate}
      className="relative block border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-a"
      aria-label={`View details for ${decodedName}`}
    >
      {/* Top row with verified icon and distance */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {/* ✅ Verified badge */}
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
          
          {/* Open Now indicator */}
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

      {/* Service name - prominent */}
      {decodedName && (
        <h2 className="text-lg font-semibold mb-1">{decodedName}</h2>
      )}

      {/* Organization name */}
      {decodedOrgName && (
        <h3 className="text-md font-medium mb-1 text-gray-700">{decodedOrgName}</h3>
      )}

      {/* Category > Subcategory */}
      <p className="text-sm text-gray-600 mb-2">{formattedCategory}</p>

      {/* Description */}
      <div className="text-gray-800 mb-2">
        {isOpen ? (
          <LazyMarkdownContent content={service.description} className="prose-sm" />
        ) : (
          <p>{preview}</p>
        )}
      </div>
      
      {/* Read more/less button on its own line */}
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

      {/* Opening Times */}
      {service.openTimes && service.openTimes.length > 0 ? (
        <div className="mt-3">
          <p className="font-semibold text-sm mb-1">Opening Times:</p>
          <ul className="list-disc pl-5 text-sm">
            {service.openTimes.map((slot, idx) => {
              // Access the correct property names from the raw data
              const dayIndex = Number(slot.day);
              const startTime = Number(slot.start);
              const endTime = Number(slot.end);
              // Database: Monday=0, Tuesday=1, ..., Sunday=6
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              
              const formatTime = (time: number) => {
                // Handle invalid numbers
                if (isNaN(time)) return '00:00';
                const str = time.toString().padStart(4, '0');
                return `${str.slice(0, 2)}:${str.slice(2)}`;
              };

              return (
                <li key={idx}>
                  {days[dayIndex] ?? 'Unknown'}: {formatTime(startTime)} – {formatTime(endTime)}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-xs text-gray-500">No opening times available</p>
        </div>
      )}

      {/* Next open indicator */}
      {!openingStatus.isOpen && openingStatus.nextOpen && (
        <div className="text-sm mt-2 text-gray-600">
          Next open: {openingStatus.nextOpen.day} {openingStatus.nextOpen.time}
        </div>
      )}
    </Link>
  );
});

export default ServiceCard;
