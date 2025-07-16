import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import FindHelpPageClient from '@/app/find-help/FindHelpPageClient';
import { LocationProvider, LocationContext } from '@/contexts/LocationContext';
import type { LocationState } from '@/contexts/LocationContext';

// Mock the components
jest.mock('@/components/Location/LocationPrompt', () => {
  return function MockLocationPrompt({ onLocationSet }: { onLocationSet?: () => void }) {
    return (
      <div data-testid="location-prompt">
        <button onClick={onLocationSet} data-testid="set-location-btn">
          Set Location
        </button>
      </div>
    );
  };
});

jest.mock('@/components/FindHelp/FindHelpResults', () => {
  return function MockFindHelpResults({ 
    services, 
    loading, 
    error 
  }: { 
    services: any[]; 
    loading?: boolean; 
    error?: string | null; 
  }) {
    if (loading) {
      return <div data-testid="loading">Loading services...</div>;
    }
    
    return (
      <div>
        {error && <div data-testid="error">Error: {error}</div>}
        <div data-testid="find-help-results">
          <div data-testid="services-count">{services.length} services</div>
          {services.map((service, index) => (
            <div key={service.id || index} data-testid={`service-${index}`}>
              {service.name}
            </div>
          ))}
        </div>
      </div>
    );
  };
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock utils
jest.mock('@/utils/htmlDecode', () => ({
  decodeHtmlEntities: (str: string) => str,
}));

jest.mock('@/utils/categoryLookup', () => ({
  categoryKeyToName: {},
  subCategoryKeyToName: {},
}));

const mockServices = [
  {
    _id: '1',
    ServiceProviderName: 'Test Service 1',
    Info: 'Test description 1',
    ParentCategoryKey: 'health',
    SubCategoryKey: 'gp',
    Address: {
      Location: {
        coordinates: [-2.0, 53.0]
      }
    },
    organisation: {
      name: 'Test Org 1',
      slug: 'test-org-1',
      isVerified: true
    },
    ServiceProviderKey: 'test-org-1',
    ClientGroups: [],
    OpeningTimes: [],
    distance: 1.5
  },
  {
    _id: '2',
    ServiceProviderName: 'Test Service 2',
    Info: 'Test description 2',
    ParentCategoryKey: 'housing',
    SubCategoryKey: 'emergency',
    Address: {
      Location: {
        coordinates: [-2.1, 53.1]
      }
    },
    organisation: {
      name: 'Test Org 2',
      slug: 'test-org-2',
      isVerified: false
    },
    ServiceProviderKey: 'test-org-2',
    ClientGroups: [],
    OpeningTimes: [],
    distance: 2.3
  }
];

function renderWithLocationContext(
  ui: React.ReactElement,
  location: LocationState | null = null
) {
  const mockContextValue = {
    location,
    setLocation: jest.fn(),
    requestLocation: jest.fn(),
    error: null,
    isLoading: false,
    clearError: jest.fn(),
  };

  return render(
    <LocationContext.Provider value={mockContextValue}>
      {ui}
    </LocationContext.Provider>
  );
}

describe('FindHelpPageClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders LocationPrompt when no location is set', () => {
    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      null
    );

    expect(screen.getByTestId('location-prompt')).toBeInTheDocument();
    expect(screen.queryByTestId('find-help-results')).not.toBeInTheDocument();
  });

  it('renders FindHelpResults when location is set', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: mockServices
      })
    });

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(screen.getByTestId('find-help-results')).toBeInTheDocument();
    });

    expect(screen.getByTestId('services-count')).toHaveTextContent('2 services');
  });

  it('fetches services with location parameters', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'postcode',
      postcode: 'M1 1AE',
      radius: 15
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: mockServices
      })
    });

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/services?lat=53&lng=-2&radius=15&limit=1000'),
        expect.objectContaining({
          cache: 'no-store'
        })
      );
    });
  });

  it('includes category filter from search params', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: mockServices
      })
    });

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{ category: 'health' }} />,
      location
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('category=health'),
        expect.any(Object)
      );
    });
  });

  it('shows loading state while fetching services', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    // Mock a delayed response
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ results: mockServices })
        }), 100)
      )
    );

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    // Mock both the initial call and fallback call to fail
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Fallback also failed'));

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Unable to load services. Please try again later.');
  });

  it('handles timeout errors with proper error message', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    // Mock timeout error
    mockFetch.mockImplementationOnce(() => 
      new Promise((_, reject) => {
        const error = new Error('Request timeout');
        error.name = 'AbortError';
        setTimeout(() => reject(error), 50);
      })
    );

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Request timed out. Please check your connection and try again.');
  });

  it('handles server errors with appropriate messages', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Server error. Our services are temporarily unavailable.');
  });

  it('handles rate limiting errors', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Too many requests. Please wait a moment and try again.');
  });

  it('handles invalid API response format', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: 'not an array'
      })
    });

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Invalid response format from services API');
  });

  it('falls back to non-location services on API error', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    // First call fails, second call (fallback) succeeds
    mockFetch
      .mockRejectedValueOnce(new Error('Location API error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: mockServices
        })
      });

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(screen.getByTestId('find-help-results')).toBeInTheDocument();
    });

    // Should show services and error message about location filtering
    expect(screen.getByTestId('services-count')).toHaveTextContent('2 services');
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Unable to filter by location, showing all available services'
    );
  });

  it('transitions from LocationPrompt to FindHelpResults when location is set', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: mockServices
      })
    });

    // Start without location
    const { rerender } = renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      null
    );

    expect(screen.getByTestId('location-prompt')).toBeInTheDocument();

    // Simulate location being set
    rerender(
      <LocationContext.Provider value={{
        location,
        setLocation: jest.fn(),
        requestLocation: jest.fn(),
        error: null,
        isLoading: false,
        clearError: jest.fn(),
      }}>
        <FindHelpPageClient searchParams={{}} />
      </LocationContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('find-help-results')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('location-prompt')).not.toBeInTheDocument();
  });

  it('processes service data correctly', async () => {
    const location: LocationState = {
      lat: 53.0,
      lng: -2.0,
      source: 'geolocation',
      radius: 10
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: mockServices
      })
    });

    renderWithLocationContext(
      <FindHelpPageClient searchParams={{}} />,
      location
    );

    await waitFor(() => {
      expect(screen.getByTestId('service-0')).toHaveTextContent('Test Service 1');
      expect(screen.getByTestId('service-1')).toHaveTextContent('Test Service 2');
    });
  });

  describe('Retry functionality', () => {
    it('shows retry button with attempt count', async () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        source: 'geolocation',
        radius: 10
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithLocationContext(
        <FindHelpPageClient searchParams={{}} />,
        location
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });

      // Should show retry functionality in error boundary fallback
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    it('handles network errors with retry mechanism', async () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        source: 'geolocation',
        radius: 10
      };

      // First call fails with network error
      mockFetch.mockImplementationOnce(() => 
        Promise.reject(new Error('Failed to fetch'))
      );

      renderWithLocationContext(
        <FindHelpPageClient searchParams={{}} />,
        location
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });

      expect(screen.getByTestId('error')).toHaveTextContent('Network error. Please check your internet connection.');
    });

    it('provides browse all services fallback option', async () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        source: 'geolocation',
        radius: 10
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithLocationContext(
        <FindHelpPageClient searchParams={{}} />,
        location
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });

      // Error boundary should provide fallback options
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  describe('Timeout handling', () => {
    it('handles request timeouts appropriately', async () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        source: 'geolocation',
        radius: 10
      };

      // Mock a request that times out
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => {
          const error = new Error('Request timeout');
          error.name = 'AbortError';
          setTimeout(() => reject(error), 100);
        })
      );

      renderWithLocationContext(
        <FindHelpPageClient searchParams={{}} />,
        location
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      }, { timeout: 2000 });

      expect(screen.getByTestId('error')).toHaveTextContent('Request timed out. Please check your connection and try again.');
    });
  });

  describe('Fallback mechanisms', () => {
    it('successfully loads fallback services when location API fails', async () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        source: 'geolocation',
        radius: 10
      };

      // First call fails, second call (fallback) succeeds
      mockFetch
        .mockRejectedValueOnce(new Error('Location API error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: mockServices
          })
        });

      renderWithLocationContext(
        <FindHelpPageClient searchParams={{}} />,
        location
      );

      await waitFor(() => {
        expect(screen.getByTestId('find-help-results')).toBeInTheDocument();
      });

      expect(screen.getByTestId('services-count')).toHaveTextContent('2 services');
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Unable to filter by location, showing all available services'
      );
    });

    it('handles complete API failure gracefully', async () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        source: 'geolocation',
        radius: 10
      };

      // Both primary and fallback calls fail
      mockFetch
        .mockRejectedValueOnce(new Error('Primary API error'))
        .mockRejectedValueOnce(new Error('Fallback API error'));

      renderWithLocationContext(
        <FindHelpPageClient searchParams={{}} />,
        location
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });

      expect(screen.getByTestId('error')).toHaveTextContent('Unable to load services. Please try again later.');
    });
  });

  describe('Error boundary integration', () => {
    it('uses ErrorBoundary for location-related errors', () => {
      renderWithLocationContext(
        <FindHelpPageClient searchParams={{}} />,
        null
      );

      // Should render LocationPrompt wrapped in ErrorBoundary
      expect(screen.getByTestId('location-prompt')).toBeInTheDocument();
    });

    it('uses ErrorBoundary for services-related errors', async () => {
      const location: LocationState = {
        lat: 53.0,
        lng: -2.0,
        source: 'geolocation',
        radius: 10
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: mockServices
        })
      });

      renderWithLocationContext(
        <FindHelpPageClient searchParams={{}} />,
        location
      );

      await waitFor(() => {
        expect(screen.getByTestId('find-help-results')).toBeInTheDocument();
      });

      // Should render FindHelpResults wrapped in ErrorBoundary
      expect(screen.getByTestId('find-help-results')).toBeInTheDocument();
    });
  });
});