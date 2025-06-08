// FindHelpResults.tsx
'use client';

import { useMemo, useState, useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import ServiceCard from './ServiceCard';
import FilterPanel from './FilterPanel';
import GoogleMap from '@/components/MapComponent/GoogleMap';
import type { ServiceProvider, FlattenedService } from '@/types';

interface Props {
  providers: ServiceProvider[];
}

interface FlattenedServiceWithExtras extends FlattenedService {
  organisation: string;
  organisationSlug: string;
  lat: number;
  lng: number;
  distance?: number;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  organisation?: string;
  link?: string;
  serviceName?: string;
  distanceKm?: number;
  icon?: string;
}

export default function FindHelpResults({ providers }: Props) {
  const { location } = useLocation();
  const [showMap, setShowMap] = useState(false);
  const [radius, setRadius] = useState(10);
  const [sortOrder, setSortOrder] = useState<'distance' | 'alpha'>('distance');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const getDistanceFromLatLonInKm = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  const flattenedServices: FlattenedServiceWithExtras[] = useMemo(() => {
    if (!providers || providers.length === 0) return [];

    return providers.flatMap((org) => {
      if (!org.services || !Array.isArray(org.services)) return [];

      return org.services.flatMap((service) => {
        if (
          typeof service.latitude !== 'number' ||
          typeof service.longitude !== 'number'
        ) {
          return [];
        }

        return [{
          id: service.id,
          name: service.name,
          description: service.description,
          category: service.category,
          subCategory: service.subCategory,
          lat: service.latitude,
          lng: service.longitude,
          latitude: service.latitude,
          longitude: service.longitude,
          organisation: org.name,
          organisationSlug: org.slug,
          clientGroups: service.clientGroups || [],
          openTimes: service.openTimes || [],
        }];
      });
    });
  }, [providers]);

  const filteredServicesWithDistance = useMemo(() => {
    if (!location || location.lat == null || location.lng == null) return [];

    return flattenedServices
      .map((service) => ({
        ...service,
        distance: getDistanceFromLatLonInKm(location.lat!, location.lng!, service.lat, service.lng),
      }))
      .filter((service) => {
        const distanceMatch = service.distance! <= radius;
        const categoryMatch = selectedCategory ? service.category === selectedCategory : true;
        const subCategoryMatch = selectedSubCategory ? service.subCategory === selectedSubCategory : true;
        return distanceMatch && categoryMatch && subCategoryMatch;
      });
  }, [flattenedServices, location, radius, selectedCategory, selectedSubCategory, getDistanceFromLatLonInKm]);

  const sortedServices = useMemo(() => {
    if (sortOrder === 'alpha') {
      return [...filteredServicesWithDistance].sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...filteredServicesWithDistance].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [filteredServicesWithDistance, sortOrder]);

  const combinedMarkers: MapMarker[] = useMemo(() => {
    const markers: MapMarker[] = filteredServicesWithDistance.map((s) => ({
      id: s.id,
      lat: s.lat,
      lng: s.lng,
      title: s.name,
      organisation: s.organisation,
      link: `/organisation/${s.organisationSlug}`,
      serviceName: s.name,
      distanceKm: s.distance,
    }));

    if (location && location.lat != null && location.lng != null) {
      markers.unshift({
        id: 'user-location',
        lat: location.lat,
        lng: location.lng,
        title: 'You are here',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      });
    }

    return markers;
  }, [filteredServicesWithDistance, location]);

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
              <label htmlFor="radius" className="text-sm font-medium">Distance radius:</label>
              <select
                id="radius"
                className="border px-2 py-1 rounded"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              >
                {[1, 3, 5, 10, 25].map((r) => (
                  <option key={r} value={r}>{r} km</option>
                ))}
              </select>
            </div>
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
            <GoogleMap center={(location && location.lat != null && location.lng != null) ? { lat: location.lat, lng: location.lng } : null} markers={combinedMarkers} />
          </div>
        )}

        <div className="flex-1 overflow-y-visible lg:overflow-y-auto pr-2">
          {sortedServices.length === 0 ? (
            <p>No services found within {radius} km of your location.</p>
          ) : (
            <div className={`gap-4 ${showMap ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {sortedServices.map((service) => (
                <div
                  key={service.id}
                  className="border border-gray-300 rounded-md p-4 bg-white flex flex-col"
                >
                  <ServiceCard service={service} />
                  {service.distance !== undefined && (
                    <p className="text-sm text-gray-500 mt-auto pt-4">
                      Approx. {service.distance.toFixed(1)} km away
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showMap && (
        <div className="hidden lg:block w-full lg:w-1/2 mt-8 lg:mt-0 lg:sticky lg:top-[6.5rem] min-h-[400px]" data-testid="map-container">
          <GoogleMap
            center={
              location && location.lat != null && location.lng != null
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
