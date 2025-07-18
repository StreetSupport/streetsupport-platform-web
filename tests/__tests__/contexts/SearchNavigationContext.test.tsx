import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SearchNavigationProvider, useSearchNavigation } from '@/contexts/SearchNavigationContext';
import type { ServiceWithDistance } from '@/types';

// Mock service data for testing
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

// Test component to interact with the context
function TestComponent() {
  const { searchState, saveSearchState, clearSearchState, hasSearchState } = useSearchNavigation();

  const handleSaveState = () => {
    saveSearchState({
      services: mockServices,
      scrollPosition: 150,
      filters: {
        selectedCategory: 'health',
        selectedSubCategory: 'mental-health',
        sortOrder: 'distance',
      },
      searchParams: { category: 'health' },
    });
  };

  return (
    <div>
      <div data-testid="has-search-state">{hasSearchState.toString()}</div>
      <div data-testid="search-state">{JSON.stringify(searchState)}</div>
      <button onClick={handleSaveState} data-testid="save-state">
        Save State
      </button>
      <button onClick={clearSearchState} data-testid="clear-state">
        Clear State
      </button>
    </div>
  );
}

describe('SearchNavigationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial empty state', () => {
    render(
      <SearchNavigationProvider>
        <TestComponent />
      </SearchNavigationProvider>
    );

    expect(screen.getByTestId('has-search-state')).toHaveTextContent('false');
    expect(screen.getByTestId('search-state')).toHaveTextContent('null');
  });

  it('should save search state correctly', () => {
    render(
      <SearchNavigationProvider>
        <TestComponent />
      </SearchNavigationProvider>
    );

    act(() => {
      screen.getByTestId('save-state').click();
    });

    expect(screen.getByTestId('has-search-state')).toHaveTextContent('true');
    
    const searchStateText = screen.getByTestId('search-state').textContent;
    const searchState = JSON.parse(searchStateText || '{}');
    
    expect(searchState.services).toHaveLength(2);
    expect(searchState.scrollPosition).toBe(150);
    expect(searchState.filters.selectedCategory).toBe('health');
    expect(searchState.filters.selectedSubCategory).toBe('mental-health');
    expect(searchState.filters.sortOrder).toBe('distance');
    expect(searchState.searchParams.category).toBe('health');
    expect(searchState.timestamp).toBeDefined();
    expect(typeof searchState.timestamp).toBe('number');
  });

  it('should clear search state correctly', () => {
    render(
      <SearchNavigationProvider>
        <TestComponent />
      </SearchNavigationProvider>
    );

    // First save state
    act(() => {
      screen.getByTestId('save-state').click();
    });

    expect(screen.getByTestId('has-search-state')).toHaveTextContent('true');

    // Then clear state
    act(() => {
      screen.getByTestId('clear-state').click();
    });

    expect(screen.getByTestId('has-search-state')).toHaveTextContent('false');
    expect(screen.getByTestId('search-state')).toHaveTextContent('null');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSearchNavigation must be used within a SearchNavigationProvider');

    consoleSpy.mockRestore();
  });

  it('should handle multiple state updates correctly', () => {
    render(
      <SearchNavigationProvider>
        <TestComponent />
      </SearchNavigationProvider>
    );

    // Save initial state
    act(() => {
      screen.getByTestId('save-state').click();
    });

    const firstStateText = screen.getByTestId('search-state').textContent;
    const firstState = JSON.parse(firstStateText || '{}');
    const firstTimestamp = firstState.timestamp;

    // Wait a bit and save again
    setTimeout(() => {
      act(() => {
        screen.getByTestId('save-state').click();
      });

      const secondStateText = screen.getByTestId('search-state').textContent;
      const secondState = JSON.parse(secondStateText || '{}');
      
      expect(secondState.timestamp).toBeGreaterThan(firstTimestamp);
    }, 10);
  });

  it('should preserve all search state properties', () => {
    const customSearchState = {
      services: [mockServices[0]], // Only one service
      scrollPosition: 300,
      filters: {
        selectedCategory: 'housing',
        selectedSubCategory: 'emergency-accommodation',
        sortOrder: 'alpha' as const,
      },
      searchParams: { category: 'housing', radius: '15' },
    };

    function CustomTestComponent() {
      const { searchState, saveSearchState } = useSearchNavigation();

      const handleSaveCustomState = () => {
        saveSearchState(customSearchState);
      };

      return (
        <div>
          <div data-testid="custom-search-state">{JSON.stringify(searchState)}</div>
          <button onClick={handleSaveCustomState} data-testid="save-custom-state">
            Save Custom State
          </button>
        </div>
      );
    }

    render(
      <SearchNavigationProvider>
        <CustomTestComponent />
      </SearchNavigationProvider>
    );

    act(() => {
      screen.getByTestId('save-custom-state').click();
    });

    const stateText = screen.getByTestId('custom-search-state').textContent;
    const state = JSON.parse(stateText || '{}');

    expect(state.services).toHaveLength(1);
    expect(state.services[0].id).toBe('1');
    expect(state.scrollPosition).toBe(300);
    expect(state.filters.selectedCategory).toBe('housing');
    expect(state.filters.selectedSubCategory).toBe('emergency-accommodation');
    expect(state.filters.sortOrder).toBe('alpha');
    expect(state.searchParams.category).toBe('housing');
    expect(state.searchParams.radius).toBe('15');
  });
});