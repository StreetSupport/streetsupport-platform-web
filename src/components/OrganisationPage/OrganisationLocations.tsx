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
  onMapReady?: (mapInstance: google.maps.Map) => void;
  selectedLocationForService?: Record<string, number>;
}

export default function OrganisationLocations({ organisation, userContext, onMarkerClick, onMapReady, selectedLocationForService }: Props) {
  // Only count service locations to match the accordion behavior
  const uniqueLocationMap = new Map();
  
  // Track location indices for proper selection matching
  const locationIndexMap = new Map<string, number>();
  let globalLocationIndex = 0;
  
  // Only add service locations (this matches what the accordion counts)
  const services = organisation.services || [];
  services.forEach((service) => {
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
          address.City,
          address.Postcode
        ].filter(Boolean).map(part => decodeText(part!));
        
        // Store the location index for this coordinate
        locationIndexMap.set(locationKey, globalLocationIndex);
        
        // Check if this location is selected by matching coordinates with the accordion's selected location
        let isSelected = false;
        if (selectedLocationForService) {
          const serviceKey = `${service.category}-${service.subCategory}`;
          const selectedIndex = selectedLocationForService[serviceKey];
          
          if (selectedIndex !== undefined) {
            // Build the same deduplicated and sorted location list as the accordion does for this service
            const serviceLocations = services.filter(s => 
              s.category === service.category && 
              s.subCategory === service.subCategory &&
              s.address?.Location?.coordinates
            );
            
            // Create deduplicated location list with same logic as accordion
            const deduplicatedLocations = [];
            
            for (const serviceLocation of serviceLocations) {
              const coords = serviceLocation.address?.Location?.coordinates;
              if (coords) {
                // Use same tolerance as accordion for floating point comparison
                const tolerance = 0.000001;
                let isDuplicate = false;
                
                for (const existingLocation of deduplicatedLocations) {
                  const existingCoords = existingLocation.coordinates;
                  const latDiff = Math.abs(existingCoords[1] - coords[1]);
                  const lngDiff = Math.abs(existingCoords[0] - coords[0]);
                  
                  if (latDiff < tolerance && lngDiff < tolerance) {
                    isDuplicate = true;
                    break;
                  }
                }
                
                if (!isDuplicate) {
                  // Calculate distance for sorting (same logic as accordion)
                  let distance = Infinity;
                  if (userContext?.lat && userContext?.lng) {
                    const R = 6371; // Earth's radius in kilometers
                    const dLat = (coords[1] - userContext.lat) * Math.PI / 180;
                    const dLng = (coords[0] - userContext.lng) * Math.PI / 180;
                    const a = 
                      Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(userContext.lat * Math.PI / 180) * Math.cos(coords[1] * Math.PI / 180) * 
                      Math.sin(dLng/2) * Math.sin(dLng/2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    distance = R * c;
                  }
                  
                  // Only add if within radius (same logic as accordion)
                  const withinRadius = !userContext?.radius || distance <= userContext.radius;
                  if (withinRadius) {
                    deduplicatedLocations.push({
                      coordinates: coords,
                      distance: distance,
                      service: serviceLocation
                    });
                  }
                }
              }
            }
            
            // Sort by distance (same as accordion)
            deduplicatedLocations.sort((a, b) => a.distance - b.distance);
            
            // Check if this location matches the selected index
            const currentCoords = address.Location.coordinates;
            const selectedLocation = deduplicatedLocations[selectedIndex];
            if (selectedLocation) {
              const selectedCoords = selectedLocation.coordinates;
              const tolerance = 0.000001;
              const latDiff = Math.abs(selectedCoords[1] - currentCoords[1]);
              const lngDiff = Math.abs(selectedCoords[0] - currentCoords[0]);
              isSelected = latDiff < tolerance && lngDiff < tolerance;
            }
          }
        }
        
        uniqueLocationMap.set(locationKey, {
          id: `service-loc-${globalLocationIndex}`,
          lat: address.Location.coordinates[1],
          lng: address.Location.coordinates[0],
          title: addressParts.join(', '),
          organisationSlug: organisation.key || 'org-location',
          serviceName: service.subCategory || service.name || 'Service',
          type: 'service',
          isSelected: isSelected,
          // Use default red pin - no custom icon for modern look
        });
        
        globalLocationIndex++;
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
        const addressParts = [addr.Street, addr.City, addr.Postcode].filter(Boolean).map(part => decodeText(part!));
        
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
  let allLocations = Array.from(uniqueLocationMap.values());
  
  // Filter locations to only show those within search radius if user context is available
  if (userContext?.lat && userContext?.lng && userContext?.radius) {
    allLocations = allLocations.filter(location => {
      // Calculate distance from user location
      const R = 6371; // Earth's radius in kilometers
      const dLat = (location.lat - userContext.lat!) * Math.PI / 180;
      const dLng = (location.lng - userContext.lng!) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userContext.lat! * Math.PI / 180) * Math.cos(location.lat * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return distance <= userContext.radius!;
    });
  }

  // Add user location marker if available
  if (userContext?.lat && userContext?.lng) {
    allLocations.unshift({
      id: 'user-location',
      lat: userContext.lat,
      lng: userContext.lng,
      title: 'You are here',
      organisationSlug: 'user-location',
      serviceName: 'Your location',
      type: 'user',
      // Use a modern user location icon - bigger size
      icon: typeof google !== 'undefined' && google.maps ? {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='%234285f4'%3E%3Ccircle cx='16' cy='16' r='12' fill='%234285f4' stroke='white' stroke-width='4'/%3E%3Ccircle cx='16' cy='16' r='4' fill='white'/%3E%3C/svg%3E",
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      } : undefined,
    });
  }

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

  // Count only organisation/service locations (exclude user location marker)
  const organisationLocationCount = allLocations.filter(loc => loc.id !== 'user-location').length;
  
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Locations</h2>
      <p className="text-sm text-gray-600 mb-3">
        {organisationLocationCount} location{organisationLocationCount !== 1 ? 's' : ''} available for this organisation
      </p>
      <GoogleMap center={center} markers={allLocations} zoom={12} onMarkerClick={onMarkerClick} onMapReady={onMapReady} />
    </section>
  );
}
