import { render, waitFor } from '@testing-library/react';
import GoogleMap from '@/components/MapComponent/GoogleMap';

// Mock the loadGoogleMaps utility
jest.mock('@/utils/loadGoogleMaps', () => ({
  loadGoogleMaps: jest.fn().mockResolvedValue(undefined),
}));

interface Marker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  organisationSlug: string;
  icon?: string;
  organisation?: string;
  serviceName?: string;
  distanceKm?: number;
}

const mockMarkers: Marker[] = [
  { 
    id: '1', 
    lat: 53.1, 
    lng: -0.5, 
    title: 'Test Pin 1',
    organisationSlug: 'test-org-1',
    organisation: 'Test Organisation 1',
    serviceName: 'Test Service 1',
    distanceKm: 2.5
  },
  { 
    id: '2', 
    lat: 53.2, 
    lng: -0.6, 
    title: 'Test Pin 2', 
    icon: 'http://example.com/icon.png',
    organisationSlug: 'test-org-2',
    organisation: 'Test Organisation 2',
    serviceName: 'Test Service 2',
    distanceKm: 1.2
  },
];

const mockCenter = { lat: 53.1, lng: -0.5 };

// Mock for tracking event listeners
const mockAddListener = jest.fn();
const mockAddListenerOnce = jest.fn();
const mockInfoWindowOpen = jest.fn();
const mockInfoWindowClose = jest.fn();
const mockSetMap = jest.fn();
const mockSetPosition = jest.fn();
const mockSetAnimation = jest.fn();
const mockClearInstanceListeners = jest.fn();
const mockMapConstructor = jest.fn();

beforeEach(() => {
  // Reset mocks
  mockAddListener.mockClear();
  mockAddListenerOnce.mockClear();
  mockInfoWindowOpen.mockClear();
  mockInfoWindowClose.mockClear();
  mockSetMap.mockClear();
  mockSetPosition.mockClear();
  mockSetAnimation.mockClear();
  mockClearInstanceListeners.mockClear();
  mockMapConstructor.mockClear();

  // Use the global mock location to avoid navigation errors
  delete (window as any).location;
  (window as any).location = (global as any).mockLocation;

  // Set up Google Maps API mock
  (window as any).google = {
    maps: {
      Map: jest.fn().mockImplementation(function (this: any) {
        mockMapConstructor.apply(this, arguments);
        return this;
      }),
      Marker: jest.fn().mockImplementation(function (this: any, options: any) {
        this._position = options?.position;
        this._animation = options?.animation;
        this.setMap = mockSetMap;
        this.addListener = mockAddListener;
        this.getPosition = jest.fn(() => this._position ? {
          lat: () => this._position.lat,
          lng: () => this._position.lng,
        } : null);
        this.getAnimation = jest.fn(() => this._animation);
        this.setPosition = mockSetPosition;
        this.setAnimation = mockSetAnimation;
        return this;
      }),
      InfoWindow: jest.fn().mockImplementation(function (this: any) {
        this.open = mockInfoWindowOpen;
        this.close = mockInfoWindowClose;
        return this;
      }),
      event: {
        addListenerOnce: mockAddListenerOnce,
        clearInstanceListeners: mockClearInstanceListeners,
      },
      Animation: {
        BOUNCE: 'BOUNCE',
      },
    },
  };
});

afterEach(() => {
  delete (window as any).google;
  // Don't delete window.location as it affects other tests
});

describe('GoogleMap', () => {
  it('renders map container', () => {
    const { container } = render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('initialises Google Maps when center provided', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    await waitFor(() => {
      expect((window as any).google.maps.Map).toHaveBeenCalled();
    });
  });

  it('creates markers using Google Maps API', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    await waitFor(() => {
      expect((window as any).google.maps.Marker).toHaveBeenCalledTimes(mockMarkers.length);
    });
  });

  it('uses provided zoom level', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} zoom={8} />);
    await waitFor(() => {
      expect((window as any).google.maps.Map).toHaveBeenCalled();
    });
    const call = (window as any).google.maps.Map.mock.calls[0][1];
    expect(call.zoom).toBe(8);
  });

  it('uses default zoom level when not provided', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    await waitFor(() => {
      expect((window as any).google.maps.Map).toHaveBeenCalled();
    });
    const call = (window as any).google.maps.Map.mock.calls[0][1];
    expect(call.zoom).toBe(12);
  });

  it('does not create map when center is null', () => {
    render(<GoogleMap markers={mockMarkers} center={null} />);
    expect((window as any).google.maps.Map).not.toHaveBeenCalled();
  });

  it('creates InfoWindow lazily on marker click', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    await waitFor(() => {
      expect(mockAddListener).toHaveBeenCalled();
    });

    // No InfoWindows created upfront
    expect((window as any).google.maps.InfoWindow).not.toHaveBeenCalled();

    // Click a marker to trigger lazy InfoWindow creation
    const clickHandler = mockAddListener.mock.calls[0][1];
    clickHandler();

    expect((window as any).google.maps.InfoWindow).toHaveBeenCalledTimes(1);
    expect(mockInfoWindowOpen).toHaveBeenCalled();
  });

  it('adds click listeners to markers', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    await waitFor(() => {
      expect(mockAddListener).toHaveBeenCalledTimes(mockMarkers.length);
    });
    expect(mockAddListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('handles marker click and opens InfoWindow', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    
    await waitFor(() => {
      expect(mockAddListener).toHaveBeenCalled();
    });
    
    // Get the click handler for the first marker
    const clickHandler = mockAddListener.mock.calls[0][1];
    
    // Simulate marker click
    clickHandler();
    
    expect(mockInfoWindowOpen).toHaveBeenCalled();
    expect(mockAddListenerOnce).toHaveBeenCalledWith(expect.any(Object), 'domready', expect.any(Function));
  });

  it('closes existing InfoWindow before opening new one', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    
    await waitFor(() => {
      expect(mockAddListener).toHaveBeenCalledTimes(mockMarkers.length);
    });
    
    // Simulate first marker click
    const firstClickHandler = mockAddListener.mock.calls[0][1];
    firstClickHandler();
    
    // Simulate second marker click
    const secondClickHandler = mockAddListener.mock.calls[1][1];
    secondClickHandler();
    
    expect(mockInfoWindowClose).toHaveBeenCalled();
  });

  it('handles missing organisation and service data gracefully', async () => {
    const markersWithMissingData: Marker[] = [
      {
        id: '3',
        lat: 53.3,
        lng: -0.7,
        title: 'Test Pin 3',
        organisationSlug: 'test-org-3'
      },
    ];

    render(<GoogleMap markers={markersWithMissingData} center={mockCenter} />);

    await waitFor(() => {
      expect(mockAddListener).toHaveBeenCalled();
    });

    // Click marker to trigger lazy InfoWindow creation
    const clickHandler = mockAddListener.mock.calls[0][1];
    clickHandler();

    expect((window as any).google.maps.InfoWindow).toHaveBeenCalledWith({
      content: expect.stringContaining('Unknown Organisation')
    });
    expect((window as any).google.maps.InfoWindow).toHaveBeenCalledWith({
      content: expect.stringContaining('Unnamed service')
    });
    expect((window as any).google.maps.InfoWindow).toHaveBeenCalledWith({
      content: expect.stringContaining('? km away')
    });
  });

  it('removes old markers and creates new ones when markers change', async () => {
    const { rerender } = render(<GoogleMap markers={mockMarkers} center={mockCenter} />);

    await waitFor(() => {
      expect((window as any).google.maps.Marker).toHaveBeenCalledTimes(2);
    });

    mockSetMap.mockClear();

    const newMarkers: Marker[] = [
      {
        id: '4',
        lat: 53.4,
        lng: -0.8,
        title: 'New Pin',
        organisationSlug: 'new-org'
      },
    ];

    rerender(<GoogleMap markers={newMarkers} center={mockCenter} />);

    await waitFor(() => {
      // Both old markers should be removed
      expect(mockSetMap).toHaveBeenCalledWith(null);
      expect(mockSetMap).toHaveBeenCalledTimes(2);
      // New marker should be created (2 original + 1 new = 3 total)
      expect((window as any).google.maps.Marker).toHaveBeenCalledTimes(3);
    });
  });

  it('preserves existing markers during diffing', async () => {
    const { rerender } = render(<GoogleMap markers={mockMarkers} center={mockCenter} />);

    await waitFor(() => {
      expect((window as any).google.maps.Marker).toHaveBeenCalledTimes(2);
    });

    mockSetMap.mockClear();

    // Keep marker 1, remove marker 2, add marker 3
    const updatedMarkers: Marker[] = [
      mockMarkers[0],
      {
        id: '3',
        lat: 53.3,
        lng: -0.7,
        title: 'New Pin',
        organisationSlug: 'new-org'
      },
    ];

    rerender(<GoogleMap markers={updatedMarkers} center={mockCenter} />);

    await waitFor(() => {
      // Only marker 2 should be removed
      expect(mockSetMap).toHaveBeenCalledWith(null);
      expect(mockSetMap).toHaveBeenCalledTimes(1);
      // Only marker 3 should be created (marker 1 preserved)
      expect((window as any).google.maps.Marker).toHaveBeenCalledTimes(3);
    });
  });

  it('handles empty markers array', () => {
    render(<GoogleMap markers={[]} center={mockCenter} />);
    expect((window as any).google.maps.Marker).not.toHaveBeenCalled();
  });

  it('sets correct marker properties including custom icon', async () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    
    await waitFor(() => {
      expect((window as any).google.maps.Marker).toHaveBeenCalledTimes(mockMarkers.length);
    });
    
    // Check first marker (no custom icon)
    expect((window as any).google.maps.Marker).toHaveBeenCalledWith({
      position: { lat: 53.1, lng: -0.5 },
      map: expect.any(Object),
      title: 'Test Pin 1',
      icon: undefined,
      zIndex: 100,
      animation: null
    });
    
    // Check second marker (with custom icon)
    expect((window as any).google.maps.Marker).toHaveBeenCalledWith({
      position: { lat: 53.2, lng: -0.6 },
      map: expect.any(Object),
      title: 'Test Pin 2',
      icon: 'http://example.com/icon.png',
      zIndex: 100,
      animation: null
    });
  });
});
