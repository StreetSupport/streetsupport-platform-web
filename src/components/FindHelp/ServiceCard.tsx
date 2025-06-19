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
  organisation?: {
    name: string;
    slug: string;
    isVerified?: boolean;
  };
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
  const destination = service.organisation?.slug
    ? `/find-help/organisation/${service.organisation.slug}`
    : '#';

  const preview =
    service.description.length > 120
      ? service.description.slice(0, 120) + '...'
      : service.description;

  return (
    <Link
      href={destination}
      className="relative block border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-a"
      aria-label={`View details for ${service.name}`}
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

      <h2 className="text-lg font-semibold mb-1">{service.name}</h2>

      {service.organisation?.name && (
        <p className="text-sm text-gray-600 mb-2">{service.organisation.name}</p>
      )}

      <p className="text-gray-800 mb-2">
        {isOpen ? service.description : preview}
        {service.description.length > 120 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggle();
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
