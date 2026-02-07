'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import rawLocations from '@/data/locations.json';
import { clearSearchState } from '@/utils/findHelpStateUtils';

interface Location {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
}

const locations = rawLocations.filter(loc => loc.isPublic) as Location[];

export default function Nav() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [focusedLocationIndex, setFocusedLocationIndex] = useState(-1);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locationsButtonRef = useRef<HTMLButtonElement>(null);
  const locationsDropdownRef = useRef<HTMLDivElement>(null);
  const locationLinksRef = useRef<Map<number, HTMLAnchorElement>>(new Map());

  // Group locations alphabetically
  const groupedLocations = {
    'A-F': locations.filter(loc => loc.name[0] >= 'A' && loc.name[0] <= 'F').sort((a, b) => a.name.localeCompare(b.name)),
    'G-M': locations.filter(loc => loc.name[0] >= 'G' && loc.name[0] <= 'M').sort((a, b) => a.name.localeCompare(b.name)),
    'N-S': locations.filter(loc => loc.name[0] >= 'N' && loc.name[0] <= 'S').sort((a, b) => a.name.localeCompare(b.name)),
    'T-Z': locations.filter(loc => loc.name[0] >= 'T' && loc.name[0] <= 'Z').sort((a, b) => a.name.localeCompare(b.name))
  };

  const sortedLocations = locations.sort((a, b) => a.name.localeCompare(b.name));

  // Handle keyboard navigation
  const handleLocationsKeyDown = (e: React.KeyboardEvent) => {
    if (!isLocationsOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsLocationsOpen(true);
        setFocusedLocationIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsLocationsOpen(false);
        setFocusedLocationIndex(-1);
        locationsButtonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedLocationIndex(prev => (prev + 1) % sortedLocations.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedLocationIndex(prev => prev <= 0 ? sortedLocations.length - 1 : prev - 1);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedLocationIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedLocationIndex(sortedLocations.length - 1);
        break;
      case 'Enter':
      case ' ':
        if (focusedLocationIndex >= 0) {
          const focusedLocation = sortedLocations[focusedLocationIndex];
          if (focusedLocation) {
            setIsLocationsOpen(false);
            setFocusedLocationIndex(-1);
            router.push(`/${focusedLocation.slug}`);
          }
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationsDropdownRef.current && !locationsDropdownRef.current.contains(event.target as Node) &&
          locationsButtonRef.current && !locationsButtonRef.current.contains(event.target as Node)) {
        setIsLocationsOpen(false);
        setFocusedLocationIndex(-1);
      }
    };

    if (isLocationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationsOpen]);

  // Move focus to the currently focused location link
  useEffect(() => {
    if (focusedLocationIndex >= 0 && isLocationsOpen) {
      const link = locationLinksRef.current.get(focusedLocationIndex);
      if (link) {
        link.focus();
      }
    }
  }, [focusedLocationIndex, isLocationsOpen]);

  function handleMouseEnter() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsLocationsOpen(true);
  }

  function handleMouseLeave() {
    closeTimeoutRef.current = setTimeout(() => {
      setIsLocationsOpen(false);
    }, 300);
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
    }, 300);
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
    
    // If we're already on the find-help page, force a clean reload
    if (typeof window !== 'undefined' && window.location.pathname === '/find-help') {
      // Clear URL parameters and navigate to clean find-help page
      window.location.href = '/find-help';
    }
  }

  function handleMenuClose() {
    setMenuOpen(false);
  }

  return (
    <nav className="nav-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center" onClick={handleMenuClose}>
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
            <div className="hamburger-icon">
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            </div>
          </button>

          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/find-help" className="nav-link" onClick={handleFindHelpClick}>Find Help</Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                ref={locationsButtonRef}
                id="locations-button"
                className="nav-link focus:outline-none focus:ring-2 focus:ring-brand-a rounded flex items-center gap-1"
                onKeyDown={handleLocationsKeyDown}
                aria-haspopup="menu"
                aria-expanded={isLocationsOpen}
                aria-controls="locations-dropdown"
              >
                Locations
                <svg className={`w-4 h-4 transition-transform duration-200 ${isLocationsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLocationsOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[650px] z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    ref={locationsDropdownRef}
                    id="locations-dropdown"
                    className="bg-white border border-brand-f rounded-md shadow-lg p-4"
                    role="menu"
                    aria-labelledby="locations-button"
                    onKeyDown={handleLocationsKeyDown}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {Object.entries(groupedLocations).map(([groupName, groupLocations]) => {
                        const groupId = `locations-group-${groupName.toLowerCase().replace('-', '')}`;
                        return (
                          <div
                            key={groupName}
                            className="space-y-2"
                            role="group"
                            aria-labelledby={groupId}
                          >
                            <h3
                              id={groupId}
                              className="text-xs font-semibold text-brand-f uppercase tracking-wide border-b border-brand-q pb-1"
                            >
                              {groupName}
                            </h3>
                            <ul className="space-y-1" aria-label={`Locations ${groupName}`}>
                              {groupLocations.map((location) => {
                                const globalIndex = sortedLocations.findIndex(loc => loc.id === location.id);
                                const isFocused = globalIndex === focusedLocationIndex;
                                return (
                                  <li key={location.id}>
                                    <Link
                                      href={`/${location.slug}`}
                                      ref={(el) => {
                                        if (el) {
                                          locationLinksRef.current.set(globalIndex, el);
                                        }
                                      }}
                                      className={`block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded focus:ring-2 focus:ring-brand-a focus:outline-none ${
                                        isFocused ? 'bg-brand-i text-brand-k ring-2 ring-brand-a outline-none' : ''
                                      }`}
                                      onClick={handleLocationClick}
                                      role="menuitem"
                                      tabIndex={isFocused ? 0 : -1}
                                      aria-current={isFocused ? 'true' : undefined}
                                    >
                                      {location.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
              <button 
                className="nav-link focus:outline-none focus:ring-2 focus:ring-brand-a rounded flex items-center gap-1"
                onMouseEnter={handleAboutMouseEnter}
                onMouseLeave={handleAboutMouseLeave}
                onClick={() => { setIsAboutOpen(false); router.push('/about'); }}
              >
                About
                <svg className={`w-4 h-4 transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isAboutOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 z-50"
                  onMouseEnter={handleAboutMouseEnter}
                  onMouseLeave={handleAboutMouseLeave}
                >
                  <div className="bg-white border border-brand-f rounded-md shadow-lg">
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/about/our-team"
                        className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded"
                        onClick={handleAboutClick}
                      >
                        Our Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/our-trustees"
                        className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded"
                        onClick={handleAboutClick}
                      >
                        Our Trustees
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/privacy-and-data"
                        className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded"
                        onClick={handleAboutClick}
                      >
                        Privacy and Data
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/accessibility"
                        className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded"
                        onClick={handleAboutClick}
                      >
                        Accessibility
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/jobs"
                        className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded"
                        onClick={handleAboutClick}
                      >
                        Jobs
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/impact"
                        className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded"
                        onClick={handleAboutClick}
                      >
                        Impact
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded"
                        onClick={handleAboutClick}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                  </div>
                </div>
              )}
            </div>
            <Link href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000/api/auth/signin'} className="bg-brand-h !text-white hover:!text-white px-4 py-2 rounded hover:bg-brand-n transition-colors duration-200">Login</Link>
          </div>
        </div>
      </div>

      <div className={`mobile-menu-container ${menuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}`}>
        <div className="mobile-menu px-4 pb-4 space-y-2">
          <Link href="/find-help" className="mobile-nav-link" onClick={handleFindHelpClick}>Find Help</Link>

          <button
            onClick={() => setMobileLocationsOpen(prev => !prev)}
            className="w-full text-left mobile-nav-link font-semibold mt-2 focus:outline-none focus:ring-2 focus:ring-brand-a rounded flex items-center justify-between"
            aria-expanded={mobileLocationsOpen}
            aria-controls="mobile-locations-menu"
            aria-haspopup="menu"
          >
            Locations
            <svg className={`w-5 h-5 transition-transform duration-200 ${mobileLocationsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {mobileLocationsOpen && (
            <div id="mobile-locations-menu" role="menu" className="mobile-locations-menu mt-2 ml-4 max-h-[60vh] overflow-y-auto bg-white/80 backdrop-blur-sm rounded-lg border border-brand-q shadow-lg">
              <div className="p-3">
                <div className="text-xs font-semibold text-brand-f uppercase tracking-wide mb-3 px-2 sticky top-0 bg-white/90 backdrop-blur-sm py-2 -mx-2 border-b border-brand-q">
                  All Locations ({sortedLocations.length})
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {sortedLocations.map(location => (
                    <Link
                      key={location.id}
                      href={`/${location.slug}`}
                      className="block py-2.5 px-3 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded focus:outline-none focus:ring-2 focus:ring-brand-a min-h-[40px] flex items-center border-l-2 border-transparent hover:border-l-brand-a"
                      onClick={handleLocationClick}
                      role="menuitem"
                    >
                      {location.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Link href="/resources" className="mobile-nav-link" onClick={handleMenuClose}>Resources</Link>
          <Link href="/news" className="mobile-nav-link" onClick={handleMenuClose}>News</Link>

          <button
            onClick={() => setMobileAboutOpen(prev => !prev)}
            className="w-full text-left mobile-nav-link font-semibold mt-2 focus:outline-none focus:ring-2 focus:ring-brand-a rounded flex items-center justify-between"
            aria-expanded={mobileAboutOpen}
            aria-controls="mobile-about-menu"
            aria-haspopup="menu"
          >
            About
            <svg className={`w-5 h-5 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {mobileAboutOpen && (
            <ul id="mobile-about-menu" role="menu" className="mobile-about-menu mt-1 space-y-1 ml-4">
              <li>
                <Link
                  href="/about"
                  className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200 font-semibold border-b border-brand-q pb-3 mb-2"
                  onClick={handleAboutClick}
                >
                  About Street Support
                </Link>
              </li>
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
                  href="/about/accessibility"
                  className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200"
                  onClick={handleAboutClick}
                >
                  Accessibility
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

          <Link href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000/api/auth/signin'} className="block bg-brand-h !text-white hover:!text-white px-4 py-2 rounded hover:bg-brand-n transition-colors duration-200 text-center mt-2" onClick={handleMenuClose}>Login</Link>
        </div>
      </div>
    </nav>
  );
}
