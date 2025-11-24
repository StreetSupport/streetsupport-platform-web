#!/usr/bin/env node

/**
 * Database Index Optimization Script
 * 
 * This script creates compound indexes to optimize the performance of
 * geospatial queries in the services API.
 * 
 * Run with: node scripts/optimize-database-indexes.js
 */

const { MongoClient } = require('mongodb');

// MongoDB connection string - update this for your environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'streetsupport';

async function createOptimizedIndexes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(DATABASE_NAME);
    const servicesCol = db.collection('ProvidedServices');
    const providersCol = db.collection('ServiceProviders');
    
    console.log('Creating optimized indexes...');
    
    // 1. Compound index for geospatial queries with filtering
    // This supports queries that filter by location AND category/published status
    const geoCompoundIndex = {
      'IsPublished': 1,
      'Address.Location': '2dsphere',
      'ParentCategoryKey': 1
    };
    
    await servicesCol.createIndex(geoCompoundIndex, {
      name: 'geo_published_category_idx',
      background: true
    });
    console.log('✓ Created geospatial compound index');
    
    // 2. Index for non-geospatial queries with city filtering
    const cityCompoundIndex = {
      'IsPublished': 1,
      'Address.City': 1,
      'ParentCategoryKey': 1
    };
    
    await servicesCol.createIndex(cityCompoundIndex, {
      name: 'city_published_category_idx',
      background: true
    });
    console.log('✓ Created city compound index');
    
    // 3. Index to optimize the $lookup join with ServiceProviders
    const serviceProviderKeyIndex = { 'ServiceProviderKey': 1 };
    
    await servicesCol.createIndex(serviceProviderKeyIndex, {
      name: 'service_provider_key_idx',
      background: true
    });
    console.log('✓ Created ServiceProviderKey index');
    
    // 4. Optimize ServiceProviders collection for lookups
    const providerKeyIndex = { 'Key': 1, 'IsVerified': 1 };
    
    await providersCol.createIndex(providerKeyIndex, {
      name: 'key_verified_idx',
      background: true
    });
    console.log('✓ Created Provider Key and Verified index');
    
    // 5. Index for pagination and sorting
    const sortingIndex = {
      'IsPublished': 1,
      'ServiceProviderName': 1,
      '_id': 1
    };
    
    await servicesCol.createIndex(sortingIndex, {
      name: 'published_name_sort_idx',
      background: true
    });
    console.log('✓ Created sorting optimization index');
    
    // Display current indexes
    console.log('\nCurrent indexes on ProvidedServices:');
    const serviceIndexes = await servicesCol.listIndexes().toArray();
    serviceIndexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });
    
    console.log('\nCurrent indexes on ServiceProviders:');
    const providerIndexes = await providersCol.listIndexes().toArray();
    providerIndexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });
    
    console.log('\n✅ Database indexes optimized successfully!');
    console.log('\nOptimizations applied:');
    console.log('  • Compound geospatial index for location + category queries');
    console.log('  • City-based compound index for non-GPS queries');
    console.log('  • ServiceProviderKey index for efficient $lookup joins');
    console.log('  • Provider Key + Verified index for fast provider lookups');
    console.log('  • Sorting optimization index for alphabetical results');
    
  } catch (error) {
    console.error('❌ Error optimizing database indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the optimization if this script is executed directly
if (require.main === module) {
  createOptimizedIndexes()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Failed to optimize indexes:', error);
      process.exit(1);
    });
}

module.exports = { createOptimizedIndexes };