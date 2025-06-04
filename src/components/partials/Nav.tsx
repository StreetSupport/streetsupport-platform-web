'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import rawLocations from '@/data/locations.json';

interface Location {
  id: number;
  name: string;
  slug: string;
}

const locations = rawLocations as unknown as Location[];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleMouseEnter() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsLocationsOpen(true);
  }

  function handleMouseLeave() {
    closeTimeoutRef.current = setTimeout(() => {
      setIsLocationsOpen(false);
    }, 100);
  }

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-neutral-900">
            Street Support
          </Link>

          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/find-help" className="text-neutral-800 hover:text-blue-600">Find Help</Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-neutral-800 hover:text-blue-600 focus:outline-none">
                Locations
              </button>

              {isLocationsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 z-50 mt-2 w-[600px] bg-white border border-neutral-200 rounded shadow-md p-4">
                  <ul className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-1">
                    {locations
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(location => (
                        <li key={location.id}>
                          <Link
                            href={`/${location.slug}`}
                            className="block text-sm text-neutral-800 hover:underline"
                          >
                            {location.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            <Link href="/about" className="text-neutral-800 hover:text-blue-600">About</Link>
            <Link href="/contact" className="text-neutral-800 hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/find-help" className="block text-neutral-800 hover:text-blue-600">Find Help</Link>

          <button
            onClick={() => setMobileLocationsOpen(prev => !prev)}
            className="w-full text-left text-neutral-800 hover:text-blue-600 text-sm font-semibold mt-2"
          >
            Locations
          </button>

          {mobileLocationsOpen && (
            <ul className="mt-1 space-y-1">
              {locations
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(location => (
                  <li key={location.id}>
                    <Link
                      href={`/${location.slug}`}
                      className="block text-neutral-800 hover:text-blue-600 text-sm"
                    >
                      {location.name}
                    </Link>
                  </li>
                ))}
            </ul>
          )}

          <Link href="/about" className="block text-neutral-800 hover:text-blue-600">About</Link>
          <Link href="/contact" className="block text-neutral-800 hover:text-blue-600">Contact</Link>
        </div>
      )}
    </nav>
  );
}
