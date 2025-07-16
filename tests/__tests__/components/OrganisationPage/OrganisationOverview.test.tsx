import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock SearchNavigationContext
jest.mock('@/contexts/SearchNavigationContext', () => ({
  useSearchNavigation: jest.fn(),
}));

const mockOrganisation = {
  name: 'Test Organisation',
  shortDescription: 'A test organisation for testing purposes',
  description: 'This is a longer description of the test organisation that provides various services.',
  key: 'test-org',
  services: [],
  groupedServices: {},
};

describe('OrganisationOverview', () => {
  const { useSearchNavigation } = require('@/contexts/SearchNavigationContext');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders organisation name and descriptions', () => {
    useSearchNavigation.mockReturnValue({
      hasSearchState: false,
      searchState: null,
    });

    render(<OrganisationOverview organisation={mockOrganisation} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.getByText('A test organisation for testing purposes')).toBeInTheDocument();
    expect(screen.getByText(/This is a longer description/)).toBeInTheDocument();
  });

  it('does not show back button when no search state exists', () => {
    useSearchNavigation.mockReturnValue({
      hasSearchState: false,
      searchState: null,
    });

    render(<OrganisationOverview organisation={mockOrganisation} />);

    expect(screen.queryByText('Back to search results')).not.toBeInTheDocument();
  });

  it('shows back button when search state exists', () => {
    useSearchNavigation.mockReturnValue({
      hasSearchState: true,
      searchState: {
        services: [],
        scrollPosition: 150,
        filters: {
          selectedCategory: 'health',
          selectedSubCategory: '',
          sortOrder: 'distance',
        },
        searchParams: { category: 'health' },
        timestamp: Date.now(),
      },
    });

    render(<OrganisationOverview organisation={mockOrganisation} />);

    expect(screen.getByText('Back to search results')).toBeInTheDocument();
  });

  it('renders without short description when not provided', () => {
    const orgWithoutShortDesc = {
      ...mockOrganisation,
      shortDescription: undefined,
    };

    useSearchNavigation.mockReturnValue({
      hasSearchState: false,
      searchState: null,
    });

    render(<OrganisationOverview organisation={orgWithoutShortDesc} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.queryByText('A test organisation for testing purposes')).not.toBeInTheDocument();
    expect(screen.getByText(/This is a longer description/)).toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    const orgWithoutDesc = {
      ...mockOrganisation,
      description: undefined,
    };

    useSearchNavigation.mockReturnValue({
      hasSearchState: false,
      searchState: null,
    });

    render(<OrganisationOverview organisation={orgWithoutDesc} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.getByText('A test organisation for testing purposes')).toBeInTheDocument();
    expect(screen.queryByText(/This is a longer description/)).not.toBeInTheDocument();
  });

  it('back button has correct accessibility attributes', () => {
    useSearchNavigation.mockReturnValue({
      hasSearchState: true,
      searchState: {
        services: [],
        scrollPosition: 150,
        filters: {
          selectedCategory: 'health',
          selectedSubCategory: '',
          sortOrder: 'distance',
        },
        searchParams: { category: 'health' },
        timestamp: Date.now(),
      },
    });

    render(<OrganisationOverview organisation={mockOrganisation} />);

    const backButton = screen.getByRole('button', { name: 'Back to search results' });
    expect(backButton).toHaveAttribute('aria-label', 'Back to search results');
  });

  it('back button contains correct icon', () => {
    useSearchNavigation.mockReturnValue({
      hasSearchState: true,
      searchState: {
        services: [],
        scrollPosition: 150,
        filters: {
          selectedCategory: 'health',
          selectedSubCategory: '',
          sortOrder: 'distance',
        },
        searchParams: { category: 'health' },
        timestamp: Date.now(),
      },
    });

    render(<OrganisationOverview organisation={mockOrganisation} />);

    const backButton = screen.getByText('Back to search results');
    const svg = backButton.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });
});