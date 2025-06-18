// src/app/api/categories/helper.ts

import { getClientPromise } from '@/utils/mongodb';
import { formatCategory } from '@/utils/formatCategories';

interface RawCategory {
  key: string;
  name: string;
  subCategories: { key: string; name: string }[];
}

export async function getCategories() {
  const client = await getClientPromise();
  const db = client.db('streetsupport');

  const categories = await db
    .collection<RawCategory>('NestedServiceCategories')
    .find({})
    .toArray();

  return categories.map(formatCategory);
}
