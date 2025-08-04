// scripts/debug-temp-accommodation.js

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

    console.log('🔍 Analyzing TemporaryAccommodation collection...');
    
    // Get total count
    const total = await db.collection('TemporaryAccommodation').countDocuments();
    console.log(`📊 Total documents: ${total}`);
    
    // Get a detailed sample
    const sample = await db.collection('TemporaryAccommodation').findOne({});
    
    if (sample) {
      console.log('\n📋 Sample document structure:');
      console.log(JSON.stringify(sample, null, 2));
    }
    
    // Check if there are any that might be published
    const withGeneralInfo = await db.collection('TemporaryAccommodation')
      .countDocuments({ 'GeneralInfo': { $exists: true } });
    console.log(`\n📈 Documents with GeneralInfo: ${withGeneralInfo}`);
    
    // Get sample with GeneralInfo
    const sampleWithInfo = await db.collection('TemporaryAccommodation')
      .findOne({ 'GeneralInfo': { $exists: true } });
    
    if (sampleWithInfo && sampleWithInfo.GeneralInfo) {
      console.log('\n🏠 GeneralInfo structure:');
      console.log(JSON.stringify(sampleWithInfo.GeneralInfo, null, 2));
    }
    
    if (sampleWithInfo && sampleWithInfo.ContactInformation) {
      console.log('\n📞 ContactInformation structure:');
      console.log(JSON.stringify(sampleWithInfo.ContactInformation, null, 2));
    }
    
    if (sampleWithInfo && sampleWithInfo.Address) {
      console.log('\n📍 Address structure:');
      console.log(JSON.stringify(sampleWithInfo.Address, null, 2));
    }
    
  } catch (err) {
    console.error('❌ Failed to analyze collection:', err);
  } finally {
    await client.close();
  }
}

main();