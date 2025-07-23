'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useSearchNavigation } from '@/contexts/SearchNavigationContext';
import { useSearchParams } from 'next/navigation';
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
  icon?: string;
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

  return Array.from(groups.values());
}

export default function FindHelpResults({ services, loading = false, error = null }: Props) {
  const { location, updateRadius } = useLocation();
  const { saveSearchState, searchState } = useSearchNavigation();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [showMap, setShowMap] = useState(false);
  const [sortOrder, setSortOrder] = useState<'distance' | 'alpha'>('distance');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [openDescriptionId, setOpenDescriptionId] = useState<string | null>(null);
  const [isRestoringState, setIsRestoringState] = useState(false);

  // Debounce filter values to prevent excessive re-renders
  const debouncedSelectedCategory = useDebounce(selectedCategory, 300);
  const debouncedSelectedSubCategory = useDebounce(selectedSubCategory, 300);

  // Centralized read more state management
  const handleToggleDescription = useCallback((id: string) => {
    setOpenDescriptionId(prev => prev === id ? null : id);
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

  // Restore search state if available
  useEffect(() => {
    if (searchState && !isRestoringState) {
      setIsRestoringState(true);
      setSortOrder(searchState.filters.sortOrder);
      setSelectedCategory(searchState.filters.selectedCategory);
      setSelectedSubCategory(searchState.filters.selectedSubCategory);
      
      // Restore scroll position after a short delay to ensure DOM is ready
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = searchState.scrollPosition;
        }
        setIsRestoringState(false);
      }, 100);
    }
  }, [searchState, isRestoringState]);

  // Save search state when navigating away
  const handleServiceNavigation = useCallback(() => {
    const currentScrollPosition = scrollContainerRef.current?.scrollTop || 0;
    const currentSearchParams: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      currentSearchParams[key] = value;
    });

    saveSearchState({
      services,
      scrollPosition: currentScrollPosition,
      filters: {
        selectedCategory: debouncedSelectedCategory,
        selectedSubCategory: debouncedSelectedSubCategory,
        sortOrder,
      },
      searchParams: currentSearchParams,
    });
  }, [services, debouncedSelectedCategory, debouncedSelectedSubCategory, sortOrder, saveSearchState, searchParams]);

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
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      });
    }

    return markers;
  }, [filteredServices, location]);

  return (
    <section className="flex flex-col lg:flex-row items-start px-4 sm:px-6 md:px-8 py-6 gap-6 max-w-7xl mx-auto h-auto lg:h-[calc(100vh-4rem)]">
      <div className={`w-full ${showMap ? 'lg:w-1/2' : 'lg:w-full'} flex flex-col h-auto lg:h-full`}>
        <div className="mb-4">
          <h1 className="text-xl font-bold mb-2">Services near you</h1>
          <FilterPanel
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
          <div className="flex items-center flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sortOrder" className="text-sm font-medium">Sort by:</label>
              <select
                id="sortOrder"
                className="border px-2 py-1 rounded"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'distance' | 'alpha')}
              >
                <option value="distance">Distance</option>
                <option value="alpha">Alphabetical</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="radius-filter" className="text-sm font-medium">Search radius:</label>
              <RadiusFilter
                selectedRadius={location?.radius || 5}
                onRadiusChange={updateRadius}
                className="border px-2 py-1 rounded"
              />
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
            >
              {showMap ? 'Hide map' : 'Show map'}
            </button>
          </div>
        </div>

        {showMap && (
          <div className="block lg:hidden w-full mb-4" data-testid="map-container">
            <GoogleMap
              center={
                location && location.lat !== undefined && location.lng !== undefined
                  ? { lat: location.lat, lng: location.lng }
                  : null
              }
              markers={combinedMarkers}
            />
          </div>
        )}

        <div ref={scrollContainerRef} className="flex-1 overflow-y-visible lg:overflow-y-auto pr-2">
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
                  <p className="mt-1 text-sm text-red-700">{error}</p>
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
              onNavigate={handleServiceNavigation}
              batchSize={20}
            />
          )}
        </div>
      </div>

      {showMap && (
        <div className="hidden lg:block w-full lg:w-1/2 mt-8 lg:mt-0 lg:sticky lg:top-[6.5rem] min-h-[400px]" data-testid="map-container">
          <GoogleMap
            center={
              location && location.lat !== undefined && location.lng !== undefined
                ? { lat: location.lat, lng: location.lng }
                : null
            }
            markers={combinedMarkers}
          />
        </div>
      )}
    </section>
  );
}