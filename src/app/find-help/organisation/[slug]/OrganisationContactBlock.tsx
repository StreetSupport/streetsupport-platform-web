'use client';

import type { OrganisationDetails } from '../path/to/OrganisationShell';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationContactBlock({ organisation }: Props) {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold mb-2">Contact</h2>

      {organisation.Email && (
        <p>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${organisation.Email}`}>{organisation.Email}</a>
        </p>
      )}

      {organisation.Telephone && (
        <p>
          <strong>Phone:</strong> {organisation.Telephone}
        </p>
      )}

      {organisation.Website && (
        <p>
          <strong>Website:</strong>{' '}
          <a href={organisation.Website} target="_blank" rel="noopener noreferrer">
            {organisation.Website}
          </a>
        </p>
      )}

      {organisation.Facebook && (
        <p>
          <strong>Facebook:</strong>{' '}
          <a href={organisation.Facebook} target="_blank" rel="noopener noreferrer">
            {organisation.Facebook}
          </a>
        </p>
      )}

      {organisation.Twitter && (
        <p>
          <strong>Twitter:</strong>{' '}
          <a href={organisation.Twitter} target="_blank" rel="noopener noreferrer">
            {organisation.Twitter}
          </a>
        </p>
      )}

      {organisation.Instagram && (
        <p>
          <strong>Instagram:</strong>{' '}
          <a href={organisation.Instagram} target="_blank" rel="noopener noreferrer">
            {organisation.Instagram}
          </a>
        </p>
      )}

      {organisation.Bluesky && (
        <p>
          <strong>Bluesky:</strong>{' '}
          <a href={organisation.Bluesky} target="_blank" rel="noopener noreferrer">
            {organisation.Bluesky}
          </a>
        </p>
      )}
    </section>
  );
}
