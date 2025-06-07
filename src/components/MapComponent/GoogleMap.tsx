'use client';

import { useEffect, useRef } from 'react';

interface Marker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  icon?: string;
  organisation?: string;
  serviceName?: string;
  distanceKm?: number;
  link?: string;
}

interface Props {
  center: { lat: number; lng: number } | null;
  markers: Marker[];
}

export default function GoogleMap({ center, markers }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Initialise map once
  useEffect(() => {
    if (!mapRef.current || !center || mapInstanceRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;
  }, [center]);

  // Recreate markers when markers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markers || markers.length === 0) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const newMarkers: google.maps.Marker[] = [];

    markers.forEach((markerData) => {
      const { lat, lng, title, icon, organisation, serviceName, distanceKm, link } = markerData;

      const gMarker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title,
        icon: icon || undefined,
      });

      if (title !== 'You are here') {
        const htmlContent = `
          <div style="font-size:14px;max-width:220px;">
            <strong>${link
              ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${organisation}</a>`
              : organisation ?? 'Unknown Organisation'}</strong><br/>
            ${serviceName ?? 'Unnamed service'}<br/>
            ${distanceKm?.toFixed(1) ?? '?'} km away
          </div>
        `;

        const infoWindow = new google.maps.InfoWindow({ content: htmlContent });

        gMarker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          infoWindowRef.current = infoWindow;
          infoWindow.open(map, gMarker);
        });
      }

      newMarkers.push(gMarker);
    });

    markersRef.current = newMarkers;
  }, [markers]);

  return <div ref={mapRef} className="w-full h-[500px] rounded border" />;
}
