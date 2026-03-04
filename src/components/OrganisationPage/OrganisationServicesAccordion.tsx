'use client';

import { useState, useEffect, useMemo } from 'react';
import Accordion from '@/components/ui/Accordion';
import ServiceLocationDetails from './ServiceLocationDetails';
import ServiceLocationPicker from './ServiceLocationPicker';
import type { OrganisationDetails, Address } from '@/utils/organisation';
import type { ServiceWithDistance, FlattenedService } from '@/types';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';

type ServiceLocation = {
  address: Address;
  distance: number;
  service: ServiceWithDistance;
};

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

interface UserContext {
  lat: number | null;
  lng: number | null;
  radius: number | null;
  location: string | null;
}

interface Props {
  organisation: OrganisationDetails;
  userContext?: UserContext;
  selectedLocationForService?: Record<string, number>;
  setSelectedLocationForService?: (value: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  openAccordion?: string | null;
  setOpenAccordion?: (value: string | null) => void;
  onLocationClick?: (lat: number, lng: number) => void;
}

export default function OrganisationServicesAccordion({
  organisation,
  userContext,
  selectedLocationForService: externalSelectedLocationForService,
  setSelectedLocationForService: externalSetSelectedLocationForService,
  openAccordion: externalOpenAccordion,
  setOpenAccordion: externalSetOpenAccordion,
  onLocationClick
}: Props) {
  const [internalOpenAccordion, setInternalOpenAccordion] = useState<string | null>(null);
  const [internalSelectedLocationForService, setInternalSelectedLocationForService] = useState<Record<string, number>>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  const selectedLocationForService = externalSelectedLocationForService ?? internalSelectedLocationForService;
  const setSelectedLocationForService = externalSetSelectedLocationForService ?? setInternalSelectedLocationForService;
  const openAccordion = externalOpenAccordion ?? internalOpenAccordion;
  const setOpenAccordion = externalSetOpenAccordion ?? setInternalOpenAccordion;

  const categoryGroupedServices = useMemo(() => {
    const services = organisation.services || [];
    const grouped = {} as Record<string, Record<string, {
      service: FlattenedService;
      locations: ServiceLocation[];
    }>>;

    services.forEach(service => {
      const category = service.category || 'Other';
      const subcategory = service.subCategory || 'Other';
      const address = service.address || {};

      let distance = Infinity;
      if (userContext?.lat && userContext?.lng && address.Location?.coordinates) {
        distance = calculateDistance(
          userContext.lat,
          userContext.lng,
          address.Location.coordinates[1],
          address.Location.coordinates[0]
        );
      }

      if (!grouped[category]) grouped[category] = {};
      if (!grouped[category][subcategory]) {
        grouped[category][subcategory] = {
          service: service,
          locations: []
        };
      }

      const existingLocation = grouped[category][subcategory].locations.find(loc => {
        if (!(loc.address as Address).Location?.coordinates || !address.Location?.coordinates) {
          return false;
        }
        const tolerance = 0.000001;
        const latDiff = Math.abs((loc.address as Address).Location!.coordinates![1] - address.Location.coordinates[1]);
        const lngDiff = Math.abs((loc.address as Address).Location!.coordinates![0] - address.Location.coordinates[0]);
        return latDiff < tolerance && lngDiff < tolerance;
      });

      if (!existingLocation) {
        const withinRadius = !userContext?.radius || distance <= userContext.radius;

        if (withinRadius) {
          const transformedService: ServiceWithDistance = {
            ...service,
            organisation: {
              name: service.organisation,
              slug: service.organisationSlug,
              isVerified: false
            }
          };

          grouped[category][subcategory].locations.push({
            address,
            distance,
            service: transformedService
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
  }, [organisation.services, userContext]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setOpenAccordion(hash);
      }
    }
  }, [setOpenAccordion]);

  if (Object.keys(categoryGroupedServices).length === 0) return null;

  const getSelectedLocation = (category: string, subcategory: string) => {
    const serviceKey = `${category}-${subcategory}`;
    const selectedIndex = selectedLocationForService[serviceKey] || 0;
    const serviceData = categoryGroupedServices[category]?.[subcategory];
    return serviceData?.locations[selectedIndex] || serviceData?.locations[0];
  };

  const setSelectedLocation = (category: string, subcategory: string, locationIndex: number) => {
    const serviceKey = `${category}-${subcategory}`;
    setSelectedLocationForService(prev => ({
      ...prev,
      [serviceKey]: locationIndex
    }));
  };

  const handleToggleExpanded = (key: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section className="mb-6" data-testid="services-accordion">
      <h2 className="text-xl font-semibold mb-4">Services</h2>

      {Object.keys(categoryGroupedServices).map((category) => {
        const subcategories = Object.keys(categoryGroupedServices[category]);

        return (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-bold mb-4">{getCategoryName(category)}</h3>

            {subcategories.map((subcategory) => {
              const serviceData = categoryGroupedServices[category][subcategory];
              const accordionKey = `${category}-${subcategory}`;
              const selectedLocation = getSelectedLocation(category, subcategory);
              const isMultiLocation = serviceData.locations.length > 1;

              return (
                <Accordion
                  key={accordionKey}
                  title={getSubCategoryName(category, subcategory)}
                  className="mb-4"
                  isOpen={openAccordion === accordionKey}
                  onToggle={() => {
                    if (openAccordion === accordionKey) {
                      setOpenAccordion(null);
                    } else {
                      setOpenAccordion(accordionKey);
                    }
                    if (openAccordion) {
                      setSelectedLocationForService(prev => {
                        const next = { ...prev };
                        delete next[openAccordion];
                        return next;
                      });
                    }
                  }}
                >
                  {isMultiLocation && (
                    <ServiceLocationPicker
                      locations={serviceData.locations}
                      selectedIndex={selectedLocationForService[accordionKey] ?? -1}
                      onSelectLocation={(index) => setSelectedLocation(category, subcategory, index)}
                      onLocationClick={onLocationClick}
                      renderDetails={(location) => (
                        <ServiceLocationDetails
                          location={location}
                          accordionKey={accordionKey}
                          expandedDescriptions={expandedDescriptions}
                          onToggleExpanded={handleToggleExpanded}
                        />
                      )}
                    />
                  )}

                  {!isMultiLocation && selectedLocation && (
                    <ServiceLocationDetails
                      location={selectedLocation}
                      accordionKey={accordionKey}
                      expandedDescriptions={expandedDescriptions}
                      onToggleExpanded={handleToggleExpanded}
                    />
                  )}
                </Accordion>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
