// scripts/fetch-client-groups.js

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  const outputPath = path.join('./src/data/client-groups.json');
  
  if (!uri || process.env.USE_FALLBACK === 'true') {
    console.log('⚠️  MONGODB_URI not available, using fallback data...');
    
    // Copy fallback data to expected location
    const fallbackPath = path.join('./public/data/client-groups-fallback.json');
    const fallbackData = fs.readFileSync(fallbackPath, 'utf8');
    fs.writeFileSync(outputPath, fallbackData);
    
    console.log(`✅ Fallback client groups data copied to ${outputPath}`);
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('streetsupport');

    const groups = await db
      .collection('ClientGroups')
      .find({})
      .project({ _id: 1, Key: 1, Name: 1 })
      .toArray();

    // Transform to use lower camel case for key + name
    const cleaned = groups.map(g => ({
      _id: g._id.toString(),
      key: g.Key,
      name: g.Name,
    }));

    fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2));

    console.log(`✅ Client groups saved to ${outputPath}`);
  } catch (err) {
    console.error('❌ Failed to fetch client groups:', err);
  } finally {
    await client.close();
  }
}

main();
