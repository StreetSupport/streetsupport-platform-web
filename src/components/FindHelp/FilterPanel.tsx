'use client';

import { useEffect, useMemo } from 'react';
import rawCategories from '@/data/service-categories.json';

interface Category {
  key: string;
  name: string;
  subCategories: { key: string; name: string }[];
}

interface Props {
  selectedCategory: string;
  selectedSubCategory: string;
  setSelectedCategory: (category: string) => void;
  setSelectedSubCategory: (subCategory: string) => void;
  onResetFilters: () => void;
}

// Pre-process categories once on module load
const categories = (rawCategories as Category[]).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export default function FilterPanel({
  selectedCategory,
  selectedSubCategory,
  setSelectedCategory,
  setSelectedSubCategory,
  onResetFilters,
}: Props) {
  // Memoize subcategories calculation
  const subCategories = useMemo(() => {
    const matched = categories.find((cat) => cat.key === selectedCategory);
    if (matched && matched.subCategories) {
      return [...matched.subCategories].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
    return [];
  }, [selectedCategory]);

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedSubCategory && subCategories.length > 0) {
      const isValidSubCategory = subCategories.some(sub => sub.key === selectedSubCategory);
      if (!isValidSubCategory) {
        setSelectedSubCategory('');
      }
    }
  }, [selectedCategory, selectedSubCategory, subCategories, setSelectedSubCategory]);

  const hasActiveFilters = selectedCategory || selectedSubCategory;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category:
        </label>
        <select
          id="category"
          className="border px-2 py-1 rounded"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubCategory('');
          }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="subCategory" className="text-sm font-medium">
          Subcategory:
        </label>
        <select
          id="subCategory"
          className="border px-2 py-1 rounded"
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
          disabled={!selectedCategory}
        >
          <option value="">All</option>
          {subCategories.map((sub) => (
            <option key={sub.key} value={sub.key}>
              {sub.name}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors ml-2"
            title="Reset all filters"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
