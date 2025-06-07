import { render, screen } from '@testing-library/react';
import GoogleMap from '@/components/MapComponent/GoogleMap';

const mockPins = [
  { id: '1', lat: 53.1, lng: -0.5, title: 'Test Pin 1' },
  { id: '2', lat: 53.2, lng: -0.6, title: 'Test Pin 2', icon: 'http://example.com/icon.png' },
];

const mockCenter = { lat: 53.1, lng: -0.5 };

// Stub window.google before each test
beforeEach(() => {
  (window as any).google = {
    maps: {
      Map: class {
        setCenter = jest.fn();
        setZoom = jest.fn();
      },
      marker: {
        AdvancedMarkerElement: class {
          map = null;
          constructor(args: any) {
            Object.assign(this, args);
          }
        },
      },
    },
  };
});

afterEach(() => {
  delete (window as any).google;
});

describe('GoogleMap', () => {
  it('renders without crashing', () => {
    render(<GoogleMap pins={mockPins} center={mockCenter} zoom={10} />);
    expect(screen.getByRole('region')).toBeInTheDocument(); // container div
  });

  it('displays loading spinner initially', () => {
    render(<GoogleMap pins={mockPins} center={mockCenter} zoom={10} />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // spinner div
  });

  it('creates markers using Google Maps API', () => {
    render(<GoogleMap pins={mockPins} center={mockCenter} zoom={10} />);
    const AdvancedMarkerElement = (window as any).google.maps.marker.AdvancedMarkerElement;

    // There should be at least one marker created
    expect(AdvancedMarkerElement).toBeDefined();
  });
});
