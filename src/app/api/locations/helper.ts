// src/app/api/locations/helper.ts

import { getClientPromise } from '@/utils/mongodb';

export interface RawLocation {
  _id: string;
  Name: string;
  Key: string;
}

export function formatLocation(raw: RawLocation) {
  return {
    id: raw._id,
    name: raw.Name,
    slug: raw.Key,
  };
}

export async function getLocations() {
  const client = await getClientPromise();
  const db = client.db('streetsupport');

  const cities = await db
    .collection<RawLocation>('Cities')
    .find({})
    .toArray();

  return cities.map(formatLocation);
}
