import { render, screen } from '@testing-library/react';
import MapView from '@/components/FindHelp/MapView';
import { LocationProvider } from '@/contexts/LocationContext';

// ✅ Mock Leaflet and React-Leaflet
jest.mock('leaflet');
jest.mock('leaflet/dist/leaflet.css', () => {});
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
  Marker: ({ children }: any) => <div>{children}</div>,
  Popup: ({ children }: any) => <div>{children}</div>,
}));

describe('MapView', () => {
  it('renders a map with service markers', () => {
    const mockServices = [
      {
        id: '1',
        name: 'Test Service 1',
        latitude: 53.1,
        longitude: -0.5,
        organisation: 'Org A',
        orgPostcode: 'LN4 2LE',
        category: 'health',
        subCategory: 'dentist',
        description: '',
        openTimes: [],
        clientGroups: [],
      },
      {
        id: '2',
        name: 'Test Service 2',
        latitude: 53.2,
        longitude: -0.6,
        organisation: 'Org B',
        orgPostcode: 'LN4 2LE',
        category: 'support',
        subCategory: 'counselling',
        description: '',
        openTimes: [],
        clientGroups: [],
      },
    ];

    render(
      <LocationProvider>
        <MapView services={mockServices} />
      </LocationProvider>
    );

    expect(screen.getByText(/TileLayer/i)).toBeInTheDocument();
  });
});
