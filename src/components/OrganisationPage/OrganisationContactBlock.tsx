'use client';
import React from 'react';
import type { OrganisationDetails } from '@/utils/organisation';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationContactBlock({ organisation }: Props) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
      <ul className="list-none space-y-1">
        {organisation.Email && (
          <li>
            <strong>Email:</strong> <a href={`mailto:${organisation.Email}`} className="text-brand-h underline">{organisation.Email}</a>
          </li>
        )}
        {organisation.Telephone && (
          <li>
            <strong>Telephone:</strong> <a href={`tel:${organisation.Telephone}`} className="text-brand-h underline">{organisation.Telephone}</a>
          </li>
        )}
        {organisation.Website && (
          <li>
            <strong>Website:</strong> <a href={organisation.Website} target="_blank" rel="noopener noreferrer" className="text-brand-h underline">{organisation.Website}</a>
          </li>
        )}
        {organisation.Facebook && (
          <li>
            <strong>Facebook:</strong> <a href={organisation.Facebook} target="_blank" rel="noopener noreferrer" className="text-brand-h underline">{organisation.Facebook}</a>
          </li>
        )}
        {organisation.Twitter && (
          <li>
            <strong>Twitter:</strong> <a href={organisation.Twitter} target="_blank" rel="noopener noreferrer" className="text-brand-h underline">{organisation.Twitter}</a>
          </li>
        )}
      </ul>
    </section>
  );
}
