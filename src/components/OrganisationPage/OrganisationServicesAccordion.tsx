'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Accordion from '@/components/ui/Accordion';
import MarkdownContent from '@/components/ui/MarkdownContent';
import type { OrganisationDetails, Address } from '@/utils/organisation';
import type { ServiceWithDistance, FlattenedService } from '@/types';
import { isServiceOpenNow } from '@/utils/openingTimes';
import { decodeText } from '@/utils/htmlDecode';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';


// Type for service location data
type ServiceLocation = {
  address: Address;
  distance: number;
  service: FlattenedService;
};

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to format decoded address
function formatAddress(address: Address): string {
  const parts = [
    address.Street,
    address.City,
    address.Postcode,
  ]
    .filter(Boolean)
    .map(part => decodeText(part!));
  
  return parts.join(', ');
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
  const [loadingContent, setLoadingContent] = useState<string | null>(null);
  
  // Use external state if provided, otherwise use internal state
  const selectedLocationForService = externalSelectedLocationForService ?? internalSelectedLocationForService;
  const setSelectedLocationForService = externalSetSelectedLocationForService ?? setInternalSelectedLocationForService;
  const openAccordion = externalOpenAccordion ?? internalOpenAccordion;
  const setOpenAccordion = externalSetOpenAccordion ?? setInternalOpenAccordion;

  // Group services by category first, then collect locations for each service
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
      
      // Calculate distance for this location
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
          service: service, // Use first service as template
          locations: []
        };
      }
      
      // Only add location if it's unique (deduplicate by coordinates with tolerance for floating point precision)
      const existingLocation = grouped[category][subcategory].locations.find(loc => {
        if (!(loc.address as Address).Location?.coordinates || !address.Location?.coordinates) {
          return false; // Don't deduplicate locations without coordinates
        }
        
        // Use a small tolerance for floating point comparison
        const tolerance = 0.000001;
        const latDiff = Math.abs((loc.address as Address).Location!.coordinates![1] - address.Location.coordinates[1]);
        const lngDiff = Math.abs((loc.address as Address).Location!.coordinates![0] - address.Location.coordinates[0]);
        
        return latDiff < tolerance && lngDiff < tolerance;
      });
      
      if (!existingLocation) {
        // Only add location if it's within the search radius (if radius is specified)
        const withinRadius = !userContext?.radius || distance <= userContext.radius;
        
        
        if (withinRadius) {
          grouped[category][subcategory].locations.push({
            address,
            distance,
            service: service as FlattenedService
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
  }, [organisation.services, userContext]);

  // Check for hash in URL to open specific accordion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setOpenAccordion(hash);
      }
    }
  }, [setOpenAccordion]);

  if (Object.keys(categoryGroupedServices).length === 0) return null;

  // Helper function to get selected location for a service
  const getSelectedLocation = (category: string, subcategory: string) => {
    const serviceKey = `${category}-${subcategory}`;
    const selectedIndex = selectedLocationForService[serviceKey] || 0;
    const serviceData = categoryGroupedServices[category]?.[subcategory];
    return serviceData?.locations[selectedIndex] || serviceData?.locations[0];
  };

  // Helper function to set selected location for a service
  const setSelectedLocation = (category: string, subcategory: string, locationIndex: number) => {
    const serviceKey = `${category}-${subcategory}`;
    setSelectedLocationForService(prev => ({
      ...prev,
      [serviceKey]: locationIndex
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

              return (
                <Accordion
                  key={accordionKey}
                  title={getSubCategoryName(category, subcategory)}
                  className="mb-4"
                  isOpen={openAccordion === accordionKey}
                  onToggle={() => setOpenAccordion(openAccordion === accordionKey ? null : accordionKey)}
                >
                  {/* Location Indicators */}
                  {serviceData.locations.length > 1 && (
                    <div className="mb-4">
                      <p className="font-semibold mb-2 text-sm">Available at {serviceData.locations.length} locations:</p>
                      <div className="space-y-2">
                        {serviceData.locations.map((location, locationIndex) => {
                          const fullAddress = formatAddress(location.address as Address);

                          const isSelected = (selectedLocationForService[accordionKey] || 0) === locationIndex;
                          
                          // Get opening status for this location
                          const service = location.service;
                          const serviceWithDistance = {
                            ...service,
                            organisation: {
                              name: service.organisation,
                              slug: service.organisationSlug,
                              isVerified: false,
                            },
                          };
                          const openingStatus = isServiceOpenNow(serviceWithDistance as ServiceWithDistance);

                          return (
                            <button
                              key={locationIndex}
                              type="button"
                              onClick={() => {
                                setSelectedLocation(category, subcategory, locationIndex);
                                
                                // Trigger loading indicator for content update
                                setLoadingContent(accordionKey);
                                setTimeout(() => setLoadingContent(null), 800);
                                
                                // Call map centering callback if provided
                                const coordinates = (location.address as Address).Location?.coordinates;
                                if (onLocationClick && coordinates) {
                                  onLocationClick(coordinates[1], coordinates[0]); // lat, lng
                                }
                              }}
                              className={`w-full px-3 py-3 rounded-lg border text-sm transition-colors ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {/* Responsive layout - mobile first, desktop optimized */}
                              <div className="flex items-start gap-2">
                                <span className="text-xs mt-0.5 flex-shrink-0">📍</span>
                                <div className="flex-1 min-w-0">
                                  {/* Address - allow wrapping */}
                                  <div className="font-medium text-left break-words">{fullAddress || 'Unknown Address'}</div>
                                  
                                  {/* Status and distance info */}
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs">
                                    {/* Distance */}
                                    <div className="flex items-center gap-3">
                                      {location.distance !== Infinity && (
                                        <span className="text-gray-500 flex-shrink-0">{location.distance.toFixed(1)} km</span>
                                      )}
                                      
                                      {/* Status indicators */}
                                      <div className="flex items-center gap-1">
                                        {(() => {
                                          const service = location.service;
                                          const hasOpenTimes = service.openTimes && service.openTimes.length > 0;
                                          
                                          // Check for 24-hour service
                                          const is24Hour = hasOpenTimes && service.openTimes.some((slot) => {
                                            const startTime = Number(slot.start);
                                            const endTime = Number(slot.end);
                                            return startTime === 0 && endTime === 2359; // 00:00 to 23:59
                                          });
                                          
                                          return (
                                            <>
                                              {/* Open/closed status - only show if has opening times and not 24/7 */}
                                              {hasOpenTimes && !is24Hour && (
                                                <>
                                                  {openingStatus.isOpen && (
                                                    <span className="text-green-600">● Open</span>
                                                  )}
                                                  {!openingStatus.isOpen && (
                                                    <span className="text-gray-500">● Closed</span>
                                                  )}
                                                </>
                                              )}
                                              {is24Hour && (
                                                <span className="text-green-600">● Open 24/7</span>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                    
                                    {/* Next open time - inline on desktop, new line on mobile */}
                                    {!openingStatus.isOpen && openingStatus.nextOpen && (
                                      <span className="text-gray-400 flex-shrink-0">
                                        Next: {openingStatus.nextOpen.day} {openingStatus.nextOpen.time}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Service Description */}
                  {(selectedLocation as ServiceLocation | undefined)?.service?.description && (
                    <div className="mb-4 relative">
                      {loadingContent === accordionKey && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        </div>
                      )}
                      <div className={`transition-opacity duration-200 ${loadingContent === accordionKey ? 'opacity-50' : 'opacity-100'}`}>
                        <MarkdownContent content={(selectedLocation as ServiceLocation).service.description} />
                      </div>
                    </div>
                  )}

                  {/* Service Type Indicators */}
                  {selectedLocation && (
                    <div className="mb-4 relative">
                      {loadingContent === accordionKey && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        </div>
                      )}
                      <div className={`transition-opacity duration-200 ${loadingContent === accordionKey ? 'opacity-50' : 'opacity-100'}`}>
                        {(() => {
                          const service = (selectedLocation as ServiceLocation).service;
                          
                          // Check for phone service
                          const isPhoneService = service.subCategory.toLowerCase().includes('telephone') || 
                                               service.subCategory.toLowerCase().includes('phone') ||
                                               service.subCategory.toLowerCase().includes('helpline');
                          
                          // Check for 24-hour service
                          const is24Hour = service.openTimes && service.openTimes.length > 0 && service.openTimes.some((slot) => {
                            const startTime = Number(slot.start);
                            const endTime = Number(slot.end);
                            return startTime === 0 && endTime === 2359; // 00:00 to 23:59
                          });
                          
                          const hasServiceTypeIndicators = isPhoneService || is24Hour;
                          
                          if (!hasServiceTypeIndicators) return null;
                          
                          return (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {isPhoneService && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                  📞 Phone Service
                                </span>
                              )}
                              {is24Hour && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                  Open 24/7
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Address and Map Links */}
                  {selectedLocation && (
                    <div className="mb-4 relative">
                      {loadingContent === accordionKey && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        </div>
                      )}
                      <div className={`transition-opacity duration-200 ${loadingContent === accordionKey ? 'opacity-50' : 'opacity-100'}`}>
                      <p className="font-semibold mb-1">Address:</p>
                      {(() => {
                        const fullAddress = formatAddress(selectedLocation.address);

                        const googleMapLink = selectedLocation.address.Location?.coordinates
                          ? `https://www.google.com/maps?q=${selectedLocation.address.Location.coordinates[1]},${selectedLocation.address.Location.coordinates[0]}`
                          : undefined;

                        const appleMapLink = selectedLocation.address.Location?.coordinates
                          ? `https://maps.apple.com/?ll=${selectedLocation.address.Location.coordinates[1]},${selectedLocation.address.Location.coordinates[0]}`
                          : undefined;

                        return (
                          <div>
                            <p className="mb-2">{fullAddress || 'No address available'}</p>
                            {(googleMapLink || appleMapLink) && (
                              <div className="flex gap-4 text-sm">
                                {googleMapLink && (
                                  <a
                                    href={googleMapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                  >
                                    View on Google Maps
                                  </a>
                                )}
                                {appleMapLink && (
                                  <a
                                    href={appleMapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                  >
                                    View on Apple Maps
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      </div>
                    </div>
                  )}

                  {/* Opening Times */}
                  {(selectedLocation as ServiceLocation | undefined)?.service?.openTimes && (selectedLocation as ServiceLocation).service.openTimes.length > 0 && (() => {
                    // Check if organization has 24/7 tag - hide opening times if it does
                    const orgTags = organisation.tags || [];
                    const tagsArray = Array.isArray(orgTags) ? orgTags : [orgTags];
                    const is24_7Service = tagsArray.some(tag => 
                      typeof tag === 'string' && tag.toLowerCase().includes('24') && tag.toLowerCase().includes('7')
                    );
                    return !is24_7Service;
                  })() && (
                    <div className="relative">
                      {loadingContent === accordionKey && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        </div>
                      )}
                      <div className={`transition-opacity duration-200 ${loadingContent === accordionKey ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">Opening Times:</p>
                        {(() => {
                          const serviceWithDistance = {
                            ...(selectedLocation as ServiceLocation).service,
                            organisation: {
                              name: (selectedLocation as ServiceLocation).service.organisation,
                              slug: (selectedLocation as ServiceLocation).service.organisationSlug,
                              isVerified: false,
                            },
                          };
                          const openingStatus = isServiceOpenNow(serviceWithDistance as ServiceWithDistance);
                          
                          // Check for phone service
                          const isPhoneService = (selectedLocation as ServiceLocation).service.subCategory.toLowerCase().includes('telephone') || 
                                               (selectedLocation as ServiceLocation).service.subCategory.toLowerCase().includes('phone') ||
                                               (selectedLocation as ServiceLocation).service.subCategory.toLowerCase().includes('helpline');
                          
                          // Check for 24-hour service
                          const is24Hour = (selectedLocation as ServiceLocation).service.openTimes.some((slot) => {
                            const startTime = Number(slot.start);
                            const endTime = Number(slot.end);
                            return startTime === 0 && endTime === 2359; // 00:00 to 23:59
                          });
                          
                          return (
                            <div className="flex items-center flex-wrap gap-2">
                              {openingStatus.isOpen && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Open Now
                                </span>
                              )}
                              {openingStatus.isAppointmentOnly && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Call before attending
                                </span>
                              )}
                              {isPhoneService && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  Phone Service
                                </span>
                              )}
                              {is24Hour && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  24 Hours
                                </span>
                              )}
                              {!openingStatus.isOpen && openingStatus.nextOpen && (
                                <span className="text-xs text-gray-600">
                                  Next open: {openingStatus.nextOpen.day} {openingStatus.nextOpen.time}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      <ul className="list-disc pl-5">
                        {(() => {
                          // Group opening times by day and consolidate multiple sessions
                          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                          const dayGroups = new Map<string, Array<{start: string; end: string}>>();
                          
                          // Group slots by day
                          (selectedLocation as ServiceLocation).service.openTimes.forEach((slot) => {
                            const dayIndex = Number(slot.day);
                            const startTime = Number(slot.start);
                            const endTime = Number(slot.end);
                            
                            if (dayIndex >= 0 && dayIndex <= 6) {
                              const dayName = days[dayIndex];
                              if (!dayGroups.has(dayName)) {
                                dayGroups.set(dayName, []);
                              }
                              dayGroups.get(dayName)!.push({
                                start: formatTime(startTime),
                                end: formatTime(endTime)
                              });
                            }
                          });
                          
                          // Sort days in proper order and format consolidated times
                          const orderedDays = days.filter(day => dayGroups.has(day));
                          
                          return orderedDays.map((dayName) => {
                            const slots = dayGroups.get(dayName) || [];
                            const timeRanges = slots.map(slot => `${slot.start} – ${slot.end}`).join(', ');
                            
                            return (
                              <li key={dayName}>
                                {dayName}: {timeRanges}
                              </li>
                            );
                          });
                        })()}
                      </ul>
                      </div>
                    </div>
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

function formatTime(num: number) {
  const str = num.toString().padStart(4, '0');
  return `${str.slice(0, 2)}:${str.slice(2)}`;
}
