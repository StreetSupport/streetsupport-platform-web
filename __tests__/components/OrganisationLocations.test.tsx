import { render, screen } from '@testing-library/react';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import type { OrganisationDetails } from '@/utils/organisation';

jest.mock('@/components/MapComponent/GoogleMap', () => (props: any) => (
  <div data-testid="google-map">Map</div>
));

const baseOrg: OrganisationDetails = {
  id: '1',
  name: 'Org',
  slug: 'org',
  postcode: '',
  latitude: 53,
  longitude: -1,
  verified: true,
  published: true,
  disabled: false,
  services: [],
  groupedServices: {},
};

describe('OrganisationLocations', () => {
  it('renders map when coordinates provided', () => {
    render(<OrganisationLocations organisation={baseOrg} />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('returns null when no coordinates', () => {
    const org = { ...baseOrg, latitude: undefined } as unknown as OrganisationDetails;
    const { container } = render(<OrganisationLocations organisation={org} />);
    expect(container.firstChild).toBeNull();
  });
});
