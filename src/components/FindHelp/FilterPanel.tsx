'use client';

import { useEffect, useState } from 'react';
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
}

const categories = (rawCategories as Category[]).sort((a, b) => a.name.localeCompare(b.name));

export default function FilterPanel({
  selectedCategory,
  selectedSubCategory,
  setSelectedCategory,
  setSelectedSubCategory,
}: Props) {
  const [subCategories, setSubCategories] = useState<{ key: string; name: string }[]>([]);

  useEffect(() => {
    const matched = categories.find((cat) => cat.key === selectedCategory);
    if (matched && matched.subCategories) {
      setSubCategories([...matched.subCategories].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

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
            setSelectedSubCategory(''); // reset subcategory when changing category
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
      </div>
    </div>
  );
}
