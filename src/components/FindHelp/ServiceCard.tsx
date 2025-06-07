'use client';

import React from 'react';

export interface Service {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  organisation?: string;
  openTimes?: { day: string; start: string; end: string }[];
  clientGroups?: string[];
  lat?: number;
  lng?: number;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="border-none p-0 shadow-none bg-transparent">
      <h2 className="text-lg font-semibold mb-1">
        {service.name}
      </h2>

      {service.organisation && (
        <p className="text-sm text-gray-600 mb-2">
          {service.organisation}
        </p>
      )}

      <p className="text-gray-800 mb-2">
        {service.description}
      </p>

      <p className="text-sm text-gray-500 mb-2">
        Category: {service.category}
      </p>

      <p className="text-sm text-gray-500 mb-2">
        Subcategory: {service.subCategory}
      </p>

      {service.clientGroups && service.clientGroups.length > 0 && (
        <div className="text-sm mt-2">
          {service.clientGroups.map((group, idx) => (
            <span key={idx} className="inline-block bg-gray-100 px-2 py-1 mr-2 rounded">
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
    </div>
  );
}
