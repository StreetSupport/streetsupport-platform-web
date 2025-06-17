import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('❌ MONGODB_URI is not defined');

async function fetchAndSaveLocations() {
  console.log('🔄 Fetching public locations data from DB...');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('streetsupport');

  // ✅ Only get IsPublic: true
  const cities = await db.collection('Cities').find({ IsPublic: true }).toArray();

  const locations = cities.map(city => ({
    id: city._id.toString(),
    key: city.Key,
    name: city.Name,
    slug: city.Key,
    latitude: city.Latitude,
    longitude: city.Longitude,
    isPublic: true // ✅ guaranteed by query
  }));

  const filePath = path.join(process.cwd(), 'src', 'data', 'locations.json');
  fs.writeFileSync(filePath, JSON.stringify(locations, null, 2));

  await client.close();

  console.log(`✅ Public locations saved to ${filePath}`);
}

fetchAndSaveLocations().catch(err => {
  console.error(err);
  process.exit(1);
});
