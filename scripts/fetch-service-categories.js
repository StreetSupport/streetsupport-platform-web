import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const OUTPUT_FILE = './src/data/service-categories.json';
const MONGO_URI = process.env.MONGODB_URI;
const MONGO_DB_NAME = process.env.MONGODB_DB || 'streetsupport';

if (!MONGO_URI) {
  throw new Error('❌ MONGODB_URI not found in environment');
}

const client = new MongoClient(MONGO_URI);

// const createKey = (name) =>
//   name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const formatCategory = (doc) => ({
  key: doc._id || doc.Key || doc.key,
  name: doc.Name || doc.name,
  subCategories: (doc.SubCategories || []).map((sc) => ({
    key: sc.Key || sc.key,
    name: sc.Name || sc.name,
  })),
});

(async () => {
  try {
    await client.connect();
    const db = client.db(MONGO_DB_NAME);

    const raw = await db.collection('NestedServiceCategories').find({}).toArray();
    const formatted = raw.map(formatCategory);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formatted, null, 2));
    console.log(`✅ Saved to ${OUTPUT_FILE}`);

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    process.exit(1);
  }
})();
