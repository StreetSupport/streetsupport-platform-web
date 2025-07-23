#!/usr/bin/env node

// Run with: node scripts/test-coventry-api.js

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const COVENTRY_LAT = 52.40709;
const COVENTRY_LNG = -1.507613;

async function testCoventryAPI() {
  console.log('🔍 Testing Coventry Services API');
  console.log('================================\n');

  const radii = [5, 10, 25];
  const results = [];

  for (const radius of radii) {
    try {
      const url = `${BASE_URL}/api/services?lat=${COVENTRY_LAT}&lng=${COVENTRY_LNG}&radius=${radius}&limit=100`;
      console.log(`📡 Testing ${radius}km radius...`);
      console.log(`   URL: ${url}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      results.push({
        radius,
        total: data.total,
        returned: data.results?.length || 0,
        cacheStatus: response.headers.get('X-Cache') || 'unknown'
      });
      
      console.log(`   Total: ${data.total}`);
      console.log(`   Returned: ${data.results?.length || 0}`);
      console.log(`   Cache: ${response.headers.get('X-Cache') || 'unknown'}`);
      
      // Show sample services
      if (data.results && data.results.length > 0) {
        console.log('   Sample services:');
        data.results.slice(0, 3).forEach((service, i) => {
          console.log(`     ${i+1}. ${service.name} (${service.distance}km)`);
        });
      }
      console.log('');
      
      // Wait a bit between requests to avoid cache issues
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error testing ${radius}km:`, error.message);
    }
  }

  // Summary
  console.log('📊 Summary:');
  console.log('===========');
  results.forEach(r => {
    console.log(`${r.radius}km: ${r.total} services (cache: ${r.cacheStatus})`);
  });

  // Check if results are the same
  if (results.length > 1 && results.every(r => r.total === results[0].total)) {
    console.log('\n⚠️  WARNING: All radius searches returned the same number of services!');
    console.log('This suggests a potential issue with the geospatial query.');
  }
}

// Run the test
testCoventryAPI().catch(console.error);