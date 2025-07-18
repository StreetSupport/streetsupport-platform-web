import { render, screen } from '@testing-library/react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import { mockOrganisationDetails } from '../../__mocks__/api-responses';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the SearchNavigationContext
const mockSearchNavigation = {
  searchState: null,
  saveSearchState: jest.fn(),
  clearSearchState: jest.fn(),
  hasSearchState: false,
};

jest.mock('@/contexts/SearchNavigationContext', () => ({
  useSearchNavigation: () => mockSearchNavigation,
}));

describe('OrganisationOverview', () => {
  beforeEach(() => {
    // Reset mock values before each test
    mockSearchNavigation.searchState = null;
    mockSearchNavigation.hasSearchState = false;
  });
  
  it('renders organisation name only', () => {
    const organisation = {
      ...mockOrganisationDetails,
      shortDescription: undefined,
      description: undefined,
    };

    render(
      <OrganisationOverview organisation={organisation} />
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Organisation');
  });

  it('renders with short description', () => {
    const organisation = {
      ...mockOrganisationDetails,
      description: undefined,
    };

    render(
      <OrganisationOverview organisation={organisation} />
    );
    expect(screen.getByText('A test organisation for testing purposes')).toBeInTheDocument();
  });

  it('renders with long description', () => {
    const organisation = {
      ...mockOrganisationDetails,
      shortDescription: undefined,
    };

    render(
      <OrganisationOverview organisation={organisation} />
    );
    expect(screen.getByText(/This is a longer description/)).toBeInTheDocument();
  });
  
  it('renders back to search results button when search state exists', () => {
    // Set up mock search state
    mockSearchNavigation.hasSearchState = true;
    mockSearchNavigation.searchState = {
      services: [],
      scrollPosition: 0,
      filters: {
        selectedCategory: '',
        selectedSubCategory: '',
        sortOrder: 'distance',
      },
      searchParams: { category: 'health' },
      timestamp: Date.now(),
    };

    render(
      <OrganisationOverview organisation={mockOrganisationDetails} />
    );
    
    expect(screen.getByText('Back to search results')).toBeInTheDocument();
  });
});
