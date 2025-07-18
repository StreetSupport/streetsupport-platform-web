import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { LocationProvider, useLocation } from '@/contexts/LocationContext';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock locations data
jest.mock('@/data/locations.json', () => [
  {
    id: '1',
    key: 'birmingham',
    name: 'Birmingham',
    slug: 'birmingham',
    latitude: 52.4862,
    longitude: -1.8904,
    isPublic: true,
  },
  {
    id: '2',
    key: 'leeds',
    name: 'Leeds',
    slug: 'leeds',
    latitude: 53.8021,
    longitude: -1.5485,
    isPublic: true,
  },
]);

function Consumer() {
  const { location, setLocation, requestLocation, error, isLoading, clearError } = useLocation();
  
  const handleSetLocation = () => {
    setLocation({ lat: 1, lng: 2, source: 'postcode' });
  };

  const handleSetLocationWithPostcode = () => {
    setLocation({ postcode: 'B1 1AA', source: 'postcode', lat: 52.4862, lng: -1.8904 });
  };

  const handleRequestLocation = async () => {
    try {
      await requestLocation();
    } catch {
      // Error is already handled by the context
    }
  };

  return (
    <div>
      <span data-testid="location">{location ? JSON.stringify(location) : 'null'}</span>
      <span data-testid="error">{error ? JSON.stringify(error) : 'null'}</span>
      <span data-testid="loading">{isLoading ? 'true' : 'false'}</span>
      <button onClick={handleSetLocation}>set</button>
      <button onClick={handleSetLocationWithPostcode}>set-postcode</button>
      <button onClick={handleRequestLocation}>request</button>
      <button onClick={clearError}>clear-error</button>
    </div>
  );
}

describe('LocationContext', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock usePathname to return root path by default
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/');
  });

  afterEach(() => {
    // Clean up geolocation mock
    delete (global.navigator as any).geolocation;
  });

  describe('Provider Setup', () => {
    it('throws if useLocation is used outside provider', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<Consumer />)).toThrow('useLocation must be used within a LocationProvider');
      (console.error as jest.Mock).mockRestore();
    });

    it('initializes with null location and no error', () => {
      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );
      
      expect(screen.getByTestId('location').textContent).toBe('null');
      expect(screen.getByTestId('error').textContent).toBe('null');
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });

  describe('Manual Location Setting', () => {
    it('updates location via setLocation with coordinates', () => {
      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );
      
      fireEvent.click(screen.getByText('set'));
      
      const locationData = JSON.parse(screen.getByTestId('location').textContent!);
      expect(locationData).toEqual({
        lat: 1,
        lng: 2,
        source: 'postcode'
      });
    });

    it('updates location via setLocation with postcode', () => {
      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );
      
      fireEvent.click(screen.getByText('set-postcode'));
      
      const locationData = JSON.parse(screen.getByTestId('location').textContent!);
      expect(locationData).toEqual({
        postcode: 'B1 1AA',
        source: 'postcode',
        lat: 52.4862,
        lng: -1.8904
      });
    });

    it('clears error when setting location manually', () => {
      // First set up an error state
      const mockGetCurrentPosition = jest.fn((success, error) => {
        error({ code: 1, message: 'Permission denied' });
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      // Trigger error
      fireEvent.click(screen.getByText('request'));

      // Wait for error to be set
      waitFor(() => {
        expect(screen.getByTestId('error').textContent).not.toBe('null');
      });

      // Now set location manually - should clear error
      fireEvent.click(screen.getByText('set'));
      
      expect(screen.getByTestId('error').textContent).toBe('null');
    });
  });

  describe('Geolocation API Integration', () => {
    it('successfully requests location using geolocation API', async () => {
      const mockGetCurrentPosition = jest.fn((success) => {
        act(() => {
          success({ coords: { latitude: 3, longitude: 4 } });
        });
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText('request'));
      });

      await waitFor(() => {
        const locationData = JSON.parse(screen.getByTestId('location').textContent!);
        expect(locationData).toEqual({
          lat: 3,
          lng: 4,
          source: 'geolocation',
          radius: 10
        });
      });

      expect(mockGetCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });

    it('shows loading state during geolocation request', async () => {
      let resolvePosition: (position: any) => void;
      const mockGetCurrentPosition = jest.fn((success) => {
        resolvePosition = success;
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText('request'));
      });

      // Should be loading
      expect(screen.getByTestId('loading').textContent).toBe('true');

      // Resolve the position
      await act(async () => {
        resolvePosition!({ coords: { latitude: 3, longitude: 4 } });
      });

      // Should no longer be loading
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
    });

    it('handles geolocation not supported', async () => {
      // Remove geolocation from navigator
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText('request'));
      });

      await waitFor(() => {
        const errorData = JSON.parse(screen.getByTestId('error').textContent!);
        expect(errorData).toEqual({
          code: 'POSITION_UNAVAILABLE',
          message: 'Geolocation is not supported by this browser.'
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('handles permission denied error', async () => {
      const mockGetCurrentPosition = jest.fn((success, error) => {
        act(() => {
          error({ code: 1, message: 'Permission denied' });
        });
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText('request'));
      });

      await waitFor(() => {
        const errorData = JSON.parse(screen.getByTestId('error').textContent!);
        expect(errorData).toEqual({
          code: 'PERMISSION_DENIED',
          message: 'Location access denied. Please enter your postcode instead.'
        });
      });
    });

    it('handles position unavailable error', async () => {
      const mockGetCurrentPosition = jest.fn((success, error) => {
        act(() => {
          error({ code: 2, message: 'Position unavailable' });
        });
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText('request'));
      });

      await waitFor(() => {
        const errorData = JSON.parse(screen.getByTestId('error').textContent!);
        expect(errorData).toEqual({
          code: 'POSITION_UNAVAILABLE',
          message: 'Location information is unavailable. Please try entering your postcode.'
        });
      });
    });

    it('handles timeout error', async () => {
      const mockGetCurrentPosition = jest.fn((success, error) => {
        act(() => {
          error({ code: 3, message: 'Timeout' });
        });
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText('request'));
      });

      await waitFor(() => {
        const errorData = JSON.parse(screen.getByTestId('error').textContent!);
        expect(errorData).toEqual({
          code: 'TIMEOUT',
          message: 'Location request timed out. Please try again or enter your postcode.'
        });
      });
    });

    it('handles unknown geolocation error', async () => {
      const mockGetCurrentPosition = jest.fn((success, error) => {
        act(() => {
          error({ code: 999, message: 'Unknown error' });
        });
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByText('request'));
      });

      await waitFor(() => {
        const errorData = JSON.parse(screen.getByTestId('error').textContent!);
        expect(errorData).toEqual({
          code: 'NETWORK_ERROR',
          message: 'An error occurred while retrieving your location.'
        });
      });
    });

    it('clears error when clearError is called', async () => {
      const mockGetCurrentPosition = jest.fn((success, error) => {
        act(() => {
          error({ code: 1, message: 'Permission denied' });
        });
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      });

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      // Trigger error
      await act(async () => {
        fireEvent.click(screen.getByText('request'));
      });

      // Wait for error to be set
      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).not.toBe('null');
      });

      // Clear error
      fireEvent.click(screen.getByText('clear-error'));
      
      expect(screen.getByTestId('error').textContent).toBe('null');
    });
  });

  describe('Navigation Context Detection', () => {
    it('detects Birmingham location from navigation path', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/birmingham');

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      const locationData = JSON.parse(screen.getByTestId('location').textContent!);
      expect(locationData).toEqual({
        lat: 52.4862,
        lng: -1.8904,
        source: 'navigation',
        radius: 10
      });
    });

    it('detects Leeds location from navigation path', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/leeds');

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      const locationData = JSON.parse(screen.getByTestId('location').textContent!);
      expect(locationData).toEqual({
        lat: 53.8021,
        lng: -1.5485,
        source: 'navigation',
        radius: 10
      });
    });

    it('does not set location for non-location paths', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/find-help');

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      expect(screen.getByTestId('location').textContent).toBe('null');
    });

    it('does not set location for unknown location slugs', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/unknown-city');

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      expect(screen.getByTestId('location').textContent).toBe('null');
    });

    it('does not set location for multi-segment paths', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/birmingham/advice');

      render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      expect(screen.getByTestId('location').textContent).toBe('null');
    });

    it('updates location when pathname changes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/');

      const { rerender } = render(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      expect(screen.getByTestId('location').textContent).toBe('null');

      // Change pathname
      usePathname.mockReturnValue('/birmingham');
      
      rerender(
        <LocationProvider>
          <Consumer />
        </LocationProvider>
      );

      const locationData = JSON.parse(screen.getByTestId('location').textContent!);
      expect(locationData).toEqual({
        lat: 52.4862,
        lng: -1.8904,
        source: 'navigation',
        radius: 10
      });
    });
  });
});
