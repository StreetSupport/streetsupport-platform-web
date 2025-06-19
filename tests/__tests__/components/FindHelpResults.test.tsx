import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';
import { LocationProvider, LocationContext, type LocationState } from '@/contexts/LocationContext';
import { FilterContextProvider } from '@/contexts/FilterContext';
import { act as reactAct } from 'react';

// ✅ Use the manual mock located in __mocks__
jest.mock('@/components/FindHelp/FilterPanel', () =>
  require('../../__mocks__/FilterPanel.tsx')
);

jest.mock('@/components/MapComponent/GoogleMap', () => (props: any) => {
  (globalThis as any).googleMapProps = props;
  return <div data-testid="google-map" />;
});

function renderWithProviders(
  ui: React.ReactElement,
  location: LocationState | null = null
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <LocationContext.Provider
      value={{ location, setLocation: jest.fn(), requestLocation: jest.fn() }}
    >
      <FilterContextProvider>{children}</FilterContextProvider>
    </LocationContext.Provider>
  );
  return render(<Wrapper>{ui}</Wrapper>);
}

describe('FindHelpResults', () => {
  beforeEach(() => {
    (globalThis as any).capturedFilterChange = undefined;
  });

  it('renders filtered service based on location', async () => {
    renderWithProviders(<FindHelpResults />);

    await waitFor(() => {
      expect(typeof (globalThis as any).capturedFilterChange).toBe('function');
    });

    const capturedFilterChange = (globalThis as any).capturedFilterChange;

    reactAct(() => {
      capturedFilterChange({
        category: 'health',
        subCategory: 'gp',
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Services near you/i)).toBeInTheDocument();
    });
  });

  it('toggles map view when "Show map" is clicked', async () => {
    renderWithProviders(<FindHelpResults />);
    const button = screen.getByRole('button', { name: /show map/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByText(/Hide map/i)).toBeInTheDocument();
  });

  it('renders "No services found" if location has no match', async () => {
    renderWithProviders(<FindHelpResults />);
    await waitFor(() => {
      expect(screen.getByText(/No services found within/i)).toBeInTheDocument();
    });
  });

  it('sorts services alphabetically when selected', async () => {
    const services = [
      {
        id: '1',
        name: 'Beta Service',
        category: 'health',
        subCategory: 'gp',
        description: '',
        latitude: 0.01,
        longitude: 0.01,
        clientGroups: [],
        openTimes: [],
      },
      {
        id: '2',
        name: 'Alpha Service',
        category: 'health',
        subCategory: 'gp',
        description: '',
        latitude: 0,
        longitude: 0,
        clientGroups: [],
        openTimes: [],
      },
    ];

    renderWithProviders(
      <FindHelpResults services={services as any} />,
      { lat: 0, lng: 0 }
    );

    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: 'alpha' } });

    // Use a reliable heading role, assuming ServiceCard uses <h2> for name
    const headings = screen.getAllByRole('heading', { level: 2 });

    expect(headings[0]).toHaveTextContent('Alpha Service');
    expect(headings[1]).toHaveTextContent('Beta Service');
  });


  it('passes user location marker to GoogleMap', async () => {
    const services = [
      {
        id: '1',
        name: 'Test Service',
        category: 'health',
        subCategory: 'gp',
        description: '',
        latitude: 0,
        longitude: 0,
        clientGroups: [],
        openTimes: [],
      },
    ];

    renderWithProviders(<FindHelpResults services={services as any} />, { lat: 0, lng: 0 });

    fireEvent.click(screen.getByRole('button', { name: /show map/i }));

    const markers = (globalThis as any).googleMapProps.markers;
    expect(markers[0].id).toBe('user-location');
    expect(markers).toHaveLength(2);
  });
});
