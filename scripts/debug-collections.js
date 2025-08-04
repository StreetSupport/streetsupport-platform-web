// scripts/debug-collections.js

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('⚠️  MONGODB_URI not available');
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('streetsupport');

    console.log('🔍 Listing all collections in streetsupport database...');
    
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📦 ${collection.name}: ${count} documents`);
      
      // Check for accommodation-related collections
      if (collection.name.toLowerCase().includes('accommodation') || 
          collection.name.toLowerCase().includes('temp')) {
        console.log(`   🔍 Checking ${collection.name} structure...`);
        const sample = await db.collection(collection.name).findOne({});
        if (sample) {
          console.log(`   📋 Sample fields: ${Object.keys(sample).join(', ')}`);
        }
      }
      
      // Also check provided services for accommodation category
      if (collection.name === 'ProvidedServices') {
        console.log(`   🔍 Checking for accommodation services...`);
        const accommodationServices = await db.collection(collection.name)
          .countDocuments({ 
            ParentCategoryKey: { $regex: /accommodation/i } 
          });
        console.log(`   🏠 Accommodation services: ${accommodationServices}`);
        
        // Get a sample accommodation service
        const accommodationSample = await db.collection(collection.name)
          .findOne({ ParentCategoryKey: { $regex: /accommodation/i } });
        
        if (accommodationSample) {
          console.log(`   📋 Accommodation service sample fields: ${Object.keys(accommodationSample).join(', ')}`);
        }
      }
    }
    
  } catch (err) {
    console.error('❌ Failed to list collections:', err);
  } finally {
    await client.close();
  }
}

main();