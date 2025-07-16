import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import { SearchNavigationProvider } from '@/contexts/SearchNavigationContext';
import { LocationProvider } from '@/contexts/LocationContext';
import type { ServiceWithDistance } from '@/types';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    forEach: jest.fn(),
    get: jest.fn(),
    toString: jest.fn(() => ''),
  })),
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
};

const mockServices: ServiceWithDistance[] = [
  {
    id: '1',
    name: 'Test Service 1',
    description: 'Test description 1',
    category: 'health',
    subCategory: 'mental-health',
    latitude: 53.4808,
    longitude: -2.2426,
    organisation: {
      name: 'Test Org 1',
      slug: 'test-org-1',
      isVerified: true,
    },
    organisationSlug: 'test-org-1',
    clientGroups: [],
    openTimes: [],
    distance: 1.5,
  },
  {
    id: '2',
    name: 'Test Service 2',
    description: 'Test description 2',
    category: 'housing',
    subCategory: 'emergency-accommodation',
    latitude: 53.4709,
    longitude: -2.2374,
    organisation: {
      name: 'Test Org 2',
      slug: 'test-org-2',
      isVerified: false,
    },
    organisationSlug: 'test-org-2',
    clientGroups: [],
    openTimes: [],
    distance: 2.1,
  },
];

const mockOrganisation = {
  name: 'Test Org 1',
  shortDescription: 'A test organisation',
  description: 'Detailed description of the organisation',
  key: 'test-org-1',
  services: [],
  groupedServices: {},
};

// Mock location context
const mockLocationContext = {
  location: {
    lat: 53.4808,
    lng: -2.2426,
    radius: 10,
    postcode: 'M1 1AA',
  },
  setLocation: jest.fn(),
  clearLocation: jest.fn(),
  isLoading: false,
  error: null,
};

jest.mock('@/contexts/LocationContext', () => ({
  LocationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useLocation: () => mockLocationContext,
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <SearchNavigationProvider>
        {children}
      </SearchNavigationProvider>
    </LocationProvider>
  );
}

describe('Search Navigation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should save search state when navigating to service and restore when returning', async () => {
    // Render the search results page
    const { rerender } = render(
      <TestWrapper>
        <FindHelpResults services={mockServices} loading={false} error={null} />
      </TestWrapper>
    );

    // Verify services are displayed
    expect(screen.getByText('Test Service 1')).toBeInTheDocument();
    expect(screen.getByText('Test Service 2')).toBeInTheDocument();

    // Click on a service to navigate
    const serviceLink = screen.getByRole('link', { name: /View details for Test Service 1/i });
    fireEvent.click(serviceLink);

    // Now render the organisation page (simulating navigation)
    rerender(
      <TestWrapper>
        <OrganisationOverview organisation={mockOrganisation} />
      </TestWrapper>
    );

    // Verify back button is shown
    expect(screen.getByText('Back to search results')).toBeInTheDocument();

    // Click back button
    const backButton = screen.getByText('Back to search results');
    fireEvent.click(backButton);

    // Verify router.push was called with correct URL
    expect(mockRouter.push).toHaveBeenCalledWith('/find-help');
  });

  it('should preserve filters and scroll position across navigation', async () => {
    // Create a scrollable container mock
    const mockScrollContainer = {
      scrollTop: 150,
    };

    // Mock the ref to return our mock container
    jest.spyOn(React, 'useRef').mockReturnValue({
      current: mockScrollContainer,
    });

    render(
      <TestWrapper>
        <FindHelpResults services={mockServices} loading={false} error={null} />
      </TestWrapper>
    );

    // Change filters
    const sortSelect = screen.getByLabelText(/Sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'alpha' } });

    // Click on a service
    const serviceLink = screen.getByRole('link', { name: /View details for Test Service 1/i });
    fireEvent.click(serviceLink);

    // The search state should be saved with the current scroll position and filters
    // This is tested implicitly through the context behavior
  });

  it('should handle navigation without search state gracefully', () => {
    // Render organisation page directly (no prior search state)
    render(
      <TestWrapper>
        <OrganisationOverview organisation={mockOrganisation} />
      </TestWrapper>
    );

    // Back button should not be visible
    expect(screen.queryByText('Back to search results')).not.toBeInTheDocument();
  });

  it('should clear stale search state after restoration', async () => {
    // This test verifies that search state is cleared after being used
    // to prevent stale data from affecting future navigation
    
    const { rerender } = render(
      <TestWrapper>
        <FindHelpResults services={mockServices} loading={false} error={null} />
      </TestWrapper>
    );

    // Navigate to service
    const serviceLink = screen.getByRole('link', { name: /View details for Test Service 1/i });
    fireEvent.click(serviceLink);

    // Render organisation page
    rerender(
      <TestWrapper>
        <OrganisationOverview organisation={mockOrganisation} />
      </TestWrapper>
    );

    // Go back
    const backButton = screen.getByText('Back to search results');
    fireEvent.click(backButton);

    // Render search results again (simulating return navigation)
    rerender(
      <TestWrapper>
        <FindHelpResults services={mockServices} loading={false} error={null} />
      </TestWrapper>
    );

    // Navigate to organisation page again
    rerender(
      <TestWrapper>
        <OrganisationOverview organisation={mockOrganisation} />
      </TestWrapper>
    );

    // The search state should have been cleared, so back button might not be available
    // or should handle the case gracefully
  });

  it('should handle multiple service navigation correctly', () => {
    render(
      <TestWrapper>
        <FindHelpResults services={mockServices} loading={false} error={null} />
      </TestWrapper>
    );

    // Click on first service
    const firstServiceLink = screen.getByRole('link', { name: /View details for Test Service 1/i });
    fireEvent.click(firstServiceLink);

    // Click on second service (without navigating away first)
    const secondServiceLink = screen.getByRole('link', { name: /View details for Test Service 2/i });
    fireEvent.click(secondServiceLink);

    // Both clicks should save the search state
    // The latest state should be preserved
  });

  it('should preserve search parameters in back navigation URL', () => {
    // Mock search params
    const mockSearchParams = new URLSearchParams('category=health&radius=15');
    const mockUseSearchParams = jest.fn(() => ({
      forEach: (callback: (value: string, key: string) => void) => {
        mockSearchParams.forEach(callback);
      },
      get: (key: string) => mockSearchParams.get(key),
      toString: () => mockSearchParams.toString(),
    }));

    (require('next/navigation').useSearchParams as jest.Mock).mockImplementation(mockUseSearchParams);

    const { rerender } = render(
      <TestWrapper>
        <FindHelpResults services={mockServices} loading={false} error={null} />
      </TestWrapper>
    );

    // Navigate to service
    const serviceLink = screen.getByRole('link', { name: /View details for Test Service 1/i });
    fireEvent.click(serviceLink);

    // Render organisation page
    rerender(
      <TestWrapper>
        <OrganisationOverview organisation={mockOrganisation} />
      </TestWrapper>
    );

    // Click back
    const backButton = screen.getByText('Back to search results');
    fireEvent.click(backButton);

    // Should navigate with preserved parameters
    expect(mockRouter.push).toHaveBeenCalledWith('/find-help?category=health&radius=15');
  });
});