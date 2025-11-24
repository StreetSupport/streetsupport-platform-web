'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import locations from '@/data/locations.json';

interface Location {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
}

const publicLocations = locations.filter(loc => loc.isPublic) as Location[];

export default function LocationDropdown() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const router = useRouter();

  const sortedLocations = publicLocations.sort((a, b) => a.name.localeCompare(b.name));

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    setSelectedLocation(selectedSlug);
    
    if (selectedSlug) {
      router.push(`/${selectedSlug}`);
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="location-select" className="block text-sm font-medium text-brand-l mb-2">
        Choose a location to explore:
      </label>
      <select
        id="location-select"
        value={selectedLocation}
        onChange={handleLocationChange}
        className="custom-select w-full px-4 py-3 border border-brand-f rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent bg-white text-brand-l"
      >
        <option value="">Select a location...</option>
        {sortedLocations.map((location) => (
          <option key={location.slug} value={location.slug}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
}