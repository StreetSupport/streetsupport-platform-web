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
        {organisation.email && (
          <li>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${organisation.email}`} className="text-brand-h underline">
              {organisation.email}
            </a>
          </li>
        )}
        {organisation.telephone && (
          <li>
            <strong>Telephone:</strong>{' '}
            <a href={`tel:${organisation.telephone}`} className="text-brand-h underline">
              {organisation.telephone}
            </a>
          </li>
        )}
        {organisation.website && (
          <li>
            <strong>Website:</strong>{' '}
            <a
              href={organisation.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-h underline"
            >
              {organisation.website}
            </a>
          </li>
        )}
        {organisation.facebook && (
          <li>
            <strong>Facebook:</strong>{' '}
            <a
              href={organisation.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-h underline"
            >
              {organisation.facebook}
            </a>
          </li>
        )}
        {organisation.twitter && (
          <li>
            <strong>Twitter:</strong>{' '}
            <a
              href={organisation.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-h underline"
            >
              {organisation.twitter}
            </a>
          </li>
        )}
        {organisation.bluesky && (
          <li>
            <strong>Bluesky:</strong>{' '}
            <a
              href={organisation.bluesky}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-h underline"
            >
              {organisation.bluesky}
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}
