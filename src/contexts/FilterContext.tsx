// src/contexts/FilterContext.tsx
'use client';

import { createContext, useContext } from 'react';

export const FilterContext = createContext({});

export const FilterContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <FilterContext.Provider value={{}}>{children}</FilterContext.Provider>;
};

export const useFilter = () => useContext(FilterContext);
