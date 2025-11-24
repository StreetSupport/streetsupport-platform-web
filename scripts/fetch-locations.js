import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

const uri = process.env.MONGODB_URI;

async function fetchAndSaveLocations() {
  const outputPath = path.join(process.cwd(), 'src', 'data', 'locations.json');
  
  if (!uri || process.env.USE_FALLBACK === 'true') {
    console.log('⚠️  MONGODB_URI not available, using fallback data...');
    
    // Copy fallback data to expected location
    const fallbackPath = path.join(process.cwd(), 'public', 'data', 'locations-fallback.json');
    const fallbackData = fs.readFileSync(fallbackPath, 'utf8');
    fs.writeFileSync(outputPath, fallbackData);
    
    console.log(`✅ Fallback locations data copied to ${outputPath}`);
    return;
  }

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

  fs.writeFileSync(outputPath, JSON.stringify(locations, null, 2));

  await client.close();

  console.log(`✅ Public locations saved to ${outputPath}`);
}

fetchAndSaveLocations().catch(err => {
  console.error(err);
  process.exit(1);
});
