'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useSearchNavigation } from '@/contexts/SearchNavigationContext';
import LocationPrompt from '@/components/Location/LocationPrompt';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { ServiceWithDistance } from '@/types';

interface FindHelpPageClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function FindHelpPageClient({ searchParams }: FindHelpPageClientProps) {
  const { location } = useLocation();
  const { searchState, clearSearchState } = useSearchNavigation();
  const [services, setServices] = useState<ServiceWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationSet, setHasLocationSet] = useState(false);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check if location is set from navigation or context
  useEffect(() => {
    if (location) {
      setHasLocationSet(true);
    }
  }, [location]);

  // Restore search state if available (user returning from service detail page)
  useEffect(() => {
    if (searchState && searchState.services.length > 0) {
      // Check if the search state is recent (within 10 minutes)
      const isRecentState = Date.now() - searchState.timestamp < 10 * 60 * 1000;
      
      if (isRecentState) {
        setServices(searchState.services);
        setHasLocationSet(true);
        setLoading(false);
        setError(null);
        
        // Clear the search state after restoring to prevent stale data
        setTimeout(() => {
          clearSearchState();
        }, 1000);
      } else {
        // Clear stale search state
        clearSearchState();
      }
    }
  }, [searchState, clearSearchState]);

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
        limit: '1000',
      });

      // Add category filter from search params if provided
      const category = searchParams.category;
      if (category && typeof category === 'string') {
        params.append('category', category);
      }

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
          throw new Error('Too many requests. Please wait a moment and try again.');
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

      const processedServices: ServiceWithDistance[] = rawArray.map((item: unknown) => {
        const serviceItem = item as Record<string, unknown>;
        const coords = ((serviceItem.Address as Record<string, unknown>)?.Location as Record<string, unknown>)?.coordinates as number[] || [0, 0];
        return {
          id: serviceItem._id || serviceItem.id,
          name: String(serviceItem.ServiceProviderName || serviceItem.name || ''),
          description: String(serviceItem.Info || serviceItem.description || ''),
          category: serviceItem.ParentCategoryKey || serviceItem.category || '',
          subCategory: serviceItem.SubCategoryKey || serviceItem.subCategory || '',
          latitude: coords[1],
          longitude: coords[0],
          organisation: {
            name: String((serviceItem.organisation as Record<string, unknown>)?.name || serviceItem.ServiceProviderName || ''),
            slug: (serviceItem.organisation as Record<string, unknown>)?.slug || serviceItem.ServiceProviderKey || '',
            isVerified: (serviceItem.organisation as Record<string, unknown>)?.isVerified || false,
          },
          organisationSlug: (serviceItem.organisation as Record<string, unknown>)?.slug || serviceItem.ServiceProviderKey || '',
          clientGroups: serviceItem.ClientGroups || [],
          openTimes: serviceItem.OpeningTimes || [],
          distance: serviceItem.distance, // Distance calculated by API
        } as ServiceWithDistance;
      });

      setServices(processedServices);
      setRetryCount(0); // Reset retry count on success
      setNetworkError(false);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Error fetching services:', err);
      
      let errorMessage = 'Failed to load services';
      let isNetworkIssue = false;

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
          isNetworkIssue = true;
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Network error. Please check your internet connection.';
          isNetworkIssue = true;
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

          const fallbackResponse = await fetch('/api/services?limit=100', {
            cache: 'no-store',
            signal: fallbackController.signal,
          });
          
          clearTimeout(fallbackTimeoutId);
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const fallbackArray = fallbackData.results || [];
            
            if (Array.isArray(fallbackArray)) {
              const fallbackServices: ServiceWithDistance[] = fallbackArray.map((item: unknown) => {
                const fallbackItem = item as Record<string, unknown>;
                const coords = ((fallbackItem.Address as Record<string, unknown>)?.Location as Record<string, unknown>)?.coordinates as number[] || [0, 0];
                return {
                  id: fallbackItem._id || fallbackItem.id,
                  name: String(fallbackItem.ServiceProviderName || fallbackItem.name || ''),
                  description: String(fallbackItem.Info || fallbackItem.description || ''),
                  category: fallbackItem.ParentCategoryKey || fallbackItem.category || '',
                  subCategory: fallbackItem.SubCategoryKey || fallbackItem.subCategory || '',
                  latitude: coords[1],
                  longitude: coords[0],
                  organisation: {
                    name: String((fallbackItem.organisation as Record<string, unknown>)?.name || fallbackItem.ServiceProviderName || ''),
                    slug: (fallbackItem.organisation as Record<string, unknown>)?.slug || fallbackItem.ServiceProviderKey || '',
                    isVerified: (fallbackItem.organisation as Record<string, unknown>)?.isVerified || false,
                  },
                  organisationSlug: (fallbackItem.organisation as Record<string, unknown>)?.slug || fallbackItem.ServiceProviderKey || '',
                  clientGroups: fallbackItem.ClientGroups || [],
                  openTimes: fallbackItem.OpeningTimes || [],
                } as ServiceWithDistance;
              });
              
              setServices(fallbackServices);
              setError('Unable to filter by location, showing all available services');
            }
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
          setError('Unable to load services. Please try again later.');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams.category]);

  // Fetch services when location is set
  useEffect(() => {
    if (hasLocationSet && location) {
      fetchServices(location);
    }
  }, [hasLocationSet, location, fetchServices]);

  const handleLocationSet = useCallback(() => {
    setHasLocationSet(true);
  }, []);

  const handleRetry = useCallback(async () => {
    if (!location) return;

    if (retryCount >= 3) {
      setError('Maximum retry attempts reached. Please refresh the page or try again later.');
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000;
    
    setTimeout(async () => {
      setIsRetrying(false);
      await fetchServices(location, true);
    }, delay);
  }, [location, fetchServices, retryCount]);

  const handleBrowseAllServices = useCallback(() => {
    // Load all services without location filtering
    setLoading(true);
    setError(null);
    
    fetch('/api/services?limit=200', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => {
        const rawArray = data.results || [];
        if (Array.isArray(rawArray)) {
          const processedServices: ServiceWithDistance[] = rawArray.map((item: unknown) => {
            const browseItem = item as Record<string, unknown>;
            const coords = ((browseItem.Address as Record<string, unknown>)?.Location as Record<string, unknown>)?.coordinates as number[] || [0, 0];
            return {
              id: browseItem._id || browseItem.id,
              name: String(browseItem.ServiceProviderName || browseItem.name || ''),
              description: String(browseItem.Info || browseItem.description || ''),
              category: browseItem.ParentCategoryKey || browseItem.category || '',
              subCategory: browseItem.SubCategoryKey || browseItem.subCategory || '',
              latitude: coords[1],
              longitude: coords[0],
              organisation: {
                name: String((browseItem.organisation as Record<string, unknown>)?.name || browseItem.ServiceProviderName || ''),
                slug: (browseItem.organisation as Record<string, unknown>)?.slug || browseItem.ServiceProviderKey || '',
                isVerified: (browseItem.organisation as Record<string, unknown>)?.isVerified || false,
              },
              organisationSlug: (browseItem.organisation as Record<string, unknown>)?.slug || browseItem.ServiceProviderKey || '',
              clientGroups: browseItem.ClientGroups || [],
              openTimes: browseItem.OpeningTimes || [],
            } as ServiceWithDistance;
          });
          setServices(processedServices);
          setError(null);
        }
      })
      .catch(err => {
        console.error('Browse all services failed:', err);
        setError('Unable to load services. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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
          onRetry={handleRetry}
          showRetry={retryCount < 3}
          fallback={
            <div className="max-w-4xl mx-auto p-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-red-800">Services Error</h3>
                <p className="mt-1 text-sm text-red-700">
                  We&apos;re having trouble loading services. Please try again.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {retryCount < 3 && (
                    <button
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      {isRetrying ? 'Retrying...' : `Try Again (${3 - retryCount} attempts left)`}
                    </button>
                  )}
                  <button
                    onClick={() => setHasLocationSet(false)}
                    className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Change Location
                  </button>
                  <button
                    onClick={handleBrowseAllServices}
                    className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    Browse All Services
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
          />
        </ErrorBoundary>
      )}
    </div>
  );
}