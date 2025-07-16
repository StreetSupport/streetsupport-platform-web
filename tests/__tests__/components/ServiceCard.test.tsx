import { render, screen, fireEvent } from '@testing-library/react';
import ServiceCard from '@/components/FindHelp/ServiceCard';

const mockService = {
  id: 'abc123',
  name: 'Health Help Service',
  category: 'health',
  subCategory: 'dentist',
  description: 'A local service offering dentist under the health category.',
  latitude: 53.4808,
  longitude: -2.2426,
  openTimes: [
    { day: 'Monday', start: '09:00', end: '17:00' },
    { day: 'Wednesday', start: '09:00', end: '17:00' },
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
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders service name and organisation', () => {
    render(<ServiceCard service={mockService} isOpen={false} onToggle={mockOnToggle} />);
    expect(screen.getByText(/Health Help Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Mayer Inc/i)).toBeInTheDocument();
  });

  it('displays description and category tags', () => {
    render(<ServiceCard service={mockService} isOpen={false} onToggle={mockOnToggle} />);
    expect(
      screen.getByText(/A local service offering dentist/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Category: health/i)).toBeInTheDocument();
    expect(screen.getByText(/Subcategory: dentist/i)).toBeInTheDocument();
  });

  it('renders client group tags and opening times', () => {
    render(<ServiceCard service={mockService} isOpen={false} onToggle={mockOnToggle} />);
    expect(screen.getByText('age-18+')).toBeInTheDocument();
    expect(screen.getByText('rough-sleepers')).toBeInTheDocument();
    expect(screen.getByText('Monday: 09:00 – 17:00')).toBeInTheDocument();
    expect(screen.getByText('Wednesday: 09:00 – 17:00')).toBeInTheDocument();
  });

  it('calls onNavigate when service card is clicked', () => {
    render(
      <ServiceCard 
        service={mockService} 
        isOpen={false} 
        onToggle={mockOnToggle} 
        onNavigate={mockOnNavigate}
      />
    );
    
    const serviceLink = screen.getByRole('link', { name: /View details for Health Help Service/i });
    fireEvent.click(serviceLink);
    
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
  });

  it('does not call onNavigate when onNavigate prop is not provided', () => {
    render(<ServiceCard service={mockService} isOpen={false} onToggle={mockOnToggle} />);
    
    const serviceLink = screen.getByRole('link', { name: /View details for Health Help Service/i });
    fireEvent.click(serviceLink);
    
    // Should not throw error when onNavigate is undefined
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it('shows correct link destination based on organisation slug', () => {
    render(<ServiceCard service={mockService} isOpen={false} onToggle={mockOnToggle} />);
    
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

    render(<ServiceCard service={serviceWithoutSlug} isOpen={false} onToggle={mockOnToggle} />);
    
    const serviceLink = screen.getByRole('link', { name: /View details for Health Help Service/i });
    expect(serviceLink).toHaveAttribute('href', '#');
  });

  it('calls onToggle when read more button is clicked', () => {
    const longDescriptionService = {
      ...mockService,
      description: 'A'.repeat(150), // Long description to trigger "Read more" button
    };

    render(<ServiceCard service={longDescriptionService} isOpen={false} onToggle={mockOnToggle} />);
    
    const readMoreButton = screen.getByText('Read more');
    fireEvent.click(readMoreButton);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('shows full description when isOpen is true', () => {
    const longDescriptionService = {
      ...mockService,
      description: 'A'.repeat(150), // Long description
    };

    render(<ServiceCard service={longDescriptionService} isOpen={true} onToggle={mockOnToggle} />);
    
    expect(screen.getByText('Show less')).toBeInTheDocument();
    expect(screen.getByText('A'.repeat(150))).toBeInTheDocument();
  });

  it('shows verified badge for verified organisations', () => {
    render(<ServiceCard service={mockService} isOpen={false} onToggle={mockOnToggle} />);
    
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

    render(<ServiceCard service={unverifiedService} isOpen={false} onToggle={mockOnToggle} />);
    
    expect(screen.queryByTitle('Verified Service')).not.toBeInTheDocument();
  });

  it('prevents navigation when read more button is clicked', () => {
    const longDescriptionService = {
      ...mockService,
      description: 'A'.repeat(150),
    };

    render(
      <ServiceCard 
        service={longDescriptionService} 
        isOpen={false} 
        onToggle={mockOnToggle} 
        onNavigate={mockOnNavigate}
      />
    );
    
    const readMoreButton = screen.getByText('Read more');
    fireEvent.click(readMoreButton);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnNavigate).not.toHaveBeenCalled();
  });
});
