import { render } from '@testing-library/react';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';

jest.mock('@/components/MapComponent/GoogleMap', () => (props: any) => {
  (globalThis as any).mapProps = props;
  return <div data-testid="map" />;
});

const baseOrg: any = {
  id: '1',
  name: 'Loc Org',
  slug: 'loc-org',
  postcode: '',
  latitude: 53,
  longitude: -2,
  verified: true,
  published: true,
  disabled: false,
};

describe('OrganisationLocations', () => {
  it('returns null when coordinates missing', () => {
    const { container } = render(
      <OrganisationLocations organisation={{ ...baseOrg, latitude: null }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders map with provided coordinates', () => {
    render(<OrganisationLocations organisation={baseOrg} />);
    expect((globalThis as any).mapProps.center).toEqual({ lat: 53, lng: -2 });
    expect((globalThis as any).mapProps.markers[0]).toMatchObject({
      id: '1',
      lat: 53,
      lng: -2,
      title: 'Loc Org',
      organisationSlug: 'loc-org',
    });
  });

  it('uses default slug when none provided', () => {
    render(<OrganisationLocations organisation={{ ...baseOrg, slug: undefined }} />);
    expect((globalThis as any).mapProps.markers[0].organisationSlug).toBe('org-loc-default');
  });
});
