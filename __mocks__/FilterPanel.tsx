// __mocks__/FilterPanel.tsx
import React, { useEffect } from 'react';

interface Props {
  onFilterChange?: (filters: any) => void;
}

const FilterPanel = ({ onFilterChange = () => {} }: Props) => {
  useEffect(() => {
    if (typeof onFilterChange === 'function') {
      console.log('✅ assigned capturedFilterChange from __mocks__/@/components/FindHelp/FilterPanel.tsx');
      (globalThis as any).capturedFilterChange = onFilterChange;
    } else {
      console.log('❌ onFilterChange was not a function');
    }
  }, [onFilterChange]);

  return <div data-testid="filter-panel">Mocked FilterPanel</div>;
};

export default FilterPanel;
