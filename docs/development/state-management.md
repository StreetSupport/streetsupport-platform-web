# State Management Architecture

## Overview

The Street Support Platform uses a hybrid state management approach combining React Context for global state, local component state for UI interactions, and URL state for shareable application state. This architecture provides optimal performance while maintaining simplicity and developer experience.

## Architecture Principles

### State Management Strategy

1. **React Context**: Global application state (user location, authentication, theme)
2. **Component State**: Local UI state (form inputs, modal visibility, loading states)
3. **URL State**: Shareable state (search filters, pagination, location selection)
4. **Server State**: Cached API responses with SWR patterns

### State Categorisation

```typescript
// Global State (Context)
interface GlobalState {
  user: UserState;
  location: LocationState;
  preferences: PreferenceState;
}

// Local State (useState/useReducer)
interface LocalState {
  isModalOpen: boolean;
  formData: FormState;
  uiState: UIState;
}

// URL State (searchParams)
interface URLState {
  search: string;
  category: string;
  location: string;
  page: number;
}

// Server State (SWR/cached)
interface ServerState {
  services: Service[];
  organisations: Organisation[];
  locations: Location[];
}
```

## Context Providers

### LocationContext - User Location Management

The LocationContext manages user geolocation and location preferences:

```typescript
// src/contexts/LocationContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Location } from '@/types';

interface LocationContextType {
  // Current user location (GPS)
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  
  // Selected location (from dropdown/search)
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  
  // Location request functionality
  requestUserLocation: () => Promise<void>;
  
  // State indicators
  isLoading: boolean;
  error: string | null;
  
  // Location utilities
  getDistanceFromUser: (lat: number, lng: number) => number | null;
  formatDistance: (distance: number) => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request user's current location
  const requestUserLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // Cache for 5 minutes
          }
        );
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setUserLocation(location);
      
      // Store in localStorage for persistence
      localStorage.setItem('userLocation', JSON.stringify(location));
      
    } catch (error) {
      const message = error instanceof GeolocationPositionError 
        ? getGeolocationErrorMessage(error.code)
        : 'Unable to get your location';
        
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate distance from user location
  const getDistanceFromUser = useCallback((lat: number, lng: number) => {
    if (!userLocation) return null;
    
    return calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      lat, 
      lng
    );
  }, [userLocation]);

  // Format distance for display
  const formatDistance = useCallback((distance: number): string => {
    if (distance < 0.1) {
      return 'Less than 0.1 miles';
    } else if (distance < 1) {
      return `${distance.toFixed(1)} miles`;
    } else {
      return `${distance.toFixed(1)} miles`;
    }
  }, []);

  // Load persisted location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setUserLocation(location);
      } catch (error) {
        console.warn('Failed to parse saved location:', error);
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  const value: LocationContextType = {
    userLocation,
    setUserLocation,
    selectedLocation,
    setSelectedLocation,
    requestUserLocation,
    isLoading,
    error,
    getDistanceFromUser,
    formatDistance
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook with error handling
export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

// Utility functions
function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'Location access denied. Please enable location permissions.';
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'Location information unavailable.';
    case GeolocationPositionError.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'An error occurred while getting your location.';
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
```

### FilterContext - Search and Filter State

The FilterContext manages service search and filtering state:

```typescript
// src/contexts/FilterContext.tsx
import { createContext, useContext, useReducer, useCallback } from 'react';

interface FilterState {
  // Search criteria
  searchTerm: string;
  category: string | null;
  subCategory: string | null;
  clientGroup: string | null;
  
  // Location and radius
  location: { lat: number; lng: number } | null;
  radius: number;
  
  // Time-based filters
  openNow: boolean;
  dayOfWeek: number | null;
  timeOfDay: number | null;
  
  // Display options
  viewMode: 'list' | 'map' | 'grid';
  sortBy: 'distance' | 'name' | 'newest' | 'rating';
  limit: number;
  offset: number;
}

type FilterAction = 
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string | null }
  | { type: 'SET_SUB_CATEGORY'; payload: string | null }
  | { type: 'SET_CLIENT_GROUP'; payload: string | null }
  | { type: 'SET_LOCATION'; payload: { lat: number; lng: number } | null }
  | { type: 'SET_RADIUS'; payload: number }
  | { type: 'TOGGLE_OPEN_NOW' }
  | { type: 'SET_VIEW_MODE'; payload: 'list' | 'map' | 'grid' }
  | { type: 'SET_SORT_BY'; payload: FilterState['sortBy'] }
  | { type: 'SET_PAGINATION'; payload: { limit: number; offset: number } }
  | { type: 'RESET_FILTERS' }
  | { type: 'LOAD_FROM_URL'; payload: Partial<FilterState> };

const initialState: FilterState = {
  searchTerm: '',
  category: null,
  subCategory: null,
  clientGroup: null,
  location: null,
  radius: 5,
  openNow: false,
  dayOfWeek: null,
  timeOfDay: null,
  viewMode: 'list',
  sortBy: 'distance',
  limit: 20,
  offset: 0,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, offset: 0 };
      
    case 'SET_CATEGORY':
      return { 
        ...state, 
        category: action.payload, 
        subCategory: null, // Reset subcategory when category changes
        offset: 0 
      };
      
    case 'SET_SUB_CATEGORY':
      return { ...state, subCategory: action.payload, offset: 0 };
      
    case 'SET_CLIENT_GROUP':
      return { ...state, clientGroup: action.payload, offset: 0 };
      
    case 'SET_LOCATION':
      return { ...state, location: action.payload, offset: 0 };
      
    case 'SET_RADIUS':
      return { ...state, radius: action.payload, offset: 0 };
      
    case 'TOGGLE_OPEN_NOW':
      return { ...state, openNow: !state.openNow, offset: 0 };
      
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
      
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload, offset: 0 };
      
    case 'SET_PAGINATION':
      return { ...state, ...action.payload };
      
    case 'RESET_FILTERS':
      return { ...initialState, location: state.location }; // Preserve location
      
    case 'LOAD_FROM_URL':
      return { ...state, ...action.payload };
      
    default:
      return state;
  }
}

interface FilterContextType {
  state: FilterState;
  actions: {
    setSearchTerm: (term: string) => void;
    setCategory: (category: string | null) => void;
    setSubCategory: (subCategory: string | null) => void;
    setClientGroup: (clientGroup: string | null) => void;
    setLocation: (location: { lat: number; lng: number } | null) => void;
    setRadius: (radius: number) => void;
    toggleOpenNow: () => void;
    setViewMode: (mode: FilterState['viewMode']) => void;
    setSortBy: (sortBy: FilterState['sortBy']) => void;
    setPagination: (pagination: { limit: number; offset: number }) => void;
    resetFilters: () => void;
    loadFromURL: (params: URLSearchParams) => void;
  };
  computed: {
    hasActiveFilters: boolean;
    queryString: string;
    totalFiltersCount: number;
  };
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  // Action creators
  const actions = {
    setSearchTerm: useCallback((term: string) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: term });
    }, []),
    
    setCategory: useCallback((category: string | null) => {
      dispatch({ type: 'SET_CATEGORY', payload: category });
    }, []),
    
    setSubCategory: useCallback((subCategory: string | null) => {
      dispatch({ type: 'SET_SUB_CATEGORY', payload: subCategory });
    }, []),
    
    setClientGroup: useCallback((clientGroup: string | null) => {
      dispatch({ type: 'SET_CLIENT_GROUP', payload: clientGroup });
    }, []),
    
    setLocation: useCallback((location: { lat: number; lng: number } | null) => {
      dispatch({ type: 'SET_LOCATION', payload: location });
    }, []),
    
    setRadius: useCallback((radius: number) => {
      dispatch({ type: 'SET_RADIUS', payload: radius });
    }, []),
    
    toggleOpenNow: useCallback(() => {
      dispatch({ type: 'TOGGLE_OPEN_NOW' });
    }, []),
    
    setViewMode: useCallback((mode: FilterState['viewMode']) => {
      dispatch({ type: 'SET_VIEW_MODE', payload: mode });
    }, []),
    
    setSortBy: useCallback((sortBy: FilterState['sortBy']) => {
      dispatch({ type: 'SET_SORT_BY', payload: sortBy });
    }, []),
    
    setPagination: useCallback((pagination: { limit: number; offset: number }) => {
      dispatch({ type: 'SET_PAGINATION', payload: pagination });
    }, []),
    
    resetFilters: useCallback(() => {
      dispatch({ type: 'RESET_FILTERS' });
    }, []),
    
    loadFromURL: useCallback((params: URLSearchParams) => {
      const filterState: Partial<FilterState> = {};
      
      const searchTerm = params.get('search');
      if (searchTerm) filterState.searchTerm = searchTerm;
      
      const category = params.get('category');
      if (category) filterState.category = category;
      
      const subCategory = params.get('subCategory');
      if (subCategory) filterState.subCategory = subCategory;
      
      const clientGroup = params.get('clientGroup');
      if (clientGroup) filterState.clientGroup = clientGroup;
      
      const radius = params.get('radius');
      if (radius) filterState.radius = parseInt(radius, 10);
      
      const openNow = params.get('openNow');
      if (openNow) filterState.openNow = openNow === 'true';
      
      const viewMode = params.get('view') as FilterState['viewMode'];
      if (viewMode && ['list', 'map', 'grid'].includes(viewMode)) {
        filterState.viewMode = viewMode;
      }
      
      const sortBy = params.get('sort') as FilterState['sortBy'];
      if (sortBy && ['distance', 'name', 'newest', 'rating'].includes(sortBy)) {
        filterState.sortBy = sortBy;
      }
      
      const page = params.get('page');
      if (page) {
        const pageNum = parseInt(page, 10);
        if (pageNum > 0) {
          filterState.offset = (pageNum - 1) * state.limit;
        }
      }
      
      dispatch({ type: 'LOAD_FROM_URL', payload: filterState });
    }, [state.limit]),
  };

  // Computed values
  const computed = {
    hasActiveFilters: Boolean(
      state.searchTerm ||
      state.category ||
      state.subCategory ||
      state.clientGroup ||
      state.openNow ||
      state.radius !== 5
    ),
    
    queryString: new URLSearchParams({
      ...(state.searchTerm && { search: state.searchTerm }),
      ...(state.category && { category: state.category }),
      ...(state.subCategory && { subCategory: state.subCategory }),
      ...(state.clientGroup && { clientGroup: state.clientGroup }),
      ...(state.radius !== 5 && { radius: state.radius.toString() }),
      ...(state.openNow && { openNow: 'true' }),
      ...(state.viewMode !== 'list' && { view: state.viewMode }),
      ...(state.sortBy !== 'distance' && { sort: state.sortBy }),
      ...(state.offset > 0 && { page: Math.floor(state.offset / state.limit) + 1 }),
    }).toString(),
    
    totalFiltersCount: [
      state.searchTerm,
      state.category,
      state.subCategory,
      state.clientGroup,
      state.openNow,
      state.radius !== 5,
    ].filter(Boolean).length,
  };

  return (
    <FilterContext.Provider value={{ state, actions, computed }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
```

### PreferencesContext - User Preferences

The PreferencesContext manages user preferences and settings:

```typescript
// src/contexts/PreferencesContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'cy' | 'ar' | 'pl'; // English, Welsh, Arabic, Polish
  accessibilityMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  textSize: 'small' | 'medium' | 'large' | 'extra-large';
  defaultRadius: number;
  mapType: 'street' | 'satellite';
  notifications: {
    browser: boolean;
    email: boolean;
    emergency: boolean;
  };
}

interface PreferencesContextType {
  preferences: PreferencesState;
  updatePreference: <K extends keyof PreferencesState>(
    key: K,
    value: PreferencesState[K]
  ) => void;
  updateNotificationPreference: (
    type: keyof PreferencesState['notifications'],
    value: boolean
  ) => void;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (data: string) => boolean;
}

const defaultPreferences: PreferencesState = {
  theme: 'system',
  language: 'en',
  accessibilityMode: false,
  reducedMotion: false,
  highContrast: false,
  textSize: 'medium',
  defaultRadius: 5,
  mapType: 'street',
  notifications: {
    browser: false,
    email: false,
    emergency: true,
  },
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }, [preferences]);

  // Apply accessibility preferences to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (preferences.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mediaQuery.matches);
    }

    // Apply accessibility modes
    root.classList.toggle('accessibility-mode', preferences.accessibilityMode);
    root.classList.toggle('high-contrast', preferences.highContrast);
    root.classList.toggle('reduced-motion', preferences.reducedMotion);
    
    // Apply text size
    root.setAttribute('data-text-size', preferences.textSize);
    
    // Apply language
    root.setAttribute('lang', preferences.language);
    
  }, [preferences]);

  const updatePreference = <K extends keyof PreferencesState>(
    key: K,
    value: PreferencesState[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNotificationPreference = (
    type: keyof PreferencesState['notifications'],
    value: boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const exportPreferences = () => {
    return JSON.stringify(preferences, null, 2);
  };

  const importPreferences = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      
      // Validate the structure
      if (typeof parsed === 'object' && parsed !== null) {
        setPreferences(prev => ({ ...prev, ...parsed }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Failed to import preferences:', error);
      return false;
    }
  };

  return (
    <PreferencesContext.Provider value={{
      preferences,
      updatePreference,
      updateNotificationPreference,
      resetPreferences,
      exportPreferences,
      importPreferences,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
```

## Provider Composition

### Root Layout Provider Setup

```typescript
// src/app/layout.tsx
import { LocationProvider } from '@/contexts/LocationContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PreferencesProvider>
          <LocationProvider>
            <FilterProvider>
              <div className="app-container">
                <Header />
                <main>{children}</main>
                <Footer />
              </div>
            </FilterProvider>
          </LocationProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
```

## Custom Hooks

### useLocalStorage - Persistent State

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

### useDebounce - Performance Optimisation

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage example in search component
export function ServiceSearch() {
  const { state, actions } = useFilters();
  const [searchInput, setSearchInput] = useState(state.searchTerm);
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  useEffect(() => {
    actions.setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, actions]);

  return (
    <input
      type="text"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Search for services..."
    />
  );
}
```

### useApi - Server State Management

```typescript
// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  url: string,
  options?: RequestInit
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Usage example
export function ServiceList() {
  const { state } = useFilters();
  const { data, loading, error } = useApi<{ data: Service[] }>(
    `/api/services?${new URLSearchParams({
      lat: state.location?.lat.toString() || '',
      lng: state.location?.lng.toString() || '',
      radius: state.radius.toString(),
      ...(state.category && { category: state.category }),
    }).toString()}`
  );

  if (loading) return <div>Loading services...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data?.data?.length) return <div>No services found</div>;

  return (
    <div className="service-list">
      {data.data.map(service => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}
```

## URL State Synchronisation

### useURLSync - Bidirectional URL State

```typescript
// src/hooks/useURLSync.ts
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFilters } from '@/contexts/FilterContext';

export function useURLSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, actions, computed } = useFilters();

  // Load state from URL on mount
  useEffect(() => {
    actions.loadFromURL(searchParams);
  }, [searchParams, actions]);

  // Update URL when filters change
  useEffect(() => {
    const url = new URL(window.location.href);
    url.search = computed.queryString;
    
    // Only update URL if it has actually changed
    if (url.search !== window.location.search) {
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [computed.queryString, router]);
}

// Usage in page components
export default function FindHelpPage() {
  useURLSync(); // Synchronise filter state with URL

  return (
    <div>
      <FilterPanel />
      <ServiceResults />
    </div>
  );
}
```

## Performance Optimisations

### Memoisation Patterns

```typescript
// Memoised context values to prevent unnecessary re-renders
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoise expensive calculations
  const getDistanceFromUser = useCallback((lat: number, lng: number) => {
    if (!userLocation) return null;
    return calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
  }, [userLocation]);

  // Memoise context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    userLocation,
    setUserLocation,
    selectedLocation,
    setSelectedLocation,
    requestUserLocation,
    isLoading,
    error,
    getDistanceFromUser,
    formatDistance
  }), [
    userLocation,
    selectedLocation,
    isLoading,
    error,
    getDistanceFromUser,
    requestUserLocation
  ]);

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}
```

### Selective Context Subscriptions

```typescript
// Split contexts to prevent unnecessary re-renders
const LocationStateContext = createContext<LocationState | undefined>(undefined);
const LocationActionsContext = createContext<LocationActions | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  
  const actions = useMemo(() => ({
    setUserLocation: (location: Location | null) => setState(prev => ({
      ...prev,
      userLocation: location
    })),
    // ... other actions
  }), []);

  return (
    <LocationStateContext.Provider value={state}>
      <LocationActionsContext.Provider value={actions}>
        {children}
      </LocationActionsContext.Provider>
    </LocationStateContext.Provider>
  );
}

// Separate hooks for state and actions
export function useLocationState() {
  const context = useContext(LocationStateContext);
  if (context === undefined) {
    throw new Error('useLocationState must be used within a LocationProvider');
  }
  return context;
}

export function useLocationActions() {
  const context = useContext(LocationActionsContext);
  if (context === undefined) {
    throw new Error('useLocationActions must be used within a LocationProvider');
  }
  return context;
}
```

## Testing State Management

### Context Testing Utilities

```typescript
// tests/utils/renderWithProviders.tsx
import { render, RenderOptions } from '@testing-library/react';
import { LocationProvider } from '@/contexts/LocationContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <PreferencesProvider>
      <LocationProvider>
        <FilterProvider>
          {children}
        </FilterProvider>
      </LocationProvider>
    </PreferencesProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Custom hook testing
import { renderHook, act } from '@testing-library/react';

describe('useLocation', () => {
  it('should provide location functionality', () => {
    const { result } = renderHook(() => useLocation(), {
      wrapper: LocationProvider
    });

    expect(result.current.userLocation).toBeNull();
    expect(result.current.selectedLocation).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle location requests', async () => {
    // Mock geolocation API
    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) => {
        success({
          coords: { latitude: 53.4808, longitude: -2.2426 }
        });
      })
    };
    
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true
    });

    const { result } = renderHook(() => useLocation(), {
      wrapper: LocationProvider
    });

    await act(async () => {
      await result.current.requestUserLocation();
    });

    expect(result.current.userLocation).toEqual({
      lat: 53.4808,
      lng: -2.2426
    });
  });
});
```

## Error Handling in State

### Error Boundary Integration

```typescript
// src/components/StateErrorBoundary.tsx
class StateErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('State management error:', error, errorInfo);
    
    // Report to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: `State error: ${error.message}`,
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with the application state</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap providers with error boundary
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StateErrorBoundary>
          <PreferencesProvider>
            <LocationProvider>
              <FilterProvider>
                {children}
              </FilterProvider>
            </LocationProvider>
          </PreferencesProvider>
        </StateErrorBoundary>
      </body>
    </html>
  );
}
```

## Related Documentation

- [Next.js Implementation](./nextjs-implementation.md) - Next.js patterns and architecture
- [API Documentation](../api/README.md) - Server state and API integration
- [Testing Strategy](../testing/README.md) - State testing patterns
- [Performance Optimisation](./IMAGE_OPTIMISATION.md) - General optimisation strategies

---

*Last Updated: August 2025*
*Architecture: React Context + URL State*
*Status: Production Ready ✅*