'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadGoogleMaps } from '@/utils/loadGoogleMaps';
import { updateMapBounds, shouldRecalculateBounds } from '@/utils/mapBounds';

interface Marker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  organisationSlug: string; // ✅ must match field used in ServiceCard
  icon?: string | google.maps.Icon;
  organisation?: string;
  serviceName?: string;
  distanceKm?: number;
  link?: string; // Custom link for homepage and other special markers
  onMarkerClick?: (markerId: string) => void; // Custom click handler
  isSelected?: boolean; // Whether this marker represents a selected location
  type?: string; // Type of marker (service, user, etc.)
}

interface UserLocation {
  lat: number;
  lng: number;
  radius?: number;
}

interface Props {
  center: { lat: number; lng: number } | null;
  markers: Marker[];
  zoom?: number;
  onMarkerClick?: (markerId: string) => void; // Global click handler
  onMapReady?: (mapInstance: google.maps.Map) => void; // Callback when map is ready
  userLocation?: UserLocation | null; // User location context for navigation
  autoFitBounds?: boolean; // Enable automatic bounds fitting
  maxZoom?: number; // Maximum zoom level for bounds fitting
  minZoom?: number; // Minimum zoom level for bounds fitting
  fitPadding?: number; // Padding percentage for bounds fitting (0-1)
  includeUserInBounds?: boolean; // Whether to include user location in bounds calculation
}

export default React.memo(function GoogleMap({ 
  center, 
  markers, 
  zoom, 
  onMarkerClick, 
  onMapReady, 
  userLocation,
  autoFitBounds = false,
  maxZoom = 16,
  minZoom = 8,
  fitPadding = 0.1,
  includeUserInBounds = true
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const previousMarkersRef = useRef<Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const effectiveZoom = zoom ?? 12;

  // Load Google Maps API immediately (simplified approach for reliability)
  useEffect(() => {
    let isCancelled = false;
    
    loadGoogleMaps()
      .then(() => {
        if (!isCancelled) {
          setIsLoaded(true);
        }
      })
      .catch((_error) => {
        if (!isCancelled) {
          setLoadError('Failed to load map. Please check your internet connection.');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !center || mapInstanceRef.current || !isLoaded) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: effectiveZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;
    
    // Call the onMapReady callback if provided
    if (onMapReady) {
      onMapReady(map);
    }
  }, [center, effectiveZoom, isLoaded, onMapReady]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markers || !isLoaded) return;

    // Always clear existing markers first
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // If no new markers, we're done (map will show no markers)
    if (markers.length === 0) {
      return;
    }

    const newMarkers: google.maps.Marker[] = [];

    markers.forEach((markerData) => {
      const {
        id,
        lat,
        lng,
        title,
        icon,
        organisation,
        serviceName,
        distanceKm,
        organisationSlug,
        link,
        onMarkerClick: markerClickHandler,
      } = markerData;

      // Determine marker styling based on type and selection
      const markerIcon = icon;
      let zIndex = 100; // Default z-index for service markers
      let animation = null;
      
      if (id === 'user-location' || markerData.type === 'user') {
        zIndex = 1000; // Higher z-index to appear above other markers
      }
      
      // Add bounce animation for selected service markers
      if (markerData.isSelected && markerData.type === 'service') {
        animation = google.maps.Animation.BOUNCE;
        zIndex = 500; // Higher than normal service markers but lower than user location
      }

      const gMarker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title,
        icon: markerIcon || undefined,
        zIndex: zIndex,
        animation: animation,
      });

      // Determine if we have custom click handlers
      const hasCustomHandler = markerClickHandler || onMarkerClick;
      
      // Use custom link if provided, otherwise default to organisation page with location context
      let destination = link || `/find-help/organisation/${organisationSlug}`;
      
      // Add user location parameters to organisation URLs if available
      if (!link && userLocation?.lat && userLocation?.lng) {
        const params = new URLSearchParams();
        params.set('lat', userLocation.lat.toString());
        params.set('lng', userLocation.lng.toString());
        if (userLocation.radius) {
          params.set('radius', userLocation.radius.toString());
        }
        destination = `/find-help/organisation/${organisationSlug}?${params.toString()}`;
      }
      
      const infoId = `info-${id}`;

      // Customize info window content based on marker type and click handlers
      const htmlContent = hasCustomHandler ?
        // Custom handler - show address info
        `<div
          id="${infoId}"
          style="font-size:14px;max-width:220px;cursor:pointer;padding:4px;"
        >
          <strong style="color:#0b9b75;">${title}</strong><br/>
          ${serviceName ? `<span style="color:#666;">${serviceName}</span><br/>` : ''}
          <span style="color:#666;font-size:12px;">Click to select this location</span>
        </div>` :
        link ? 
        // Homepage/location markers - simpler content
        `<div
          id="${infoId}"
          style="font-size:14px;max-width:220px;cursor:pointer;padding:4px;"
        >
          <strong style="color:#0b9b75;">${title}</strong><br/>
          <span style="color:#666;">Click to view services in this area</span>
        </div>` :
        // Service markers - detailed content
        `<div
          id="${infoId}"
          style="font-size:14px;max-width:220px;cursor:pointer;padding:4px;"
        >
          <strong style="color:#0b9b75;">${organisation ?? 'Unknown Organisation'}</strong><br/>
          ${serviceName ?? 'Unnamed service'}<br/>
          ${distanceKm?.toFixed(1) ?? '?'} km away
        </div>`;

      const infoWindow = new google.maps.InfoWindow({ content: htmlContent });

      gMarker.addListener('click', () => {
        // For markers with links (like homepage), navigate directly without showing info window
        if (link) {
          window.location.href = destination;
          return;
        }

        // For other markers, use custom handlers or show info window
        if (markerClickHandler) {
          markerClickHandler(id);
          return;
        } else if (onMarkerClick) {
          onMarkerClick(id);
          return;
        }

        // Default behavior: show info window
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }

        infoWindowRef.current = infoWindow;
        infoWindow.open(map, gMarker);

        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          const el = document.getElementById(infoId);
          if (el) {
            el.addEventListener('click', () => {
              window.location.href = destination;
            });
          }
        });
      });

      newMarkers.push(gMarker);
    });

    markersRef.current = newMarkers;

    // Auto-fit bounds if enabled and Google Maps API is loaded
    if (autoFitBounds && typeof google !== 'undefined' && google.maps && google.maps.geometry) {
      // Check if we should recalculate bounds (markers changed significantly)
      const shouldRecalculate = shouldRecalculateBounds(previousMarkersRef.current, markers);
      
      if (shouldRecalculate) {
        // Convert user location to the format expected by mapBounds utility
        const boundsUserLocation = userLocation?.lat !== undefined && userLocation?.lng !== undefined 
          ? { lat: userLocation.lat, lng: userLocation.lng }
          : null;

        // Update map bounds with the new markers
        updateMapBounds(map, markers, boundsUserLocation, {
          includeUserLocation: includeUserInBounds,
          maxZoom,
          minZoom,
          paddingPercent: fitPadding
        });

        // Store current markers for next comparison
        previousMarkersRef.current = [...markers];
      }
    }
  }, [markers, isLoaded, onMarkerClick, userLocation?.lat, userLocation?.lng, userLocation?.radius, autoFitBounds, maxZoom, minZoom, fitPadding, includeUserInBounds]);

  if (loadError) {
    return (
      <div className="w-full h-full min-h-96 rounded border bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Map Error</p>
          <p className="text-gray-600 text-sm">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-96 rounded border bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full min-h-96 rounded border" />;
});
