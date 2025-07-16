'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ServiceWithDistance } from '@/types';

interface SearchState {
  services: ServiceWithDistance[];
  scrollPosition: number;
  filters: {
    selectedCategory: string;
    selectedSubCategory: string;
    sortOrder: 'distance' | 'alpha';
  };
  searchParams: Record<string, string>;
  timestamp: number;
}

interface SearchNavigationContextType {
  searchState: SearchState | null;
  saveSearchState: (state: Omit<SearchState, 'timestamp'>) => void;
  clearSearchState: () => void;
  hasSearchState: boolean;
}

const SearchNavigationContext = createContext<SearchNavigationContextType | undefined>(undefined);

interface SearchNavigationProviderProps {
  children: ReactNode;
}

export function SearchNavigationProvider({ children }: SearchNavigationProviderProps) {
  const [searchState, setSearchState] = useState<SearchState | null>(null);

  const saveSearchState = useCallback((state: Omit<SearchState, 'timestamp'>) => {
    setSearchState({
      ...state,
      timestamp: Date.now(),
    });
  }, []);

  const clearSearchState = useCallback(() => {
    setSearchState(null);
  }, []);

  const hasSearchState = searchState !== null;

  const value: SearchNavigationContextType = {
    searchState,
    saveSearchState,
    clearSearchState,
    hasSearchState,
  };

  return (
    <SearchNavigationContext.Provider value={value}>
      {children}
    </SearchNavigationContext.Provider>
  );
}

export function useSearchNavigation() {
  const context = useContext(SearchNavigationContext);
  if (context === undefined) {
    throw new Error('useSearchNavigation must be used within a SearchNavigationProvider');
  }
  return context;
}