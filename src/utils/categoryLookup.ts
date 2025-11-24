import rawCategories from '@/data/service-categories.json';
import { formatCategory, type RawCategory } from './formatCategories';

const categories = (rawCategories as RawCategory[]).map(formatCategory);

export const categoryKeyToName: Record<string, string> = {};
export const subCategoryKeyToName: Record<string, string> = {};

// Create contextual lookup for subcategories: categoryKey -> subcategoryKey -> subcategoryName
const contextualSubCategoryLookup: Record<string, Record<string, string>> = {};

categories.forEach(cat => {
  categoryKeyToName[cat.key] = cat.name;
  contextualSubCategoryLookup[cat.key] = {};
  
  cat.subCategories.forEach(sub => {
    // Keep the old simple lookup for backwards compatibility (will be overwritten by last occurrence)
    subCategoryKeyToName[sub.key] = sub.name;
    
    // Add to contextual lookup
    contextualSubCategoryLookup[cat.key][sub.key] = sub.name;
  });
});

/**
 * Get the subcategory name given both category and subcategory keys.
 * This resolves naming conflicts where multiple categories have subcategories with the same key.
 * 
 * @param categoryKey - The parent category key (e.g., 'foodbank', 'support')
 * @param subCategoryKey - The subcategory key (e.g., 'general')
 * @returns The contextual subcategory name (e.g., 'Food Banks' vs 'General support')
 */
export function getSubCategoryName(categoryKey: string, subCategoryKey: string): string {
  return contextualSubCategoryLookup[categoryKey]?.[subCategoryKey] || subCategoryKey;
}

/**
 * Get the category name for a given category key.
 * 
 * @param categoryKey - The category key
 * @returns The category name or the key if not found
 */
export function getCategoryName(categoryKey: string): string {
  return categoryKeyToName[categoryKey] || categoryKey;
}
