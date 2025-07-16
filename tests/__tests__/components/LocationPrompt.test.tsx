import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationPrompt from '@/components/Location/LocationPrompt';
import { LocationProvider, LocationContext } from '@/contexts/LocationContext';
import type { LocationState, LocationError } from '@/contexts/LocationContext';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock window.location
const mockLocation = {
  href: ''
};
delete (window as any).location;
(window as any).location = mockLocation;

const mockContextValue = {
  location: null as LocationState | null,
  setLocation: jest.fn(),
  requestLocation: jest.fn(),
  error: null as LocationError | null,
  isLoading: false,
  clearError: jest.fn(),
};

const renderWithContext = (ui: React.ReactElement, contextOverrides = {}) => {
  const value = { ...mockContextValue, ...contextOverrides };
  return render(
    <LocationContext.Provider value={value}>
      {ui}
    </LocationContext.Provider>
  );
};

describe('LocationPrompt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockLocation.href = '';
  });

  describe('Initial state', () => {
    it('renders location prompt when no location is set', () => {
      renderWithContext(<LocationPrompt />);

      expect(screen.getByText('Find Services Near You')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /use my current location/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enter postcode instead/i })).toBeInTheDocument();
    });

    it('shows location confirmation when location is already set', () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        source: 'geolocation',
        radius: 10
      };

      renderWithContext(<LocationPrompt />, { location });

      expect(screen.getByText(/location set/i)).toBeInTheDocument();
      expect(screen.getByText(/using your current location/i)).toBeInTheDocument();
    });

    it('shows postcode in confirmation when location is from postcode', () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        postcode: 'M1 1AE',
        source: 'postcode',
        radius: 10
      };

      renderWithContext(<LocationPrompt />, { location });

      expect(screen.getByText(/location set: M1 1AE/i)).toBeInTheDocument();
      expect(screen.getByText(/using postcode location/i)).toBeInTheDocument();
    });
  });

  describe('Location request', () => {
    it('shows loading state during location request', () => {
      renderWithContext(<LocationPrompt />, { isLoading: true });

      expect(screen.getByText(/getting your location/i)).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('calls requestLocation when location button is clicked', async () => {
      const requestLocation = jest.fn().mockResolvedValue(undefined);
      renderWithContext(<LocationPrompt />, { requestLocation });

      fireEvent.click(screen.getByRole('button', { name: /use my current location/i }));

      expect(requestLocation).toHaveBeenCalled();
    });

    it('calls onLocationSet when location request succeeds', async () => {
      const onLocationSet = jest.fn();
      const requestLocation = jest.fn().mockResolvedValue(undefined);
      
      renderWithContext(<LocationPrompt onLocationSet={onLocationSet} />, { requestLocation });

      fireEvent.click(screen.getByRole('button', { name: /use my current location/i }));

      await waitFor(() => {
        expect(onLocationSet).toHaveBeenCalled();
      });
    });

    it('shows postcode input when location request fails', async () => {
      const error: LocationError = {
        code: 'PERMISSION_DENIED',
        message: 'Location access denied. Please enter your postcode instead.'
      };
      const requestLocation = jest.fn().mockRejectedValue(error);

      renderWithContext(<LocationPrompt />, { requestLocation, error });

      fireEvent.click(screen.getByRole('button', { name: /use my current location/i }));

      await waitFor(() => {
        expect(screen.getByText(/location access denied/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /use postcode instead/i })).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('displays permission denied error with retry and postcode options', () => {
      const error: LocationError = {
        code: 'PERMISSION_DENIED',
        message: 'Location access denied. Please enter your postcode instead.'
      };

      renderWithContext(<LocationPrompt />, { error });

      expect(screen.getByText(/location access denied/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /use postcode instead/i })).toBeInTheDocument();
    });

    it('displays timeout error with appropriate message', () => {
      const error: LocationError = {
        code: 'TIMEOUT',
        message: 'Location request timed out. Please try again or enter your postcode.'
      };

      renderWithContext(<LocationPrompt />, { error });

      expect(screen.getByText(/location request timed out/i)).toBeInTheDocument();
    });

    it('displays position unavailable error', () => {
      const error: LocationError = {
        code: 'POSITION_UNAVAILABLE',
        message: 'Location information is unavailable. Please try entering your postcode.'
      };

      renderWithContext(<LocationPrompt />, { error });

      expect(screen.getByText(/location information is unavailable/i)).toBeInTheDocument();
    });

    it('clears error when try again is clicked', () => {
      const clearError = jest.fn();
      const error: LocationError = {
        code: 'PERMISSION_DENIED',
        message: 'Location access denied.'
      };

      renderWithContext(<LocationPrompt />, { error, clearError });

      fireEvent.click(screen.getByRole('button', { name: /try again/i }));

      expect(clearError).toHaveBeenCalled();
    });
  });

  describe('Postcode input', () => {
    beforeEach(() => {
      renderWithContext(<LocationPrompt />);
      fireEvent.click(screen.getByRole('button', { name: /enter postcode instead/i }));
    });

    it('shows postcode input form when postcode button is clicked', () => {
      expect(screen.getByLabelText(/enter your postcode/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /find services/i })).toBeInTheDocument();
    });

    it('validates postcode format', async () => {
      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      
      fireEvent.change(postcodeInput, { target: { value: 'INVALID' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid uk postcode/i)).toBeInTheDocument();
      });
    });

    it('requires postcode input', async () => {
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter a postcode/i)).toBeInTheDocument();
      });
    });

    it('calls geocoding API with valid postcode', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          location: { lat: 53.0, lng: -2.0 }
        })
      });

      const setLocation = jest.fn();
      const onLocationSet = jest.fn();

      renderWithContext(<LocationPrompt onLocationSet={onLocationSet} />, { setLocation });
      
      fireEvent.click(screen.getByRole('button', { name: /enter postcode instead/i }));
      
      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/geocode?postcode=M1%201AE'),
          expect.objectContaining({
            signal: expect.any(AbortSignal),
            headers: { 'Content-Type': 'application/json' }
          })
        );
      });

      await waitFor(() => {
        expect(setLocation).toHaveBeenCalledWith({
          lat: 53.0,
          lng: -2.0,
          postcode: 'M1 1AE',
          source: 'postcode',
          radius: 10
        });
        expect(onLocationSet).toHaveBeenCalled();
      });
    });

    it('shows loading state during geocoding', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ location: { lat: 53.0, lng: -2.0 } })
        }), 100))
      );

      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      expect(screen.getByText(/finding location/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /finding location/i })).toBeDisabled();
    });

    it('handles geocoding API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: 'Postcode not found'
        })
      });

      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByText(/postcode not found/i)).toBeInTheDocument();
      });
    });

    it('handles network errors with timeout', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Failed to fetch')), 50)
        )
      );

      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('handles request timeout', async () => {
      // Mock a request that takes longer than the timeout
      mockFetch.mockImplementationOnce(() => 
        new Promise(() => {}) // Never resolves
      );

      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByText(/request timed out/i)).toBeInTheDocument();
      }, { timeout: 12000 });
    });

    it('handles server errors appropriately', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
    });

    it('handles rate limiting errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429
      });

      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
      });
    });
  });

  describe('Retry functionality', () => {
    it('shows retry options for network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

      renderWithContext(<LocationPrompt />);
      fireEvent.click(screen.getByRole('button', { name: /enter postcode instead/i }));
      
      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry.*3 attempts left/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /browse all services/i })).toBeInTheDocument();
      });
    });

    it('decrements retry count on each attempt', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to fetch'));

      renderWithContext(<LocationPrompt />);
      fireEvent.click(screen.getByRole('button', { name: /enter postcode instead/i }));
      
      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry.*3 attempts left/i })).toBeInTheDocument();
      });

      // Click retry
      fireEvent.click(screen.getByRole('button', { name: /retry.*3 attempts left/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry.*2 attempts left/i })).toBeInTheDocument();
      });
    });

    it('disables retry after maximum attempts', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to fetch'));

      renderWithContext(<LocationPrompt />);
      fireEvent.click(screen.getByRole('button', { name: /enter postcode instead/i }));
      
      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      // Retry 3 times
      for (let i = 0; i < 3; i++) {
        await waitFor(() => {
          const retryButton = screen.queryByRole('button', { name: /retry/i });
          if (retryButton) {
            fireEvent.click(retryButton);
          }
        });
      }

      await waitFor(() => {
        expect(screen.getByText(/maximum retry attempts reached/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
      });
    });

    it('navigates to browse all services when fallback button is clicked', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

      renderWithContext(<LocationPrompt />);
      fireEvent.click(screen.getByRole('button', { name: /enter postcode instead/i }));
      
      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /browse all services/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /browse all services/i }));

      expect(mockLocation.href).toBe('/find-help?browse=all');
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and structure', () => {
      renderWithContext(<LocationPrompt />);
      fireEvent.click(screen.getByRole('button', { name: /enter postcode instead/i }));

      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      expect(postcodeInput).toHaveAttribute('required');
      expect(postcodeInput).toHaveAttribute('id', 'postcode');
    });

    it('shows loading spinner with proper aria attributes', () => {
      renderWithContext(<LocationPrompt />, { isLoading: true });

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('disables form elements during loading states', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ location: { lat: 53.0, lng: -2.0 } })
        }), 100))
      );

      renderWithContext(<LocationPrompt />);
      fireEvent.click(screen.getByRole('button', { name: /enter postcode instead/i }));
      
      const postcodeInput = screen.getByLabelText(/enter your postcode/i);
      fireEvent.change(postcodeInput, { target: { value: 'M1 1AE' } });
      fireEvent.click(screen.getByRole('button', { name: /find services/i }));

      expect(postcodeInput).toBeDisabled();
      expect(screen.getByRole('button', { name: /finding location/i })).toBeDisabled();
    });
  });
});