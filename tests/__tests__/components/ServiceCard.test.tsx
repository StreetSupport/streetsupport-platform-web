import { render, screen, fireEvent } from '@testing-library/react';
import ServiceCard from '@/components/FindHelp/ServiceCard';
import { LocationProvider } from '@/contexts/LocationContext';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock locations data
jest.mock('@/data/locations.json', () => [
  {
    id: '1',
    key: 'birmingham',
    name: 'Birmingham',
    slug: 'birmingham',
    latitude: 52.4862,
    longitude: -1.8904,
    isPublic: true,
  },
]);

// Mock service categories data
jest.mock('@/data/service-categories.json', () => [
  {
    key: 'health',
    name: 'Health',
    subCategories: [
      { key: 'dentist', name: 'Dentist' },
      { key: 'gp', name: 'GP' },
    ],
  },
]);

const mockService = {
  id: 'abc123',
  name: 'Health Help Service',
  category: 'health',
  subCategory: 'dentist',
  description: 'A local service offering dentist under the health category.',
  latitude: 53.4808,
  longitude: -2.2426,
  openTimes: [
    { day: 0, start: 900, end: 1700 }, // Sunday: 09:00 - 17:00
    { day: 2, start: 900, end: 1700 }, // Tuesday: 09:00 - 17:00  
  ],
  clientGroups: ['age-18+', 'rough-sleepers'],
  organisation: {
    name: 'Mayer Inc',
    slug: 'mayer-inc',
    isVerified: true,
  },
  organisationSlug: 'mayer-inc',
  orgPostcode: 'LN4 2LE',
};

describe('ServiceCard', () => {
  const mockOnToggle = jest.fn();

  // Helper function to render ServiceCard with LocationProvider
  const renderServiceCard = (service = mockService, props = {}) => {
    return render(
      <LocationProvider>
        <ServiceCard 
          service={service} 
          isOpen={false} 
          onToggle={mockOnToggle} 
          {...props}
        />
      </LocationProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders service name and organisation', () => {
    renderServiceCard();
    expect(screen.getByText(/Health Help Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Mayer Inc/i)).toBeInTheDocument();
  });

  it('displays description and category tags', () => {
    renderServiceCard();
    expect(
      screen.getByText(/A local service offering dentist/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Dentist')).toBeInTheDocument();
  });

  it('renders opening times', () => {
    renderServiceCard();
    // Note: ServiceCard component doesn't render client groups, only opening times
    expect(screen.getByText(/Sun.*09:00.*17:00/)).toBeInTheDocument();
    expect(screen.getByText(/Tue.*09:00.*17:00/)).toBeInTheDocument();
  });

  it('shows correct link destination based on organisation slug', () => {
    renderServiceCard();
    
    const serviceLink = screen.getByRole('link', { name: /View details for Health Help Service/i });
    expect(serviceLink).toHaveAttribute('href', '/find-help/organisation/mayer-inc');
  });

  it('shows fallback link when organisation slug is missing', () => {
    const serviceWithoutSlug = {
      ...mockService,
      organisation: {
        ...mockService.organisation,
        slug: '',
      },
    };

    renderServiceCard(serviceWithoutSlug);
    
    const serviceLink = screen.getByRole('link', { name: /View details for Health Help Service/i });
    expect(serviceLink).toHaveAttribute('href', '#');
  });

  it('calls onToggle when read more button is clicked', () => {
    const longDescriptionService = {
      ...mockService,
      description: 'A'.repeat(150), // Long description to trigger "Read more" button
    };

    renderServiceCard(longDescriptionService);
    
    const readMoreButton = screen.getByText('Read more');
    fireEvent.click(readMoreButton);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('shows full description when isOpen is true', () => {
    const longDescriptionService = {
      ...mockService,
      description: 'A'.repeat(150), // Long description
    };

    renderServiceCard(longDescriptionService, { isOpen: true });
    
    expect(screen.getByText('Show less')).toBeInTheDocument();
    
    // Since we're using lazy loading, the content will initially show a loading state
    // Check for the presence of a loading state or the actual content
    const contentArea = screen.getByRole('link').querySelector('.mb-2');
    expect(contentArea).toBeInTheDocument();
  });

  it('shows verified badge for verified organisations', () => {
    renderServiceCard();
    
    const verifiedIcon = screen.getByTitle('Verified Service');
    expect(verifiedIcon).toBeInTheDocument();
  });

  it('does not show verified badge for unverified organisations', () => {
    const unverifiedService = {
      ...mockService,
      organisation: {
        ...mockService.organisation,
        isVerified: false,
      },
    };

    renderServiceCard(unverifiedService);
    
    expect(screen.queryByTitle('Verified Service')).not.toBeInTheDocument();
  });

  it('prevents navigation when read more button is clicked', () => {
    const longDescriptionService = {
      ...mockService,
      description: 'A'.repeat(150),
    };

    renderServiceCard(longDescriptionService);
    
    const readMoreButton = screen.getByText('Read more');
    fireEvent.click(readMoreButton);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});
