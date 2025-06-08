import { render } from '@testing-library/react';
import GoogleMap from '@/components/MapComponent/GoogleMap';

type Marker = { id: string; lat: number; lng: number; title: string; icon?: string };

const mockMarkers: Marker[] = [
  { id: '1', lat: 53.1, lng: -0.5, title: 'Test Pin 1' },
  { id: '2', lat: 53.2, lng: -0.6, title: 'Test Pin 2', icon: 'http://example.com/icon.png' },
];

const mockCenter = { lat: 53.1, lng: -0.5 };

beforeEach(() => {
  (window as any).google = {
    maps: {
      Map: jest.fn().mockImplementation(function () {}),
      Marker: jest.fn().mockImplementation(function () {
        this.setMap = jest.fn();
        this.addListener = jest.fn();
      }),
      InfoWindow: jest.fn().mockImplementation(function () {
        this.open = jest.fn();
        this.close = jest.fn();
      }),
    },
  };
});

afterEach(() => {
  delete (window as any).google;
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
});
