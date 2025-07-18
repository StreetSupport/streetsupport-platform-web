// src/utils/formatCategories.ts

export interface RawCategory {
  key: string;
  name: string;
  subCategories: { key: string; name: string }[];
}

export interface ApiCategory {
  key: string;
  name: string;
  subCategories: { key: string; name: string }[];
}

// For now this is a pass-through, but later you might clean names, sort, etc.
export function formatCategory(raw: RawCategory): ApiCategory {
  return {
    key: raw.key,
    name: raw.name,
    subCategories: raw.subCategories.map(sub => ({
      key: sub.key,
      name: sub.name,
    })),
  };
}
