'use client';

import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useDebounce } from '@/hooks/useDebounce';
import ProgressiveServiceGrid from './ProgressiveServiceGrid';
import FilterPanel from './FilterPanel';
import RadiusFilter from './RadiusFilter';
import GoogleMap from '@/components/MapComponent/GoogleMap';
import type { ServiceWithDistance } from '@/types';

interface Props {
  services: ServiceWithDistance[];
  loading?: boolean;
  error?: string | null;
  shouldRestoreState?: boolean;
  initialFilters?: {
    selectedCategory: string;
    selectedSubCategory: string;
    sortOrder: 'distance' | 'alpha';
    showMap: boolean;
    currentPage?: number;
  } | null;
  onStateUpdate?: (state: {
    selectedCategory: string;
    selectedSubCategory: string;
    sortOrder: 'distance' | 'alpha';
    showMap: boolean;
    currentPage: number;
  }) => void;
  onChangeLocation?: () => void;
  onRetry?: () => void;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  organisation?: string;
  organisationSlug: string;
  serviceName?: string;
  distanceKm?: number;
  icon?: string | google.maps.Icon;
  type?: string;
}

// Grouping interfaces
interface ServiceGroup {
  orgId: string;
  orgName: string;
  orgSlug: string;
  isVerified: boolean;
  orgDescription?: string;
  services: ServiceWithDistance[];
  categories: string[];
  subcategories: string[];
  distance: number; // Minimum distance from any service in the group
}

// Optimized grouping function moved outside component to prevent recreation
function groupServicesByOrganisation(
  services: ServiceWithDistance[],
  selectedCategory: string,
  selectedSubCategory: string
): ServiceGroup[] {
  const groups = new Map<string, ServiceGroup>();

  for (const service of services) {
    // Apply filtering at the service level first
    const categoryMatch = selectedCategory ? service.category === selectedCategory : true;
    const subCategoryMatch = selectedSubCategory ? service.subCategory === selectedSubCategory : true;
    
    if (!categoryMatch || !subCategoryMatch) {
      continue;
    }

    const groupKey = service.organisation.slug;
    
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        orgId: service.organisation.slug,
        orgName: service.organisation.name,
        orgSlug: service.organisation.slug,
        isVerified: service.organisation.isVerified || false,
        orgDescription: service.description || '',
        services: [],
        categories: [],
        subcategories: [],
        distance: service.distance || 0,
      });
    }

    const group = groups.get(groupKey)!;
    group.services.push(service);
    
    // Add category if not already present
    if (!group.categories.includes(service.category)) {
      group.categories.push(service.category);
    }
    
    // Add subcategory if not already present
    if (!group.subcategories.includes(service.subCategory)) {
      group.subcategories.push(service.subCategory);
    }
    
    // Update distance to minimum distance in group
    if (service.distance && service.distance < group.distance) {
      group.distance = service.distance;
    }
  }

  // After grouping, update orgName and orgDescription to use first regular service if it's currently empty
  // This happens when the first service was an accommodation
  for (const group of groups.values()) {
    if (!group.orgName) {
      const firstRegularService = group.services.find(s => s.sourceType !== 'accommodation');
      if (firstRegularService) {
        group.orgName = firstRegularService.organisation?.name || '';
        group.orgDescription = firstRegularService.description || ''; 
      } else {
        // If all services are accommodations, use the first one's name and description
        group.orgName = group.services[0]?.organisation?.name || '';
        group.orgDescription = group.services[0]?.description || '';
      }
    }
  }

  return Array.from(groups.values());
}

export default React.memo(function FindHelpResults({ 
  services, 
  loading = false, 
  error = null, 
  shouldRestoreState: _shouldRestoreState = false,
  initialFilters = null,
  onStateUpdate,
  onChangeLocation,
  onRetry
}: Props) {
  const { location, updateRadius } = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filtersHeaderRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  
  const [showMap, setShowMap] = useState(initialFilters?.showMap || false);
  const [sortOrder, setSortOrder] = useState<'distance' | 'alpha'>(initialFilters?.sortOrder || 'distance');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.selectedCategory || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialFilters?.selectedSubCategory || '');
  const [currentPage, setCurrentPage] = useState(initialFilters?.currentPage || 1);
  const [openDescriptionId, setOpenDescriptionId] = useState<string | null>(null);

  // Debounce filter values to prevent excessive re-renders
  const debouncedSelectedCategory = useDebounce(selectedCategory, 300);
  const debouncedSelectedSubCategory = useDebounce(selectedSubCategory, 300);
  
  // Effect to call onStateUpdate when state changes
  useEffect(() => {
    if (onStateUpdate) {
      onStateUpdate({
        selectedCategory: debouncedSelectedCategory,
        selectedSubCategory: debouncedSelectedSubCategory,
        sortOrder,
        showMap,
        currentPage
      });
    }
  }, [debouncedSelectedCategory, debouncedSelectedSubCategory, sortOrder, showMap, currentPage, onStateUpdate]);

  // Centralized read more state management
  const handleToggleDescription = useCallback((id: string) => {
    setOpenDescriptionId(prev => prev === id ? null : id);
  }, []);

  // Reset filters handler
  const handleResetFilters = useCallback(() => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setCurrentPage(1); // Reset to first page when filters are reset
  }, []);

  // Combined filtering and grouping logic with debounced values
  const { sortedGroups, filteredServices } = useMemo(() => {
    if (!services || services.length === 0) return { sortedGroups: [], filteredServices: [] };
    
    // Filter services first using debounced values
    const filtered = services.filter((service) => {
      const categoryMatch = debouncedSelectedCategory ? service.category === debouncedSelectedCategory : true;
      const subCategoryMatch = debouncedSelectedSubCategory ? service.subCategory === debouncedSelectedSubCategory : true;
      return categoryMatch && subCategoryMatch;
    });
    
    // Group filtered services using debounced values
    const grouped = groupServicesByOrganisation(services, debouncedSelectedCategory, debouncedSelectedSubCategory);
    
    // Sort groups
    const sorted = sortOrder === 'alpha' 
      ? [...grouped].sort((a, b) => a.orgName.localeCompare(b.orgName))
      : [...grouped].sort((a, b) => a.distance - b.distance);
    
    return {
      sortedGroups: sorted,
      filteredServices: filtered
    };
  }, [services, debouncedSelectedCategory, debouncedSelectedSubCategory, sortOrder]);



  const combinedMarkers: MapMarker[] = useMemo(() => {
    const markers: MapMarker[] = filteredServices.map((s) => ({
      id: s.id,
      lat: s.latitude,
      lng: s.longitude,
      title: s.name,
      organisation: s.organisation?.name,
      organisationSlug: s.organisationSlug,
      serviceName: s.name,
      distanceKm: s.distance,
    }));

    if (location && location.lat != null && location.lng != null) {
      markers.unshift({
        id: 'user-location',
        lat: location.lat,
        lng: location.lng,
        title: 'You are here',
        organisationSlug: 'user-location',
        type: 'user',
        // Use a modern user location icon - bigger size for consistency
        icon: typeof google !== 'undefined' && google.maps ? {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='%234285f4'%3E%3Ccircle cx='16' cy='16' r='12' fill='%234285f4' stroke='white' stroke-width='4'/%3E%3Ccircle cx='16' cy='16' r='4' fill='white'/%3E%3C/svg%3E",
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        } : undefined,
      });
    }

    return markers;
  }, [filteredServices, location]);

  return (
    <section className="section-spacing">
      <div className="page-container">
        <div className="w-full flex flex-col gap-6">
        <div ref={filtersHeaderRef} className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl font-bold">Services near you</h1>
              {location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location.label || `${location.lat?.toFixed(4)}, ${location.lng?.toFixed(4)}`}
                  </span>
                  {onChangeLocation && (
                    <button
                      onClick={onChangeLocation}
                      className="text-brand-a hover:text-brand-b underline transition-colors"
                      title="Change location"
                    >
                      Change
                    </button>
                  )}
                </div>
              )}
            </div>
            {!loading && !error && sortedGroups.length > 0 && (
              <p className="text-sm text-gray-600">
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} from {sortedGroups.length} organisation{sortedGroups.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <FilterPanel
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedCategory={setSelectedCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              onResetFilters={handleResetFilters}
            />
            
            <div className="border-t border-brand-a pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-brand-l mb-2">Sort by</label>
                  <select
                    id="sortOrder"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-brand-a bg-white"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'distance' | 'alpha')}
                  >
                    <option value="distance">Distance</option>
                    <option value="alpha">Alphabetical</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="radius-filter" className="block text-sm font-medium text-brand-l mb-2">Search radius</label>
                  <RadiusFilter
                    selectedRadius={location?.radius || 5}
                    onRadiusChange={updateRadius}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-brand-a bg-white"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="btn-base btn-primary btn-sm"
                  >
                    {showMap ? 'Hide map' : 'Show map'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showMap && (
          <div className="w-full mb-4" data-testid="map-container">
            <GoogleMap
              center={
                location && location.lat !== undefined && location.lng !== undefined
                  ? { lat: location.lat, lng: location.lng }
                  : null
              }
              markers={combinedMarkers}
              zoom={13}
              autoFitBounds={true}
              maxZoom={15}
              minZoom={10}
              includeUserInBounds={true}
              userLocation={
                location && location.lat !== undefined && location.lng !== undefined
                  ? { lat: location.lat, lng: location.lng, radius: location.radius }
                  : null
              }
            />
          </div>
        )}

        <div ref={scrollContainerRef} className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" role="status" aria-label="Loading"></div>
              <span className="ml-2 text-gray-600">Loading services...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading services</h3>
                  {error === 'RATE_LIMIT' ? (
                    <>
                      <p className="mt-1 text-sm text-red-700">Too many requests</p>
                      <p className="text-sm text-red-700">Please wait a moment and try again</p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  )}
                  {(error?.includes('Network error') || error?.includes('Request timed out')) && onRetry && (
                    <button
                      onClick={onRetry}
                      className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : sortedGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No services found matching your criteria.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search in a different area.</p>
            </div>
          ) : (
            <ProgressiveServiceGrid
              groups={sortedGroups}
              showMap={showMap}
              openDescriptionId={openDescriptionId}
              onToggleDescription={handleToggleDescription}
              batchSize={21}
              initialPage={currentPage}
              onPageChange={setCurrentPage}
              scrollTargetRef={filtersHeaderRef}
            />
          )}
        </div>
        </div>
      </div>
    </section>
  );
});