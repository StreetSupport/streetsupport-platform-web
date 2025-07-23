'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { OrganisationDetails } from '@/utils/organisation';
import { decodeText } from '@/utils/htmlDecode';

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

interface UserContext {
  lat: number | null;
  lng: number | null;
  radius: number | null;
  location: string | null;
}

interface Props {
  organisation: OrganisationDetails;
  userContext?: UserContext;
  onMarkerClick?: (markerId: string) => void;
}

export default function OrganisationLocations({ organisation, userContext, onMarkerClick }: Props) {
  // Only count service locations to match the accordion behavior
  const uniqueLocationMap = new Map();
  
  // Only add service locations (this matches what the accordion counts)
  const services = organisation.services || [];
  services.forEach((service, idx) => {
    const address = service.address;
    if (address?.Location?.coordinates && 
        address.Location.coordinates.length === 2 &&
        typeof address.Location.coordinates[0] === 'number' &&
        typeof address.Location.coordinates[1] === 'number') {
      
      const locationKey = `${address.Location.coordinates[0]}-${address.Location.coordinates[1]}`;
      
      // Only add if this location doesn't already exist (deduplicate)
      if (!uniqueLocationMap.has(locationKey)) {
        const addressParts = [
          address.Street,
          address.Street1, 
          address.City,
          address.Postcode
        ].filter(Boolean).map(part => decodeText(part));
        
        uniqueLocationMap.set(locationKey, {
          id: `service-loc-${idx}`,
          lat: address.Location.coordinates[1],
          lng: address.Location.coordinates[0],
          title: addressParts.join(', '),
          organisationSlug: organisation.key || 'org-location',
          serviceName: service.subCategoryName || service.name || 'Service',
          type: 'service',
        });
      }
    }
  });
  
  // If no service locations, fall back to organization addresses
  if (uniqueLocationMap.size === 0) {
    const addresses = organisation.addresses || [];
    addresses.forEach((addr, idx) => {
      if (addr.Location?.coordinates && 
          addr.Location.coordinates.length === 2 &&
          typeof addr.Location.coordinates[0] === 'number' &&
          typeof addr.Location.coordinates[1] === 'number') {
        
        const locationKey = `${addr.Location.coordinates[0]}-${addr.Location.coordinates[1]}`;
        const addressParts = [addr.Street, addr.City, addr.Postcode].filter(Boolean).map(part => decodeText(part));
        
        uniqueLocationMap.set(locationKey, {
          id: addr.Key?.$binary?.base64 || `org-addr-${idx}`,
          lat: addr.Location.coordinates[1],
          lng: addr.Location.coordinates[0],
          title: addressParts.join(', '),
          organisationSlug: organisation.key || 'org-location',
          type: 'organisation',
        });
      }
    });
  }
  
  // Convert to array for rendering
  const allLocations = Array.from(uniqueLocationMap.values());

  // ✅ Always render heading, even if no map
  if (allLocations.length === 0) {
    return (
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Locations</h2>
        <p>No addresses available for this organisation.</p>
      </section>
    );
  }

  // Determine center point
  let center;
  if (userContext?.lat && userContext?.lng) {
    // Use user location as center if available
    center = {
      lat: userContext.lat,
      lng: userContext.lng,
    };
  } else {
    // Use first location as center
    const first = allLocations[0];
    center = {
      lat: first.lat,
      lng: first.lng,
    };
  }

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Locations</h2>
      <p className="text-sm text-gray-600 mb-3">
        {allLocations.length} location{allLocations.length !== 1 ? 's' : ''} available for this organisation
      </p>
      <GoogleMap center={center} markers={allLocations} zoom={13} onMarkerClick={onMarkerClick} />
    </section>
  );
}
