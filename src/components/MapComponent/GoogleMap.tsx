'use client';

import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/utils/loadGoogleMaps';

interface Marker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  organisationSlug: string; // ✅ must match field used in ServiceCard
  icon?: string;
  organisation?: string;
  serviceName?: string;
  distanceKm?: number;
  link?: string; // Custom link for homepage and other special markers
}

interface Props {
  center: { lat: number; lng: number } | null;
  markers: Marker[];
  zoom?: number;
}

export default function GoogleMap({ center, markers, zoom }: Props) {
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
      .catch((error) => {
        if (!isCancelled) {
          console.error('Failed to load Google Maps:', error);
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
  }, [center, effectiveZoom, isLoaded]);

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
      } = markerData;

      const gMarker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title,
        icon: icon || undefined,
      });

      // Use custom link if provided, otherwise default to organisation page
      const destination = link || `/find-help/organisation/${organisationSlug}`;
      const infoId = `info-${id}`;

      // Customize info window content based on marker type
      const htmlContent = link ? 
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
  }, [markers, isLoaded]);

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
