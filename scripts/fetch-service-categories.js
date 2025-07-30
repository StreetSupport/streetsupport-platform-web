import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const OUTPUT_FILE = './src/data/service-categories.json';
const MONGO_URI = process.env.MONGODB_URI;
const MONGO_DB_NAME = process.env.MONGODB_DB || 'streetsupport';

// Remove the error throw - we'll handle this gracefully
// MongoClient will be created only when MONGO_URI is available


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
    if (!MONGO_URI || process.env.USE_FALLBACK === 'true') {
      console.log('⚠️  MONGODB_URI not available, using fallback data...');
      
      // Copy fallback data to expected location
      const fallbackPath = './public/data/service-categories-fallback.json';
      const fallbackData = fs.readFileSync(fallbackPath, 'utf8');
      fs.writeFileSync(OUTPUT_FILE, fallbackData);
      
      console.log(`✅ Fallback service categories data copied to ${OUTPUT_FILE}`);
      process.exit(0);
    }

    const client = new MongoClient(MONGO_URI);
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
