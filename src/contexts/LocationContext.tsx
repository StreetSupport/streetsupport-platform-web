'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

export interface LocationState {
  lat?: number;
  lng?: number;
  postcode?: string;
}

interface LocationContextType {
  location: LocationState | null;
  setLocation: (location: LocationState) => void;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation, requestLocation }}>
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
