import Link from 'next/link';

interface Location {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
}

interface MobileNavMenuProps {
  menuOpen: boolean;
  mobileLocationsOpen: boolean;
  setMobileLocationsOpen: (fn: (prev: boolean) => boolean) => void;
  mobileAboutOpen: boolean;
  setMobileAboutOpen: (fn: (prev: boolean) => boolean) => void;
  sortedLocations: Location[];
  onFindHelpClick: () => void;
  onLocationClick: () => void;
  onAboutClick: () => void;
  onMenuClose: () => void;
}

export default function MobileNavMenu({
  menuOpen,
  mobileLocationsOpen,
  setMobileLocationsOpen,
  mobileAboutOpen,
  setMobileAboutOpen,
  sortedLocations,
  onFindHelpClick,
  onLocationClick,
  onAboutClick,
  onMenuClose,
}: MobileNavMenuProps) {
  return (
    <div className={`mobile-menu-container ${menuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}`}>
      <div className="mobile-menu px-4 pb-4 space-y-2">
        <Link href="/find-help" className="mobile-nav-link" onClick={onFindHelpClick}>Find Help</Link>

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
                    onClick={onLocationClick}
                    role="menuitem"
                  >
                    {location.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <Link href="/resources" className="mobile-nav-link" onClick={onMenuClose}>Resources</Link>
        <Link href="/news" className="mobile-nav-link" onClick={onMenuClose}>News</Link>

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
                onClick={onAboutClick}
              >
                About Street Support
              </Link>
            </li>
            <li>
              <Link href="/about/our-team" className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200" onClick={onAboutClick}>
                Our Team
              </Link>
            </li>
            <li>
              <Link href="/about/our-trustees" className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200" onClick={onAboutClick}>
                Our Trustees
              </Link>
            </li>
            <li>
              <Link href="/about/privacy-and-data" className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200" onClick={onAboutClick}>
                Privacy and Data
              </Link>
            </li>
            <li>
              <Link href="/about/accessibility" className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200" onClick={onAboutClick}>
                Accessibility
              </Link>
            </li>
            <li>
              <Link href="/about/jobs" className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200" onClick={onAboutClick}>
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/about/impact" className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200" onClick={onAboutClick}>
                Impact
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block py-2 px-3 text-sm text-brand-l hover:bg-brand-i hover:text-brand-k transition-colors duration-200" onClick={onAboutClick}>
                Contact
              </Link>
            </li>
          </ul>
        )}

        <Link href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000/api/auth/signin'} className="block bg-brand-h !text-white hover:!text-white px-4 py-2 rounded hover:bg-brand-n transition-colors duration-200 text-center mt-2" onClick={onMenuClose}>Login</Link>
      </div>
    </div>
  );
}
