'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { OrganisationDetails } from '@/utils/organisation';

// Lazy load GoogleMap to improve initial page load performance
const GoogleMap = dynamic(() => import('@/components/MapComponent/GoogleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationLocations({ organisation }: Props) {
  // ✅ Normalised prop
  const addresses = organisation.addresses || [];

  const validAddresses = addresses.filter(
    (addr) =>
      addr.Location?.coordinates &&
      addr.Location.coordinates.length === 2 &&
      typeof addr.Location.coordinates[0] === 'number' &&
      typeof addr.Location.coordinates[1] === 'number'
  );

  // ✅ Always render heading, even if no map
  if (validAddresses.length === 0) {
    return (
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Locations</h2>
        <p>No addresses available for this organisation.</p>
      </section>
    );
  }

  const first = validAddresses[0];
  
  // TypeScript guard: we know these exist because of the filter, but TS doesn't
  if (!first.Location?.coordinates || first.Location.coordinates.length !== 2) {
    return (
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Locations</h2>
        <p>No valid addresses available for this organisation.</p>
      </section>
    );
  }

  const center = {
    lat: first.Location.coordinates[1],
    lng: first.Location.coordinates[0],
  };

  const markers = validAddresses.map((addr, idx) => {
    // TypeScript guard for each address
    if (!addr.Location?.coordinates || addr.Location.coordinates.length !== 2) {
      return null;
    }
    
    return {
      id: addr.Key?.$binary?.base64 || `addr-${idx}`,
      lat: addr.Location.coordinates[1],
      lng: addr.Location.coordinates[0],
      title: [addr.Street, addr.City, addr.Postcode].filter(Boolean).join(', '),
      organisationSlug: organisation.key || 'org-location', // ✅ normalised
    };
  }).filter((marker): marker is NonNullable<typeof marker> => marker !== null);

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Locations</h2>
      <GoogleMap center={center} markers={markers} zoom={14} />
    </section>
  );
}
