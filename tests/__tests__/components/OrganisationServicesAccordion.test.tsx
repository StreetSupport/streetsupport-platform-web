import { render, screen, fireEvent } from '@testing-library/react';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import type { OrganisationDetails } from '@/utils/organisation';
import type { FlattenedService } from '@/types';

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

interface FlattenedServiceWithAddress extends FlattenedService {
  address?: Address;
}

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
      <OrganisationServicesAccordion organisation={{ key: '', name: '', addresses: [], services: [] }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders grouped services inside accordions', () => {
    const services: FlattenedServiceWithAddress[] = [
      {
        id: 'a',
        name: 'Training Skills',
        category: 'training',
        subCategory: 'skills',
        organisation: 'Test Org',
        organisationSlug: 'test-org',
        description: 'Training description',
        openTimes: [],
        latitude: 53,
        longitude: -2,
        address: {
          Street: '123 High St',
          City: 'Test City',
          Postcode: 'TE1 1ST',
          Location: { coordinates: [-2, 53] },
        }
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
        latitude: 53.1,
        longitude: -2.1,
        address: {
          Street: '456 Low St',
          City: 'Test City',
          Postcode: 'TE2 2ST',
          Location: { coordinates: [-2.1, 53.1] },
        }
      }
    ];

    const org = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services,
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);

    expect(screen.getByText('Services')).toBeInTheDocument();

    expect(screen.getByText('training')).toBeInTheDocument();
    expect(screen.getByText('employment')).toBeInTheDocument();

    const accordions = screen.getAllByTestId('accordion');
    expect(accordions).toHaveLength(2);
    expect(accordions[0]).toHaveAttribute('data-title', 'skills');
    expect(accordions[1]).toHaveAttribute('data-title', 'jobs');

    accordions.forEach(acc => {
      expect(acc).toHaveAttribute('data-isopen', 'false');
    });

    const toggleButtons = screen.getAllByTestId('accordion-toggle');
    fireEvent.click(toggleButtons[0]);

    expect(accordions[0]).toHaveAttribute('data-isopen', 'true');
    expect(accordions[1]).toHaveAttribute('data-isopen', 'false');

    expect(screen.getByText('Training description')).toBeInTheDocument();

    fireEvent.click(toggleButtons[1]);

    expect(accordions[0]).toHaveAttribute('data-isopen', 'false');
    expect(accordions[1]).toHaveAttribute('data-isopen', 'true');
  });

  it('handles accordion toggle correctly', () => {
    const services: FlattenedServiceWithAddress[] = [
      {
        id: 'a',
        name: 'Test Service',
        category: 'meals',
        subCategory: 'breakfast',
        organisation: 'Test Org',
        organisationSlug: 'test-org',
        description: 'Test description',
        openTimes: [],
        latitude: 53,
        longitude: -2,
        address: {
          Street: '123 Test St',
          City: 'Test City',
          Postcode: 'TE1 1ST',
          Location: { coordinates: [-2, 53] },
        }
      }
    ];

    const org = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services,
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);

    const accordion = screen.getByTestId('accordion');
    const toggleButton = screen.getByTestId('accordion-toggle');

    expect(accordion).toHaveAttribute('data-isopen', 'false');

    fireEvent.click(toggleButton);
    expect(accordion).toHaveAttribute('data-isopen', 'true');

    fireEvent.click(toggleButton);
    expect(accordion).toHaveAttribute('data-isopen', 'false');
  });

  it('displays service information when accordion is open', () => {
    const services: FlattenedServiceWithAddress[] = [
      {
        id: 'a',
        name: 'Test Service',
        category: 'meals',
        subCategory: 'breakfast',
        organisation: 'Test Org',
        organisationSlug: 'test-org',
        description: 'Detailed service description',
        openTimes: [],
        latitude: 53,
        longitude: -2,
        address: {
          Street: '123 Test St',
          City: 'Test City',
          Postcode: 'TE1 1ST',
          Location: { coordinates: [-2, 53] },
        }
      }
    ];

    const org = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services,
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);

    const toggleButton = screen.getByTestId('accordion-toggle');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Detailed service description')).toBeInTheDocument();
  });

  it('handles multiple categories and subcategories', () => {
    const services: FlattenedServiceWithAddress[] = [
      {
        id: 'a',
        name: 'Morning Meals',
        category: 'meals',
        subCategory: 'breakfast',
        organisation: 'Test Org',
        organisationSlug: 'test-org',
        description: 'Breakfast service',
        openTimes: [],
        latitude: 53,
        longitude: -2,
        address: { Street: '123 Test St' },
      },
      {
        id: 'b',
        name: 'Evening Meals',
        category: 'meals',
        subCategory: 'dinner',
        organisation: 'Test Org',
        organisationSlug: 'test-org',
        description: 'Dinner service',
        openTimes: [],
        latitude: 53.1,
        longitude: -2.1,
        address: { Street: '456 Test St' },
      },
      {
        id: 'c',
        name: 'Night Shelter',
        category: 'accommodation',
        subCategory: 'emergency',
        organisation: 'Test Org',
        organisationSlug: 'test-org',
        description: 'Emergency accommodation',
        openTimes: [],
        latitude: 53.2,
        longitude: -2.2,
        address: { Street: '789 Test St' },
      }
    ];

    const org = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services,
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);

    expect(screen.getByText('meals')).toBeInTheDocument();
    expect(screen.getByText('accommodation')).toBeInTheDocument();

    expect(screen.getByText((content) => content.includes('breakfast'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('dinner'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('emergency'))).toBeInTheDocument();

    const accordions = screen.getAllByTestId('accordion');
    expect(accordions).toHaveLength(3);
  });

  it('renders service with opening times correctly', () => {
    const serviceWithOpenTimes: FlattenedServiceWithAddress = {
      id: 'c',
      name: 'Counseling',
      category: 'health',
      subCategory: 'mental-health',
      organisation: 'Test Org',
      organisationSlug: 'test-org',
      description: 'Counseling services',
      openTimes: [
        { day: 0, start: 900, end: 1700 },
        { day: 2, start: 1000, end: 1600 },
      ],
      latitude: 53.2,
      longitude: -2.2,
      address: {
        Street: '789 Health St',
        City: 'Test City',
        Postcode: 'TE3 3ST',
        Location: { coordinates: [-2.2, 53.2] },
      }
    };

    const org = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services: [serviceWithOpenTimes],
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);

    const toggleButton = screen.getByTestId('accordion-toggle');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Opening Times:')).toBeInTheDocument();
    expect(screen.getByText('Mon: 09:00 – 17:00')).toBeInTheDocument();
    expect(screen.getByText('Wed: 10:00 – 16:00')).toBeInTheDocument();
  });

  it('renders service with address and map links correctly', () => {
    const serviceWithAddress: FlattenedServiceWithAddress = {
      id: 'd',
      name: 'Housing Advice',
      category: 'housing',
      subCategory: 'housing-advice',
      organisation: 'Test Org',
      organisationSlug: 'test-org',
      description: 'Housing advice services',
      openTimes: [],
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

    const org = {
      key: 'test-org',
      name: 'Test Organisation',
      addresses: [],
      services: [serviceWithAddress],
    };

    render(<OrganisationServicesAccordion organisation={org as OrganisationDetails} />);

    const toggleButton = screen.getByTestId('accordion-toggle');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Address:')).toBeInTheDocument();

    const addressText = screen.getByText('101 Housing St, Test City, TE4 4ST');
    expect(addressText).toBeInTheDocument();
  });
});
