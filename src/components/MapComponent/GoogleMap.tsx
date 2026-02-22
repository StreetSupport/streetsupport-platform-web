'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { GOOGLE_MAPS_SCRIPT_URL, waitForGoogleMaps, isGoogleMapsReady } from '@/utils/loadGoogleMaps';
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
  const markerInstancesRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const markerDataRef = useRef<Map<string, Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const previousMarkersRef = useRef<Marker[]>([]);

  // Refs for latest prop values (accessible from click handlers without re-registration)
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;
  const userLocationRef = useRef(userLocation);
  userLocationRef.current = userLocation;
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsReady);
  const [loadError, setLoadError] = useState<string | null>(null);
  const effectiveZoom = zoom ?? 12;

  const handleScriptLoad = useCallback(() => {
    waitForGoogleMaps().then(() => setIsLoaded(true));
  }, []);

  const handleScriptError = useCallback(() => {
    setLoadError('Failed to load map. Please check your internet connection.');
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

    // Update data ref so click handlers always access latest marker data
    const newDataMap = new Map<string, Marker>();
    for (const m of markers) {
      newDataMap.set(m.id, m);
    }
    markerDataRef.current = newDataMap;

    const currentMarkerIds = new Set(markers.map(m => m.id));

    // Remove markers no longer in the list
    for (const [id, gMarker] of markerInstancesRef.current) {
      if (!currentMarkerIds.has(id)) {
        google.maps.event.clearInstanceListeners(gMarker);
        gMarker.setMap(null);
        markerInstancesRef.current.delete(id);
      }
    }

    // Add new markers or update existing ones
    for (const markerData of markers) {
      const existing = markerInstancesRef.current.get(markerData.id);

      let zIndex = 100;
      let animation: google.maps.Animation | null = null;

      if (markerData.id === 'user-location' || markerData.type === 'user') {
        zIndex = 1000;
      }

      if (markerData.isSelected && markerData.type === 'service') {
        animation = google.maps.Animation.BOUNCE;
        zIndex = 500;
      }

      if (existing) {
        // Update position if changed
        const pos = existing.getPosition();
        if (pos?.lat() !== markerData.lat || pos?.lng() !== markerData.lng) {
          existing.setPosition({ lat: markerData.lat, lng: markerData.lng });
        }

        // Update animation if selection state changed
        if (existing.getAnimation() !== animation) {
          existing.setAnimation(animation);
        }
      } else {
        // Create new marker
        const gMarker = new google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map,
          title: markerData.title,
          icon: markerData.icon || undefined,
          zIndex,
          animation,
        });

        // Click handler uses refs so it always accesses latest data and props
        const markerId = markerData.id;
        gMarker.addListener('click', () => {
          const data = markerDataRef.current.get(markerId);
          if (!data) return;
          const currentOnMarkerClick = onMarkerClickRef.current;
          const currentUserLocation = userLocationRef.current;

          if (data.link) {
            window.location.href = data.link;
            return;
          }

          if (data.onMarkerClick) {
            data.onMarkerClick(data.id);
            return;
          }
          if (currentOnMarkerClick) {
            currentOnMarkerClick(data.id);
            return;
          }

          // Build destination URL
          let destination = `/find-help/organisation/${data.organisationSlug}`;
          if (currentUserLocation?.lat && currentUserLocation?.lng) {
            const params = new URLSearchParams();
            params.set('lat', currentUserLocation.lat.toString());
            params.set('lng', currentUserLocation.lng.toString());
            if (currentUserLocation.radius) {
              params.set('radius', currentUserLocation.radius.toString());
            }
            destination = `/find-help/organisation/${data.organisationSlug}?${params.toString()}`;
          }

          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }

          // Create InfoWindow lazily on click
          const infoId = `info-${data.id}`;
          const htmlContent = `<div
            id="${infoId}"
            style="font-size:14px;max-width:220px;cursor:pointer;padding:4px;"
          >
            <strong style="color:#0b9b75;">${escapeHtml(data.organisation ?? 'Unknown Organisation')}</strong><br/>
            ${escapeHtml(data.serviceName ?? 'Unnamed service')}<br/>
            ${data.distanceKm?.toFixed(1) ?? '?'} km away
          </div>`;

          const infoWindow = new google.maps.InfoWindow({ content: htmlContent });
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

        markerInstancesRef.current.set(markerData.id, gMarker);
      }
    }

    // Auto-fit bounds if enabled
    if (autoFitBounds && typeof google !== 'undefined' && google.maps && google.maps.geometry) {
      const shouldRecalculate = shouldRecalculateBounds(previousMarkersRef.current, markers);

      if (shouldRecalculate) {
        const boundsUserLocation = userLocation?.lat !== undefined && userLocation?.lng !== undefined
          ? { lat: userLocation.lat, lng: userLocation.lng }
          : null;

        updateMapBounds(map, markers, boundsUserLocation, {
          includeUserLocation: includeUserInBounds,
          maxZoom,
          minZoom,
          paddingPercent: fitPadding
        });

        previousMarkersRef.current = [...markers];
      }
    }
  }, [markers, isLoaded, userLocation?.lat, userLocation?.lng, userLocation?.radius, autoFitBounds, maxZoom, minZoom, fitPadding, includeUserInBounds]);

  // Clean up all markers on unmount
  useEffect(() => {
    const instances = markerInstancesRef.current;
    const data = markerDataRef.current;
    return () => {
      if (typeof google !== 'undefined' && google.maps?.event) {
        instances.forEach((gMarker) => {
          google.maps.event.clearInstanceListeners(gMarker);
          gMarker.setMap(null);
        });
      }
      instances.clear();
      data.clear();
    };
  }, []);

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
      <>
        <Script
          src={GOOGLE_MAPS_SCRIPT_URL}
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
          onError={handleScriptError}
        />
        <div className="w-full h-full min-h-96 rounded border bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </>
    );
  }

  return <div ref={mapRef} className="w-full h-full min-h-96 rounded border" />;
});
