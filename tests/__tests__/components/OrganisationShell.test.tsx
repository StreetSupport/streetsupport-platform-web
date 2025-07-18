import React from 'react';
import { render, screen } from '@testing-library/react';
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
  return function MockOrganisationLocations({ organisation }: { organisation: OrganisationDetails }) {
    return <div data-testid="organisation-locations">Locations: {organisation.addresses.length}</div>;
  };
});

jest.mock('@/components/OrganisationPage/OrganisationServicesAccordion', () => {
  return function MockOrganisationServicesAccordion({ organisation }: { organisation: OrganisationDetails }) {
    return <div data-testid="organisation-services">Services: {organisation.services.length}</div>;
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
    
    // Check that all components are rendered
    expect(screen.getByTestId('organisation-overview')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-locations')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-services')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-contact')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-footer')).toBeInTheDocument();
    
    // Check that data is passed correctly to components
    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Test Organisation');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 2');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 3');
    expect(screen.getByTestId('organisation-contact')).toHaveTextContent('Contact: contact@example.org');
  });

  it('renders with minimal organisation data', () => {
    // Use the predefined minimal organisation mock
    render(<OrganisationShell organisation={mockMinimalOrganisationDetails} />);
    
    // Check that all components are still rendered
    expect(screen.getByTestId('organisation-overview')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-locations')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-services')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-contact')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-footer')).toBeInTheDocument();
    
    // Check that data reflects the minimal organisation
    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Minimal Organisation');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 0');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 0');
    expect(screen.getByTestId('organisation-contact')).toHaveTextContent('Contact: No email');
  });

  it('renders with custom organisation data', () => {
    // Create a custom organisation with specific properties to test
    const customOrg: OrganisationDetails = {
      ...mockOrganisationDetails,
      name: 'Custom Organisation',
      email: 'custom@example.org',
      addresses: [mockOrganisationDetails.addresses[0]],
      services: [mockOrganisationDetails.services[0]],
    };
    
    render(<OrganisationShell organisation={customOrg} />);
    
    // Check that data reflects the custom organisation
    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Custom Organisation');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 1');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 1');
    expect(screen.getByTestId('organisation-contact')).toHaveTextContent('Contact: custom@example.org');
  });

  it('renders with organisation data missing optional fields', () => {
    // Create an organisation with missing optional fields
    const orgWithMissingFields: OrganisationDetails = {
      ...mockMinimalOrganisationDetails,
      name: 'Organisation With Missing Fields',
      shortDescription: undefined,
      description: undefined,
      website: undefined,
      telephone: undefined,
      addresses: [],
      services: [],
      groupedServices: {},
    };
    
    render(<OrganisationShell organisation={orgWithMissingFields} />);
    
    // Check that all components are still rendered
    expect(screen.getByTestId('organisation-overview')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-locations')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-services')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-contact')).toBeInTheDocument();
    expect(screen.getByTestId('organisation-footer')).toBeInTheDocument();
    
    // Check that data reflects the organisation with missing fields
    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Organisation With Missing Fields');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 0');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 0');
    expect(screen.getByTestId('organisation-contact')).toHaveTextContent('Contact: No email');
  });

  it('renders with organisation having empty arrays for addresses and services', () => {
    // Create an organisation with empty arrays
    const orgWithEmptyArrays: OrganisationDetails = {
      ...mockOrganisationDetails,
      name: 'Organisation With Empty Arrays',
      addresses: [],
      services: [],
      groupedServices: {},
    };
    
    render(<OrganisationShell organisation={orgWithEmptyArrays} />);
    
    // Check that components handle empty arrays correctly
    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Organisation With Empty Arrays');
    expect(screen.getByTestId('organisation-locations')).toHaveTextContent('Locations: 0');
    expect(screen.getByTestId('organisation-services')).toHaveTextContent('Services: 0');
  });

  it('renders with organisation having social media links', () => {
    // Create an organisation with all social media fields
    const orgWithSocialMedia: OrganisationDetails = {
      ...mockOrganisationDetails,
      name: 'Organisation With Social Media',
      facebook: 'social-org',
      twitter: 'social-org',
      instagram: 'social-org',
      bluesky: '@social-org.bsky.social',
    };
    
    render(<OrganisationShell organisation={orgWithSocialMedia} />);
    
    // Check that the organisation name is rendered correctly
    expect(screen.getByTestId('organisation-overview')).toHaveTextContent('Organisation With Social Media');
  });

  it('renders the correct CSS classes for layout', () => {
    const { container } = render(<OrganisationShell organisation={mockOrganisationDetails} />);
    
    // Check that the main container has the correct CSS classes
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('px-4');
    expect(mainElement).toHaveClass('py-6');
    expect(mainElement).toHaveClass('max-w-4xl');
    expect(mainElement).toHaveClass('mx-auto');
  });
});