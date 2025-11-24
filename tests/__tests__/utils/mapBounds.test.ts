import {
  calculateMapBounds,
  fitMapToBounds,
  updateMapBounds,
  shouldRecalculateBounds
} from '@/utils/mapBounds';

// Mock Google Maps API
const mockBounds = {
  extend: jest.fn(),
  isEmpty: jest.fn().mockReturnValue(false),
};

const mockLatLng = jest.fn().mockImplementation((lat: number, lng: number) => ({
  lat: () => lat,
  lng: () => lng,
  _lat: lat,
  _lng: lng,
}));

const mockGeometry = {
  spherical: {
    computeDistanceBetween: jest.fn().mockReturnValue(1000), // 1km
  },
};

const mockEvent = {
  addListenerOnce: jest.fn(),
};

const mockMap = {
  getDiv: jest.fn().mockReturnValue({
    offsetWidth: 800,
    offsetHeight: 600,
  }),
  fitBounds: jest.fn(),
  getZoom: jest.fn().mockReturnValue(12),
  setZoom: jest.fn(),
  setCenter: jest.fn(),
};

// Mock global google object
(global as any).google = {
  maps: {
    LatLngBounds: jest.fn().mockImplementation(() => mockBounds),
    LatLng: mockLatLng,
    geometry: mockGeometry,
    event: mockEvent,
    Map: jest.fn(),
  },
};

describe('mapBounds utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBounds.extend.mockClear();
    mockBounds.isEmpty.mockReturnValue(false);
  });

  describe('calculateMapBounds', () => {
    const testMarkers = [
      { lat: 53.4808, lng: -2.2426, id: 'marker1', type: 'service' },
      { lat: 53.4788, lng: -2.2446, id: 'marker2', type: 'service' },
    ];

    const userLocation = { lat: 53.4798, lng: -2.2436 };

    it('should handle empty markers array', () => {
      const result = calculateMapBounds([]);
      expect(result).toEqual({
        bounds: null,
        shouldFit: false,
      });
    });

    it('should handle empty markers with user location', () => {
      const result = calculateMapBounds([], userLocation);
      expect(result).toEqual({
        bounds: null,
        shouldFit: false,
        recommendedZoom: 13,
      });
    });

    it('should calculate bounds for multiple markers', () => {
      const result = calculateMapBounds(testMarkers, userLocation);
      expect(result.shouldFit).toBe(true);
      expect(result.bounds).toBeDefined();
      expect(mockBounds.extend).toHaveBeenCalledTimes(3); // 2 markers + user location
    });

    it('should handle single marker without user location', () => {
      const singleMarker = [testMarkers[0]];
      const result = calculateMapBounds(singleMarker);
      expect(result).toEqual({
        bounds: null,
        shouldFit: false,
        recommendedZoom: 14,
      });
    });

    it('should filter out user location markers', () => {
      const markersWithUser = [
        ...testMarkers,
        { lat: 53.4798, lng: -2.2436, id: 'user-location', type: 'user' },
      ];
      const result = calculateMapBounds(markersWithUser, userLocation);
      expect(mockBounds.extend).toHaveBeenCalledTimes(3); // 2 service markers + user location
    });

    it('should respect maxDistanceKm option', () => {
      mockGeometry.spherical.computeDistanceBetween.mockReturnValue(60000); // 60km
      const result = calculateMapBounds(testMarkers, userLocation, { maxDistanceKm: 50 });
      // User location should not be included due to distance
      expect(mockBounds.extend).toHaveBeenCalledTimes(2); // Only service markers
    });

    it('should handle Google Maps API not available', () => {
      const originalGoogle = (global as any).google;
      (global as any).google = undefined;
      
      const result = calculateMapBounds(testMarkers);
      expect(result).toEqual({
        bounds: null,
        shouldFit: false,
      });

      (global as any).google = originalGoogle;
    });

    it('should respect maxZoom option for single marker', () => {
      const singleMarker = [testMarkers[0]];
      const result = calculateMapBounds(singleMarker, undefined, { maxZoom: 12 });
      expect(result.recommendedZoom).toBe(12);
    });
  });

  describe('fitMapToBounds', () => {
    it('should fit map to bounds with proper padding', () => {
      fitMapToBounds(mockMap as any, mockBounds as any);
      expect(mockMap.fitBounds).toHaveBeenCalledWith(mockBounds, {
        top: 60,
        right: 80,
        bottom: 60,
        left: 80,
      });
    });

    it('should handle empty bounds', () => {
      mockBounds.isEmpty.mockReturnValue(true);
      fitMapToBounds(mockMap as any, mockBounds as any);
      expect(mockMap.fitBounds).not.toHaveBeenCalled();
    });

    it('should apply zoom constraints after fitting', () => {
      const eventCallback = jest.fn();
      mockEvent.addListenerOnce.mockImplementation((map, event, callback) => {
        callback();
        eventCallback();
      });
      
      mockMap.getZoom.mockReturnValue(18); // Above maxZoom
      fitMapToBounds(mockMap as any, mockBounds as any, { maxZoom: 16 });
      
      expect(mockMap.setZoom).toHaveBeenCalledWith(16);
    });

    it('should apply minimum zoom constraint', () => {
      const eventCallback = jest.fn();
      mockEvent.addListenerOnce.mockImplementation((map, event, callback) => {
        callback();
        eventCallback();
      });
      
      mockMap.getZoom.mockReturnValue(5); // Below minZoom
      fitMapToBounds(mockMap as any, mockBounds as any, { minZoom: 8 });
      
      expect(mockMap.setZoom).toHaveBeenCalledWith(8);
    });

    it('should use custom padding percentage', () => {
      fitMapToBounds(mockMap as any, mockBounds as any, { paddingPercent: 0.2 });
      expect(mockMap.fitBounds).toHaveBeenCalledWith(mockBounds, {
        top: 120,
        right: 160,
        bottom: 120,
        left: 160,
      });
    });
  });

  describe('updateMapBounds', () => {
    const testMarkers = [
      { lat: 53.4808, lng: -2.2426, id: 'marker1', type: 'service' },
      { lat: 53.4788, lng: -2.2446, id: 'marker2', type: 'service' },
    ];

    it('should fit bounds when shouldFit is true', () => {
      updateMapBounds(mockMap as any, testMarkers);
      expect(mockMap.fitBounds).toHaveBeenCalled();
    });

    it('should set center and zoom for single marker', () => {
      const singleMarker = [testMarkers[0]];
      updateMapBounds(mockMap as any, singleMarker);
      expect(mockMap.setCenter).toHaveBeenCalled();
      expect(mockMap.setZoom).toHaveBeenCalledWith(14);
    });

    it('should set center and zoom for user location only', () => {
      const userLocation = { lat: 53.4798, lng: -2.2436 };
      updateMapBounds(mockMap as any, [], userLocation);
      expect(mockMap.setCenter).toHaveBeenCalled();
      expect(mockMap.setZoom).toHaveBeenCalledWith(13);
    });
  });

  describe('shouldRecalculateBounds', () => {
    const markers1 = [
      { lat: 53.4808, lng: -2.2426, id: 'marker1', type: 'service' },
      { lat: 53.4788, lng: -2.2446, id: 'marker2', type: 'service' },
    ];

    const markers2 = [
      { lat: 53.4808, lng: -2.2426, id: 'marker1', type: 'service' },
      { lat: 53.4788, lng: -2.2446, id: 'marker2', type: 'service' },
    ];

    const markers3 = [
      { lat: 53.4808, lng: -2.2426, id: 'marker1', type: 'service' },
    ];

    it('should return true for different number of markers', () => {
      expect(shouldRecalculateBounds(markers1, markers3)).toBe(true);
    });

    it('should return false for identical markers', () => {
      expect(shouldRecalculateBounds(markers1, markers2)).toBe(false);
    });

    it('should return true for different marker positions', () => {
      const differentMarkers = [
        { lat: 53.4810, lng: -2.2426, id: 'marker1', type: 'service' },
        { lat: 53.4788, lng: -2.2446, id: 'marker2', type: 'service' },
      ];
      expect(shouldRecalculateBounds(markers1, differentMarkers)).toBe(true);
    });

    it('should handle empty arrays', () => {
      expect(shouldRecalculateBounds([], [])).toBe(false);
      expect(shouldRecalculateBounds(markers1, [])).toBe(true);
      expect(shouldRecalculateBounds([], markers1)).toBe(true);
    });
  });
});