'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <nav className="nav-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/img/StreetSupport_logo_land.png"
              alt="Street Support Network"
              width={240}
              height={60}
              className="h-10 w-auto"
            />
          </Link>

          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-a"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 text-brand-k" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/find-help" className="nav-link" onClick={handleFindHelpClick}>Find Help</Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="nav-link focus:outline-none">
                Locations
              </button>

              {isLocationsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white border border-brand-f rounded-md shadow-lg z-50 p-4">
                  <ul className="columns-1 sm:columns-2 md:columns-3 gap-4">
                    {locations
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(location => (
                        <li key={location.id} className="break-inside-avoid mb-1">
                          <Link
                            href={`/${location.slug}`}
                            className="block px-2 py-1 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded"
                            onClick={handleLocationClick}
                          >
                            {location.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            <Link href="/resources" className="nav-link">Resources</Link>
            <Link href="/news" className="nav-link">News</Link>

            <div
              className="relative"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <Link href="/about" className="nav-link" onClick={handleAboutClick}>
                About
              </Link>

              {isAboutOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-brand-f rounded-md shadow-lg z-50">
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/about/our-team"
                        className="block px-4 py-2 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                        onClick={handleAboutClick}
                      >
                        Our Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/our-trustees"
                        className="block px-4 py-2 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                        onClick={handleAboutClick}
                      >
                        Our Trustees
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/privacy-and-data"
                        className="block px-4 py-2 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                        onClick={handleAboutClick}
                      >
                        Privacy and Data
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/jobs"
                        className="block px-4 py-2 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                        onClick={handleAboutClick}
                      >
                        Jobs
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/impact"
                        className="block px-4 py-2 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                        onClick={handleAboutClick}
                      >
                        Impact
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="block px-4 py-2 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
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
        <div className="mobile-menu px-4 pb-4 space-y-2">
          <Link href="/find-help" className="mobile-nav-link" onClick={handleFindHelpClick}>Find Help</Link>

          <button
            onClick={() => setMobileLocationsOpen(prev => !prev)}
            className="w-full text-left mobile-nav-link text-small font-semibold mt-2"
          >
            Locations
          </button>

          {mobileLocationsOpen && (
            <ul className="mt-2 space-y-1 ml-4">
              {locations
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(location => (
                  <li key={location.id}>
                    <Link
                      href={`/${location.slug}`}
                      className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                      onClick={handleLocationClick}
                    >
                      {location.name}
                    </Link>
                  </li>
                ))}
            </ul>
          )}

          <Link href="/resources" className="mobile-nav-link">Resources</Link>
          <Link href="/news" className="mobile-nav-link">News</Link>

          <button
            onClick={() => setMobileAboutOpen(prev => !prev)}
            className="w-full text-left mobile-nav-link text-small font-semibold mt-2"
          >
            About
          </button>

          {mobileAboutOpen && (
            <ul className="mt-1 space-y-1 ml-4">
              <li>
                <Link
                  href="/about/our-team"
                  className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                  onClick={handleAboutClick}
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/about/our-trustees"
                  className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                  onClick={handleAboutClick}
                >
                  Our Trustees
                </Link>
              </li>
              <li>
                <Link
                  href="/about/privacy-and-data"
                  className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                  onClick={handleAboutClick}
                >
                  Privacy and Data
                </Link>
              </li>
              <li>
                <Link
                  href="/about/jobs"
                  className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                  onClick={handleAboutClick}
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/about/impact"
                  className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                  onClick={handleAboutClick}
                >
                  Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
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
