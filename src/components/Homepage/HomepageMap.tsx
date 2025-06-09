'use client';

import { useMemo } from 'react';
import locations from '@/data/locations.json';
import GoogleMap from '@/components/MapComponent/GoogleMap';

interface LocationEntry {
  key: string;
  name: string;
  latitude: number;
  longitude: number;
  isPublic: boolean;
}

export default function HomepageMap() {

  const markers = useMemo(() => {
    return (locations as LocationEntry[])
      .filter((loc) => loc.isPublic)
      .map((loc) => ({
        id: loc.key,
        lat: loc.latitude,
        lng: loc.longitude,
        title: loc.name,
        icon: '/assets/img/map-pin.png',
        link: `/${loc.key}`,
      }));
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Find Street Support in your area</h2>
      <div className="w-full max-w-md mx-auto rounded overflow-hidden border">
        <GoogleMap
          center={{ lat: 53.4098, lng: -2.1576 }}
          markers={markers}
          zoom={6}
        />
      </div>
    </section>
  );
}