import { render, screen, fireEvent } from '@testing-library/react';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import type { OrganisationDetails } from '@/utils/organisation';
import type { FlattenedService } from '@/types';

// Define the Address interface to match the one in the component
interface Address {
  Street?: string;
  Street1?: string;
  Street2?: string;
  Street3?: string;
  City?: string;
  Postcode?: string;
  Location?: {
    coordinates: [number, number];
  };
}

// Define the extended service type with address
interface FlattenedServiceWithAddress extends FlattenedService {
  address?: Address;
}

// Define a type for the groupedServices that includes the address property
type GroupedServicesWithAddress = Record<string, Record<string, FlattenedServiceWithAddress[]>>;

// Mock the Accordion component with the correct props
jest.mock('@/components/ui/Accordion', () => {
  return {
    __esModule: true,
    default: ({ 
      title, 
      children, 
      className, 
      isOpen, 
      onToggle 
    }: {
      title: string;
      children: React.ReactNode;
      className?: string;
      isOpen: boolean;
      onToggle: () => void;
    }) => (
      <div data-testid="accordion" data-title={title} className={className} data-isopen={isOpen.toString()}>
        <button onClick={onToggle} data-testid="accordion-toggle">Toggle {title}</button>
        {isOpen && <div data-testid="accordion-content">{children}</div>}
      </div>
    )
  };
});

describe('OrganisationServicesAccordion', () => {
  it('returns null when no services', () => {
    const { container } = render(
      <OrganisationServicesAccordion organisation={{ groupedServices: {}, key: '', name: '', addresses: [], services: [] }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders grouped services inside accordions', () => {
    // Create mock data that matches the expected structure
    const mockServices: FlattenedService[] = [
      {
        id: 'a',
        name: 'Training Skills',
        category: 'training',
        subCategory: 'skills',
        organisation: 'Test Org',
        organisationSlug: 'test-org',
        description: 'Training description',
        openTimes: [],
        clientGroups: ['adults'],
        latitude: 53,
        longitude: -2,
      },
      {
        id: 'b',
        name: 'Job Search',
        category: 'employment',
        subCategory: 'jobs',
        organisation: 'Test Org',
        organisationSlug: 'test-org',
        description: 'Job search description',
        openTimes: [],
        clientGroups: ['adults'],
        latitude: 53.1,
        longitude: -2.1,
      }
    ];

    // Create grouped services structure with the extended type
    const groupedServices: GroupedServicesWithAddress = {
      training: {
        skills: [
          {
            ...mockServices[0],
            address: {
              Street: '123 High St',
              City: 'Test City',
              Postcode: 'TE1 1ST',
              Location: { coordinates: [-2, 53] },
            }
          }
        ]
      },
      employment: {
        jobs: [
          {
            ...mockServices[1],
            address: {
              Street: '456 Job St',
              City: 'Test City',
              Postcode: 'TE2 2ST',
              Location: { coordinates: [-2.1, 53.1] },
            }
          }
        ]
      }
    };

    // Create a modified OrganisationDetails type that includes our extended groupedServices
    type TestOrganisationDetails = Omit<OrganisationDetails, 'groupedServices'> & {
      groupedServices: GroupedServicesWithAddress;
    };

    const org: TestOrganisationDetails = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services: mockServices,
      groupedServices
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);
    
    // Check that the section title is rendered
    expect(screen.getByText('Services')).toBeInTheDocument();
    
    // Check that the parent category headings are rendered
    expect(screen.getByText('training')).toBeInTheDocument();
    expect(screen.getByText('employment')).toBeInTheDocument();
    
    // Check that the accordions are rendered with the correct titles
    const accordions = screen.getAllByTestId('accordion');
    expect(accordions).toHaveLength(2);
    expect(accordions[0]).toHaveAttribute('data-title', 'skills');
    expect(accordions[1]).toHaveAttribute('data-title', 'jobs');
    
    // All accordions should be closed initially
    accordions.forEach(acc => {
      expect(acc).toHaveAttribute('data-isopen', 'false');
    });
    
    // Test opening an accordion
    const toggleButtons = screen.getAllByTestId('accordion-toggle');
    fireEvent.click(toggleButtons[0]);
    
    // Now the first accordion should be open
    expect(accordions[0]).toHaveAttribute('data-isopen', 'true');
    expect(accordions[1]).toHaveAttribute('data-isopen', 'false');
    
    // Check that the content is displayed when accordion is open
    expect(screen.getByText('Training description')).toBeInTheDocument();
    
    // Test opening another accordion (should close the first one)
    fireEvent.click(toggleButtons[1]);
    
    // Now the second accordion should be open and the first closed
    expect(accordions[0]).toHaveAttribute('data-isopen', 'false');
    expect(accordions[1]).toHaveAttribute('data-isopen', 'true');
  });

  it('renders service with opening times correctly', () => {
    // Create service with opening times
    const serviceWithOpenTimes: FlattenedServiceWithAddress = {
      id: 'c',
      name: 'Counseling',
      category: 'health',
      subCategory: 'mental-health',
      organisation: 'Test Org',
      organisationSlug: 'test-org',
      description: 'Counseling services',
      openTimes: [
        { day: 0, start: 900, end: 1700 }, // Monday 9:00-17:00
        { day: 2, start: 1000, end: 1600 }, // Wednesday 10:00-16:00
      ],
      clientGroups: ['adults'],
      latitude: 53.2,
      longitude: -2.2,
      address: {
        Street: '789 Health St',
        City: 'Test City',
        Postcode: 'TE3 3ST',
        Location: { coordinates: [-2.2, 53.2] },
      }
    };

    const groupedServices: GroupedServicesWithAddress = {
      health: {
        'mental-health': [serviceWithOpenTimes]
      }
    };

    // Create a modified OrganisationDetails type that includes our extended groupedServices
    type TestOrganisationDetails = Omit<OrganisationDetails, 'groupedServices'> & {
      groupedServices: GroupedServicesWithAddress;
    };

    const org: TestOrganisationDetails = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services: [],
      groupedServices
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);
    
    // Open the accordion
    const toggleButton = screen.getByTestId('accordion-toggle');
    fireEvent.click(toggleButton);
    
    // Check that opening times are displayed correctly
    expect(screen.getByText('Opening Times:')).toBeInTheDocument();
    expect(screen.getByText('Mon: 09:00 – 17:00')).toBeInTheDocument();
    expect(screen.getByText('Wed: 10:00 – 16:00')).toBeInTheDocument();
  });

  it('renders service with address and map links correctly', () => {
    // Create service with address
    const serviceWithAddress: FlattenedServiceWithAddress = {
      id: 'd',
      name: 'Housing Advice',
      category: 'housing',
      subCategory: 'housing-advice',
      organisation: 'Test Org',
      organisationSlug: 'test-org',
      description: 'Housing advice services',
      openTimes: [],
      clientGroups: ['adults'],
      latitude: 53.3,
      longitude: -2.3,
      address: {
        Street: '101 Housing St',
        Street1: 'Floor 2',
        City: 'Test City',
        Postcode: 'TE4 4ST',
        Location: { coordinates: [-2.3, 53.3] },
      }
    };

    const groupedServices: GroupedServicesWithAddress = {
      housing: {
        'housing-advice': [serviceWithAddress]
      }
    };

    // Create a modified OrganisationDetails type that includes our extended groupedServices
    type TestOrganisationDetails = Omit<OrganisationDetails, 'groupedServices'> & {
      groupedServices: GroupedServicesWithAddress;
    };

    const org: TestOrganisationDetails = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services: [],
      groupedServices
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);
    
    // Open the accordion
    const toggleButton = screen.getByTestId('accordion-toggle');
    fireEvent.click(toggleButton);
    
    // Check that address is displayed correctly
    expect(screen.getByText('Address:')).toBeInTheDocument();
    
    // Check for the map link (we can't check the href directly with the mock)
    const addressText = screen.getByText('101 Housing St, Floor 2, Test City, TE4 4ST');
    expect(addressText).toBeInTheDocument();
  });
});