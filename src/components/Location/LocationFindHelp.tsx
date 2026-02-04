'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import GoogleMap from '@/components/MapComponent/GoogleMap';
import rawCategories from '@/data/service-categories.json';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';
import type { ServiceWithDistance } from '@/types';

interface Category {
  key: string;
  name: string;
  subCategories: { key: string; name: string }[];
}

interface Props {
  locationName: string;
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
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

// Process service data from API response
function processServiceData(item: unknown): ServiceWithDistance {
  const serviceItem = item as Record<string, unknown>;
  const coords = ((serviceItem.Address as Record<string, unknown>)?.Location as Record<string, unknown>)?.coordinates as number[] || [0, 0];
  
  const openTimes = (serviceItem.OpeningTimes as Array<{ Day?: number; day?: number; StartTime?: number; start?: number; EndTime?: number; end?: number }> || []).map((slot) => ({
    day: slot.Day ?? slot.day ?? 0,
    start: slot.StartTime ?? slot.start ?? 0,
    end: slot.EndTime ?? slot.end ?? 0,
  }));
  
  return {
    id: String(serviceItem._id || serviceItem.id || ''),
    name: String(serviceItem.name || serviceItem.ServiceProviderName || ''),
    description: String(serviceItem.description || serviceItem.Info || ''),
    category: String(serviceItem.ParentCategoryKey || serviceItem.category || ''),
    subCategory: String(serviceItem.SubCategoryKey || serviceItem.subCategory || ''),
    latitude: coords[1] || 0,
    longitude: coords[0] || 0,
    organisation: serviceItem.organisation ? {
      name: String((serviceItem.organisation as Record<string, unknown>).name || ''),
      slug: String((serviceItem.organisation as Record<string, unknown>).slug || ''),
      isVerified: Boolean((serviceItem.organisation as Record<string, unknown>).isVerified || false),
    } : {
      name: String(serviceItem.ServiceProviderName || serviceItem.name || ''),
      slug: String(serviceItem.ServiceProviderKey || ''),
      isVerified: (serviceItem.IsVerified as boolean) || false,
    },
    organisationSlug: serviceItem.organisation ? 
      String((serviceItem.organisation as Record<string, unknown>).slug || '') :
      String(serviceItem.ServiceProviderKey || ''),
    address: serviceItem.Address as Record<string, unknown> || {},
    openTimes,
    distance: Number(serviceItem.distance || 0),
    clientGroups: Array.isArray(serviceItem.ClientGroups) ? serviceItem.ClientGroups : [],
    isTelephoneService: (serviceItem.IsTelephoneService as boolean) || false,
    isAppointmentOnly: (serviceItem.IsAppointmentOnly as boolean) || false,
    isOpen247: (serviceItem.Address as Record<string, unknown>)?.IsOpen247 as boolean || false
  };
}

const categories = (rawCategories as Category[]).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export default function LocationFindHelp({ locationName, latitude, longitude, radius = 5, limit = 1000 }: Props) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allServices, setAllServices] = useState<ServiceWithDistance[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Debounce search parameters
  const debouncedCategory = useDebounce(selectedCategory, 300);
  const debouncedSubCategory = useDebounce(selectedSubCategory, 300);

  // Get subcategories for selected category
  const subCategories = useMemo(() => {
    const matched = categories.find((cat) => cat.key === selectedCategory);
    if (matched && matched.subCategories) {
      return [...matched.subCategories].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
    return [];
  }, [selectedCategory]);

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedSubCategory && subCategories.length > 0) {
      const isValidSubCategory = subCategories.some(sub => sub.key === selectedSubCategory);
      if (!isValidSubCategory) {
        setSelectedSubCategory('');
      }
    }
  }, [selectedSubCategory, subCategories]);

  // Load all services in radius on initial load
  const loadAllServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lng: longitude.toString(),
        radius: radius.toString(),
        limit: String(limit), // Get all services in area
      });

      const response = await fetch(`/api/services?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const results = data.results || [];
      
      const processedServices = results.map(processServiceData);
      setAllServices(processedServices);
      setHasLoaded(true);
    } catch (err) {
      console.error('Load services error:', err);
      setError('Failed to load services. Please try again.');
      setAllServices([]);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, radius, limit]);

  // Load services on mount
  useEffect(() => {
    loadAllServices();
  }, [loadAllServices]);

  // Filter services based on selected filters
  const filteredServices = useMemo(() => {
    if (!hasLoaded) return [];
    
    return allServices.filter((service) => {
      const categoryMatch = debouncedCategory ? service.category === debouncedCategory : true;
      const subCategoryMatch = debouncedSubCategory ? service.subCategory === debouncedSubCategory : true;
      return categoryMatch && subCategoryMatch;
    });
  }, [allServices, debouncedCategory, debouncedSubCategory, hasLoaded]);

  // Create map markers from filtered services
  const mapMarkers: MapMarker[] = useMemo(() => {
    return filteredServices.map((service) => ({
      id: service.id,
      lat: service.latitude,
      lng: service.longitude,
      title: service.name,
      organisation: service.organisation.name,
      organisationSlug: service.organisation.slug,
      serviceName: service.name,
      distanceKm: service.distance,
      type: 'service',
    }));
  }, [filteredServices]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setError(null);
  };

  const handleShowResults = () => {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
      radius: radius.toString(),
    });

    if (selectedCategory) {
      params.append('cat', selectedCategory);
    }

    if (selectedSubCategory) {
      params.append('subcat', selectedSubCategory);
    }

    router.push(`/find-help?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Search Form - Left Side */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-brand-f p-6">
          <h3 className="heading-4 mb-4">Find Support Services in {locationName}</h3>
          
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-brand-l mb-2">
                What type of support do you need?
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-brand-f rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selection */}
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-brand-l mb-2">
                More specific support (optional)
              </label>
              <select
                id="subcategory"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={subCategories.length === 0}
                className="w-full px-3 py-2 border border-brand-f rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent disabled:bg-gray-100 disabled:text-brand-l disabled:cursor-not-allowed"
              >
                <option value="">All {selectedCategory ? getCategoryName(selectedCategory) : 'subcategories'}</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.key} value={subCategory.key}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-f">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-brand-f">
                Within {radius}km of {locationName}
              </p>
              {(selectedCategory || selectedSubCategory) && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-brand-a hover:text-brand-b underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Show Results Button */}
            {hasLoaded && (
              <div className="space-y-3">
                <div className="text-center">
                  {selectedSubCategory && (
                    <p className="text-sm text-brand-f">
                      Showing {selectedCategory ? getSubCategoryName(selectedCategory, selectedSubCategory) : selectedSubCategory} services
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleShowResults}
                  disabled={filteredServices.length === 0 || loading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-brand-a text-white font-semibold rounded-md hover:bg-brand-b active:bg-brand-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2 disabled:bg-brand-f disabled:text-brand-l disabled:cursor-not-allowed"
                >
                  Show {filteredServices.length} results
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map - Right Side */}
      <div className="h-96 lg:h-[600px]">
        {loading && !hasLoaded ? (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-brand-f">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-a mx-auto mb-2"></div>
              <span className="text-brand-f">Loading services...</span>
            </div>
          </div>
        ) : (
          <GoogleMap
            center={{ lat: latitude, lng: longitude }}
            markers={mapMarkers}
            zoom={13}
            autoFitBounds={true}
            maxZoom={14}
            minZoom={10}
            includeUserInBounds={false}
            userLocation={
              // Use the location page's coordinates as the "user location" for marker navigation
              // This ensures that when users click markers, the organisation page will show
              // a user pin at this location's coordinates
              { lat: latitude, lng: longitude, radius }
            }
          />
        )}
      </div>
    </div>
  );
}