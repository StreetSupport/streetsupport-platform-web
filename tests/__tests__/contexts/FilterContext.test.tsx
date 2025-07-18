import React from 'react';
import { render, screen } from '@testing-library/react';
import { FilterContextProvider, useFilter } from '@/contexts/FilterContext';

// Test component to interact with the context
function TestComponent() {
  const filterContext = useFilter();

  return (
    <div>
      <div data-testid="filter-context">{JSON.stringify(filterContext)}</div>
    </div>
  );
}

describe('FilterContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide empty filter context by default', () => {
    render(
      <FilterContextProvider>
        <TestComponent />
      </FilterContextProvider>
    );

    expect(screen.getByTestId('filter-context')).toHaveTextContent('{}');
  });

  it('should be accessible outside provider (returns empty object)', () => {
    // Unlike other contexts, FilterContext doesn't throw when used outside provider
    // It just returns an empty object
    render(<TestComponent />);

    expect(screen.getByTestId('filter-context')).toHaveTextContent('{}');
  });

  it('should maintain consistent empty state', () => {
    const { rerender } = render(
      <FilterContextProvider>
        <TestComponent />
      </FilterContextProvider>
    );

    expect(screen.getByTestId('filter-context')).toHaveTextContent('{}');

    // Re-render and ensure state remains consistent
    rerender(
      <FilterContextProvider>
        <TestComponent />
      </FilterContextProvider>
    );

    expect(screen.getByTestId('filter-context')).toHaveTextContent('{}');
  });

  it('should render children correctly', () => {
    render(
      <FilterContextProvider>
        <div data-testid="child-component">Child Content</div>
      </FilterContextProvider>
    );

    expect(screen.getByTestId('child-component')).toHaveTextContent('Child Content');
  });

  it('should handle multiple consumers', () => {
    function MultipleConsumers() {
      const context1 = useFilter();
      const context2 = useFilter();

      return (
        <div>
          <div data-testid="context-1">{JSON.stringify(context1)}</div>
          <div data-testid="context-2">{JSON.stringify(context2)}</div>
        </div>
      );
    }

    render(
      <FilterContextProvider>
        <MultipleConsumers />
      </FilterContextProvider>
    );

    expect(screen.getByTestId('context-1')).toHaveTextContent('{}');
    expect(screen.getByTestId('context-2')).toHaveTextContent('{}');
  });
});