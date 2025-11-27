// src/app/api/categories/helper.ts

import { getClientPromise } from '@/utils/mongodb';
import { formatCategory, type RawCategory } from '@/utils/formatCategories';

interface DbSubCategory {
  Key: string;
  Name: string;
}

interface DbCategory {
  _id: string;
  Name: string;
  SubCategories: DbSubCategory[];
}

export async function getCategories() {
  const client = await getClientPromise();
  const db = client.db('streetsupport');

  const categories = await db
    .collection<DbCategory>('NestedServiceCategories')
    .find({})
    .toArray();

  return categories.map((rawCategory) => {
    const normalized: RawCategory = {
      key: rawCategory._id,
      name: rawCategory.Name,
      subCategories: rawCategory.SubCategories.map((sub) => ({
        key: sub.Key,
        name: sub.Name,
      })),
    };

    return formatCategory(normalized);
  });
}
