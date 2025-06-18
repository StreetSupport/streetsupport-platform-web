'use client';

import React from 'react';
import Link from 'next/link';

export interface Service {
  id: string;
  name: string;
  category: string;
  categoryName?: string;
  subCategory: string;
  subCategoryName?: string;
  description: string;
  organisation?: string;
  organisationSlug?: string;
  openTimes?: { day: string; start: string; end: string }[];
  clientGroups?: string[];
  lat?: number;
  lng?: number;
}

interface ServiceCardProps {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ServiceCard({ service, isOpen, onToggle }: ServiceCardProps) {
  const destination = service.organisationSlug
    ? `/find-help/organisation/${service.organisationSlug}`
    : '#';

  const preview = service.description.length > 120
    ? service.description.slice(0, 120) + '...'
    : service.description;

  return (
    <Link
      href={destination}
      className="block border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-a"
      aria-label={`View details for ${service.name}`}
    >
      <h2 className="text-lg font-semibold mb-1">{service.name}</h2>

      {service.organisation && (
        <p className="text-sm text-gray-600 mb-2">{service.organisation}</p>
      )}

      <p className="text-gray-800 mb-2">
        {isOpen ? service.description : preview}
        {service.description.length > 120 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // prevent link navigation
              onToggle(); // notify parent
            }}
            className="ml-2 text-blue-600 underline text-sm"
          >
            {isOpen ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>

      <p className="text-sm text-gray-500 mb-1">
        Category: {service.categoryName || service.category}
      </p>

      <p className="text-sm text-gray-500 mb-2">
        Subcategory: {service.subCategoryName || service.subCategory}
      </p>

      {service.clientGroups && service.clientGroups.length > 0 && (
        <div className="text-sm mt-2">
          {service.clientGroups.map((group, idx) => (
            <span
              key={idx}
              className="inline-block bg-gray-100 px-2 py-1 mr-2 rounded"
            >
              {group}
            </span>
          ))}
        </div>
      )}

      {service.openTimes && service.openTimes.length > 0 && (
        <div className="text-sm mt-2 text-gray-600">
          {service.openTimes.map((slot, idx) => (
            <div key={idx}>
              {slot.day}: {slot.start} – {slot.end}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
