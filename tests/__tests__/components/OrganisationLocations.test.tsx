/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import type { OrganisationDetails } from '@/utils/organisation';

// ✅ Mock GoogleMap to capture props
jest.mock('@/components/MapComponent/GoogleMap', () => (props: any) => {
  (globalThis as any).mapProps = props;
  return <div data-testid="mock-map">MockMap</div>;
});

// Create a more complete mock organization with proper typing
const baseOrg: Partial<OrganisationDetails> = {
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
  name: 'Test Organization',
  services: [],
  groupedServices: {},
};

describe('OrganisationLocations', () => {
  afterEach(() => {
    (globalThis as any).mapProps = undefined;
  });

  it('shows fallback message when no valid addresses', () => {
    render(
      <OrganisationLocations organisation={{ ...baseOrg, addresses: [] } as OrganisationDetails} />
    );

    // It should render <h2> and fallback text
    expect(screen.getByText('Locations')).toBeInTheDocument();
    expect(screen.getByText('No addresses available for this organisation.')).toBeInTheDocument();
  });

  it('renders map with provided coordinates', () => {
    render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} />);
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

    render(<OrganisationLocations organisation={orgNoSlug as OrganisationDetails} />);
    expect((globalThis as any).mapProps.markers[0].organisationSlug).toBe(
      'org-location'
    );
  });

  it('filters out invalid addresses', () => {
    const orgWithInvalidAddresses = {
      ...baseOrg,
      addresses: [
        ...baseOrg.addresses as any[],
        { // Missing coordinates
          Key: { $binary: { base64: 'addr-invalid-1' } },
          Street: 'Invalid Address St',
          City: 'Invalid City',
          Postcode: 'IN1 1VD',
        },
        { // Invalid coordinates format
          Key: { $binary: { base64: 'addr-invalid-2' } },
          Location: { coordinates: ['not-a-number', 'not-a-number'] },
          Street: 'Invalid Coords St',
          City: 'Invalid City',
          Postcode: 'IN1 2VD',
        },
        { // Empty coordinates array
          Key: { $binary: { base64: 'addr-invalid-3' } },
          Location: { coordinates: [] },
          Street: 'Empty Coords St',
          City: 'Invalid City',
          Postcode: 'IN1 3VD',
        },
        { // Valid second address
          Key: { $binary: { base64: 'addr-2' } },
          Location: { coordinates: [-1.5, 52.5] },
          Street: '456 Second St',
          City: 'Secondville',
          Postcode: 'SC1 1ND',
        }
      ]
    };

    render(<OrganisationLocations organisation={orgWithInvalidAddresses as OrganisationDetails} />);
    
    // Should only have 2 valid markers (the original one and the valid second address)
    expect((globalThis as any).mapProps.markers.length).toBe(2);
    
    // Check that the valid markers are included
    const markerIds = (globalThis as any).mapProps.markers.map((m: any) => m.id);
    expect(markerIds).toContain('addr-1');
    expect(markerIds).toContain('addr-2');
    
    // Check that invalid markers are not included
    expect(markerIds).not.toContain('addr-invalid-1');
    expect(markerIds).not.toContain('addr-invalid-2');
    expect(markerIds).not.toContain('addr-invalid-3');
  });

  it('generates marker titles correctly from address fields', () => {
    const orgWithVariousAddresses = {
      ...baseOrg,
      addresses: [
        { // Complete address
          Key: { $binary: { base64: 'addr-complete' } },
          Location: { coordinates: [-2, 53] },
          Street: '123 Complete St',
          City: 'Complete City',
          Postcode: 'CM1 1PL',
        },
        { // Missing city
          Key: { $binary: { base64: 'addr-no-city' } },
          Location: { coordinates: [-1.9, 52.9] },
          Street: '456 No City St',
          Postcode: 'NC1 1TY',
        },
        { // Missing street
          Key: { $binary: { base64: 'addr-no-street' } },
          Location: { coordinates: [-1.8, 52.8] },
          City: 'No Street City',
          Postcode: 'NS1 1TR',
        },
        { // Only postcode
          Key: { $binary: { base64: 'addr-only-postcode' } },
          Location: { coordinates: [-1.7, 52.7] },
          Postcode: 'OP1 1CD',
        }
      ]
    };

    render(<OrganisationLocations organisation={orgWithVariousAddresses as OrganisationDetails} />);
    
    // Check that marker titles are correctly generated
    const markers = (globalThis as any).mapProps.markers;
    
    // Find markers by their IDs
    const completeMarker = markers.find((m: any) => m.id === 'addr-complete');
    const noCityMarker = markers.find((m: any) => m.id === 'addr-no-city');
    const noStreetMarker = markers.find((m: any) => m.id === 'addr-no-street');
    const onlyPostcodeMarker = markers.find((m: any) => m.id === 'addr-only-postcode');
    
    // Check titles
    expect(completeMarker.title).toBe('123 Complete St, Complete City, CM1 1PL');
    expect(noCityMarker.title).toBe('456 No City St, NC1 1TY');
    expect(noStreetMarker.title).toBe('No Street City, NS1 1TR');
    expect(onlyPostcodeMarker.title).toBe('OP1 1CD');
  });

  it('generates fallback IDs when Key is missing', () => {
    const orgWithMissingKeys = {
      ...baseOrg,
      addresses: [
        { // No Key property
          Location: { coordinates: [-2, 53] },
          Street: '123 No Key St',
          City: 'No Key City',
          Postcode: 'NK1 1EY',
        },
        { // Another address with no Key
          Location: { coordinates: [-1.9, 52.9] },
          Street: '456 Also No Key St',
          City: 'No Key City',
          Postcode: 'NK1 2EY',
        }
      ]
    };

    render(<OrganisationLocations organisation={orgWithMissingKeys as OrganisationDetails} />);
    
    // Check that fallback IDs are generated
    const markers = (globalThis as any).mapProps.markers;
    expect(markers[0].id).toBe('addr-0');
    expect(markers[1].id).toBe('addr-1');
  });
});
