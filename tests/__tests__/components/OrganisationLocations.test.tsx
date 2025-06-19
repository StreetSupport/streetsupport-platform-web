import { render, screen } from '@testing-library/react';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';

// ✅ Mock GoogleMap to capture props
jest.mock('@/components/MapComponent/GoogleMap', () => (props: any) => {
  (globalThis as any).mapProps = props;
  return <div data-testid="mock-map">MockMap</div>;
});

const baseOrg = {
  addresses: [
    {
      Key: { $binary: { base64: 'addr-1' } },
      Location: { coordinates: [-2, 53] },
      Street: '123 Example St',
      City: 'Testville',
      Postcode: 'TS1 1TS',
    },
  ],
  key: 'org-key',
};

describe('OrganisationLocations', () => {
  afterEach(() => {
    (globalThis as any).mapProps = undefined;
  });

  it('shows fallback message when no valid addresses', () => {
    const { container } = render(
      <OrganisationLocations organisation={{ ...baseOrg, addresses: [] }} />
    );

    // It should render <h2> and fallback text
    expect(container).toHaveTextContent('Locations');
    expect(container).toHaveTextContent('No addresses available');
  });

  it('renders map with provided coordinates', () => {
    render(<OrganisationLocations organisation={baseOrg} />);
    expect((globalThis as any).mapProps.center).toEqual({ lat: 53, lng: -2 });
    expect((globalThis as any).mapProps.markers[0]).toMatchObject({
      id: 'addr-1',   // ✅ match your mock!
      lat: 53,
      lng: -2,
    });
  });


  it('uses default slug when none provided', () => {
    const orgNoSlug = {
      ...baseOrg,
      key: undefined,
    };

    render(<OrganisationLocations organisation={orgNoSlug} />);
    expect((globalThis as any).mapProps.markers[0].organisationSlug).toBe(
      'org-location'
    );
  });
});
