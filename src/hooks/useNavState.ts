import { useState, useRef, useEffect, useCallback } from 'react';
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

const groupedLocations = {
  'A-F': locations.filter(loc => loc.name[0] >= 'A' && loc.name[0] <= 'F').sort((a, b) => a.name.localeCompare(b.name)),
  'G-M': locations.filter(loc => loc.name[0] >= 'G' && loc.name[0] <= 'M').sort((a, b) => a.name.localeCompare(b.name)),
  'N-S': locations.filter(loc => loc.name[0] >= 'N' && loc.name[0] <= 'S').sort((a, b) => a.name.localeCompare(b.name)),
  'T-Z': locations.filter(loc => loc.name[0] >= 'T' && loc.name[0] <= 'Z').sort((a, b) => a.name.localeCompare(b.name))
};

const sortedLocations = locations.sort((a, b) => a.name.localeCompare(b.name));

export function useNavState() {
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

  const handleLocationsKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [isLocationsOpen, focusedLocationIndex, router]);

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

  useEffect(() => {
    if (focusedLocationIndex >= 0 && isLocationsOpen) {
      const link = locationLinksRef.current.get(focusedLocationIndex);
      if (link) {
        link.focus();
      }
    }
  }, [focusedLocationIndex, isLocationsOpen]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsLocationsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsLocationsOpen(false);
    }, 300);
  }, []);

  const handleAboutMouseEnter = useCallback(() => {
    if (aboutCloseTimeoutRef.current) {
      clearTimeout(aboutCloseTimeoutRef.current);
    }
    setIsAboutOpen(true);
  }, []);

  const handleAboutMouseLeave = useCallback(() => {
    aboutCloseTimeoutRef.current = setTimeout(() => {
      setIsAboutOpen(false);
    }, 300);
  }, []);

  const handleLocationClick = useCallback(() => {
    setIsLocationsOpen(false);
    setMobileLocationsOpen(false);
    setMenuOpen(false);
  }, []);

  const handleAboutClick = useCallback(() => {
    setIsAboutOpen(false);
    setMobileAboutOpen(false);
    setMenuOpen(false);
  }, []);

  const handleFindHelpClick = useCallback(() => {
    clearSearchState();
    setMenuOpen(false);

    if (typeof window !== 'undefined' && window.location.pathname === '/find-help') {
      window.location.href = '/find-help';
    }
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleAboutButtonClick = useCallback(() => {
    setIsAboutOpen(false);
    router.push('/about');
  }, [router]);

  return {
    menuOpen,
    setMenuOpen,
    isLocationsOpen,
    isAboutOpen,
    mobileLocationsOpen,
    setMobileLocationsOpen,
    mobileAboutOpen,
    setMobileAboutOpen,
    focusedLocationIndex,

    locationsButtonRef,
    locationsDropdownRef,
    locationLinksRef,

    groupedLocations,
    sortedLocations,

    handleLocationsKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    handleAboutMouseEnter,
    handleAboutMouseLeave,
    handleLocationClick,
    handleAboutClick,
    handleFindHelpClick,
    handleMenuClose,
    handleAboutButtonClick,
  };
}
