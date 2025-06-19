'use client';

import React from 'react';
import type { OrganisationDetails } from '@/utils/organisation';
import GoogleMap from '@/components/MapComponent/GoogleMap';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationLocations({ organisation }: Props) {
  const addresses = organisation.Addresses || [];

  // ✅ If no addresses or none have valid coordinates, skip map
  const validAddresses = addresses.filter(
    (addr) =>
      addr.Location?.coordinates &&
      addr.Location.coordinates.length === 2 &&
      typeof addr.Location.coordinates[0] === 'number' &&
      typeof addr.Location.coordinates[1] === 'number'
  );

  if (validAddresses.length === 0) {
    return null;
  }

  // ✅ Center on the first valid address
  const first = validAddresses[0];
  const center = {
    lat: first.Location.coordinates[1],
    lng: first.Location.coordinates[0],
  };

  const markers = validAddresses.map((addr, idx) => ({
    id: addr.Key?.$binary?.base64 || `addr-${idx}`,
    lat: addr.Location.coordinates[1],
    lng: addr.Location.coordinates[0],
    title: [addr.Street, addr.City, addr.Postcode].filter(Boolean).join(', '),
    organisationSlug: organisation.Key || 'org-location',
  }));

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Locations</h2>
      <GoogleMap center={center} markers={markers} zoom={14} />
    </section>
  );
}
