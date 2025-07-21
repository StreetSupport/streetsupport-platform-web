'use client';

import React from 'react';
import Link from 'next/link';

import type { ServiceWithDistance } from '@/types';
import { decodeText } from '@/utils/htmlDecode';

interface ServiceCardProps {
  service: ServiceWithDistance;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export default function ServiceCard({ service, isOpen, onToggle, onNavigate }: ServiceCardProps) {
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

  return (
    <Link
      href={destination}
      onClick={onNavigate}
      className="relative block border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-a"
      aria-label={`View details for ${decodedName}`}
    >
      {/* ✅ Verified check icon */}
      {service.organisation?.isVerified && (
        <span
          className="absolute top-2 right-2 inline-flex items-center justify-center"
          title="Verified Service"
        >
          <svg
            className="w-4 h-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}

      <h2 className="text-lg font-semibold mb-1">{decodedName}</h2>

      {decodedOrgName && (
        <p className="text-sm text-gray-600 mb-2">{decodedOrgName}</p>
      )}

      <p className="text-gray-800 mb-2">
        {isOpen ? decodedDescription : preview}
        {decodedDescription.length > 120 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            className="ml-2 text-blue-600 underline text-sm"
          >
            {isOpen ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>

      <p className="text-sm text-gray-500 mb-1">
        Category: {service.category}
      </p>

      <p className="text-sm text-gray-500 mb-2">
        Subcategory: {service.subCategory}
      </p>

      {service.clientGroups && service.clientGroups.length > 0 && (
        <div className="text-sm mt-2">
          {service.clientGroups.map((group, idx) => {
            // Handle both string format and object format for client groups
            const groupName = typeof group === 'string' ? group : (group as { Name?: string; name?: string })?.Name || (group as { Name?: string; name?: string })?.name || String(group);
            return (
              <span
                key={idx}
                className="inline-block bg-gray-100 px-2 py-1 mr-2 rounded"
              >
                {groupName}
              </span>
            );
          })}
        </div>
      )}

      {service.openTimes && service.openTimes.length > 0 && (
        <div className="text-sm mt-2 text-gray-600">
          {service.openTimes.map((slot, idx) => {
            // Convert day number to day name
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            
            // Handle both MongoDB format (Day, StartTime, EndTime) and normalized format (day, start, end)
            const dayValue = (slot as { Day?: number | string; day?: number | string }).Day ?? (slot as { Day?: number | string; day?: number | string }).day;
            const startValue = (slot as { StartTime?: number | string; start?: number | string }).StartTime ?? (slot as { StartTime?: number | string; start?: number | string }).start;
            const endValue = (slot as { EndTime?: number | string; end?: number | string }).EndTime ?? (slot as { EndTime?: number | string; end?: number | string }).end;
            
            // Skip if we don't have the required data
            if (dayValue === undefined || startValue === undefined || endValue === undefined) {
              return null;
            }
            
            const dayName = typeof dayValue === 'number' ? dayNames[dayValue] || dayValue : dayValue;
            
            // Format time (assuming it's in HHMM format or already a string)
            const formatTime = (time: number | string) => {
              if (typeof time === 'string') return time;
              if (typeof time !== 'number') return 'N/A';
              const timeStr = time.toString().padStart(4, '0');
              return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
            };
            
            return (
              <div key={idx}>
                {dayName}: {formatTime(startValue)} – {formatTime(endValue)}
              </div>
            );
          })}
        </div>
      )}
    </Link>
  );
}
