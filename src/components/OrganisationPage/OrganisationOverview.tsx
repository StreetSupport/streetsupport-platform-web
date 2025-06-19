'use client';
import React from 'react';
import type { OrganisationDetails } from '@/utils/organisation';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationOverview({ organisation }: Props) {
  return (
    <section className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{organisation.Name}</h1>

      {organisation.ShortDescription && (
        <p className="text-lg mb-2">{organisation.ShortDescription}</p>
      )}

      {organisation.Description && (
        <p className="text-gray-700 whitespace-pre-line">{organisation.Description}</p>
      )}
    </section>
  );
}
