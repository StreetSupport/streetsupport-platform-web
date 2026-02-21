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
}

export default function OrganisationShell({ organisation }: Props) {
  const [selectedLocationForService, setSelectedLocationForService] = useState<Record<string, number>>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [backToSearchURL, setBackToSearchURL] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [userContext, setUserContext] = useState<UserContext | undefined>(undefined);

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
      setUserContext({
        lat: savedState.lat,
        lng: savedState.lng,
        radius: savedState.radius,
        location: savedState.locationLabel || null,
      });
    }
  }, []);

  const handleMapMarkerClick = (markerId: string) => {
    if (markerId.startsWith('service-loc-')) {
      const locationIndex = parseInt(markerId.replace('service-loc-', ''), 10);

      const services = organisation.services || [];
      const uniqueLocationMap = new Map();
      let globalLocationIndex = 0;

      services.forEach((service) => {
        const address = service.address;
        if (address?.Location?.coordinates &&
            address.Location.coordinates.length === 2 &&
            typeof address.Location.coordinates[0] === 'number' &&
            typeof address.Location.coordinates[1] === 'number') {

          const locationKey = `${address.Location.coordinates[0]}-${address.Location.coordinates[1]}`;

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

            if (!firstServiceKey) {
              firstServiceKey = serviceKey;
            }

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

        if (firstServiceKey) {
          setOpenAccordion(firstServiceKey);

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

      let distance = Infinity;
      const coords = (address as AddressWithLocation).Location?.coordinates;
      if (userContext?.lat && userContext?.lng && coords) {
        const R = 6371;
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
          service: service,
          locations: []
        };
      }

      const existingLocation = grouped[category][subcategory].locations.find(loc => {
        const locCoords = (loc.address as AddressWithLocation)?.Location?.coordinates;
        if (!locCoords || !coords) {
          return false;
        }

        const tolerance = 0.000001;
        const latDiff = Math.abs(locCoords[1] - coords[1]);
        const lngDiff = Math.abs(locCoords[0] - coords[0]);

        return latDiff < tolerance && lngDiff < tolerance;
      });

      if (!existingLocation) {
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

    Object.keys(grouped).forEach(category => {
      Object.keys(grouped[category]).forEach(subcategory => {
        grouped[category][subcategory].locations.sort((a, b) => a.distance - b.distance);

        if (grouped[category][subcategory].locations.length === 0) {
          delete grouped[category][subcategory];
        }
      });

      if (Object.keys(grouped[category]).length === 0) {
        delete grouped[category];
      }
    });

    return grouped;
  };

  const handleLocationClick = (lat: number, lng: number) => {
    if (mapInstance) {
      mapInstance.panTo({ lat, lng });
    }
  };

  const handleMapReady = (map: google.maps.Map) => {
    setMapInstance(map);
  };

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
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
    </div>
  );
}
