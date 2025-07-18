import React, { ReactNode } from 'react';

// Mock the context values
const mockSearchNavigationContext = {
  searchState: null,
  saveSearchState: jest.fn(),
  clearSearchState: jest.fn(),
  hasSearchState: false,
};

// Create a mock provider component
export const SearchNavigationProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// Create a mock hook
export const useSearchNavigation = jest.fn(() => mockSearchNavigationContext);

// Export the mock context for direct manipulation in tests
export const mockContext = mockSearchNavigationContext;