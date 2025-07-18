import { render } from '@testing-library/react';
import GoogleMap from '@/components/MapComponent/GoogleMap';

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
const mockMapConstructor = jest.fn();

beforeEach(() => {
  // Reset mocks
  mockAddListener.mockClear();
  mockAddListenerOnce.mockClear();
  mockInfoWindowOpen.mockClear();
  mockInfoWindowClose.mockClear();
  mockSetMap.mockClear();
  mockMapConstructor.mockClear();

  // Mock window.location
  delete (window as any).location;
  (window as any).location = { href: '' };

  (window as any).google = {
    maps: {
      Map: jest.fn().mockImplementation(function (this: any) {
        mockMapConstructor.apply(this, arguments);
        return this;
      }),
      Marker: jest.fn().mockImplementation(function (this: any) {
        this.setMap = mockSetMap;
        this.addListener = mockAddListener;
        return this;
      }),
      InfoWindow: jest.fn().mockImplementation(function (this: any) {
        this.open = mockInfoWindowOpen;
        this.close = mockInfoWindowClose;
        return this;
      }),
      event: {
        addListenerOnce: mockAddListenerOnce,
      },
    },
  };
});

afterEach(() => {
  delete (window as any).google;
  delete (window as any).location;
});

describe('GoogleMap', () => {
  it('renders map container', () => {
    const { container } = render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('initialises Google Maps when center provided', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    expect((window as any).google.maps.Map).toHaveBeenCalled();
  });

  it('creates markers using Google Maps API', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    expect((window as any).google.maps.Marker).toHaveBeenCalledTimes(mockMarkers.length);
  });

  it('uses provided zoom level', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} zoom={8} />);
    const call = (window as any).google.maps.Map.mock.calls[0][1];
    expect(call.zoom).toBe(8);
  });

  it('uses default zoom level when not provided', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    const call = (window as any).google.maps.Map.mock.calls[0][1];
    expect(call.zoom).toBe(12);
  });

  it('does not create map when center is null', () => {
    render(<GoogleMap markers={mockMarkers} center={null} />);
    expect((window as any).google.maps.Map).not.toHaveBeenCalled();
  });

  it('creates InfoWindow for each marker', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    expect((window as any).google.maps.InfoWindow).toHaveBeenCalledTimes(mockMarkers.length);
  });

  it('adds click listeners to markers', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    expect(mockAddListener).toHaveBeenCalledTimes(mockMarkers.length);
    expect(mockAddListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('handles marker click and opens InfoWindow', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    
    // Get the click handler for the first marker
    const clickHandler = mockAddListener.mock.calls[0][1];
    
    // Simulate marker click
    clickHandler();
    
    expect(mockInfoWindowOpen).toHaveBeenCalled();
    expect(mockAddListenerOnce).toHaveBeenCalledWith(expect.any(Object), 'domready', expect.any(Function));
  });

  it('closes existing InfoWindow before opening new one', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    
    // Simulate first marker click
    const firstClickHandler = mockAddListener.mock.calls[0][1];
    firstClickHandler();
    
    // Simulate second marker click
    const secondClickHandler = mockAddListener.mock.calls[1][1];
    secondClickHandler();
    
    expect(mockInfoWindowClose).toHaveBeenCalled();
  });

  it('handles missing organisation and service data gracefully', () => {
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

  it('clears existing markers when new markers are provided', () => {
    const { rerender } = render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    
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
    
    // Should call setMap(null) for each old marker to clear them
    expect(mockSetMap).toHaveBeenCalledWith(null);
  });

  it('handles empty markers array', () => {
    render(<GoogleMap markers={[]} center={mockCenter} />);
    expect((window as any).google.maps.Marker).not.toHaveBeenCalled();
  });

  it('sets correct marker properties including custom icon', () => {
    render(<GoogleMap markers={mockMarkers} center={mockCenter} />);
    
    // Check first marker (no custom icon)
    expect((window as any).google.maps.Marker).toHaveBeenCalledWith({
      position: { lat: 53.1, lng: -0.5 },
      map: expect.any(Object),
      title: 'Test Pin 1',
      icon: undefined
    });
    
    // Check second marker (with custom icon)
    expect((window as any).google.maps.Marker).toHaveBeenCalledWith({
      position: { lat: 53.2, lng: -0.6 },
      map: expect.any(Object),
      title: 'Test Pin 2',
      icon: 'http://example.com/icon.png'
    });
  });
});
