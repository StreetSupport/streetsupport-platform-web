'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { usePathname } from 'next/navigation';
import locations from '@/data/locations.json';

export type LocationSource = 'geolocation' | 'postcode' | 'navigation';

export interface LocationState {
  lat?: number;
  lng?: number;
  postcode?: string;
  source: LocationSource;
  radius?: number;
}

export interface LocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'GEOCODING_FAILED' | 'NETWORK_ERROR';
  message: string;
}

interface LocationContextType {
  location: LocationState | null;
  setLocation: (location: LocationState) => void;
  updateRadius: (radius: number) => void;
  requestLocation: () => Promise<void>;
  error: LocationError | null;
  isLoading: boolean;
  clearError: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Navigation context detection
  useEffect(() => {
    // Check if we're on a location page and set location from navigation context
    if (!pathname) return;
    
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 1) {
      // Check if this is a location slug (e.g., /birmingham, /leeds)
      const locationSlug = pathSegments[0];
      const locationData = locations.find(loc => loc.slug === locationSlug && loc.isPublic);
      
      if (locationData) {
        setLocation({
          lat: locationData.latitude,
          lng: locationData.longitude,
          source: 'navigation',
          radius: 5, // Default radius in km
        });
      }
    }
  }, [pathname]);

  const requestLocation = useCallback(async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError({
        code: 'POSITION_UNAVAILABLE',
        message: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            source: 'geolocation',
            radius: 5, // Default radius in km
          });
          setIsLoading(false);
          resolve();
        },
        (geoError) => {
          let errorCode: LocationError['code'];
          let errorMessage: string;

          // Handle GeolocationPositionError codes
          switch (geoError.code) {
            case 1: // PERMISSION_DENIED
              errorCode = 'PERMISSION_DENIED';
              errorMessage = 'Location access denied. Please enter your postcode instead.';
              break;
            case 2: // POSITION_UNAVAILABLE
              errorCode = 'POSITION_UNAVAILABLE';
              errorMessage = 'Location information is unavailable. Please try entering your postcode.';
              break;
            case 3: // TIMEOUT
              errorCode = 'TIMEOUT';
              errorMessage = 'Location request timed out. Please try again or enter your postcode.';
              break;
            default:
              errorCode = 'NETWORK_ERROR';
              errorMessage = 'An error occurred while retrieving your location.';
          }

          const locationError: LocationError = {
            code: errorCode,
            message: errorMessage,
          };

          setError(locationError);
          setIsLoading(false);
          reject(locationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const enhancedSetLocation = useCallback((newLocation: LocationState) => {
    setLocation(newLocation);
    setError(null); // Clear any existing errors when location is set
  }, []);

  const updateRadius = useCallback((radius: number) => {
    setLocation(prev => prev ? { ...prev, radius } : null);
  }, []);

  return (
    <LocationContext.Provider 
      value={{ 
        location, 
        setLocation: enhancedSetLocation, 
        updateRadius,
        requestLocation, 
        error, 
        isLoading, 
        clearError 
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

export { LocationContext };
