'use client';
import React from 'react';
import type { OrganisationDetails } from '@/utils/organisation';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationOverview({ organisation }: Props) {
  const categories = Array.from(
    new Set(organisation.services.map((s) => s.category))
  );

  return (
    <section className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{organisation.name}</h1>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-brand-a text-white px-2 py-1 rounded text-sm"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
