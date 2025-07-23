#!/usr/bin/env node

/**
 * Coventry Services Geospatial Debug Script
 * 
 * This script investigates why geospatial queries for Coventry services
 * are not returning the expected number of results when the radius is increased.
 * 
 * Run with: node scripts/debug-coventry-services.js
 */

import { MongoClient } from 'mongodb';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'streetsupport';

// Coventry coordinates
const COVENTRY_LAT = 52.40709;
const COVENTRY_LNG = -1.507613;

async function debugCoventryServices() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔍 Debugging Coventry Services Geospatial Query Issues');
    console.log('=====================================================\n');
    
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const servicesCol = db.collection('ProvidedServices');
    
    console.log(`📍 Coventry coordinates: ${COVENTRY_LAT}, ${COVENTRY_LNG}\n`);
    
    // 1. Check if geospatial index exists
    console.log('1. Checking geospatial indexes...');
    const indexes = await servicesCol.listIndexes().toArray();
    const geoIndexes = indexes.filter(idx => 
      JSON.stringify(idx.key).includes('2dsphere') || 
      JSON.stringify(idx.key).includes('Address.Location')
    );
    
    if (geoIndexes.length === 0) {
      console.log('❌ No geospatial indexes found!');
      console.log('   This could be causing performance issues or query failures.\n');
    } else {
      console.log('✅ Found geospatial indexes:');
      geoIndexes.forEach(idx => {
        console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
      });
      console.log('');
    }
    
    // 2. Check data structure consistency
    console.log('2. Analyzing Address.Location data structure...');
    const sampleDocs = await servicesCol.find({
      IsPublished: true,
      'Address.Location': { $exists: true }
    }).limit(5).toArray();
    
    console.log(`📊 Found ${sampleDocs.length} services with Address.Location field`);
    
    if (sampleDocs.length > 0) {
      console.log('   Sample Address.Location structures:');
      sampleDocs.forEach((doc, i) => {
        console.log(`   ${i + 1}. ${JSON.stringify(doc.Address?.Location)}`);
      });
      console.log('');
    }
    
    // 3. Count total published services
    console.log('3. Counting total published services...');
    const totalPublished = await servicesCol.countDocuments({ IsPublished: true });
    console.log(`📈 Total published services: ${totalPublished}\n`);
    
    // 4. Count services with valid geospatial data
    console.log('4. Counting services with valid geospatial data...');
    const geoServicesCount = await servicesCol.countDocuments({
      IsPublished: true,
      'Address.Location.type': 'Point',
      'Address.Location.coordinates': { $exists: true, $type: 'array' }
    });
    console.log(`🌍 Services with valid GeoJSON Point data: ${geoServicesCount}\n`);
    
    // 5. Test different radius queries
    console.log('5. Testing geospatial queries with different radii...');
    const radii = [5, 10, 25, 50, 100];
    
    for (const radius of radii) {
      try {
        const pipeline = [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [COVENTRY_LNG, COVENTRY_LAT]
              },
              distanceField: "distance",
              maxDistance: radius * 1000, // Convert km to meters
              spherical: true,
              query: { IsPublished: true }
            }
          },
          { $count: "total" }
        ];
        
        const result = await servicesCol.aggregate(pipeline).toArray();
        const count = result.length > 0 ? result[0].total : 0;
        console.log(`   📏 ${radius}km radius: ${count} services`);
        
        if (radius === 5) {
          // Get sample results for 5km to check distances
          const samplePipeline = [
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [COVENTRY_LNG, COVENTRY_LAT]
                },
                distanceField: "distance",
                maxDistance: radius * 1000,
                spherical: true,
                query: { IsPublished: true }
              }
            },
            { $limit: 5 },
            {
              $project: {
                ServiceProviderName: 1,
                'Address.City': 1,
                'Address.Location': 1,
                distance: 1
              }
            }
          ];
          
          const samples = await servicesCol.aggregate(samplePipeline).toArray();
          console.log('     Sample services within 5km:');
          samples.forEach((service, i) => {
            const distanceKm = Math.round(service.distance / 1000 * 100) / 100;
            console.log(`     ${i + 1}. ${service.ServiceProviderName} (${service.Address?.City}) - ${distanceKm}km`);
          });
        }
        
      } catch (error) {
        console.log(`   ❌ ${radius}km radius: Query failed - ${error.message}`);
      }
    }
    console.log('');
    
    // 6. Check for services around Coventry without geospatial query
    console.log('6. Checking services in Coventry area using city name...');
    const coventryServices = await servicesCol.countDocuments({
      IsPublished: true,
      'Address.City': { $regex: /coventry/i }
    });
    console.log(`🏙️ Services with "Coventry" in Address.City: ${coventryServices}\n`);
    
    // 7. Check for data quality issues
    console.log('7. Checking for data quality issues...');
    
    // Invalid coordinates
    const invalidCoords = await servicesCol.countDocuments({
      IsPublished: true,
      $or: [
        { 'Address.Location.coordinates.0': { $not: { $gte: -180, $lte: 180 } } },
        { 'Address.Location.coordinates.1': { $not: { $gte: -90, $lte: 90 } } },
        { 'Address.Location.coordinates': { $size: { $ne: 2 } } }
      ]
    });
    console.log(`⚠️ Services with invalid coordinates: ${invalidCoords}`);
    
    // Missing coordinates
    const missingCoords = await servicesCol.countDocuments({
      IsPublished: true,
      $or: [
        { 'Address.Location': { $exists: false } },
        { 'Address.Location.coordinates': { $exists: false } },
        { 'Address.Location.type': { $ne: 'Point' } }
      ]
    });
    console.log(`📍 Services missing valid geospatial data: ${missingCoords}\n`);
    
    // 8. Recommendations
    console.log('8. Recommendations:');
    console.log('==================');
    
    if (geoIndexes.length === 0) {
      console.log('🔧 Run the index optimization script:');
      console.log('   node scripts/optimize-database-indexes.js\n');
    }
    
    if (missingCoords > 0) {
      console.log('🔧 Consider updating services with missing geospatial data');
      console.log('   to include proper Address.Location GeoJSON Point format\n');
    }
    
    if (invalidCoords > 0) {
      console.log('🔧 Fix services with invalid coordinates to ensure');
      console.log('   they are included in geospatial queries\n');
    }
    
    console.log('🔧 To add debug logging to the API, modify the console.error');
    console.log('   statements in /api/services/route.ts to include query details\n');
    
    console.log('✅ Diagnostic complete!');
    
  } catch (error) {
    console.error('❌ Error during diagnostic:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the diagnostic if this script is executed directly
debugCoventryServices()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Failed to run diagnostic:', error);
    process.exit(1);
  });

export { debugCoventryServices };