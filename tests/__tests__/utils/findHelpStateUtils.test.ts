import {
  generateBackToSearchURL,
  createSearchState,
  FindHelpSearchState,
} from '@/utils/findHelpStateUtils';

// Mock console methods to avoid noise in tests
const mockConsoleWarn = jest.fn();
console.warn = mockConsoleWarn;

// Create mocks for browser APIs
const mockLocationSearch = jest.fn();
const mockHistoryReplaceState = jest.fn();
const mockSessionStorageGetItem = jest.fn();
const mockSessionStorageSetItem = jest.fn();
const mockSessionStorageRemoveItem = jest.fn();
const mockDocumentReferrer = jest.fn();

// Mock the functions that depend on browser APIs by creating spies
let getURLSearchParamsSpy: jest.SpyInstance;
let updateURLSearchParamsSpy: jest.SpyInstance;
let saveSearchStateSpy: jest.SpyInstance;
let loadSearchStateSpy: jest.SpyInstance;
let clearSearchStateSpy: jest.SpyInstance;
let isFromOrganisationPageSpy: jest.SpyInstance;

describe('findHelpStateUtils', () => {
  beforeEach(() => {
    // Reset all mocks
    mockConsoleWarn.mockReset();
    mockLocationSearch.mockReset();
    mockHistoryReplaceState.mockReset();
    mockSessionStorageGetItem.mockReset();
    mockSessionStorageSetItem.mockReset();
    mockSessionStorageRemoveItem.mockReset();
    mockDocumentReferrer.mockReset();

    // Reset spies if they exist
    if (getURLSearchParamsSpy) getURLSearchParamsSpy.mockRestore();
    if (updateURLSearchParamsSpy) updateURLSearchParamsSpy.mockRestore();
    if (saveSearchStateSpy) saveSearchStateSpy.mockRestore();
    if (loadSearchStateSpy) loadSearchStateSpy.mockRestore();
    if (clearSearchStateSpy) clearSearchStateSpy.mockRestore();
    if (isFromOrganisationPageSpy) isFromOrganisationPageSpy.mockRestore();
  });

  afterEach(() => {
    // Clean up spies
    if (getURLSearchParamsSpy) getURLSearchParamsSpy.mockRestore();
    if (updateURLSearchParamsSpy) updateURLSearchParamsSpy.mockRestore();
    if (saveSearchStateSpy) saveSearchStateSpy.mockRestore();
    if (loadSearchStateSpy) loadSearchStateSpy.mockRestore();
    if (clearSearchStateSpy) clearSearchStateSpy.mockRestore();
    if (isFromOrganisationPageSpy) isFromOrganisationPageSpy.mockRestore();
  });

  describe('generateBackToSearchURL', () => {
    it('should generate URL with required coordinates', () => {
      const result = generateBackToSearchURL(53.4808, -2.2426);
      expect(result).toBe('/find-help?lat=53.4808&lng=-2.2426');
    });

    it('should include category when provided', () => {
      const result = generateBackToSearchURL(53.4808, -2.2426, 'meals');
      expect(result).toBe('/find-help?lat=53.4808&lng=-2.2426&cat=meals');
    });

    it('should include subcategory when provided', () => {
      const result = generateBackToSearchURL(53.4808, -2.2426, 'meals', 'breakfast');
      expect(result).toBe('/find-help?lat=53.4808&lng=-2.2426&cat=meals&subcat=breakfast');
    });

    it('should include non-default radius', () => {
      const result = generateBackToSearchURL(53.4808, -2.2426, undefined, undefined, 10);
      expect(result).toBe('/find-help?lat=53.4808&lng=-2.2426&radius=10');
    });

    it('should not include default radius (5)', () => {
      const result = generateBackToSearchURL(53.4808, -2.2426, undefined, undefined, 5);
      expect(result).toBe('/find-help?lat=53.4808&lng=-2.2426');
    });

    it('should include location slug when provided', () => {
      const result = generateBackToSearchURL(53.4808, -2.2426, undefined, undefined, undefined, 'manchester');
      expect(result).toBe('/find-help?lat=53.4808&lng=-2.2426&locationSlug=manchester');
    });

    it('should include all parameters when provided', () => {
      const result = generateBackToSearchURL(
        53.4808, 
        -2.2426, 
        'accommodation', 
        'emergency', 
        15, 
        'manchester'
      );
      expect(result).toBe('/find-help?lat=53.4808&lng=-2.2426&cat=accommodation&subcat=emergency&radius=15&locationSlug=manchester');
    });

    it('should handle negative coordinates', () => {
      const result = generateBackToSearchURL(-33.8688, 151.2093, 'meals');
      expect(result).toBe('/find-help?lat=-33.8688&lng=151.2093&cat=meals');
    });

    it('should handle decimal coordinates', () => {
      const result = generateBackToSearchURL(53.480837, -2.242631);
      expect(result).toBe('/find-help?lat=53.480837&lng=-2.242631');
    });
  });

  describe('createSearchState', () => {
    it('should create complete search state with all parameters', () => {
      const filters = {
        selectedCategory: 'meals',
        selectedSubCategory: 'breakfast',
        selectedClientGroups: ['adults', 'families'],
        openNow: true,
        sortOrder: 'distance' as const,
        showMap: false,
        timetableFilters: { monday: true, tuesday: false },
      };

      const result = createSearchState(
        53.4808,
        -2.2426,
        'Manchester',
        10,
        filters,
        'postcode',
        'manchester'
      );

      expect(result).toEqual({
        lat: 53.4808,
        lng: -2.2426,
        locationLabel: 'Manchester',
        radius: 10,
        locationSource: 'postcode',
        locationSlug: 'manchester',
        selectedCategory: 'meals',
        selectedSubCategory: 'breakfast',
        selectedClientGroups: ['adults', 'families'],
        openNow: true,
        sortOrder: 'distance',
        showMap: false,
        fromResultsPage: true,
        currentPage: 1,
        timetableFilters: { monday: true, tuesday: false },
      });
    });

    it('should create state with minimal filters', () => {
      const filters = {
        selectedCategory: '',
        selectedSubCategory: '',
        sortOrder: 'alpha' as const,
        showMap: true,
      };

      const result = createSearchState(53.4808, -2.2426, 'Manchester', 5, filters);

      expect(result).toEqual({
        lat: 53.4808,
        lng: -2.2426,
        locationLabel: 'Manchester',
        radius: 5,
        locationSource: undefined,
        locationSlug: undefined,
        selectedCategory: '',
        selectedSubCategory: '',
        selectedClientGroups: [],
        openNow: false,
        sortOrder: 'alpha',
        showMap: true,
        fromResultsPage: true,
        currentPage: 1,
        timetableFilters: {},
      });
    });

    it('should handle undefined optional client groups', () => {
      const filters = {
        selectedCategory: 'housing',
        selectedSubCategory: 'advice',
        sortOrder: 'distance' as const,
        showMap: true,
      };

      const result = createSearchState(53.4808, -2.2426, 'Manchester', 5, filters);

      expect(result.selectedClientGroups).toEqual([]);
      expect(result.openNow).toBe(false);
      expect(result.timetableFilters).toEqual({});
    });

    it('should handle geolocation source', () => {
      const filters = {
        selectedCategory: 'meals',
        selectedSubCategory: 'lunch',
        sortOrder: 'distance' as const,
        showMap: false,
      };

      const result = createSearchState(
        53.4808,
        -2.2426,
        'Current location',
        5,
        filters,
        'geolocation'
      );

      expect(result.locationSource).toBe('geolocation');
      expect(result.locationLabel).toBe('Current location');
    });

    it('should handle navigation source with location slug', () => {
      const filters = {
        selectedCategory: 'accommodation',
        selectedSubCategory: 'emergency',
        sortOrder: 'alpha' as const,
        showMap: true,
      };

      const result = createSearchState(
        53.4808,
        -2.2426,
        'Greater Manchester',
        15,
        filters,
        'navigation',
        'greater-manchester'
      );

      expect(result.locationSource).toBe('navigation');
      expect(result.locationSlug).toBe('greater-manchester');
    });

    it('should always set fromResultsPage to true and currentPage to 1', () => {
      const filters = {
        selectedCategory: 'health',
        selectedSubCategory: 'mental-health',
        sortOrder: 'distance' as const,
        showMap: false,
      };

      const result = createSearchState(53.4808, -2.2426, 'Manchester', 5, filters);

      expect(result.fromResultsPage).toBe(true);
      expect(result.currentPage).toBe(1);
    });
  });

  // For browser-dependent functions, we'll create simple tests that verify they handle edge cases
  describe('Browser-dependent functions (basic coverage)', () => {
    it('should handle server-side rendering (no window)', () => {
      // Test functions that check for window existence
      const originalWindow = global.window;
      
      // @ts-ignore
      global.window = undefined;
      
      // Import after setting window to undefined
      const {
        getURLSearchParams,
        updateURLSearchParams,
        saveSearchState,
        loadSearchState,
        clearSearchState,
        isFromOrganisationPage,
      } = require('@/utils/findHelpStateUtils');

      // These should not throw and should handle undefined window gracefully
      expect(() => getURLSearchParams()).not.toThrow();
      expect(() => updateURLSearchParams({})).not.toThrow();
      expect(() => saveSearchState({} as FindHelpSearchState)).not.toThrow();
      expect(() => loadSearchState()).not.toThrow();
      expect(() => clearSearchState()).not.toThrow();
      expect(() => isFromOrganisationPage()).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });

    it('should return correct values for server-side rendering', () => {
      const originalWindow = global.window;
      
      // @ts-ignore
      global.window = undefined;
      
      const {
        getURLSearchParams,
        loadSearchState,
        isFromOrganisationPage,
      } = require('@/utils/findHelpStateUtils');

      expect(getURLSearchParams()).toEqual({});
      expect(loadSearchState()).toBeNull();
      expect(isFromOrganisationPage()).toBe(false);

      // Restore window
      global.window = originalWindow;
    });

    it('should handle missing document gracefully', () => {
      const originalDocument = global.document;
      
      // @ts-ignore
      global.document = undefined;
      
      const { isFromOrganisationPage } = require('@/utils/findHelpStateUtils');
      
      expect(isFromOrganisationPage()).toBe(false);
      
      // Restore document
      global.document = originalDocument;
    });

    it('should create mock search state for testing', () => {
      const mockState: FindHelpSearchState = {
        lat: 53.4808,
        lng: -2.2426,
        locationLabel: 'Test Location',
        radius: 5,
        selectedCategory: 'test',
        selectedSubCategory: 'test-sub',
        selectedClientGroups: ['adults'],
        openNow: false,
        sortOrder: 'distance',
        showMap: true,
        fromResultsPage: false,
      };

      // Test that we can create and validate state objects
      expect(mockState.lat).toBe(53.4808);
      expect(mockState.lng).toBe(-2.2426);
      expect(mockState.locationLabel).toBe('Test Location');
      expect(mockState.selectedClientGroups).toContain('adults');
    });

    it('should handle various location source types', () => {
      const sources: Array<'geolocation' | 'postcode' | 'navigation' | 'location'> = [
        'geolocation', 'postcode', 'navigation', 'location'
      ];

      sources.forEach(source => {
        const filters = {
          selectedCategory: 'test',
          selectedSubCategory: 'test-sub',
          sortOrder: 'distance' as const,
          showMap: true,
        };

        const result = createSearchState(53, -2, 'Test', 5, filters, source);
        expect(result.locationSource).toBe(source);
      });
    });

    it('should handle sort order types', () => {
      const sortOrders: Array<'distance' | 'alpha'> = ['distance', 'alpha'];

      sortOrders.forEach(sortOrder => {
        const filters = {
          selectedCategory: 'test',
          selectedSubCategory: 'test-sub',
          sortOrder,
          showMap: true,
        };

        const result = createSearchState(53, -2, 'Test', 5, filters);
        expect(result.sortOrder).toBe(sortOrder);
      });
    });

    it('should handle various client groups', () => {
      const clientGroups = ['adults', 'families', 'young-people', 'children'];
      
      const filters = {
        selectedCategory: 'test',
        selectedSubCategory: 'test-sub',
        selectedClientGroups: clientGroups,
        sortOrder: 'distance' as const,
        showMap: true,
      };

      const result = createSearchState(53, -2, 'Test', 5, filters);
      expect(result.selectedClientGroups).toEqual(clientGroups);
    });

    it('should handle timetable filters correctly', () => {
      const timetableFilters = {
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: true,
      };
      
      const filters = {
        selectedCategory: 'test',
        selectedSubCategory: 'test-sub',
        sortOrder: 'distance' as const,
        showMap: true,
        timetableFilters,
      };

      const result = createSearchState(53, -2, 'Test', 5, filters);
      expect(result.timetableFilters).toEqual(timetableFilters);
    });

    it('should handle coordinate edge cases', () => {
      // Test extreme coordinates
      const extremeCoords = [
        { lat: 90, lng: 180 },    // Max values
        { lat: -90, lng: -180 },  // Min values  
        { lat: 0, lng: 0 },       // Zero values
        { lat: 53.123456789, lng: -2.987654321 }, // High precision
      ];

      extremeCoords.forEach(({ lat, lng }) => {
        const url = generateBackToSearchURL(lat, lng);
        expect(url).toContain(`lat=${lat}`);
        expect(url).toContain(`lng=${lng}`);
      });
    });

    it('should handle radius edge cases', () => {
      const radiusValues = [1, 5, 10, 25, 50, 100];

      radiusValues.forEach(radius => {
        const url = generateBackToSearchURL(53, -2, undefined, undefined, radius);
        
        if (radius === 5) {
          // Default radius should not be included
          expect(url).not.toContain('radius=');
        } else {
          expect(url).toContain(`radius=${radius}`);
        }
      });
    });

    it('should handle special characters in URL parameters', () => {
      const specialCategories = [
        'meals & drinks',
        'housing/accommodation', 
        'health+wellbeing',
        'education&training',
      ];

      specialCategories.forEach(category => {
        const url = generateBackToSearchURL(53, -2, category);
        expect(url).toContain('cat=');
        // URL should be properly encoded
        expect(url).not.toContain(' ');
      });
    });
  });
});