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
        organisationSlug: `homepage-${loc.key}`
      }));
  }, []);

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
        <div className="h-[500px] w-full">
          <GoogleMap
            center={{ lat: 53.4098, lng: -2.1576 }}
            markers={markers}
            zoom={6}
          />
        </div>
      </div>
    </div>
  );
}