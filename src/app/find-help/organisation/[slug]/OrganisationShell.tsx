'use client';

import { useState } from 'react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';

import type { OrganisationDetails } from '@/utils/organisation';

interface UserContext {
  lat: number | null;
  lng: number | null;
  radius: number | null;
  location: string | null;
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

  // Handler for when a map marker is clicked
  const handleMapMarkerClick = (markerId: string) => {
    // Parse marker ID to extract location coordinates
    if (markerId.startsWith('service-loc-')) {
      // Find the service location that matches this marker
      const services = organisation.services || [];
      const matchingService = services.find((service, idx) => `service-loc-${idx}` === markerId);
      
      if (matchingService) {
        // Find all services at this location and update their selection
        const targetCoords = matchingService.address?.Location?.coordinates;
        if (targetCoords) {
          let firstServiceKey: string | null = null;
          
          services.forEach((service) => {
            const serviceCoords = service.address?.Location?.coordinates;
            if (serviceCoords && 
                serviceCoords[0] === targetCoords[0] && 
                serviceCoords[1] === targetCoords[1]) {
              
              const category = service.categoryName || 'Other';
              const subcategory = service.subCategoryName || 'Other';
              const serviceKey = `${category}-${subcategory}`;
              
              // Store the first service key to open its accordion
              if (!firstServiceKey) {
                firstServiceKey = serviceKey;
              }
              
              // Find the index of this location in the service's locations array
              const categoryGroupedServices = getCategoryGroupedServices();
              const serviceData = categoryGroupedServices[category]?.[subcategory];
              if (serviceData) {
                const locationIndex = serviceData.locations.findIndex(loc => 
                  loc.address?.Location?.coordinates &&
                  loc.address.Location.coordinates[0] === targetCoords[0] &&
                  loc.address.Location.coordinates[1] === targetCoords[1]
                );
                
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
          }
        }
      }
    }
  };

  // Helper function to recreate category grouped services (should match the one in OrganisationServicesAccordion)
  const getCategoryGroupedServices = () => {
    const services = organisation.services || [];
    const grouped = {} as Record<string, Record<string, {
      service: any;
      locations: Array<{
        address: any;
        distance: number;
        service: any;
      }>;
    }>>;
    
    services.forEach(service => {
      const category = service.categoryName || 'Other';
      const subcategory = service.subCategoryName || 'Other';
      const address = service.address || {};
      
      // Calculate distance for this location
      let distance = Infinity;
      if (userContext?.lat && userContext?.lng && address.Location?.coordinates) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (address.Location.coordinates[1] - userContext.lat) * Math.PI / 180;
        const dLng = (address.Location.coordinates[0] - userContext.lng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(userContext.lat * Math.PI / 180) * Math.cos(address.Location.coordinates[1] * Math.PI / 180) * 
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
      
      grouped[category][subcategory].locations.push({
        address,
        distance,
        service
      });
    });
    
    // Sort locations within each service by distance
    Object.keys(grouped).forEach(category => {
      Object.keys(grouped[category]).forEach(subcategory => {
        grouped[category][subcategory].locations.sort((a, b) => a.distance - b.distance);
      });
    });
    
    return grouped;
  };

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <OrganisationOverview organisation={organisation} />
      <OrganisationLocations 
        organisation={organisation} 
        userContext={userContext} 
        onMarkerClick={handleMapMarkerClick}
      />
      <OrganisationServicesAccordion 
        organisation={organisation} 
        userContext={userContext}
        selectedLocationForService={selectedLocationForService}
        setSelectedLocationForService={setSelectedLocationForService}
        openAccordion={openAccordion}
        setOpenAccordion={setOpenAccordion}
      />
      <OrganisationContactBlock organisation={organisation} />
      <OrganisationFooter />
    </main>
  );
}