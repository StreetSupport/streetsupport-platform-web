'use client';

import { useState, useEffect, useCallback } from 'react';
// import Link from 'next/link'; // Unused import
import { useLocation } from '@/contexts/LocationContext';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import LocationPrompt from '@/components/Location/LocationPrompt';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';
import ErrorBoundary from '@/components/ErrorBoundary';
import { 
  getURLSearchParams, 
  updateURLSearchParams, 
  saveSearchState, 
  loadSearchState, 
  clearSearchState, 
  isFromOrganisationPage,
  createSearchState
} from '@/utils/findHelpStateUtils';
import locations from '@/data/locations.json';
import type { ServiceWithDistance } from '@/types';

// Utility function to process raw service data
function processServiceData(item: unknown): ServiceWithDistance {
  const serviceItem = item as Record<string, unknown>;
  const coords = ((serviceItem.Address as Record<string, unknown>)?.Location as Record<string, unknown>)?.coordinates as number[] || [0, 0];
  
  // Process opening times to normalize the data structure
  const openTimes = (serviceItem.OpeningTimes as Array<{ Day?: number; day?: number; StartTime?: number; start?: number; EndTime?: number; end?: number }> || []).map((slot) => ({
    day: slot.Day ?? slot.day ?? 0,
    start: slot.StartTime ?? slot.start ?? 0,
    end: slot.EndTime ?? slot.end ?? 0,
  }));
  
  return {
    id: serviceItem._id || serviceItem.id,
    name: String(serviceItem.ServiceProviderName || serviceItem.name || ''),
    description: String(serviceItem.Info || serviceItem.description || ''),
    category: serviceItem.ParentCategoryKey || serviceItem.category || '',
    subCategory: serviceItem.SubCategoryKey || serviceItem.subCategory || '',
    latitude: coords[1],
    longitude: coords[0],
    organisation: serviceItem.organisation ? {
      name: String((serviceItem.organisation as Record<string, unknown>).name || ''),
      slug: (serviceItem.organisation as Record<string, unknown>).slug || '',
      isVerified: (serviceItem.organisation as Record<string, unknown>).isVerified || false,
    } : {
      name: String(serviceItem.ServiceProviderName || ''),
      slug: serviceItem.ServiceProviderKey || '',
      isVerified: false,
    },
    organisationSlug: serviceItem.organisation ? 
      (serviceItem.organisation as Record<string, unknown>).slug || serviceItem.ServiceProviderKey || '' : 
      serviceItem.ServiceProviderKey || '',
    clientGroups: serviceItem.ClientGroups || [],
    openTimes,
    distance: serviceItem.distance,
  } as ServiceWithDistance;
}

interface FindHelpPageClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function FindHelpPageClient({ searchParams: _searchParams }: FindHelpPageClientProps) {
  const { location, setLocationFromCoordinates, clearLocation } = useLocation();
  const [services, setServices] = useState<ServiceWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationSet, setHasLocationSet] = useState(false);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [shouldRestoreState, setShouldRestoreState] = useState(false);
  const [initialFilters, setInitialFilters] = useState<{
    selectedCategory: string;
    selectedSubCategory: string;
    sortOrder: 'distance' | 'alpha';
    showMap: boolean;
    currentPage?: number;
  } | null>(null);

  // Initialize state from URL and sessionStorage on mount
  useEffect(() => {
    const urlParams = getURLSearchParams();
    const savedState = loadSearchState();
    const fromOrgPage = isFromOrganisationPage();
    
    // Check if we should restore from saved state
    if (savedState && fromOrgPage && savedState.fromResultsPage) {
      setShouldRestoreState(true);
      setInitialFilters({
        selectedCategory: savedState.selectedCategory,
        selectedSubCategory: savedState.selectedSubCategory,
        sortOrder: savedState.sortOrder,
        showMap: savedState.showMap,
        currentPage: 1
      });
      
      // Restore location from saved state
      if (!location || (location.lat !== savedState.lat || location.lng !== savedState.lng)) {
        setLocationFromCoordinates({
          lat: savedState.lat,
          lng: savedState.lng,
          label: savedState.locationLabel,
          radius: savedState.radius,
          source: savedState.locationSource || 'navigation',
          slug: savedState.locationSlug
        });
      }
    } else if (urlParams.lat && urlParams.lng) {
      // Initialize from URL parameters
      const lat = parseFloat(urlParams.lat);
      const lng = parseFloat(urlParams.lng);
      const radius = urlParams.radius ? parseFloat(urlParams.radius) : 5;
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // Check if we have a location slug to restore the proper label
        let label = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        let source: 'geolocation' | 'postcode' | 'navigation' | 'location' = 'navigation';
        let slug: string | undefined;
        
        if (urlParams.locationSlug) {
          const locationData = locations.find(loc => loc.slug === urlParams.locationSlug && loc.isPublic);
          if (locationData) {
            label = locationData.name;
            source = 'location';
            slug = locationData.slug;
          }
        }
        
        setLocationFromCoordinates({
          lat,
          lng,
          label,
          radius,
          source,
          slug
        });
        
        setInitialFilters({
          selectedCategory: urlParams.cat || '',
          selectedSubCategory: urlParams.subcat || '',
          sortOrder: 'distance',
          showMap: false,
          currentPage: 1
        });
      }
    } else {
      // Clear any old saved state if not coming from org page
      clearSearchState();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount - dependencies intentionally omitted
  
  // Check if location is set from navigation or context
  useEffect(() => {
    if (location) {
      setHasLocationSet(true);
    }
  }, [location]);


  const fetchServices = useCallback(async (locationData: typeof location, isRetry: boolean = false) => {
    if (!locationData?.lat || !locationData?.lng) {
      return;
    }

    setLoading(true);
    setError(null);
    setNetworkError(false);

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const params = new URLSearchParams({
        lat: locationData.lat.toString(),
        lng: locationData.lng.toString(),
        radius: (locationData.radius || 5).toString(),
        limit: '500',
      });

      // Don't apply category/subcategory filters in the API call
      // We'll filter client-side to allow users to change filters dynamically

      const response = await fetch(`/api/services?${params.toString()}`, {
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error. Our services are temporarily unavailable.');
        } else if (response.status === 429) {
          throw new Error('RATE_LIMIT');
        } else if (response.status === 404) {
          throw new Error('Services endpoint not found. Please try again later.');
        } else {
          throw new Error(`Failed to fetch services (${response.status}). Please try again.`);
        }
      }

      const data = await response.json();
      const rawArray = data.results || [];

      if (!Array.isArray(rawArray)) {
        throw new Error('Invalid response format from services API');
      }

      const processedServices: ServiceWithDistance[] = rawArray.map(processServiceData);

      setServices(processedServices);
      setNetworkError(false);
    } catch (err) {
      clearTimeout(timeoutId);
      
      let errorMessage = 'Failed to load services';
      let isNetworkIssue = false;

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
          isNetworkIssue = true;
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Network error. Please check your internet connection.';
          isNetworkIssue = true;
        } else if (err.message === 'RATE_LIMIT') {
          errorMessage = 'RATE_LIMIT';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setNetworkError(isNetworkIssue);
      
      // Only attempt fallback if this isn't already a retry and it's not a network issue
      if (!isRetry && !isNetworkIssue) {
        try {
          const fallbackController = new AbortController();
          const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000);

          const fallbackResponse = await fetch('/api/services?limit=50', {
            cache: 'no-store',
            signal: fallbackController.signal,
          });
          
          clearTimeout(fallbackTimeoutId);
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const fallbackArray = fallbackData.results || [];
            
            if (Array.isArray(fallbackArray)) {
              const fallbackServices: ServiceWithDistance[] = fallbackArray.map(processServiceData);
              
              setServices(fallbackServices);
              setError('Unable to filter by location, showing all available services');
            }
          }
        } catch {
          setError('Unable to load services. Please try again later.');
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch services when location is set
  useEffect(() => {
    if (hasLocationSet && location) {
      fetchServices(location);
    }
  }, [hasLocationSet, location, fetchServices]);

  const handleLocationSet = useCallback(() => {
    setHasLocationSet(true);
  }, []);

  const handleRetry = useCallback(() => {
    if (location) {
      fetchServices(location);
    }
  }, [location, fetchServices]);

  const handleChangeLocation = useCallback(() => {
    // Clear all state and URL parameters
    clearLocation();
    clearSearchState();
    setHasLocationSet(false);
    setServices([]);
    setError(null);
    setInitialFilters(null);
    setShouldRestoreState(false);
    
    // Clear URL parameters
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
  }, [clearLocation]);



  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: "Find Help", current: true }
        ]} 
      />
      
      {!hasLocationSet ? (
        <div className="max-w-2xl mx-auto p-4 pt-8">
          <ErrorBoundary
            fallback={
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-red-800">Location Error</h3>
                <p className="mt-1 text-sm text-red-700">
                  We&apos;re having trouble with location services. Please try refreshing the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                >
                  Refresh
                </button>
              </div>
            }
          >
            <LocationPrompt onLocationSet={handleLocationSet} />
          </ErrorBoundary>
        </div>
      ) : (
        <ErrorBoundary
          errorType={networkError ? 'network' : 'services'}
          fallback={
            <div className="max-w-4xl mx-auto p-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-red-800">Services Error</h3>
                <p className="mt-1 text-sm text-red-700">
                  We&apos;re having trouble loading services. Please try again.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={handleChangeLocation}
                    className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Change Location
                  </button>
                </div>
              </div>
            </div>
          }
        >
          <FindHelpResults 
            services={services} 
            loading={loading} 
            error={error}
            shouldRestoreState={shouldRestoreState}
            initialFilters={initialFilters}
            onRetry={handleRetry}
            onStateUpdate={(state) => {
              // Update URL parameters
              updateURLSearchParams({
                lat: location?.lat?.toString(),
                lng: location?.lng?.toString(),
                cat: state.selectedCategory || undefined,
                subcat: state.selectedSubCategory || undefined,
                radius: (location?.radius && location.radius !== 5) ? location.radius.toString() : undefined,
                locationSlug: location?.source === 'location' ? location.slug : undefined
              });
              
              // Save to sessionStorage if location is available
              if (location && location.lat !== undefined && location.lng !== undefined) {
                const searchState = createSearchState(
                  location.lat,
                  location.lng,
                  location.label || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
                  location.radius || 5,
                  {
                    selectedCategory: state.selectedCategory,
                    selectedSubCategory: state.selectedSubCategory,
                    selectedClientGroups: [],
                    openNow: false,
                    sortOrder: state.sortOrder,
                    showMap: state.showMap
                  },
                  location.source,
                  location.slug
                );
                saveSearchState(searchState);
              }
            }}
            onChangeLocation={handleChangeLocation}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}