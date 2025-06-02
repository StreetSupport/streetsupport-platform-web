'use client';

import { useEffect, useState } from 'react';

interface Category {
  key: string;
  name: string;
  subCategories: {
    key: string;
    name: string;
  }[];
}

interface Props {
  onFilterChange: (filters: { category: string; subCategory: string }) => void;
}

export default function FilterPanel({ onFilterChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/get-categories');
        const data: Category[] = await res.json();

        const sorted = data
          .map((cat) => ({
            ...cat,
            subCategories: cat.subCategories.sort((a, b) =>
              a.name.localeCompare(b.name)
            ),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(sorted);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    setSubCategory('');
    onFilterChange({ category, subCategory: '' });
  }, [category, onFilterChange]);

  useEffect(() => {
    onFilterChange({ category, subCategory });
  }, [subCategory, category, onFilterChange]);

  const currentCategory = category
    ? categories.find((c) => c.key === category)
    : undefined;

  return (
    <div className="p-4 bg-white rounded shadow mb-4 space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {category && currentCategory && currentCategory.subCategories?.length > 0 && (
        <div>
          <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Subcategory
          </label>
          <select
            id="subCategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All subcategories</option>
            {currentCategory.subCategories.map((sub) => (
              <option key={sub.key} value={sub.key}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
