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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-brand-l mb-2">
          Category
        </label>
        <select
          id="category"
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-brand-a bg-white"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubCategory('');
          }}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="subCategory" className="block text-sm font-medium text-brand-l mb-2">
          Subcategory
        </label>
        <select
          id="subCategory"
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-brand-a bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200"
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
          disabled={!selectedCategory}
        >
          <option value="">All subcategories</option>
          {subCategories.map((sub) => (
            <option key={sub.key} value={sub.key}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2 lg:col-span-2 flex justify-end">
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-sm text-brand-a hover:text-brand-b hover:bg-brand-i rounded-md transition-colors font-medium"
            title="Reset all filters"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
