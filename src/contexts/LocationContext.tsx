'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface LocationState {
  lat?: number;
  lng?: number;
  postcode?: string;
}

interface LocationContextType {
  location: LocationState | null;
  setLocation: (location: LocationState) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  console.log('[LocationProvider] Initialising...'); // ✅ Diagnostic log

  const [location, setLocation] = useState<LocationState | null>(null);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
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

if (process.env.NODE_ENV !== 'test') {
  console.log('[LocationProvider] Initialising...');
}
