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

// Mock next/dynamic to return the mocked GoogleMap directly
jest.mock('next/dynamic', () => (fn: any, options?: any) => {
  // Return the mocked GoogleMap component directly
  return (props: any) => {
    (globalThis as any).mapProps = props;
    return <div data-testid="mock-map">MockMap</div>;
  };
});

beforeEach(() => {
  // Clear any previous map props
  delete (globalThis as any).mapProps;
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
    
    // Debug: Check if the mock map was rendered
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    
    // Check if mapProps was set by the mock
    expect((globalThis as any).mapProps).toBeDefined();
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
    expect(markers[0].id).toBe('org-addr-0');
    expect(markers[1].id).toBe('org-addr-1');
  });

  describe('Service locations', () => {
    it('prefers service locations over organisation addresses', () => {
      const orgWithServices = {
        ...baseOrg,
        services: [
          {
            id: 'service-1',
            name: 'Test Service',
            category: 'meals',
            subCategory: 'breakfast',
            address: {
              Street: '789 Service St',
              City: 'Service City',
              Postcode: 'SV1 1CE',
              Location: { coordinates: [-2.1, 53.1] }
            }
          }
        ],
        addresses: [
          {
            Key: { $binary: { base64: 'addr-org' } },
            Location: { coordinates: [-2, 53] },
            Street: '123 Org St',
            City: 'Org City',
            Postcode: 'OR1 1G',
          }
        ]
      };

      render(<OrganisationLocations organisation={orgWithServices as OrganisationDetails} />);
      
      const markers = (globalThis as any).mapProps.markers;
      // Should only show service location, not organisation address
      expect(markers).toHaveLength(1);
      expect(markers[0].title).toBe('789 Service St, Service City, SV1 1CE');
      expect(markers[0].type).toBe('service');
    });

    it('falls back to organisation addresses when no service locations', () => {
      const orgWithoutServiceLocations = {
        ...baseOrg,
        services: [
          {
            id: 'service-1',
            name: 'Test Service',
            category: 'meals',
            subCategory: 'breakfast',
            // No address field
          }
        ]
      };

      render(<OrganisationLocations organisation={orgWithoutServiceLocations as OrganisationDetails} />);
      
      const markers = (globalThis as any).mapProps.markers;
      expect(markers).toHaveLength(1);
      expect(markers[0].type).toBe('organisation');
    });

    it('deduplicates service locations with same coordinates', () => {
      const orgWithDuplicateServices = {
        ...baseOrg,
        services: [
          {
            id: 'service-1',
            name: 'Morning Service',
            category: 'meals',
            subCategory: 'breakfast',
            address: {
              Street: '789 Service St',
              City: 'Service City',
              Postcode: 'SV1 1CE',
              Location: { coordinates: [-2.1, 53.1] }
            }
          },
          {
            id: 'service-2',
            name: 'Evening Service',
            category: 'meals',
            subCategory: 'dinner',
            address: {
              Street: '789 Service St',
              City: 'Service City',
              Postcode: 'SV1 1CE',
              Location: { coordinates: [-2.1, 53.1] } // Same coordinates
            }
          }
        ]
      };

      render(<OrganisationLocations organisation={orgWithDuplicateServices as OrganisationDetails} />);
      
      const markers = (globalThis as any).mapProps.markers;
      // Should only show one marker despite two services at same location
      expect(markers).toHaveLength(1);
      expect(markers[0].lat).toBe(53.1);
      expect(markers[0].lng).toBe(-2.1);
    });
  });

  describe('User context integration', () => {
    const userContext = {
      lat: 53.0,
      lng: -2.0,
      radius: 10,
      location: 'Manchester'
    };

    it('includes user location marker when user context provided', () => {
      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} userContext={userContext} />);
      
      const markers = (globalThis as any).mapProps.markers;
      const userMarker = markers.find((m: any) => m.id === 'user-location');
      
      expect(userMarker).toBeDefined();
      expect(userMarker.lat).toBe(53.0);
      expect(userMarker.lng).toBe(-2.0);
      expect(userMarker.title).toBe('You are here');
      expect(userMarker.type).toBe('user');
    });

    it('uses user location as map center when available', () => {
      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} userContext={userContext} />);
      
      const mapProps = (globalThis as any).mapProps;
      expect(mapProps.center).toEqual({ lat: 53.0, lng: -2.0 });
    });

    it('filters locations by radius when user context has radius', () => {
      const orgWithDistantLocation = {
        ...baseOrg,
        addresses: [
          {
            Key: { $binary: { base64: 'addr-nearby' } },
            Location: { coordinates: [-2.01, 53.01] }, // Very close
            Street: '123 Nearby St',
            City: 'Nearby City',
            Postcode: 'NB1 1Y',
          },
          {
            Key: { $binary: { base64: 'addr-distant' } },
            Location: { coordinates: [-5, 55] }, // Very far (Scotland)
            Street: '456 Distant St',
            City: 'Distant City',
            Postcode: 'DI1 1ST',
          }
        ]
      };

      render(
        <OrganisationLocations 
          organisation={orgWithDistantLocation as OrganisationDetails} 
          userContext={userContext} 
        />
      );
      
      const markers = (globalThis as any).mapProps.markers;
      const orgMarkers = markers.filter((m: any) => m.type === 'organisation');
      
      // Should only include nearby location within radius
      expect(orgMarkers).toHaveLength(1);
      expect(orgMarkers[0].id).toBe('addr-nearby');
    });

    it('sets correct userLocation prop on GoogleMap', () => {
      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} userContext={userContext} />);
      
      const mapProps = (globalThis as any).mapProps;
      expect(mapProps.userLocation).toEqual({
        lat: 53.0,
        lng: -2.0,
        radius: 10
      });
    });

    it('handles user context without radius', () => {
      const userContextNoRadius = {
        lat: 53.0,
        lng: -2.0,
        radius: null,
        location: 'Manchester'
      };

      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} userContext={userContextNoRadius} />);
      
      const mapProps = (globalThis as any).mapProps;
      expect(mapProps.userLocation).toEqual({
        lat: 53.0,
        lng: -2.0,
        radius: undefined
      });
    });
  });

  describe('Selected location highlighting', () => {
    it('marks locations as selected based on selectedLocationForService prop', () => {
      const orgWithServices = {
        ...baseOrg,
        services: [
          {
            id: 'service-1',
            name: 'Test Service',
            category: 'meals',
            subCategory: 'breakfast',
            address: {
              Street: '789 Service St',
              City: 'Service City',
              Postcode: 'SV1 1CE',
              Location: { coordinates: [-2.1, 53.1] }
            }
          }
        ]
      };

      const selectedLocationForService = {
        'meals-breakfast': 0 // Select first location for this service category
      };

      render(
        <OrganisationLocations 
          organisation={orgWithServices as OrganisationDetails} 
          selectedLocationForService={selectedLocationForService}
        />
      );
      
      const markers = (globalThis as any).mapProps.markers;
      expect(markers[0].isSelected).toBe(true);
    });
  });

  describe('Location count display', () => {
    it('shows correct singular location count', () => {
      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} />);
      
      expect(screen.getByText('1 location available for this organisation')).toBeInTheDocument();
    });

    it('shows correct plural location count', () => {
      const orgWithMultipleLocations = {
        ...baseOrg,
        addresses: [
          ...baseOrg.addresses as any[],
          {
            Key: { $binary: { base64: 'addr-2' } },
            Location: { coordinates: [-1.5, 52.5] },
            Street: '456 Second St',
            City: 'Second City',
            Postcode: 'SC1 1ND',
          }
        ]
      };

      render(<OrganisationLocations organisation={orgWithMultipleLocations as OrganisationDetails} />);
      
      expect(screen.getByText('2 locations available for this organisation')).toBeInTheDocument();
    });

    it('excludes user location from organisation count', () => {
      const userContext = {
        lat: 53.0,
        lng: -2.0,
        radius: 10,
        location: 'Manchester'
      };

      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} userContext={userContext} />);
      
      // Should still show "1 location" even though there are 2 markers (org + user)
      expect(screen.getByText('1 location available for this organisation')).toBeInTheDocument();
    });
  });

  describe('Event handlers', () => {
    it('passes onMarkerClick handler to GoogleMap', () => {
      const onMarkerClick = jest.fn();
      
      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} onMarkerClick={onMarkerClick} />);
      
      const mapProps = (globalThis as any).mapProps;
      expect(mapProps.onMarkerClick).toBe(onMarkerClick);
    });

    it('passes onMapReady handler to GoogleMap', () => {
      const onMapReady = jest.fn();
      
      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} onMapReady={onMapReady} />);
      
      const mapProps = (globalThis as any).mapProps;
      expect(mapProps.onMapReady).toBe(onMapReady);
    });
  });

  describe('Map configuration', () => {
    it('sets correct map configuration props', () => {
      render(<OrganisationLocations organisation={baseOrg as OrganisationDetails} />);
      
      const mapProps = (globalThis as any).mapProps;
      expect(mapProps.zoom).toBe(14);
      expect(mapProps.autoFitBounds).toBe(true);
      expect(mapProps.maxZoom).toBe(16);
      expect(mapProps.minZoom).toBe(12);
      expect(mapProps.includeUserInBounds).toBe(true);
    });
  });
});
