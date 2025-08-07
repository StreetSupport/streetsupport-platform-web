import openingTimesCache from '@/utils/openingTimesCache';
import { isServiceOpenNow } from '@/utils/openingTimes';
import type { ServiceWithDistance } from '@/types';

// Mock the openingTimes utility
jest.mock('@/utils/openingTimes', () => ({
  isServiceOpenNow: jest.fn(),
}));

const mockIsServiceOpenNow = isServiceOpenNow as jest.MockedFunction<typeof isServiceOpenNow>;

describe('OpeningTimesCache', () => {
  const mockService: ServiceWithDistance = {
    id: 'test-service-1',
    name: 'Test Service',
    description: 'A test service',
    category: 'meals',
    location: {
      streetAddress: '123 Test St',
      city: 'Manchester',
      postcode: 'M1 1AA',
      latitude: 53.4808,
      longitude: -2.2426,
    },
    distance: 0.5,
    organisation_id: 'test-org',
    openingTimes: [],
    tags: [],
  };

  const mockOpeningStatus = {
    isOpen: true,
    nextChange: null,
    statusText: 'Open now',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    openingTimesCache.clear();
    mockIsServiceOpenNow.mockReturnValue(mockOpeningStatus);
  });

  afterEach(() => {
    // Clear any intervals that might have been set
    jest.clearAllTimers();
  });

  describe('getOpeningStatus', () => {
    it('should calculate and cache opening status for new service', () => {
      const result = openingTimesCache.getOpeningStatus(mockService);
      
      expect(mockIsServiceOpenNow).toHaveBeenCalledWith(mockService);
      expect(result).toEqual(mockOpeningStatus);
      expect(openingTimesCache.getStats().size).toBe(1);
    });

    it('should return cached result for same service within cache duration', () => {
      // First call
      openingTimesCache.getOpeningStatus(mockService);
      expect(mockIsServiceOpenNow).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result = openingTimesCache.getOpeningStatus(mockService);
      expect(mockIsServiceOpenNow).toHaveBeenCalledTimes(1); // Not called again
      expect(result).toEqual(mockOpeningStatus);
    });

    it('should recalculate after cache expires', () => {
      const originalDateNow = Date.now;
      let currentTime = 1000000000000; // Fixed timestamp
      Date.now = jest.fn(() => currentTime);

      // First call
      openingTimesCache.getOpeningStatus(mockService);
      expect(mockIsServiceOpenNow).toHaveBeenCalledTimes(1);

      // Advance time beyond cache duration (1 minute)
      currentTime += 61000;

      // Second call - should recalculate
      openingTimesCache.getOpeningStatus(mockService);
      expect(mockIsServiceOpenNow).toHaveBeenCalledTimes(2);

      Date.now = originalDateNow;
    });

    it('should handle services with _id instead of id', () => {
      const serviceWithMongoId = {
        ...mockService,
        _id: 'mongo-id-123',
      };
      delete (serviceWithMongoId as any).id;

      const result = openingTimesCache.getOpeningStatus(serviceWithMongoId);
      expect(result).toEqual(mockOpeningStatus);
      expect(mockIsServiceOpenNow).toHaveBeenCalledWith(serviceWithMongoId);
    });

    it('should handle services without id or _id', () => {
      const serviceWithoutId = { ...mockService };
      delete (serviceWithoutId as any).id;

      const result = openingTimesCache.getOpeningStatus(serviceWithoutId);
      expect(result).toEqual(mockOpeningStatus);
      expect(mockIsServiceOpenNow).toHaveBeenCalledWith(serviceWithoutId);
    });
  });

  describe('cache management', () => {
    it('should limit cache size and remove oldest entries', () => {
      // Create more services than max cache size (500)
      const services: ServiceWithDistance[] = [];
      for (let i = 0; i < 502; i++) {
        services.push({
          ...mockService,
          id: `service-${i}`,
          name: `Service ${i}`,
        });
      }

      // Fill cache beyond max size
      services.forEach(service => {
        openingTimesCache.getOpeningStatus(service);
      });

      const stats = openingTimesCache.getStats();
      expect(stats.size).toBeLessThanOrEqual(stats.maxSize);
    });

    it('should generate different cache keys for different time windows', () => {
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => 1000000000000); // Fixed timestamp

      openingTimesCache.getOpeningStatus(mockService);
      expect(mockIsServiceOpenNow).toHaveBeenCalledTimes(1);

      // Move to next minute window
      Date.now = jest.fn(() => 1000000060000);

      openingTimesCache.getOpeningStatus(mockService);
      expect(mockIsServiceOpenNow).toHaveBeenCalledTimes(2);

      Date.now = originalDateNow;
    });
  });

  describe('cleanup', () => {
    it('should remove expired cache entries', () => {
      const originalDateNow = Date.now;
      let currentTime = 1000000000000;
      Date.now = jest.fn(() => currentTime);

      // Add some entries
      openingTimesCache.getOpeningStatus(mockService);
      openingTimesCache.getOpeningStatus({
        ...mockService,
        id: 'service-2',
      });

      expect(openingTimesCache.getStats().size).toBe(2);

      // Advance time beyond cache duration
      currentTime += 61000;
      Date.now = jest.fn(() => currentTime);

      openingTimesCache.cleanup();
      expect(openingTimesCache.getStats().size).toBe(0);

      Date.now = originalDateNow;
    });

    it('should keep unexpired entries during cleanup', () => {
      const originalDateNow = Date.now;
      let currentTime = 1000000000000;
      Date.now = jest.fn(() => currentTime);

      // Add first entry
      openingTimesCache.getOpeningStatus(mockService);

      // Advance time by 30 seconds
      currentTime += 30000;
      Date.now = jest.fn(() => currentTime);

      // Add second entry
      openingTimesCache.getOpeningStatus({
        ...mockService,
        id: 'service-2',
      });

      // Advance time by another 40 seconds (total 70 seconds)
      currentTime += 40000;
      Date.now = jest.fn(() => currentTime);

      openingTimesCache.cleanup();

      // First entry should be expired (70s > 60s), second should remain (40s < 60s)
      expect(openingTimesCache.getStats().size).toBe(1);

      Date.now = originalDateNow;
    });
  });

  describe('clear', () => {
    it('should remove all cache entries', () => {
      openingTimesCache.getOpeningStatus(mockService);
      openingTimesCache.getOpeningStatus({
        ...mockService,
        id: 'service-2',
      });

      expect(openingTimesCache.getStats().size).toBe(2);

      openingTimesCache.clear();
      expect(openingTimesCache.getStats().size).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return correct cache statistics', () => {
      const stats = openingTimesCache.getStats();
      
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(stats).toHaveProperty('cacheDurationMs');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.maxSize).toBe('number');
      expect(typeof stats.cacheDurationMs).toBe('number');
    });

    it('should reflect current cache size', () => {
      expect(openingTimesCache.getStats().size).toBe(0);

      openingTimesCache.getOpeningStatus(mockService);
      expect(openingTimesCache.getStats().size).toBe(1);

      openingTimesCache.getOpeningStatus({
        ...mockService,
        id: 'service-2',
      });
      expect(openingTimesCache.getStats().size).toBe(2);
    });
  });

  describe('different opening statuses', () => {
    it('should cache different opening statuses correctly', () => {
      const closedStatus = {
        isOpen: false,
        nextChange: new Date(),
        statusText: 'Closed',
      };

      mockIsServiceOpenNow.mockReturnValue(closedStatus);

      const result = openingTimesCache.getOpeningStatus(mockService);
      expect(result).toEqual(closedStatus);

      // Should return same cached result
      const cachedResult = openingTimesCache.getOpeningStatus(mockService);
      expect(cachedResult).toEqual(closedStatus);
      expect(mockIsServiceOpenNow).toHaveBeenCalledTimes(1);
    });
  });
});