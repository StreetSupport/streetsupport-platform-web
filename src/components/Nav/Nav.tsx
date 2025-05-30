'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Location {
  id: number;
  name: string;
  slug: string;
}

export default function Nav() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/get-locations');
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Expected an array but received: ' + JSON.stringify(data));
        }

        const sorted = data.sort((a: Location, b: Location) => a.name.localeCompare(b.name));
        setLocations(sorted);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    }

    fetchLocations();
  }, []);

  return (
    <nav>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/find-help">Find Help</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>

        <li>
          <label htmlFor="location-select" style={{ marginRight: '0.5rem' }}>Locations:</label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.length === 0 ? (
              <option disabled>Loading locations...</option>
            ) : (
              <>
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.slug}>
                    {loc.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {selectedLocation && (
            <Link href={`/location/${selectedLocation}`}>
              <button style={{ marginLeft: '0.5rem' }}>Go</button>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
