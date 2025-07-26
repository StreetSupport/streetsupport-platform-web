'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import rawLocations from '@/data/locations.json';
import { clearSearchState } from '@/utils/findHelpStateUtils';

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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  function handleAboutMouseEnter() {
    if (aboutCloseTimeoutRef.current) {
      clearTimeout(aboutCloseTimeoutRef.current);
    }
    setIsAboutOpen(true);
  }

  function handleAboutMouseLeave() {
    aboutCloseTimeoutRef.current = setTimeout(() => {
      setIsAboutOpen(false);
    }, 100);
  }

  // ✅ Handler to close all menus on link click
  function handleLocationClick() {
    setIsLocationsOpen(false);
    setMobileLocationsOpen(false);
    setMenuOpen(false);
  }

  function handleAboutClick() {
    setIsAboutOpen(false);
    setMobileAboutOpen(false);
    setMenuOpen(false);
  }

  function handleFindHelpClick() {
    // Clear any saved search state to ensure fresh start
    clearSearchState();
    setMenuOpen(false);
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
            <Link href="/find-help" className="text-neutral-800 hover:text-blue-600" onClick={handleFindHelpClick}>Find Help</Link>

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
                            onClick={handleLocationClick} // ✅ Close on click
                          >
                            {location.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            <Link href="/resources" className="text-neutral-800 hover:text-blue-600">Resources</Link>
            <Link href="/news" className="text-neutral-800 hover:text-blue-600">News</Link>

            <div
              className="relative"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <button className="text-neutral-800 hover:text-blue-600 focus:outline-none">
                About
              </button>

              {isAboutOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 z-50 mt-2 w-48 bg-white border border-neutral-200 rounded shadow-md">
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/about/our-team"
                        className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                        onClick={handleAboutClick}
                      >
                        Our Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/our-trustees"
                        className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                        onClick={handleAboutClick}
                      >
                        Our Trustees
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/privacy-and-data"
                        className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                        onClick={handleAboutClick}
                      >
                        Privacy and Data
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/jobs"
                        className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                        onClick={handleAboutClick}
                      >
                        Jobs
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/impact"
                        className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                        onClick={handleAboutClick}
                      >
                        Impact
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                        onClick={handleAboutClick}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/find-help" className="block text-neutral-800 hover:text-blue-600" onClick={handleFindHelpClick}>Find Help</Link>

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
                      onClick={handleLocationClick} // ✅ Close on click
                    >
                      {location.name}
                    </Link>
                  </li>
                ))}
            </ul>
          )}

          <Link href="/resources" className="block text-neutral-800 hover:text-blue-600">Resources</Link>
          <Link href="/news" className="block text-neutral-800 hover:text-blue-600">News</Link>

          <button
            onClick={() => setMobileAboutOpen(prev => !prev)}
            className="w-full text-left text-neutral-800 hover:text-blue-600 text-sm font-semibold mt-2"
          >
            About
          </button>

          {mobileAboutOpen && (
            <ul className="mt-1 space-y-1 ml-4">
              <li>
                <Link
                  href="/about/our-team"
                  className="block text-neutral-800 hover:text-blue-600 text-sm"
                  onClick={handleAboutClick}
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/about/our-trustees"
                  className="block text-neutral-800 hover:text-blue-600 text-sm"
                  onClick={handleAboutClick}
                >
                  Our Trustees
                </Link>
              </li>
              <li>
                <Link
                  href="/about/privacy-and-data"
                  className="block text-neutral-800 hover:text-blue-600 text-sm"
                  onClick={handleAboutClick}
                >
                  Privacy and Data
                </Link>
              </li>
              <li>
                <Link
                  href="/about/jobs"
                  className="block text-neutral-800 hover:text-blue-600 text-sm"
                  onClick={handleAboutClick}
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/about/impact"
                  className="block text-neutral-800 hover:text-blue-600 text-sm"
                  onClick={handleAboutClick}
                >
                  Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-neutral-800 hover:text-blue-600 text-sm"
                  onClick={handleAboutClick}
                >
                  Contact
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}
