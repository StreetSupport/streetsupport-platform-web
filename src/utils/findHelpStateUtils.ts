/**
 * Utilities for managing Find Help search state in URL and sessionStorage
 */

export interface FindHelpSearchState {
  // Location data
  lat: number;
  lng: number;
  locationLabel: string;
  radius: number;
  
  // Filter states
  selectedCategory: string;
  selectedSubCategory: string;
  selectedClientGroups: string[];
  openNow: boolean;
  sortOrder: 'distance' | 'alpha';
  showMap: boolean;
  
  // UI state
  fromResultsPage: boolean;
  
  // Timetable filters
  timetableFilters?: {
    [key: string]: boolean;
  };
}

export interface URLSearchParams {
  lat?: string;
  lng?: string;
  cat?: string;
  subcat?: string;
  radius?: string;
}

const STORAGE_KEY = 'findHelpSearchState';

/**
 * Get current URL search parameters for Find Help
 */
export function getURLSearchParams(): URLSearchParams {
  if (typeof window === 'undefined') return {};
  
  const searchParams = new URLSearchParams(window.location.search);
  return {
    lat: searchParams.get('lat') || undefined,
    lng: searchParams.get('lng') || undefined,
    cat: searchParams.get('cat') || undefined,
    subcat: searchParams.get('subcat') || undefined,
    radius: searchParams.get('radius') || undefined,
  };
}

/**
 * Update URL with search parameters without full page reload
 */
export function updateURLSearchParams(params: URLSearchParams): void {
  if (typeof window === 'undefined') return;
  
  const searchParams = new URLSearchParams(window.location.search);
  
  // Update or remove each parameter
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== '') {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  });
  
  const newURL = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.replaceState(null, '', newURL);
}

/**
 * Save complete search state to sessionStorage
 */
export function saveSearchState(state: FindHelpSearchState): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save search state to sessionStorage:', error);
  }
}

/**
 * Load search state from sessionStorage
 */
export function loadSearchState(): FindHelpSearchState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const state = JSON.parse(stored) as FindHelpSearchState;
    return state;
  } catch (error) {
    console.warn('Failed to load search state from sessionStorage:', error);
    return null;
  }
}

/**
 * Clear search state from sessionStorage
 */
export function clearSearchState(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear search state from sessionStorage:', error);
  }
}

/**
 * Check if current page referrer was an organisation page
 */
export function isFromOrganisationPage(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  
  const referrer = document.referrer;
  if (!referrer) return false;
  
  try {
    const referrerUrl = new URL(referrer);
    return referrerUrl.pathname.startsWith('/find-help/organisation/');
  } catch {
    return false;
  }
}

/**
 * Generate back navigation URL with search parameters
 */
export function generateBackToSearchURL(
  lat: number,
  lng: number,
  category?: string,
  subCategory?: string,
  radius?: number
): string {
  const params = new URLSearchParams();
  
  params.set('lat', lat.toString());
  params.set('lng', lng.toString());
  
  if (category) {
    params.set('cat', category);
  }
  
  if (subCategory) {
    params.set('subcat', subCategory);
  }
  
  if (radius && radius !== 5) { // Don't include default radius
    params.set('radius', radius.toString());
  }
  
  return `/find-help?${params.toString()}`;
}


/**
 * Create search state from current application state
 */
export function createSearchState(
  lat: number,
  lng: number,
  locationLabel: string,
  radius: number,
  filters: {
    selectedCategory: string;
    selectedSubCategory: string;
    selectedClientGroups?: string[];
    openNow?: boolean;
    sortOrder: 'distance' | 'alpha';
    showMap: boolean;
    timetableFilters?: { [key: string]: boolean };
  }
): FindHelpSearchState {
  return {
    lat,
    lng,
    locationLabel,
    radius,
    selectedCategory: filters.selectedCategory,
    selectedSubCategory: filters.selectedSubCategory,
    selectedClientGroups: filters.selectedClientGroups || [],
    openNow: filters.openNow || false,
    sortOrder: filters.sortOrder,
    showMap: filters.showMap,
    fromResultsPage: true,
    timetableFilters: filters.timetableFilters || {},
  };
}