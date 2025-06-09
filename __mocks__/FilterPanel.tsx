import React, { useEffect } from 'react';

interface Props {
  onFilterChange?: (filters: any) => void;
}

const FilterPanel = ({ onFilterChange = () => {} }: Props) => {
  useEffect(() => {
    if (typeof onFilterChange === 'function') {
      (globalThis as any).capturedFilterChange = onFilterChange;
    }
  }, [onFilterChange]);

  return <div data-testid="filter-panel">Mocked FilterPanel</div>;
};

export default FilterPanel;
