'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Location {
  id: number;
  name: string;
  slug: string;
}

export default function Nav() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/get-locations');
        const data = await response.json();
        setLocations(
          data.sort((a: Location, b: Location) => a.name.localeCompare(b.name))
    );

      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    }

    fetchLocations();
  }, []);

  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/find-help">Find Help</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>

        <li>
          <strong>Locations</strong>
          <ul>
            {locations.map((location) => (
              <li key={location.id}>
                <Link href={`/location/${location.slug}`}>{location.name}</Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
