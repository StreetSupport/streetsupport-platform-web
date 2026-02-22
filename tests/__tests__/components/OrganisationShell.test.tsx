import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrganisationShell from '@/app/find-help/organisation/[slug]/OrganisationShell';
import { mockOrganisationDetails, mockMinimalOrganisationDetails } from '../../__mocks__/api-responses';
import { OrganisationDetails } from '@/utils/organisation';

// Mock the child components
jest.mock('@/components/OrganisationPage/OrganisationOverview', () => {
  return function MockOrganisationOverview({ organisation }: { organisation: OrganisationDetails }) {
    return <div data-testid="organisation-overview">{organisation.name}</div>;
  };
});

jest.mock('@/components/OrganisationPage/OrganisationLocations', () => {
  return function MockOrganisationLocations({ organisation, onMarkerClick }: {
    organisation: OrganisationDetails;
    onMarkerClick?: (markerId: string) => void;
  }) {
    return (
      <div data-testid="organisation-locations">
        Locations: {organisation.addresses.length}
        {onMarkerClick && (
          <button
            data-testid="marker-click-trigger"
            onClick={() => onMarkerClick('service-loc-0')}
          >
            Trigger Marker Click
          </button>
        )}
      </div>
    );
  };
});

jest.mock('@/components/OrganisationPage/OrganisationServicesAccordion', () => {
  return function MockOrganisationServicesAccordion({
    organisation,
    selectedLocationForService,
    openAccordion,
  }: {
    organisation: OrganisationDetails;
    selectedLocationForService?: Record<string, number>;
    setSelectedLocationForService?: (value: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
    openAccordion?: string | null;
    setOpenAccordion?: (value: string | null) => void;
  }) {
    return (
      <div data-testid="organisation-services">
        Services: {organisation.services.length}
        {openAccordion && <div data-testid="open-accordion">{openAccordion}</div>}
        {selectedLocationForService && Object.keys(selectedLocationForService).length > 0 && (
          <div data-testid="selected-locations">{JSON.stringify(selectedLocationForService)}</div>
        )}
      </div>
    );
  };
});

jest.mock('@/components/OrganisationPage/OrganisationContactBlock', () => {
  return function MockOrganisationContactBlock({ organisation }: { organisation: OrganisationDetails }) {
    return <div data-testid="organisation-contact">Contact: {organisation.email || 'No email'}</div>;
  };
});

jest.mock('@/components/OrganisationPage/OrganisationFooter', () => {
  return function MockOrganisationFooter() {
    return <div data-testid="organisation-footer">Footer</div>;
  };
});

describe('OrganisationShell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all organisation components with correct data', () => {
    render(<OrganisationShell organisation={mockOrganisationDetails} />);

    expect(screen.getByTestId('organisation-overview')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-locations')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-services')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-contact')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-footer')).toBeInTheDocument();

    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Test Organisation');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 2');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 3');
    expect(screen.getByTestId('organisation-contact')).toHaveTextContent('Contact: contact@example.org');
  });

  it('renders with minimal organisation data', () => {
    render(<OrganisationShell organisation={mockMinimalOrganisationDetails} />);

    expect(screen.getByTestId('organisation-overview')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-locations')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-services')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-contact')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-footer')).toBeInTheDocument();

    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Minimal Organisation');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 0');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 0');
    expect(screen.getByTestId('organisation-contact')).toHaveTextContent('Contact: No email');
  });

  it('renders with custom organisation data', () => {
    const customOrg: OrganisationDetails = {
      ...mockOrganisationDetails,
      name: 'Custom Organisation',
      email: 'custom@example.org',
      addresses: [mockOrganisationDetails.addresses[0]],
      services: [mockOrganisationDetails.services[0]],
    };

    render(<OrganisationShell organisation={customOrg} />);

    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Custom Organisation');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 1');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 1');
    expect(screen.getByTestId('organisation-contact')).toHaveTextContent('Contact: custom@example.org');
  });

  it('renders with organisation data missing optional fields', () => {
    const orgWithMissingFields: OrganisationDetails = {
      ...mockMinimalOrganisationDetails,
      name: 'Organisation With Missing Fields',
      shortDescription: undefined,
      description: undefined,
      website: undefined,
      telephone: undefined,
      addresses: [],
      services: [],
    };

    render(<OrganisationShell organisation={orgWithMissingFields} />);

    expect(screen.getByTestId('organisation-overview')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-locations')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-services')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-contact')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-footer')).toBeInTheDocument();

    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Organisation With Missing Fields');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 0');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 0');
    expect(screen.getByTestId('organisation-contact')).toHaveTextContent('Contact: No email');
  });

  it('renders with organisation having empty arrays for addresses and services', () => {
    const orgWithEmptyArrays: OrganisationDetails = {
      ...mockOrganisationDetails,
      name: 'Organisation With Empty Arrays',
      addresses: [],
      services: [],
    };

    render(<OrganisationShell organisation={orgWithEmptyArrays} />);

    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Organisation With Empty Arrays');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 0');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 0');
  });

  it('renders with organisation having social media links', () => {
    const orgWithSocialMedia: OrganisationDetails = {
      ...mockOrganisationDetails,
      name: 'Organisation With Social Media',
      facebook: 'social-org',
      twitter: 'social-org',
      instagram: 'social-org',
      bluesky: '@social-org.bsky.social',
    };

    render(<OrganisationShell organisation={orgWithSocialMedia} />);

    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Organisation With Social Media');
  });

  it('renders the correct CSS classes for layout', () => {
    const { container } = render(<OrganisationShell organisation={mockOrganisationDetails} />);

    const wrapperElement = container.querySelector('.px-4.py-6.max-w-4xl.mx-auto');
    expect(wrapperElement).toHaveClass('px-4');
    expect(wrapperElement).toHaveClass('py-6');
    expect(wrapperElement).toHaveClass('max-w-4xl');
    expect(wrapperElement).toHaveClass('mx-auto');
  });

  it('handles map marker click for service location', () => {
    const orgWithServices: OrganisationDetails = {
      ...mockOrganisationDetails,
      services: [
        {
          id: 'service-1',
          name: 'Test Service',
          category: 'housing',
          subCategory: 'advice',
          organisation: 'Test Org',
          organisationSlug: 'test-org',
          description: 'Test service description',
          openTimes: [],
          latitude: 53.4808,
          longitude: -2.2426,
          address: {
            Street: '123 Test St',
            City: 'Test City',
            Postcode: 'T1 1ES',
            Location: { coordinates: [-2.2426, 53.4808] }
          }
        }
      ]
    };

    render(<OrganisationShell organisation={orgWithServices} />);

    const markerTrigger = screen.getByTestId('marker-click-trigger');
    fireEvent.click(markerTrigger);

    expect(screen.getByTestId('open-accordion')).toHaveTextContent('housing-advice');
  });

  it('handles map marker click with no matching service', () => {
    render(<OrganisationShell organisation={mockOrganisationDetails} />);

    const markerTrigger = screen.getByTestId('marker-click-trigger');
    fireEvent.click(markerTrigger);

    expect(screen.queryByTestId('open-accordion')).not.toBeInTheDocument();
  });

  it('handles map marker click with service but no coordinates', () => {
    const orgWithServiceNoCoords: OrganisationDetails = {
      ...mockOrganisationDetails,
      services: [
        {
          id: 'service-1',
          name: 'Test Service',
          category: 'housing',
          subCategory: 'advice',
          organisation: 'Test Org',
          organisationSlug: 'test-org',
          description: 'Test service description',
          openTimes: [],
          latitude: 53.4808,
          longitude: -2.2426,
          address: {
            Street: '123 Test St',
            City: 'Test City',
            Postcode: 'T1 1ES'
          }
        }
      ]
    };

    render(<OrganisationShell organisation={orgWithServiceNoCoords} />);

    const markerTrigger = screen.getByTestId('marker-click-trigger');
    fireEvent.click(markerTrigger);

    expect(screen.queryByTestId('open-accordion')).not.toBeInTheDocument();
  });
});
