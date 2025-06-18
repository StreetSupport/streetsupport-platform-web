// scripts/fetch-client-groups.js

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment');
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

    const outputPath = path.join('./src/data/client-groups.json');
    fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2));

    console.log(`✅ Client groups saved to ${outputPath}`);
  } catch (err) {
    console.error('❌ Failed to fetch client groups:', err);
  } finally {
    await client.close();
  }
}

main();
