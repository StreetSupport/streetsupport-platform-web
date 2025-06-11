'use client';
import React from 'react';
import type { OrganisationDetails } from '@/utils/organisation';
import GoogleMap from '@/components/MapComponent/GoogleMap';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationLocations({ organisation }: Props) {
  if (
    organisation.latitude == null ||
    organisation.longitude == null
  ) {
    return null;
  }

  const center = { lat: organisation.latitude, lng: organisation.longitude };
  const markers = [
    {
      id: organisation.id,
      lat: organisation.latitude,
      lng: organisation.longitude,
      title: organisation.name,
      organisationSlug: organisation.slug || 'org-loc-default'
    },
  ];

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Location</h2>
      <GoogleMap center={center} markers={markers} zoom={14} />
    </section>
  );
}