import { render, screen } from '@testing-library/react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';

jest.mock('@/components/MapComponent/GoogleMap', () => (props: any) => {
  (globalThis as any).mapProps = props;
  return <div data-testid="map" />;
});

jest.mock('@/components/FindHelp/ServiceCard', () => (props: any) => (
  <div data-testid="service-card">{props.service.name}</div>
));

const org = {
  id: '1',
  name: 'Test Org',
  slug: 'test-org',
  latitude: 53,
  longitude: -2,
  services: [
    { id: 's1', name: 'A', category: 'cat1', subCategory: 'sub', description: '' },
    { id: 's2', name: 'B', category: 'cat2', subCategory: 'sub', description: '' },
  ],
  groupedServices: {
    cat1: [{ id: 's1', name: 'A', category: 'cat1', subCategory: 'sub', description: '' }],
    cat2: [{ id: 's2', name: 'B', category: 'cat2', subCategory: 'sub', description: '' }],
  },
};

describe('OrganisationPage components', () => {
  it('renders organisation overview with categories', () => {
    render(<OrganisationOverview organisation={org} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Org');
    expect(screen.getByText('cat1')).toBeInTheDocument();
    expect(screen.getByText('cat2')).toBeInTheDocument();
  });

  it('renders map when location available', () => {
    render(<OrganisationLocations organisation={org} />);
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect((globalThis as any).mapProps.center).toEqual({ lat: 53, lng: -2 });
  });

  it('returns null when no location data', () => {
    const { container } = render(
      <OrganisationLocations organisation={{ ...org, latitude: undefined }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders services accordion with categories', () => {
    render(<OrganisationServicesAccordion organisation={org} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('renders contact block and footer', () => {
    render(
      <>
        <OrganisationContactBlock organisation={org} />
        <OrganisationFooter />
      </>
    );
    expect(screen.getByText(/We do not currently have public contact details/i)).toBeInTheDocument();
    expect(screen.getByText(/Information provided by Street Support/)).toBeInTheDocument();
  });
});
