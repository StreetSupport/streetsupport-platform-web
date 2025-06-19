import { render } from '@testing-library/react';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';

jest.mock('@/components/MapComponent/GoogleMap', () => (props: any) => {
  (globalThis as any).mapProps = props;
  return <div data-testid="map" />;
});

const baseOrg: any = {
  id: '1',
  name: 'Loc Org',
  Key: 'loc-org',
  Addresses: [
    {
      Location: {
        coordinates: [-2, 53], // GeoJSON order: [lng, lat]
      },
      Street: '123 High St',
      City: 'Manchester',
      Postcode: 'M1 2AB',
    },
  ],
};

describe('OrganisationLocations', () => {
  it('returns null when no valid addresses', () => {
    const { container } = render(
      <OrganisationLocations organisation={{ ...baseOrg, Addresses: [] }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders map with provided coordinates', () => {
    render(<OrganisationLocations organisation={baseOrg} />);
    expect((globalThis as any).mapProps.center).toEqual({ lat: 53, lng: -2 });
    expect((globalThis as any).mapProps.markers[0]).toMatchObject({
      id: 'addr-0',
      lat: 53,
      lng: -2,
      title: '123 High St, Manchester, M1 2AB',
      organisationSlug: 'loc-org',
    });
  });

  it('uses default slug when none provided', () => {
    render(
      <OrganisationLocations
        organisation={{ ...baseOrg, Key: undefined, slug: undefined }}
      />
    );
    expect((globalThis as any).mapProps.markers[0].organisationSlug).toBe(
      'org-location'
    );
  });
});
