import React, { useEffect } from 'react';

interface Props {
  selectedCategory: string;
  selectedSubCategory: string;
  setSelectedCategory: (category: string) => void;
  setSelectedSubCategory: (subCategory: string) => void;
}

const FilterPanel = ({ 
  selectedCategory, 
  selectedSubCategory, 
  setSelectedCategory, 
  setSelectedSubCategory 
}: Props) => {
  useEffect(() => {
    // Expose the filter setters for testing
    (globalThis as any).capturedFilterChange = (filters: { category?: string; subCategory?: string }) => {
      if (filters.category !== undefined) {
        setSelectedCategory(filters.category);
      }
      if (filters.subCategory !== undefined) {
        setSelectedSubCategory(filters.subCategory);
      }
    };
  }, [setSelectedCategory, setSelectedSubCategory]);

  return (
    <div data-testid="filter-panel">
      Mocked FilterPanel (Category: {selectedCategory || 'All'}, SubCategory: {selectedSubCategory || 'All'})
    </div>
  );
};

export default FilterPanel;
