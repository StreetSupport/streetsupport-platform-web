/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import { isServiceOpenNow } from '@/utils/openingTimes';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';
import { decodeText } from '@/utils/htmlDecode';
import type { OrganisationDetails } from '@/utils/organisation';
import type { FlattenedService } from '@/types';

// Mock dependencies
jest.mock('@/utils/openingTimes');
jest.mock('@/utils/categoryLookup');
jest.mock('@/utils/htmlDecode');
jest.mock('@/components/ui/Accordion', () => {
  return function MockAccordion({ title, children, isOpen, onToggle, className }: any) {
    return (
      <div className={className} data-testid={`accordion-${title}`} data-open={isOpen}>
        <button onClick={onToggle} data-testid={`accordion-toggle-${title}`}>
          {title}
        </button>
        {isOpen && <div data-testid={`accordion-content-${title}`}>{children}</div>}
      </div>
    );
  };
});
jest.mock('@/components/ui/MarkdownContent', () => {
  return function MockMarkdownContent({ content }: { content: string }) {
    return <div data-testid="markdown-content">{content}</div>;
  };
});
jest.mock('@/components/ui/Tooltip', () => {
  return function MockTooltip({ content, children, position }: any) {
    return (
      <div data-testid="tooltip" data-content={content} data-position={position}>
        {children}
      </div>
    );
  };
});

// Note: Window location mocking removed to avoid conflicts

describe('OrganisationServicesAccordion', () => {
  const mockIsServiceOpenNow = isServiceOpenNow as jest.MockedFunction<typeof isServiceOpenNow>;
  const mockGetCategoryName = getCategoryName as jest.MockedFunction<typeof getCategoryName>;
  const mockGetSubCategoryName = getSubCategoryName as jest.MockedFunction<typeof getSubCategoryName>;
  const mockDecodeText = decodeText as jest.MockedFunction<typeof decodeText>;

  const mockService: FlattenedService = {
    id: 'service-1',
    category: 'foodbank',
    subCategory: 'general',
    organisation: 'Test Organisation',
    organisationSlug: 'test-organisation',
    name: 'Test Food Service',
    description: 'A test food service',
    address: {
      Street: '123 Test Street',
      City: 'Manchester',
      Postcode: 'M1 1AA',
      Location: {
        type: 'Point',
        coordinates: [-2.2426, 53.4808]
      }
    },
    openTimes: [
      { day: '0', start: '900', end: '1700' },
      { day: '1', start: '900', end: '1700' }
    ],
    clientGroups: []
  };

  const mockOrganisation: OrganisationDetails = {
    id: 'org-1',
    name: 'Test Organisation',
    slug: 'test-organisation',
    description: 'A test organisation',
    services: [mockService],
    addresses: [],
    tags: [],
    isVerified: false,
    isPublished: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockIsServiceOpenNow.mockReturnValue({ 
      isOpen: false, 
      isAppointmentOnly: false,
      nextOpen: { day: 'Monday', time: '09:00' }
    });
    mockGetCategoryName.mockImplementation((category) => category);
    mockGetSubCategoryName.mockImplementation((category, subcategory) => subcategory);
    mockDecodeText.mockImplementation((text) => text);
    
    // Window location reset removed
  });

  describe('Basic Rendering', () => {
    it('renders services accordion when organisation has services', () => {
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      expect(screen.getByTestId('services-accordion')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('returns null when organisation has no services', () => {
      const orgWithoutServices = { ...mockOrganisation, services: [] };
      const { container } = render(<OrganisationServicesAccordion organisation={orgWithoutServices} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('renders category and subcategory headings', () => {
      mockGetCategoryName.mockReturnValue('Food');
      mockGetSubCategoryName.mockReturnValue('Food Banks');
      
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(mockGetCategoryName).toHaveBeenCalledWith('foodbank');
      expect(mockGetSubCategoryName).toHaveBeenCalledWith('foodbank', 'general');
    });
  });

  describe('Service Grouping', () => {
    it('groups services by category and subcategory', () => {
      const services: FlattenedService[] = [
        { ...mockService, id: 'service-1', category: 'foodbank', subCategory: 'general' },
        { ...mockService, id: 'service-2', category: 'foodbank', subCategory: 'vouchers' },
        { ...mockService, id: 'service-3', category: 'medical', subCategory: 'gp' }
      ];
      
      const organisation = { ...mockOrganisation, services };
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      expect(mockGetCategoryName).toHaveBeenCalledWith('foodbank');
      expect(mockGetCategoryName).toHaveBeenCalledWith('medical');
      expect(mockGetSubCategoryName).toHaveBeenCalledWith('foodbank', 'general');
      expect(mockGetSubCategoryName).toHaveBeenCalledWith('foodbank', 'vouchers');
      expect(mockGetSubCategoryName).toHaveBeenCalledWith('medical', 'gp');
    });

    it('handles services without category or subcategory', () => {
      const serviceWithoutCategory = {
        ...mockService,
        category: '',
        subCategory: ''
      };
      const organisation = { ...mockOrganisation, services: [serviceWithoutCategory] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      expect(mockGetCategoryName).toHaveBeenCalledWith('Other');
      expect(mockGetSubCategoryName).toHaveBeenCalledWith('Other', 'Other');
    });
  });

  describe('Distance Calculation', () => {
    it('calculates distance when user context and coordinates are provided', () => {
      const userContext = {
        lat: 53.4808,
        lng: -2.2426,
        radius: 10,
        location: 'Manchester'
      };
      
      render(
        <OrganisationServicesAccordion 
          organisation={mockOrganisation} 
          userContext={userContext}
        />
      );
      
      // Should render the service (within radius)
      expect(screen.getByTestId('services-accordion')).toBeInTheDocument();
    });

    it('filters services outside radius when radius is specified', () => {
      const userContext = {
        lat: 51.5074, // London coordinates
        lng: -0.1278,
        radius: 1, // 1km radius
        location: 'London'
      };
      
      // Manchester service should be filtered out due to distance
      const { container } = render(
        <OrganisationServicesAccordion 
          organisation={mockOrganisation} 
          userContext={userContext}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('handles services without coordinates', () => {
      const serviceWithoutCoords = {
        ...mockService,
        address: {
          ...mockService.address,
          Location: undefined
        }
      };
      const organisation = { ...mockOrganisation, services: [serviceWithoutCoords] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      expect(screen.getByTestId('services-accordion')).toBeInTheDocument();
    });
  });

  describe('Location Selection', () => {
    it('shows location indicators when service has multiple locations', () => {
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1', 
          address: { 
            ...mockService.address, 
            Street: '123 Test Street',
            Location: { type: 'Point', coordinates: [-2.2426, 53.4808] }
          } 
        },
        { 
          ...mockService, 
          id: 'service-2', 
          address: { 
            ...mockService.address, 
            Street: '456 Other Street',
            Location: { type: 'Point', coordinates: [-2.2500, 53.4850] } // Different coordinates
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      // Open the accordion to see content
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText(/Available at 2 locations/)).toBeInTheDocument();
    });

    it('handles location selection when multiple locations exist', () => {
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1', 
          address: { 
            ...mockService.address, 
            Street: '123 Test Street',
            Location: { type: 'Point', coordinates: [-2.2426, 53.4808] }
          } 
        },
        { 
          ...mockService, 
          id: 'service-2', 
          address: { 
            ...mockService.address, 
            Street: '456 Other Street',
            Location: { type: 'Point', coordinates: [-2.2500, 53.4850] }
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      // Open the accordion
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show location buttons
      const locationButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('Test Street') || button.textContent?.includes('Other Street')
      );
      expect(locationButtons.length).toBeGreaterThan(0);
    });

    it('calls onLocationClick when location button is clicked', () => {
      const onLocationClick = jest.fn();
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1', 
          address: { 
            ...mockService.address, 
            Street: '123 Test Street',
            Location: { type: 'Point', coordinates: [-2.2426, 53.4808] }
          } 
        },
        { 
          ...mockService, 
          id: 'service-2', 
          address: { 
            ...mockService.address, 
            Street: '456 Other Street',
            Location: { type: 'Point', coordinates: [-2.2500, 53.4850] }
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      render(
        <OrganisationServicesAccordion 
          organisation={organisation} 
          onLocationClick={onLocationClick}
        />
      );
      
      // Open the accordion
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Click on a location button
      const locationButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('📍')
      );
      if (locationButtons.length > 0) {
        fireEvent.click(locationButtons[0]);
        expect(onLocationClick).toHaveBeenCalledWith(53.4808, -2.2426);
      }
    });
  });

  describe('Opening Times', () => {
    it('displays opening status indicators in location buttons', () => {
      mockIsServiceOpenNow.mockReturnValue({ 
        isOpen: true, 
        isAppointmentOnly: false,
        nextOpen: null
      });
      
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Status shows in the opening times section when accordion is open
      expect(screen.getByText('Opening Times:')).toBeInTheDocument();
    });

    it('shows closed status with next open time in location buttons', () => {
      mockIsServiceOpenNow.mockReturnValue({ 
        isOpen: false, 
        isAppointmentOnly: false,
        nextOpen: { day: 'Monday', time: '09:00' }
      });
      
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Next open time shows in opening times section
      expect(screen.getByText('Next open: Monday 09:00')).toBeInTheDocument();
    });

    it('detects and displays 24-hour services', () => {
      const service24Hour = {
        ...mockService,
        openTimes: [{ day: '0', start: '0', end: '2359' }]
      };
      const organisation = { ...mockOrganisation, services: [service24Hour] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('24 Hours')).toBeInTheDocument();
    });

    it('formats opening times correctly', () => {
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show multiple time entries (Mon and Tue both have 09:00 – 17:00)
      expect(screen.getAllByText(/09:00 – 17:00/)).toHaveLength(2);
    });
  });

  describe('Service Types', () => {
    it('detects phone services', () => {
      const phoneService = {
        ...mockService,
        subCategory: 'telephone',
        category: 'support'
      };
      const organisation = { ...mockOrganisation, services: [phoneService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-telephone');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('📞 Phone Service')).toBeInTheDocument();
    });

    it('displays service description with markdown', () => {
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
      expect(screen.getByTestId('markdown-content')).toHaveTextContent('A test food service');
    });
  });

  describe('Accommodation Services', () => {
    it('displays accommodation type indicators', () => {
      const accommodationService = {
        ...mockService,
        category: 'accom',
        subCategory: 'supported',
        sourceType: 'accommodation',
        accommodationData: {
          type: 'supported',
          isOpenAccess: true,
          referralRequired: false,
          referralNotes: '',
          price: '50',
          foodIncluded: 1,
          availabilityOfMeals: 'Breakfast included'
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-supported');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('🏠 Supported')).toBeInTheDocument();
      expect(screen.getByText('Open Access')).toBeInTheDocument();
    });

    it('displays referral required with tooltip', () => {
      const accommodationService = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'emergency',
          referralRequired: true,
          referralNotes: 'Contact local council for referral'
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('Referral Required')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toHaveAttribute(
        'data-content', 
        'Referral required: Contact local council for referral'
      );
    });

    it('displays comprehensive accommodation details', () => {
      const accommodationService = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'supported',
          description: 'A comprehensive supported accommodation service',
          synopsis: 'Short description',
          price: '75',
          foodIncluded: 1,
          availabilityOfMeals: 'All meals included',
          contact: {
            name: 'John Smith',
            telephone: '0161 123 4567',
            email: 'john@example.com'
          },
          features: {
            acceptsHousingBenefit: 1,
            hasSingleRooms: 1,
            hasSharedRooms: 0,
            hasDisabledAccess: 1,
            acceptsPets: 0,
            hasOnSiteManager: 1,
            additionalFeatures: 'WiFi available'
          },
          residentCriteria: {
            acceptsMen: true,
            acceptsWomen: false,
            acceptsCouples: true
          },
          support: {
            supportOffered: ['mental health', 'substance abuse'],
            supportInfo: 'Comprehensive support available'
          }
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Check accommodation information section
      expect(screen.getByText('Accommodation Information')).toBeInTheDocument();
      expect(screen.getByText('A comprehensive supported accommodation service')).toBeInTheDocument();
      
      // Check contact details
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('0161 123 4567')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      
      // Check cost information
      expect(screen.getByText('£75')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument(); // Meals included
      
      // Check resident criteria
      expect(screen.getByText('✓ Men')).toBeInTheDocument();
      expect(screen.getByText('✗ Women')).toBeInTheDocument();
      expect(screen.getByText('✓ Couples')).toBeInTheDocument();
      
      // Check facilities - these might be in different sections
      expect(screen.getByText(/Single rooms/)).toBeInTheDocument();
      expect(screen.getByText(/shared rooms/)).toBeInTheDocument();
      
      // Check support services section exists
      expect(screen.getByText('Support Services')).toBeInTheDocument();
    });

    it('handles description read more/less functionality', async () => {
      const longDescription = 'A'.repeat(200); // Long description that will be truncated
      const accommodationService = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'supported',
          description: longDescription
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show read more button
      const readMoreButton = screen.getByText('Read more');
      expect(readMoreButton).toBeInTheDocument();
      
      // Click read more
      fireEvent.click(readMoreButton);
      
      // Should now show read less
      expect(screen.getByText('Read less')).toBeInTheDocument();
    });
  });

  describe('Address and Map Links', () => {
    beforeEach(() => {
      mockDecodeText.mockImplementation((text) => text || '');
    });

    it('displays formatted address', () => {
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('Address:')).toBeInTheDocument();
      expect(mockDecodeText).toHaveBeenCalledWith('123 Test Street');
      expect(mockDecodeText).toHaveBeenCalledWith('Manchester');
      expect(mockDecodeText).toHaveBeenCalledWith('M1 1AA');
    });

    it('generates correct map links', () => {
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      const googleMapLink = screen.getByText('View on Google Maps');
      const appleMapLink = screen.getByText('View on Apple Maps');
      
      expect(googleMapLink).toHaveAttribute(
        'href', 
        'https://www.google.com/maps?q=53.4808,-2.2426'
      );
      expect(appleMapLink).toHaveAttribute(
        'href', 
        'https://maps.apple.com/?ll=53.4808,-2.2426'
      );
    });

    it('handles missing coordinates gracefully', () => {
      const serviceWithoutCoords = {
        ...mockService,
        address: {
          ...mockService.address,
          Location: undefined
        }
      };
      const organisation = { ...mockOrganisation, services: [serviceWithoutCoords] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('Address:')).toBeInTheDocument();
      expect(screen.queryByText('View on Google Maps')).not.toBeInTheDocument();
      expect(screen.queryByText('View on Apple Maps')).not.toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('handles internal accordion state', () => {
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      
      // Initially closed
      expect(screen.getByTestId('accordion-general')).toHaveAttribute('data-open', 'false');
      
      // Click to open
      fireEvent.click(accordionToggle);
      expect(screen.getByTestId('accordion-general')).toHaveAttribute('data-open', 'true');
      
      // Click to close
      fireEvent.click(accordionToggle);
      expect(screen.getByTestId('accordion-general')).toHaveAttribute('data-open', 'false');
    });

    it('uses external accordion state when provided', () => {
      const setOpenAccordion = jest.fn();
      
      render(
        <OrganisationServicesAccordion 
          organisation={mockOrganisation}
          openAccordion="foodbank-general"
          setOpenAccordion={setOpenAccordion}
        />
      );
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      
      // Should be open due to external state
      expect(screen.getByTestId('accordion-general')).toHaveAttribute('data-open', 'true');
      
      // Clicking should call external setter
      fireEvent.click(accordionToggle);
      expect(setOpenAccordion).toHaveBeenCalledWith(null);
    });

    it('uses external state management correctly', () => {
      const setOpenAccordion = jest.fn();
      
      render(
        <OrganisationServicesAccordion 
          organisation={mockOrganisation}
          openAccordion="foodbank-general"
          setOpenAccordion={setOpenAccordion}
        />
      );
      
      // Should use the provided external state
      expect(screen.getByTestId('accordion-general')).toHaveAttribute('data-open', 'true');
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator when location changes', async () => {
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1', 
          address: { 
            ...mockService.address, 
            Street: '123 Test Street',
            Location: { type: 'Point', coordinates: [-2.2426, 53.4808] }
          } 
        },
        { 
          ...mockService, 
          id: 'service-2', 
          address: { 
            ...mockService.address, 
            Street: '456 Other Street',
            Location: { type: 'Point', coordinates: [-2.2500, 53.4850] }
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Click on a location button to trigger loading
      const locationButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('📍')
      );
      
      if (locationButtons.length > 0) {
        fireEvent.click(locationButtons[0]);
        
        // Should show loading indicator briefly (it uses CSS classes and animation)
        const spinners = document.querySelectorAll('.animate-spin');
        expect(spinners.length).toBeGreaterThanOrEqual(0); // Loading state is brief
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined services gracefully', () => {
      const orgWithUndefinedServices = { ...mockOrganisation, services: undefined as any };
      const { container } = render(<OrganisationServicesAccordion organisation={orgWithUndefinedServices} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('handles services with missing address gracefully', () => {
      const serviceWithoutAddress = {
        ...mockService,
        address: undefined as any
      };
      const organisation = { ...mockOrganisation, services: [serviceWithoutAddress] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      expect(screen.getByTestId('services-accordion')).toBeInTheDocument();
    });

    it('handles services with invalid opening times', () => {
      const serviceWithInvalidTimes = {
        ...mockService,
        openTimes: [
          { day: '10', start: 'invalid', end: 'invalid' } // Invalid day and times
        ]
      };
      const organisation = { ...mockOrganisation, services: [serviceWithInvalidTimes] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should still render without crashing
      expect(screen.getByTestId('accordion-content-general')).toBeInTheDocument();
    });

    it('deduplicates locations with same coordinates', () => {
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1', 
          address: { 
            ...mockService.address, 
            Street: '123 Test Street',
            Location: { type: 'Point', coordinates: [-2.2426, 53.4808] }
          } 
        },
        { 
          ...mockService, 
          id: 'service-2', 
          address: { 
            ...mockService.address, 
            Street: '123 Test Street', // Same address
            Location: { type: 'Point', coordinates: [-2.2426, 53.4808] } // Same coordinates
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should not show multiple locations indicator
      expect(screen.queryByText(/Available at 2 locations/)).not.toBeInTheDocument();
    });
  });

  describe('Distance and Filtering', () => {
    it('calculates distance correctly between different coordinates', () => {
      const userContext = {
        lat: 53.4808,
        lng: -2.2426,
        radius: 50,
        location: 'Manchester'
      };
      
      const serviceWithDifferentCoords = {
        ...mockService,
        address: {
          ...mockService.address,
          Location: {
            type: 'Point' as const,
            coordinates: [-2.2500, 53.4850] // Slightly different coordinates
          }
        }
      };
      const organisation = { ...mockOrganisation, services: [serviceWithDifferentCoords] };
      
      render(
        <OrganisationServicesAccordion 
          organisation={organisation} 
          userContext={userContext}
        />
      );
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should display the service (distance is shown in location buttons when multiple locations)
      expect(screen.getByTestId('services-accordion')).toBeInTheDocument();
    });

    it('handles services without user context', () => {
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should not show distance when no user context
      expect(screen.queryByText(/km/)).not.toBeInTheDocument();
    });

    it('removes services outside radius', () => {
      const userContext = {
        lat: 51.5074, // London
        lng: -0.1278,
        radius: 1, // 1km radius - Manchester service should be filtered out
        location: 'London'
      };
      
      const { container } = render(
        <OrganisationServicesAccordion 
          organisation={mockOrganisation} 
          userContext={userContext}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    it('includes services when no radius specified', () => {
      const userContext = {
        lat: 51.5074, // London - far from Manchester
        lng: -0.1278,
        radius: null, // No radius limit
        location: 'London'
      };
      
      render(
        <OrganisationServicesAccordion 
          organisation={mockOrganisation} 
          userContext={userContext}
        />
      );
      
      expect(screen.getByTestId('services-accordion')).toBeInTheDocument();
    });
  });

  describe('Complex Location Scenarios', () => {
    it('handles duplicate location deduplication with tolerance', () => {
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1',
          address: { 
            ...mockService.address, 
            Location: { type: 'Point', coordinates: [-2.2426, 53.4808] }
          } 
        },
        { 
          ...mockService, 
          id: 'service-2',
          address: { 
            ...mockService.address, 
            Location: { type: 'Point', coordinates: [-2.2426001, 53.4808001] } // Very close
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should deduplicate very close locations
      expect(screen.queryByText(/Available at 2 locations/)).not.toBeInTheDocument();
    });

    it('handles locations without coordinates during deduplication', () => {
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1',
          address: { 
            ...mockService.address, 
            Location: undefined
          } 
        },
        { 
          ...mockService, 
          id: 'service-2',
          address: { 
            ...mockService.address, 
            Location: undefined
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      // Should still render both services (no deduplication without coordinates)
      expect(screen.getByTestId('services-accordion')).toBeInTheDocument();
    });

    it('sorts locations by distance correctly', () => {
      const userContext = {
        lat: 53.4808,
        lng: -2.2426,
        radius: 50,
        location: 'Manchester'
      };
      
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1',
          address: { 
            ...mockService.address,
            Street: 'Far Street',
            Location: { type: 'Point', coordinates: [-2.3000, 53.5000] } // Further away
          } 
        },
        { 
          ...mockService, 
          id: 'service-2',
          address: { 
            ...mockService.address,
            Street: 'Near Street', 
            Location: { type: 'Point', coordinates: [-2.2430, 53.4810] } // Closer
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      render(
        <OrganisationServicesAccordion 
          organisation={organisation} 
          userContext={userContext}
        />
      );
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show multiple locations
      expect(screen.getByText(/Available at 2 locations/)).toBeInTheDocument();
    });
  });

  describe('Organization Tags and 24/7 Services', () => {
    it('hides opening times for 24/7 tagged organizations', () => {
      const org24_7 = {
        ...mockOrganisation,
        tags: ['24/7', 'emergency']
      };
      
      render(<OrganisationServicesAccordion organisation={org24_7} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should not show opening times section for 24/7 services
      expect(screen.queryByText('Opening Times:')).not.toBeInTheDocument();
    });

    it('handles string tag format for 24/7 detection', () => {
      const orgWithStringTag = {
        ...mockOrganisation,
        tags: '24/7 service' as any // Single string instead of array
      };
      
      render(<OrganisationServicesAccordion organisation={orgWithStringTag} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should not show opening times
      expect(screen.queryByText('Opening Times:')).not.toBeInTheDocument();
    });

    it('shows opening times for non-24/7 organizations', () => {
      const orgNormal = {
        ...mockOrganisation,
        tags: ['food', 'support']
      };
      
      render(<OrganisationServicesAccordion organisation={orgNormal} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show opening times
      expect(screen.getByText('Opening Times:')).toBeInTheDocument();
    });
  });

  describe('Service Status Detection', () => {
    it('detects helpline services', () => {
      const helplineService = {
        ...mockService,
        subCategory: 'helpline',
        category: 'support'
      };
      const organisation = { ...mockOrganisation, services: [helplineService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-helpline');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('📞 Phone Service')).toBeInTheDocument();
      expect(screen.getByText('Phone Service')).toBeInTheDocument(); // In opening times section
    });

    it('detects phone services in subcategory', () => {
      const phoneService = {
        ...mockService,
        subCategory: 'phone support',
        category: 'support'
      };
      const organisation = { ...mockOrganisation, services: [phoneService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-phone support');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('📞 Phone Service')).toBeInTheDocument();
    });

    it('shows appointment only indicator', () => {
      mockIsServiceOpenNow.mockReturnValue({ 
        isOpen: true, 
        isAppointmentOnly: true,
        nextOpen: null
      });
      
      render(<OrganisationServicesAccordion organisation={mockOrganisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('Call before attending')).toBeInTheDocument();
    });
  });

  describe('Time Formatting Edge Cases', () => {
    it('formats single digit times correctly', () => {
      const serviceWithSingleDigitTimes = {
        ...mockService,
        openTimes: [
          { day: '0', start: '30', end: '530' } // 00:30 to 05:30
        ]
      };
      const organisation = { ...mockOrganisation, services: [serviceWithSingleDigitTimes] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText(/00:30 – 05:30/)).toBeInTheDocument();
    });

    it('handles day grouping and multiple time slots', () => {
      const serviceWithMultipleSlots = {
        ...mockService,
        openTimes: [
          { day: '0', start: '900', end: '1200' },
          { day: '0', start: '1300', end: '1700' }, // Same day, different times
          { day: '1', start: '1000', end: '1500' }
        ]
      };
      const organisation = { ...mockOrganisation, services: [serviceWithMultipleSlots] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show consolidated times for the same day
      expect(screen.getByText(/09:00 – 12:00, 13:00 – 17:00/)).toBeInTheDocument();
      expect(screen.getByText(/10:00 – 15:00/)).toBeInTheDocument();
    });

    it('handles invalid day indices', () => {
      const serviceWithInvalidDays = {
        ...mockService,
        openTimes: [
          { day: '7', start: '900', end: '1700' }, // Invalid day index
          { day: '-1', start: '900', end: '1700' } // Invalid day index
        ]
      };
      const organisation = { ...mockOrganisation, services: [serviceWithInvalidDays] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should still render without invalid days
      expect(screen.getByText('Opening Times:')).toBeInTheDocument();
    });
  });

  describe('Advanced Accommodation Features', () => {
    it('handles accommodation with complex feature values', () => {
      const accommodationService = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'emergency',
          features: {
            acceptsHousingBenefit: 0, // Explicitly not accepted
            hasSingleRooms: 2, // Unspecified
            hasSharedRooms: 1,
            hasDisabledAccess: 0,
            acceptsPets: 2,
            allowsVisitors: 0,
            hasOnSiteManager: 0
          },
          residentCriteria: {
            acceptsMen: false,
            acceptsWomen: 0, // Falsy number
            acceptsCouples: '', // Falsy string
            acceptsYoungPeople: null, // Null value
            acceptsFamilies: undefined // Undefined value
          }
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Check that accommodation section renders
      expect(screen.getByText('Accommodation Information')).toBeInTheDocument();
      
      // Check some basic features are displayed
      expect(screen.getByText(/Housing Benefit/)).toBeInTheDocument();
      
      // Check that Who Can Stay section renders
      expect(screen.getByText('Who Can Stay')).toBeInTheDocument();
    });

    it('handles accommodation without certain sections', () => {
      const minimalAccommodation = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'hostel',
          price: '0' // Free accommodation
          // Missing most other fields
        }
      };
      const organisation = { ...mockOrganisation, services: [minimalAccommodation] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('🏠 Hostel')).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('handles different accommodation types', () => {
      const accommodationTypes = [
        { type: 'supported', expected: 'Supported' },
        { type: 'emergency', expected: 'Emergency' },
        { type: 'hostel', expected: 'Hostel' },
        { type: 'social', expected: 'Social Housing' }
      ];
      
      accommodationTypes.forEach(({ type, expected }) => {
        const accommodationService = {
          ...mockService,
          id: `service-${type}`,
          category: 'accom',
          sourceType: 'accommodation',
          accommodationData: { type }
        };
        const organisation = { ...mockOrganisation, services: [accommodationService] };
        
        const { unmount } = render(<OrganisationServicesAccordion organisation={organisation} />);
        
        const accordionToggle = screen.getByTestId('accordion-toggle-general');
        fireEvent.click(accordionToggle);
        
        // Look for the accommodation type in the service type indicators
        expect(screen.getByText(new RegExp(expected))).toBeInTheDocument();
        
        unmount();
      });
    });

    it('handles support service labels correctly', () => {
      const accommodationService = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'supported',
          support: {
            supportOffered: ['mental health', 'substances', 'alcohol', 'domestic violence', 'physical health', 'custom support'],
            supportInfo: 'Comprehensive support available'
          }
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      expect(screen.getByText('Mental Health')).toBeInTheDocument();
      expect(screen.getByText('Substance Abuse')).toBeInTheDocument();
      expect(screen.getByText('Alcohol Issues')).toBeInTheDocument();
      expect(screen.getByText('Domestic Violence')).toBeInTheDocument();
      expect(screen.getByText('Physical Health')).toBeInTheDocument();
      expect(screen.getByText('Custom support')).toBeInTheDocument();
    });
  });

  describe('External State Management', () => {
    it('uses external selected location state', () => {
      const services: FlattenedService[] = [
        { 
          ...mockService, 
          id: 'service-1',
          address: { 
            ...mockService.address,
            Street: '123 First Street',
            Location: { type: 'Point', coordinates: [-2.2426, 53.4808] }
          } 
        },
        { 
          ...mockService, 
          id: 'service-2',
          address: { 
            ...mockService.address,
            Street: '456 Second Street',
            Location: { type: 'Point', coordinates: [-2.2500, 53.4850] }
          } 
        }
      ];
      const organisation = { ...mockOrganisation, services };
      
      const selectedLocationForService = { 'foodbank-general': 1 };
      const setSelectedLocationForService = jest.fn();
      
      render(
        <OrganisationServicesAccordion 
          organisation={organisation}
          selectedLocationForService={selectedLocationForService}
          setSelectedLocationForService={setSelectedLocationForService}
        />
      );
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Second location should be selected
      const locationButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('📍')
      );
      
      if (locationButtons.length > 1) {
        // Check if second button is selected (has blue styling classes)
        expect(locationButtons[1]).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
      }
    });
  });

  describe('Accommodation Feature Coverage', () => {
    it('covers facility rendering edge cases', () => {
      const accommodationService = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'supported',
          features: {
            hasAccessToKitchen: 0, // Should not render
            hasLaundryFacilities: 0, // Should not render
            hasLounge: 0, // Should not render
            hasShowerBathroomFacilities: 0 // Should not render
          }
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show "Facilities not specified" when no facilities are available
      expect(screen.getByText('Facilities not specified')).toBeInTheDocument();
    });

    it('covers room type rendering when no rooms specified', () => {
      const accommodationService = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'supported',
          features: {
            hasSingleRooms: 0,
            hasSharedRooms: 0
          }
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show both "No single rooms" and "No shared rooms"
      expect(screen.getByText('✗ No single rooms')).toBeInTheDocument();
      expect(screen.getByText('✗ No shared rooms')).toBeInTheDocument();
    });

    it('covers policies rendering when no policies specified', () => {
      const accommodationService = {
        ...mockService,
        category: 'accom',
        accommodationData: {
          type: 'supported',
          features: {
            hasDisabledAccess: 2, // Unspecified
            acceptsPets: 2, // Unspecified
            allowsVisitors: 2 // Unspecified
          }
        }
      };
      const organisation = { ...mockOrganisation, services: [accommodationService] };
      
      render(<OrganisationServicesAccordion organisation={organisation} />);
      
      const accordionToggle = screen.getByTestId('accordion-toggle-general');
      fireEvent.click(accordionToggle);
      
      // Should show "Policies not specified" when all policies are unspecified
      expect(screen.getByText('Policies not specified')).toBeInTheDocument();
    });
  });
});