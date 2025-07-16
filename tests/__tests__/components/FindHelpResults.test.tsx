import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';
import { LocationProvider, LocationContext, type LocationState } from '@/contexts/LocationContext';
import { FilterContextProvider } from '@/contexts/FilterContext';
import { act as reactAct } from 'react';
import type { ServiceWithDistance } from '@/types';

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

const mockServices: ServiceWithDistance[] = [
  {
    id: '1',
    name: 'Beta Service',
    category: 'health',
    subCategory: 'gp',
    description: 'Test service description',
    latitude: 0.01,
    longitude: 0.01,
    clientGroups: [],
    openTimes: [],
    organisation: {
      name: 'Test Organisation',
      slug: 'test-org',
      isVerified: true,
    },
    organisationSlug: 'test-org',
    distance: 1.5,
  },
  {
    id: '2',
    name: 'Alpha Service',
    category: 'health',
    subCategory: 'gp',
    description: 'Another test service',
    latitude: 0,
    longitude: 0,
    clientGroups: [],
    openTimes: [],
    organisation: {
      name: 'Another Organisation',
      slug: 'another-org',
      isVerified: false,
    },
    organisationSlug: 'another-org',
    distance: 0.5,
  },
];

describe('FindHelpResults', () => {
  beforeEach(() => {
    (globalThis as any).capturedFilterChange = undefined;
  });

  it('renders services with pre-calculated distances', async () => {
    renderWithProviders(<FindHelpResults services={mockServices} />);

    await waitFor(() => {
      expect(screen.getByText(/Services near you/i)).toBeInTheDocument();
    });

    // Check that services are rendered with their distances
    expect(screen.getByText('Beta Service')).toBeInTheDocument();
    expect(screen.getByText('Alpha Service')).toBeInTheDocument();
    expect(screen.getByText('Approx. 1.5 km away')).toBeInTheDocument();
    expect(screen.getByText('Approx. 0.5 km away')).toBeInTheDocument();
  });

  it('toggles map view when "Show map" is clicked', async () => {
    renderWithProviders(<FindHelpResults services={mockServices} />);
    const button = screen.getByRole('button', { name: /show map/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByText(/Hide map/i)).toBeInTheDocument();
  });

  it('renders "No services found" message when no services provided', async () => {
    renderWithProviders(<FindHelpResults services={[]} />);
    await waitFor(() => {
      expect(screen.getByText(/No services found matching your criteria/i)).toBeInTheDocument();
    });
  });

  it('sorts services alphabetically when selected', async () => {
    renderWithProviders(
      <FindHelpResults services={mockServices} />,
      { lat: 0, lng: 0 }
    );

    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: 'alpha' } });

    // Use a reliable heading role, assuming ServiceCard uses <h2> for name
    const headings = screen.getAllByRole('heading', { level: 2 });

    expect(headings[0]).toHaveTextContent('Alpha Service');
    expect(headings[1]).toHaveTextContent('Beta Service');
  });

  it('sorts services by distance by default', async () => {
    renderWithProviders(
      <FindHelpResults services={mockServices} />,
      { lat: 0, lng: 0 }
    );

    // Services should be sorted by distance (Alpha Service: 0.5km, Beta Service: 1.5km)
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings[0]).toHaveTextContent('Alpha Service');
    expect(headings[1]).toHaveTextContent('Beta Service');
  });

  it('passes user location marker to GoogleMap', async () => {
    renderWithProviders(<FindHelpResults services={mockServices} />, { lat: 0, lng: 0 });

    fireEvent.click(screen.getByRole('button', { name: /show map/i }));

    const markers = (globalThis as any).googleMapProps.markers;
    expect(markers[0].id).toBe('user-location');
    expect(markers).toHaveLength(3); // 2 services + 1 user location
  });

  it('displays loading state when loading prop is true', async () => {
    renderWithProviders(<FindHelpResults services={[]} loading={true} />);
    
    expect(screen.getByText('Loading services...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // spinner
  });

  it('displays error state when error prop is provided', async () => {
    const errorMessage = 'Failed to load services';
    renderWithProviders(<FindHelpResults services={[]} error={errorMessage} />);
    
    expect(screen.getByText('Error loading services')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('filters services by category', async () => {
    const servicesWithDifferentCategories = [
      ...mockServices,
      {
        id: '3',
        name: 'Housing Service',
        category: 'housing',
        subCategory: 'emergency',
        description: 'Housing help',
        latitude: 0.02,
        longitude: 0.02,
        clientGroups: [],
        openTimes: [],
        organisation: {
          name: 'Housing Org',
          slug: 'housing-org',
          isVerified: true,
        },
        organisationSlug: 'housing-org',
        distance: 2.0,
      },
    ];

    renderWithProviders(<FindHelpResults services={servicesWithDifferentCategories} />);

    await waitFor(() => {
      expect(typeof (globalThis as any).capturedFilterChange).toBe('function');
    });

    const capturedFilterChange = (globalThis as any).capturedFilterChange;

    // Filter by health category
    reactAct(() => {
      capturedFilterChange({
        category: 'health',
        subCategory: '',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Beta Service')).toBeInTheDocument();
      expect(screen.getByText('Alpha Service')).toBeInTheDocument();
      expect(screen.queryByText('Housing Service')).not.toBeInTheDocument();
    });
  });

  it('filters services by subcategory', async () => {
    const servicesWithDifferentSubCategories = [
      ...mockServices,
      {
        id: '3',
        name: 'Specialist Service',
        category: 'health',
        subCategory: 'specialist',
        description: 'Specialist help',
        latitude: 0.02,
        longitude: 0.02,
        clientGroups: [],
        openTimes: [],
        organisation: {
          name: 'Specialist Org',
          slug: 'specialist-org',
          isVerified: true,
        },
        organisationSlug: 'specialist-org',
        distance: 2.0,
      },
    ];

    renderWithProviders(<FindHelpResults services={servicesWithDifferentSubCategories} />);

    await waitFor(() => {
      expect(typeof (globalThis as any).capturedFilterChange).toBe('function');
    });

    const capturedFilterChange = (globalThis as any).capturedFilterChange;

    // Filter by gp subcategory
    reactAct(() => {
      capturedFilterChange({
        category: '',
        subCategory: 'gp',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Beta Service')).toBeInTheDocument();
      expect(screen.getByText('Alpha Service')).toBeInTheDocument();
      expect(screen.queryByText('Specialist Service')).not.toBeInTheDocument();
    });
  });
});
