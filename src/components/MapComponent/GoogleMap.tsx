'use client';

import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/utils/loadGoogleMaps';

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
}

export default function GoogleMap({ center, markers, zoom, onMarkerClick, onMapReady, userLocation }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const effectiveZoom = zoom ?? 12;

  // Load Google Maps API
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
    if (!map || !markers || markers.length === 0 || !isLoaded) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

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
  }, [markers, isLoaded, onMarkerClick]);

  if (loadError) {
    return (
      <div className="w-full h-[500px] rounded border bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Map Error</p>
          <p className="text-gray-600 text-sm">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] rounded border bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-[500px] rounded border" />;
}
