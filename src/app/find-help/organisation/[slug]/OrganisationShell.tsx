'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';
import { loadSearchState, generateBackToSearchURL } from '@/utils/findHelpStateUtils';

import type { OrganisationDetails } from '@/utils/organisation';

interface UserContext {
  lat: number | null;
  lng: number | null;
  radius: number | null;
  location: string | null;
}

interface AddressWithLocation {
  Location?: {
    coordinates: [number, number];
  };
  [key: string]: unknown;
}

interface ServiceWithCategoryNames {
  categoryName?: string;
  subCategoryName?: string;
  category: string;
  subCategory: string;
  address?: unknown;
  [key: string]: unknown;
}

interface Props {
  organisation: OrganisationDetails;
  userContext?: UserContext;
}

export default function OrganisationShell({ organisation, userContext }: Props) {
  // State to manage location selection for services
  const [selectedLocationForService, setSelectedLocationForService] = useState<Record<string, number>>({});
  // State to manage which accordion is open
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  // State for back navigation URL
  const [backToSearchURL, setBackToSearchURL] = useState<string | null>(null);
  // State for map instance reference
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  
  // Set up back navigation URL on mount
  useEffect(() => {
    const savedState = loadSearchState();
    if (savedState && savedState.fromResultsPage) {
      const backURL = generateBackToSearchURL(
        savedState.lat,
        savedState.lng,
        savedState.selectedCategory,
        savedState.selectedSubCategory,
        savedState.radius,
        savedState.locationSlug
      );
      setBackToSearchURL(backURL);
    }
  }, []);

  // Handler for when a map marker is clicked
  const handleMapMarkerClick = (markerId: string) => {
    // Parse marker ID to extract location coordinates
    if (markerId.startsWith('service-loc-')) {
      // Extract the location index from the marker ID
      const locationIndex = parseInt(markerId.replace('service-loc-', ''), 10);
      
      // Build the same location mapping as OrganisationLocations to find the coordinates
      const services = organisation.services || [];
      const uniqueLocationMap = new Map();
      let globalLocationIndex = 0;
      
      // Recreate the same logic as OrganisationLocations to get the correct coordinates
      services.forEach((service) => {
        const address = service.address;
        if (address?.Location?.coordinates && 
            address.Location.coordinates.length === 2 &&
            typeof address.Location.coordinates[0] === 'number' &&
            typeof address.Location.coordinates[1] === 'number') {
          
          const locationKey = `${address.Location.coordinates[0]}-${address.Location.coordinates[1]}`;
          
          // Only add if this location doesn't already exist (deduplicate)
          if (!uniqueLocationMap.has(locationKey)) {
            uniqueLocationMap.set(locationKey, {
              index: globalLocationIndex,
              coordinates: address.Location.coordinates,
              service: service
            });
            globalLocationIndex++;
          }
        }
      });
      
      // Find the location data for the clicked marker
      const locationData = Array.from(uniqueLocationMap.values()).find(loc => loc.index === locationIndex);
      
      if (locationData) {
        const targetCoords = locationData.coordinates;
        let firstServiceKey: string | null = null;
        
        services.forEach((service) => {
          const serviceCoords = (service.address as AddressWithLocation)?.Location?.coordinates;
          if (serviceCoords && 
              serviceCoords[0] === targetCoords[0] && 
              serviceCoords[1] === targetCoords[1]) {
            
            const serviceWithNames = service as unknown as ServiceWithCategoryNames;
            const category = serviceWithNames.category || 'Other';
            const subcategory = serviceWithNames.subCategory || 'Other';
            const serviceKey = `${category}-${subcategory}`;
            
            // Store the first service key to open its accordion
            if (!firstServiceKey) {
              firstServiceKey = serviceKey;
            }
            
            // Find the index of this location in the service's locations array
            const categoryGroupedServices = getCategoryGroupedServices();
            const serviceData = categoryGroupedServices[category]?.[subcategory];
            if (serviceData) {
              const locationIndex = serviceData.locations.findIndex(loc => {
                const coords = (loc.address as AddressWithLocation)?.Location?.coordinates;
                return coords && coords[0] === targetCoords[0] && coords[1] === targetCoords[1];
              });
              
              if (locationIndex >= 0) {
                setSelectedLocationForService(prev => ({
                  ...prev,
                  [serviceKey]: locationIndex
                }));
              }
            }
          }
        });
        
        // Open the accordion for the first service at this location
        if (firstServiceKey) {
          setOpenAccordion(firstServiceKey);
          
          // Scroll to the services section after a short delay to ensure the accordion opens
          setTimeout(() => {
            const servicesSection = document.querySelector('[data-testid="services-accordion"]');
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    }
  };

  // Helper function to recreate category grouped services (should match the one in OrganisationServicesAccordion)
  const getCategoryGroupedServices = () => {
    const services = organisation.services || [];
    const grouped = {} as Record<string, Record<string, {
      service: unknown;
      locations: Array<{
        address: unknown;
        distance: number;
        service: unknown;
      }>;
    }>>;
    
    services.forEach(service => {
      const serviceWithNames = service as unknown as ServiceWithCategoryNames;
      const category = serviceWithNames.category || 'Other';
      const subcategory = serviceWithNames.subCategory || 'Other';
      const address = service.address || {};
      
      // Calculate distance for this location
      let distance = Infinity;
      const coords = (address as AddressWithLocation).Location?.coordinates;
      if (userContext?.lat && userContext?.lng && coords) {
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
      
      if (!grouped[category]) grouped[category] = {};
      if (!grouped[category][subcategory]) {
        grouped[category][subcategory] = {
          service: service, // Use first service as template
          locations: []
        };
      }
      
      // Only add location if it's unique (deduplicate by coordinates with tolerance for floating point precision)
      const existingLocation = grouped[category][subcategory].locations.find(loc => {
        const locCoords = (loc.address as AddressWithLocation)?.Location?.coordinates;
        if (!locCoords || !coords) {
          return false; // Don't deduplicate locations without coordinates
        }
        
        // Use a small tolerance for floating point comparison (same as accordion)
        const tolerance = 0.000001;
        const latDiff = Math.abs(locCoords[1] - coords[1]);
        const lngDiff = Math.abs(locCoords[0] - coords[0]);
        
        return latDiff < tolerance && lngDiff < tolerance;
      });
      
      if (!existingLocation) {
        // Only add location if it's within the search radius (if radius is specified)
        const withinRadius = !userContext?.radius || distance <= userContext.radius;
        
        if (withinRadius) {
          grouped[category][subcategory].locations.push({
            address,
            distance,
            service
          });
        }
      }
    });
    
    // Sort locations within each service by distance and remove empty services/categories
    Object.keys(grouped).forEach(category => {
      Object.keys(grouped[category]).forEach(subcategory => {
        grouped[category][subcategory].locations.sort((a, b) => a.distance - b.distance);
        
        // Remove services that have no locations after filtering
        if (grouped[category][subcategory].locations.length === 0) {
          delete grouped[category][subcategory];
        }
      });
      
      // Remove categories that have no services after filtering
      if (Object.keys(grouped[category]).length === 0) {
        delete grouped[category];
      }
    });
    
    return grouped;
  };

  // Handler for when a location in the accordion is clicked (to center map)
  const handleLocationClick = (lat: number, lng: number) => {
    if (mapInstance) {
      mapInstance.panTo({ lat, lng });
    }
  };

  // Handler for when map is ready
  const handleMapReady = (map: google.maps.Map) => {
    setMapInstance(map);
  };

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      {backToSearchURL && (
        <div className="mb-4">
          <Link 
            href={backToSearchURL} 
            scroll={false}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to search results
          </Link>
        </div>
      )}
      <OrganisationOverview organisation={organisation} />
      <OrganisationLocations 
        organisation={organisation} 
        userContext={userContext} 
        onMarkerClick={handleMapMarkerClick}
        onMapReady={handleMapReady}
        selectedLocationForService={selectedLocationForService}
      />
      <OrganisationServicesAccordion 
        organisation={organisation} 
        userContext={userContext}
        selectedLocationForService={selectedLocationForService}
        setSelectedLocationForService={setSelectedLocationForService}
        openAccordion={openAccordion}
        setOpenAccordion={setOpenAccordion}
        onLocationClick={handleLocationClick}
      />
      <OrganisationContactBlock organisation={organisation} />
      <OrganisationFooter />
    </main>
  );
}