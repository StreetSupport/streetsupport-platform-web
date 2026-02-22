'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useNavState } from '@/hooks/useNavState';
import DesktopLocationsDropdown from '@/components/partials/DesktopLocationsDropdown';
import MobileNavMenu from '@/components/partials/MobileNavMenu';

export default function Nav() {
  const nav = useNavState();

  return (
    <nav className="nav-container" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center" onClick={nav.handleMenuClose}>
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
            onClick={() => nav.setMenuOpen(!nav.menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="hamburger-icon">
              <span className={`hamburger-line ${nav.menuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${nav.menuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${nav.menuOpen ? 'open' : ''}`}></span>
            </div>
          </button>

          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/find-help" className="nav-link" onClick={nav.handleFindHelpClick}>Find Help</Link>

            <div
              className="relative"
              onMouseEnter={nav.handleMouseEnter}
              onMouseLeave={nav.handleMouseLeave}
            >
              <button
                ref={nav.locationsButtonRef}
                id="locations-button"
                className="nav-link focus:outline-none focus:ring-2 focus:ring-brand-a rounded flex items-center gap-1"
                onKeyDown={nav.handleLocationsKeyDown}
                aria-haspopup="menu"
                aria-expanded={nav.isLocationsOpen}
                aria-controls="locations-dropdown"
              >
                Locations
                <svg className={`w-4 h-4 transition-transform duration-200 ${nav.isLocationsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {nav.isLocationsOpen && (
                <DesktopLocationsDropdown
                  groupedLocations={nav.groupedLocations}
                  sortedLocations={nav.sortedLocations}
                  focusedLocationIndex={nav.focusedLocationIndex}
                  locationsDropdownRef={nav.locationsDropdownRef}
                  locationLinksRef={nav.locationLinksRef}
                  onKeyDown={nav.handleLocationsKeyDown}
                  onMouseEnter={nav.handleMouseEnter}
                  onMouseLeave={nav.handleMouseLeave}
                  onLocationClick={nav.handleLocationClick}
                />
              )}
            </div>

            <Link href="/resources" className="nav-link">Resources</Link>
            <Link href="/news" className="nav-link">News</Link>

            <div
              className="relative"
              onMouseEnter={nav.handleAboutMouseEnter}
              onMouseLeave={nav.handleAboutMouseLeave}
            >
              <button
                id="about-button"
                className="nav-link focus:outline-none focus:ring-2 focus:ring-brand-a rounded flex items-center gap-1"
                onMouseEnter={nav.handleAboutMouseEnter}
                onMouseLeave={nav.handleAboutMouseLeave}
                onClick={nav.handleAboutButtonClick}
                aria-haspopup="menu"
                aria-expanded={nav.isAboutOpen}
                aria-controls="about-dropdown"
              >
                About
                <svg className={`w-4 h-4 transition-transform duration-200 ${nav.isAboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {nav.isAboutOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 z-50"
                  onMouseEnter={nav.handleAboutMouseEnter}
                  onMouseLeave={nav.handleAboutMouseLeave}
                >
                  <div id="about-dropdown" className="bg-white border border-brand-f rounded-md shadow-lg" role="menu" aria-labelledby="about-button">
                    <ul className="py-2">
                      <li>
                        <Link href="/about/our-team" className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded" onClick={nav.handleAboutClick} role="menuitem">
                          Our Team
                        </Link>
                      </li>
                      <li>
                        <Link href="/about/our-trustees" className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded" onClick={nav.handleAboutClick} role="menuitem">
                          Our Trustees
                        </Link>
                      </li>
                      <li>
                        <Link href="/about/privacy-and-data" className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded" onClick={nav.handleAboutClick} role="menuitem">
                          Privacy and Data
                        </Link>
                      </li>
                      <li>
                        <Link href="/about/accessibility" className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded" onClick={nav.handleAboutClick} role="menuitem">
                          Accessibility
                        </Link>
                      </li>
                      <li>
                        <Link href="/about/jobs" className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded" onClick={nav.handleAboutClick} role="menuitem">
                          Jobs
                        </Link>
                      </li>
                      <li>
                        <Link href="/about/impact" className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded" onClick={nav.handleAboutClick} role="menuitem">
                          Impact
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded" onClick={nav.handleAboutClick} role="menuitem">
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

      <MobileNavMenu
        menuOpen={nav.menuOpen}
        mobileLocationsOpen={nav.mobileLocationsOpen}
        setMobileLocationsOpen={nav.setMobileLocationsOpen}
        mobileAboutOpen={nav.mobileAboutOpen}
        setMobileAboutOpen={nav.setMobileAboutOpen}
        sortedLocations={nav.sortedLocations}
        onFindHelpClick={nav.handleFindHelpClick}
        onLocationClick={nav.handleLocationClick}
        onAboutClick={nav.handleAboutClick}
        onMenuClose={nav.handleMenuClose}
      />
    </nav>
  );
}
