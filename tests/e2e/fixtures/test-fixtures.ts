import { test as base } from '@playwright/test';
import { setupAPIMocks, TEST_POSTCODE, TEST_COORDINATES } from '../helpers/mocks';

type TestFixtures = {
  mockSetup: void;
};

export const test = base.extend<TestFixtures>({
  mockSetup: [async ({ page }, use) => {
    await setupAPIMocks(page);
    await page.addInitScript(() => {
      localStorage.setItem('ss_cookie_consent', JSON.stringify({
        version: '2.0',
        timestamp: new Date().toISOString(),
        categories: {
          necessary: true,
          analytics: false,
          functional: false
        }
      }));

      const noop = () => {};
      const mockLatLng = function(lat: number, lng: number) {
        return { lat: () => lat, lng: () => lng };
      };
      const mockBounds = function() {
        return {
          extend: noop,
          isEmpty: () => true,
          getNorthEast: () => mockLatLng(0, 0),
          getSouthWest: () => mockLatLng(0, 0),
        };
      };
      const mockMap = function() {
        return {
          setCenter: noop,
          setZoom: noop,
          fitBounds: noop,
          getZoom: () => 12,
          addListener: noop,
          getBounds: mockBounds,
        };
      };
      const mockMarker = function() {
        return { setMap: noop, addListener: noop, setPosition: noop, setIcon: noop };
      };
      const mockInfoWindow = function() {
        return { open: noop, close: noop, setContent: noop, addListener: noop };
      };

      (window as any).google = {
        maps: {
          Map: mockMap,
          Marker: mockMarker,
          InfoWindow: mockInfoWindow,
          LatLng: mockLatLng,
          LatLngBounds: mockBounds,
          Size: function(w: number, h: number) { return { width: w, height: h }; },
          Point: function(x: number, y: number) { return { x, y }; },
          event: {
            addListener: noop,
            addDomListener: noop,
            clearInstanceListeners: noop,
            removeListener: noop,
          },
          AdvancedMarkerElement: mockMarker,
          geometry: {
            spherical: {
              computeDistanceBetween: () => 0,
            },
          },
        },
      };
    });
    await use();
  }, { auto: true }]
});

export { expect } from '@playwright/test';
export { TEST_POSTCODE, TEST_COORDINATES };
