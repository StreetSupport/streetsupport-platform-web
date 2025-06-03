'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '@/contexts/LocationContext';

interface MapViewProps {
  services: {
    organisation: string;
    latitude: number;
    longitude: number;
    category: string;
    subCategory: string;
  }[];
}

export default function MapView({ services }: MapViewProps) {
  const { location } = useLocation();

  useEffect(() => {
    if (L?.Icon?.Default) {
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  const defaultPosition: [number, number] =
    location?.lat && location?.lng
      ? [location.lat, location.lng]
      : [53.2307, -0.5406];

  return (
    <div className="h-96 w-full rounded overflow-hidden border border-gray-300 mb-6">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {services.map((s, index) => (
          <Marker
            key={`${s.organisation}-${index}`}
            position={[s.latitude, s.longitude]}
          >
            <Popup>
              <strong>{s.organisation}</strong>
              <br />
              {s.category} → {s.subCategory}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
