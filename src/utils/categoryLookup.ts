// src/utils/categoryLookup.ts

import rawCategories from '@/data/service-categories.json';
import { formatCategory } from './formatCategories';

const categories = (rawCategories as unknown[]).map(formatCategory);

export const categoryKeyToName: Record<string, string> = {};
export const subCategoryKeyToName: Record<string, string> = {};

// Build lookup tables
categories.forEach(cat => {
  categoryKeyToName[cat.key] = cat.name;
  cat.subCategories.forEach(sub => {
    subCategoryKeyToName[sub.key] = sub.name;
  });
});
