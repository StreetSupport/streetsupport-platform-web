'use client';

import { useEffect, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import rawProviders from '@/data/service-providers.json';
import ServiceCard from './ServiceCard';
import FilterPanel from './FilterPanel';
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('./MapView'), { ssr: false });


interface RawService {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  openTimes: { day: string; start: string; end: string }[];
  clientGroups: string[];
}

interface Organisation {
  id: string;
  name: string;
  postcode: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  services: RawService[];
}

interface FlattenedService extends RawService {
  organisation: string;
  orgPostcode: string;
  latitude: number;
  longitude: number;
}

const allProviders = rawProviders as Organisation[];

export default function FindHelpResults() {
  const { location } = useLocation();
  const [filtered, setFiltered] = useState<FlattenedService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [log, setLog] = useState<string>('🪵 Initialising...');

  function handleFilterChange(filters: { category: string; subCategory: string }) {
    setSelectedCategory(filters.category);
    setSelectedSubCategory(filters.subCategory);
  }

  useEffect(() => {
    const logs: string[] = [];
    logs.push('📍 useEffect ran');
    logs.push(`🧭 LOCATION: ${JSON.stringify(location, null, 2)}`);
    logs.push(`🔽 CATEGORY: ${selectedCategory}, SUBCATEGORY: ${selectedSubCategory}`);

    if (!location) {
      logs.push('⛔ No location found');
      setLog(logs.join('\n'));
      return;
    }

    const flattened: FlattenedService[] = allProviders.flatMap((org) =>
      org.services.map((service) => ({
        ...service,
        organisation: org.name,
        orgPostcode: org.postcode,
        latitude: org.latitude,
        longitude: org.longitude,
      }))
    );

    logs.push(`📦 Flattened services count: ${flattened.length}`);

    let matched: FlattenedService[] = [];

    if (location.postcode) {
      const match = location.postcode.trim().toLowerCase();
      logs.push(`🔍 Matching postcode: "${match}"`);

      matched = flattened.filter((s) => {
        const orgPC = s.orgPostcode?.trim().toLowerCase();
        const postcodeMatch = orgPC === match;
        const categoryMatch = !selectedCategory || s.category === selectedCategory;
        const subCategoryMatch = !selectedSubCategory || s.subCategory === selectedSubCategory;

        const keep = postcodeMatch && categoryMatch && subCategoryMatch;
        return keep;
      });

      logs.push(`✅ Matched count: ${matched.length}`);
    } else if (location.lat && location.lng) {
      logs.push('📌 No postcode, using lat/lng match (fallback)');
      matched = flattened.filter((s) => {
        const categoryMatch = !selectedCategory || s.category === selectedCategory;
        const subCategoryMatch = !selectedSubCategory || s.subCategory === selectedSubCategory;
        return categoryMatch && subCategoryMatch;
      });

      logs.push(`✅ Matched count (lat/lng): ${matched.length}`);
    } else {
      logs.push('⚠️ No valid location data for filtering');
    }

    setFiltered(matched);
    setLog(logs.join('\n'));
  }, [location, selectedCategory, selectedSubCategory]);

  return (
    <section className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Services near you</h1>

      <FilterPanel onFilterChange={handleFilterChange} />

      <button
        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowMap(!showMap)}
      >
        {showMap ? 'Hide map' : 'Show map'}
      </button>

      {showMap && <p className="text-green-600">🗺️ Map is toggled ON</p>}
      {showMap && <MapView services={filtered} />}

      <details className="mb-4">
        <summary className="cursor-pointer text-sm text-gray-600">Debug Log</summary>
        <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">{log}</pre>
      </details>

      {filtered.length === 0 ? (
        <p>No services found near your location.</p>
      ) : (
        filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))
      )}
    </section>
  );
}
