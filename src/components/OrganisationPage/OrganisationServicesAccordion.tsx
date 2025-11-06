'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Accordion from '@/components/ui/Accordion';
import MarkdownContent from '@/components/ui/MarkdownContent';
import Tooltip from '@/components/ui/Tooltip';
import type { OrganisationDetails, Address } from '@/utils/organisation';
import type { ServiceWithDistance, FlattenedService } from '@/types';
import { isServiceOpenNow } from '@/utils/openingTimes';
import { decodeText } from '@/utils/htmlDecode';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';


// Type for service location data
type ServiceLocation = {
  address: Address;
  distance: number;
  service: ServiceWithDistance;
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
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  
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
          // Transform FlattenedService to ServiceWithDistance by converting organisation string to object
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
                          // service is already a ServiceWithDistance, no need to transform
                          const openingStatus = isServiceOpenNow(service);

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
                                          const is24Hour = (hasOpenTimes && service.openTimes.some((slot) => {
                                            const startTime = Number(slot.start);
                                            const endTime = Number(slot.end);
                                            return startTime === 0 && endTime === 2359; // 00:00 to 23:59
                                          }));
                                          
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
                                              {service.isOpen247 && (
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
                          const isPhoneService = service.isTelephoneService || service.subCategory.toLowerCase().includes('telephone') || 
                                               service.subCategory.toLowerCase().includes('phone') ||
                                               service.subCategory.toLowerCase().includes('helpline');
                          
                          // Check for 24-hour service
                          const is24Hour = (service.openTimes && service.openTimes.length > 0 && service.openTimes.some((slot) => {
                            const startTime = Number(slot.start);
                            const endTime = Number(slot.end);
                            return startTime === 0 && endTime === 2359; // 00:00 to 23:59
                          }));

                          // Check for accommodation service
                          const isAccommodation = service.category === 'accom' || service.sourceType === 'accommodation';
                          const accommodationData = service.accommodationData;
                          
                          const hasServiceTypeIndicators = isPhoneService || is24Hour || isAccommodation || service.isOpen247;
                          
                          if (!hasServiceTypeIndicators) return null;
                          
                          return (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {isPhoneService && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                  📞 Phone Service
                                </span>
                              )}
                              {service.isOpen247 && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                  Open 24/7
                                </span>
                              )}
                              {service.isAppointmentOnly && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                  Call before attending
                                </span>
                              )}
                              {isAccommodation && accommodationData && (
                                <>
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    🏠 {accommodationData.type === 'supported' ? 'Supported' : 
                                         accommodationData.type === 'emergency' ? 'Emergency' :
                                         accommodationData.type === 'hostel' ? 'Hostel' :
                                         accommodationData.type === 'social' ? 'Social Housing' :
                                         accommodationData.type || 'Accommodation'}
                                  </span>
                                  {accommodationData.referralRequired && (
                                    <Tooltip 
                                      content={accommodationData.referralNotes ? 
                                        `Referral required: ${accommodationData.referralNotes}` : 
                                        "A referral is required for this accommodation. Contact the organisation to find out how to obtain a referral."}
                                      position="bottom"
                                    >
                                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-help" style={{backgroundColor: 'var(--color-brand-j)', color: 'white'}}>
                                        Referral Required
                                      </span>
                                    </Tooltip>
                                  )}
                                  {accommodationData.isOpenAccess && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium" style={{backgroundColor: 'var(--color-brand-b)', color: 'white'}}>
                                      Open Access
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Accommodation Details */}
                  {selectedLocation && (selectedLocation as ServiceLocation).service.category === 'accom' && (
                    <div className="mb-4 relative">
                      {loadingContent === accordionKey && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        </div>
                      )}
                      <div className={`transition-opacity duration-200 ${loadingContent === accordionKey ? 'opacity-50' : 'opacity-100'}`}>
                        {(() => {
                          const accommodationData = (selectedLocation as ServiceLocation).service.accommodationData;
                          if (!accommodationData) return null;

                          return (
                            <div className="space-y-6">
                              <h4 className="text-lg font-semibold mb-4 border-b pb-2" style={{ color: 'var(--color-brand-k)', borderColor: 'var(--color-brand-q)' }}>
                                Accommodation Information
                              </h4>
                              
                              {/* Description with read more */}
                              {(accommodationData.description || accommodationData.synopsis) && (
                                <div className="mb-4">
                                  {(() => {
                                    // Use description if available, otherwise fall back to synopsis
                                    const description = accommodationData.description || accommodationData.synopsis || '';
                                    const shouldTruncate = description.length > 140;
                                    const truncatedDescription = shouldTruncate ? description.slice(0, 140) + '...' : description;
                                    const descriptionKey = `${accordionKey}-description`;
                                    const isExpanded = expandedDescriptions[descriptionKey] || false;
                                    
                                    return (
                                      <div className="text-sm" style={{ color: 'var(--color-brand-l)', lineHeight: '1.6' }}>
                                        <p>
                                          {isExpanded || !shouldTruncate ? description : truncatedDescription}
                                          {shouldTruncate && (
                                            <button 
                                              onClick={() => setExpandedDescriptions(prev => ({
                                                ...prev,
                                                [descriptionKey]: !isExpanded
                                              }))}
                                              className="ml-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded"
                                              style={{ color: 'var(--color-brand-a)' }}
                                            >
                                              {isExpanded ? 'Read less' : 'Read more'}
                                            </button>
                                          )}
                                        </p>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                              
                              {/* Application & Contact */}
                              <div className="rounded-lg p-4" style={{ backgroundColor: '#f0f9f7', borderLeft: '4px solid var(--color-brand-b)' }}>
                                <h5 className="font-semibold mb-3" style={{ color: 'var(--color-brand-k)' }}>
                                  How to Apply & Contact
                                </h5>
                                <div className="space-y-3">
                                  {accommodationData.referralNotes && (
                                    <div>
                                      <p className="font-medium text-sm mb-1" style={{ color: 'var(--color-brand-k)' }}>Application Process:</p>
                                      <p className="text-sm p-3 rounded" style={{ color: 'var(--color-brand-l)', backgroundColor: 'var(--color-brand-q)' }}>{accommodationData.referralNotes}</p>
                                    </div>
                                  )}
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {accommodationData.contact?.name && (
                                      <div>
                                        <p className="font-medium text-sm" style={{ color: 'var(--color-brand-k)' }}>Contact Person:</p>
                                        <p className="text-sm" style={{ color: 'var(--color-brand-l)' }}>{accommodationData.contact.name}</p>
                                      </div>
                                    )}
                                    {accommodationData.contact?.telephone && (
                                      <div>
                                        <p className="font-medium text-sm" style={{ color: 'var(--color-brand-k)' }}>Phone:</p>
                                        <p className="text-sm font-mono" style={{ color: 'var(--color-brand-l)' }}>{accommodationData.contact.telephone}</p>
                                      </div>
                                    )}
                                    {accommodationData.contact?.email && (
                                      <div>
                                        <p className="font-medium text-sm" style={{ color: 'var(--color-brand-k)' }}>Email:</p>
                                        <p className="text-sm" style={{ color: 'var(--color-brand-l)' }}>{accommodationData.contact.email}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Cost & Meals */}
                              <div className="rounded-lg p-4" style={{ backgroundColor: '#fef9e7', borderLeft: '4px solid var(--color-brand-j)' }}>
                                <h5 className="font-semibold mb-3" style={{ color: 'var(--color-brand-k)' }}>
                                  Cost & Meals
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="font-medium text-sm mb-1" style={{ color: 'var(--color-brand-k)' }}>Weekly Cost:</p>
                                    <p className="text-lg font-bold" style={{ color: 'var(--color-brand-a)' }}>
                                      {accommodationData.price === '0' || !accommodationData.price ? 'Free' : `£${accommodationData.price}`}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm mb-1" style={{ color: 'var(--color-brand-k)' }}>Meals Included:</p>
                                    <p className="text-sm" style={{ color: 'var(--color-brand-l)' }}>
                                      {accommodationData.foodIncluded === 1 ? 'Yes' : 
                                       accommodationData.foodIncluded === 0 ? 'No' : 'Not specified'}
                                    </p>
                                    {accommodationData.availabilityOfMeals && (
                                      <p className="text-xs mt-1" style={{ color: 'var(--color-brand-f)' }}>{accommodationData.availabilityOfMeals}</p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm mb-1" style={{ color: 'var(--color-brand-k)' }}>Housing Benefit:</p>
                                    <p className="text-sm" style={{ color: 'var(--color-brand-l)' }}>
                                      {accommodationData.features?.acceptsHousingBenefit === 1 ? 'Accepted' : 
                                       accommodationData.features?.acceptsHousingBenefit === 0 ? 'Not accepted' : 'Not specified'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Who Can Stay */}
                              <div className="rounded-lg p-4" style={{ backgroundColor: '#f0f4ff', borderLeft: '4px solid var(--color-brand-h)' }}>
                                <h5 className="font-semibold mb-3" style={{ color: 'var(--color-brand-k)' }}>
                                  Who Can Stay
                                </h5>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                  {(() => {
                                    const renderCriteria = (key: string, label: string, value: unknown) => {
                                      const isAccepted = value === true || value === 1;
                                      const isUnspecified = value === 2 || value === undefined || value === null;
                                      
                                      if (isUnspecified) {
                                        return (
                                          <div key={key} style={{ color: 'var(--color-brand-f)' }}>
                                            {label} (not specified)
                                          </div>
                                        );
                                      }
                                      
                                      return (
                                        <div key={key} style={{ color: isAccepted ? 'var(--color-brand-b)' : 'var(--color-brand-g)' }}>
                                          {isAccepted ? '✓' : '✗'} {label}
                                        </div>
                                      );
                                    };
                                    
                                    return [
                                      renderCriteria('men', 'Men', accommodationData.residentCriteria?.acceptsMen),
                                      renderCriteria('women', 'Women', accommodationData.residentCriteria?.acceptsWomen),
                                      renderCriteria('couples', 'Couples', accommodationData.residentCriteria?.acceptsCouples),
                                      renderCriteria('young', 'Young People', accommodationData.residentCriteria?.acceptsYoungPeople),
                                      renderCriteria('families', 'Families', accommodationData.residentCriteria?.acceptsFamilies),
                                      renderCriteria('benefits', 'Benefits Claimants', accommodationData.residentCriteria?.acceptsBenefitsClaimants)
                                    ];
                                  })()}
                                </div>
                              </div>

                              {/* Facilities & Features */}
                              <div className="rounded-lg p-4" style={{backgroundColor: '#faf9f7', borderLeft: '4px solid var(--color-brand-d)'}}>
                                <h5 className="font-semibold mb-3" style={{color: 'var(--color-brand-k)'}}>
                                  Facilities & Features
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="font-medium text-sm mb-2" style={{color: 'var(--color-brand-k)'}}>Room Types:</p>
                                    <div className="space-y-1 text-sm">
                                      {(() => {
                                        const singleRooms = accommodationData.features?.hasSingleRooms;
                                        const sharedRooms = accommodationData.features?.hasSharedRooms;
                                        
                                        const items = [];
                                        if (singleRooms === 1) {
                                          items.push(<div key="single" style={{color: 'var(--color-brand-b)'}}>✓ Single rooms available</div>);
                                        } else if (singleRooms === 0) {
                                          items.push(<div key="single" style={{color: 'var(--color-brand-g)'}}>✗ No single rooms</div>);
                                        }
                                        
                                        if (sharedRooms === 1) {
                                          items.push(<div key="shared" style={{color: 'var(--color-brand-b)'}}>✓ Shared rooms available</div>);
                                        } else if (sharedRooms === 0) {
                                          items.push(<div key="shared" style={{color: 'var(--color-brand-g)'}}>✗ No shared rooms</div>);
                                        }
                                        
                                        if (items.length === 0) {
                                          items.push(<div key="none" style={{color: 'var(--color-brand-f)'}}>Room types not specified</div>);
                                        }
                                        
                                        return items;
                                      })()}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium text-sm mb-2" style={{color: 'var(--color-brand-k)'}}>Facilities:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {(() => {
                                        const facilities = [];
                                        const features = accommodationData.features || {};
                                        
                                        if (features.hasAccessToKitchen === 1) {
                                          facilities.push(<span key="kitchen" className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor: 'var(--color-brand-d)', color: 'white'}}>Kitchen</span>);
                                        }
                                        if (features.hasLaundryFacilities === 1) {
                                          facilities.push(<span key="laundry" className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor: 'var(--color-brand-d)', color: 'white'}}>Laundry</span>);
                                        }
                                        if (features.hasLounge === 1) {
                                          facilities.push(<span key="lounge" className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor: 'var(--color-brand-d)', color: 'white'}}>Lounge</span>);
                                        }
                                        if (features.hasShowerBathroomFacilities === 1) {
                                          facilities.push(<span key="bathroom" className="px-2 py-1 rounded text-xs font-medium" style={{backgroundColor: 'var(--color-brand-d)', color: 'white'}}>Bathroom</span>);
                                        }
                                        
                                        if (facilities.length === 0) {
                                          facilities.push(<span key="none" className="px-2 py-1 text-xs" style={{color: 'var(--color-brand-f)'}}>Facilities not specified</span>);
                                        }
                                        
                                        return facilities;
                                      })()}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="font-medium text-sm mb-2" style={{color: 'var(--color-brand-k)'}}>Accessibility & Policies:</p>
                                    <div className="space-y-1 text-sm">
                                      {(() => {
                                        const policies = [];
                                        const features = accommodationData.features || {};
                                        
                                        if (features.hasDisabledAccess === 1) {
                                          policies.push(<div key="disabled" style={{color: 'var(--color-brand-b)'}}>✓ Wheelchair accessible</div>);
                                        } else if (features.hasDisabledAccess === 0) {
                                          policies.push(<div key="disabled" style={{color: 'var(--color-brand-g)'}}>✗ Not wheelchair accessible</div>);
                                        }
                                        
                                        if (features.acceptsPets === 1) {
                                          policies.push(<div key="pets" style={{color: 'var(--color-brand-b)'}}>✓ Pets allowed</div>);
                                        } else if (features.acceptsPets === 0) {
                                          policies.push(<div key="pets" style={{color: 'var(--color-brand-g)'}}>✗ No pets allowed</div>);
                                        }
                                        
                                        if (features.allowsVisitors === 1) {
                                          policies.push(<div key="visitors" style={{color: 'var(--color-brand-b)'}}>✓ Visitors allowed</div>);
                                        } else if (features.allowsVisitors === 0) {
                                          policies.push(<div key="visitors" style={{color: 'var(--color-brand-g)'}}>✗ No visitors allowed</div>);
                                        }
                                        
                                        if (policies.length === 0) {
                                          policies.push(<div key="none" style={{color: 'var(--color-brand-f)'}}>Policies not specified</div>);
                                        }
                                        
                                        return policies;
                                      })()}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="font-medium text-sm mb-2" style={{color: 'var(--color-brand-k)'}}>Management:</p>
                                    <div className="text-sm">
                                      {accommodationData.features?.hasOnSiteManager === 1 ? (
                                        <div style={{color: 'var(--color-brand-b)'}}>✓ On-site manager</div>
                                      ) : accommodationData.features?.hasOnSiteManager === 0 ? (
                                        <div style={{color: 'var(--color-brand-g)'}}>✗ No on-site manager</div>
                                      ) : (
                                        <div style={{color: 'var(--color-brand-f)'}}>Management not specified</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {accommodationData.features?.additionalFeatures && (
                                  <div className="mt-3 pt-3" style={{borderTop: '1px solid var(--color-brand-q)'}}>
                                    <p className="font-medium text-sm mb-1" style={{color: 'var(--color-brand-k)'}}>Additional Features:</p>
                                    <p className="text-sm p-2 rounded" style={{color: 'var(--color-brand-l)', backgroundColor: 'var(--color-brand-q)'}}>{accommodationData.features.additionalFeatures}</p>
                                  </div>
                                )}
                              </div>

                              {/* Support Services */}
                              {(accommodationData.support?.supportOffered?.length > 0 || accommodationData.support?.supportInfo) && (
                                <div className="rounded-lg p-4" style={{backgroundColor: '#f8f5ff', borderLeft: '4px solid var(--color-brand-h)'}}>
                                  <h5 className="font-semibold mb-3" style={{color: 'var(--color-brand-k)'}}>
                                    Support Services
                                  </h5>
                                  {accommodationData.support.supportOffered?.length > 0 && (
                                    <div className="mb-3">
                                      <p className="font-medium text-sm mb-2" style={{color: 'var(--color-brand-k)'}}>Support Available For:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {accommodationData.support.supportOffered.map((support: string, index: number) => (
                                          <span key={index} className="px-3 py-1 rounded text-sm font-medium" style={{backgroundColor: 'var(--color-brand-h)', color: 'white'}}>
                                            {support === 'mental health' ? 'Mental Health' :
                                             support === 'substances' ? 'Substance Abuse' :
                                             support === 'alcohol' ? 'Alcohol Issues' :
                                             support === 'domestic violence' ? 'Domestic Violence' :
                                             support === 'physical health' ? 'Physical Health' :
                                             support.charAt(0).toUpperCase() + support.slice(1)}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {accommodationData.support?.supportInfo && (
                                    <div>
                                      <p className="font-medium text-sm mb-1" style={{color: 'var(--color-brand-k)'}}>Support Details:</p>
                                      <p className="text-sm p-2 rounded" style={{color: 'var(--color-brand-l)', backgroundColor: 'var(--color-brand-q)'}}>{accommodationData.support.supportInfo}</p>
                                    </div>
                                  )}
                                </div>
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
                  {(selectedLocation as ServiceLocation | undefined)?.service?.openTimes && (selectedLocation as ServiceLocation).service.openTimes.length > 0 && !(selectedLocation as ServiceLocation).service.isOpen247 && (
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
                          // selectedLocation.service is already a ServiceWithDistance, no transformation needed
                          const service = (selectedLocation as ServiceLocation).service;
                          const openingStatus = isServiceOpenNow(service);
                          
                          // Check for phone service
                          const isPhoneService = service.isTelephoneService || service.subCategory.toLowerCase().includes('telephone') || 
                                               service.subCategory.toLowerCase().includes('phone') ||
                                               service.subCategory.toLowerCase().includes('helpline');
                          
                          // Check for 24-hour service
                          const is24Hour = service.isOpen247 || (service.openTimes.some((slot) => {
                            const startTime = Number(slot.start);
                            const endTime = Number(slot.end);
                            return startTime === 0 && endTime === 2359; // 00:00 to 23:59
                          }));
                          
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
                          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
