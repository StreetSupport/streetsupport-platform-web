#!/usr/bin/env node

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const COVENTRY_LAT = 52.40709;
const COVENTRY_LNG = -1.507613;

async function debugGrouping() {
  console.log('🔍 Debugging Service Grouping for Coventry');
  console.log('==========================================\n');

  const radii = [5, 10];
  
  for (const radius of radii) {
    const url = `${BASE_URL}/api/services?lat=${COVENTRY_LAT}&lng=${COVENTRY_LNG}&radius=${radius}&limit=100`;
    console.log(`📡 Fetching ${radius}km radius data...`);
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Group services by organisation (mimicking frontend logic)
      const orgMap = new Map();
      
      if (data.results) {
        data.results.forEach(service => {
          const orgKey = service.organisationSlug || service.ServiceProviderKey || 'unknown';
          if (!orgMap.has(orgKey)) {
            orgMap.set(orgKey, {
              name: service.organisation?.name || service.ServiceProviderName,
              services: []
            });
          }
          orgMap.get(orgKey).services.push(service);
        });
      }
      
      console.log(`\n📊 Results for ${radius}km:`);
      console.log(`   Total individual services: ${data.total}`);
      console.log(`   Services returned in this batch: ${data.results?.length || 0}`);
      console.log(`   Number of unique organisations: ${orgMap.size}`);
      console.log(`   Average services per organisation: ${data.results ? (data.results.length / orgMap.size).toFixed(1) : 0}`);
      
      // Show sample organisations with multiple services
      const orgsWithMultiple = Array.from(orgMap.entries())
        .filter(([_, org]) => org.services.length > 1)
        .sort((a, b) => b[1].services.length - a[1].services.length)
        .slice(0, 5);
        
      if (orgsWithMultiple.length > 0) {
        console.log('\n   Top organisations with multiple services:');
        orgsWithMultiple.forEach(([_, org]) => {
          console.log(`     - ${org.name}: ${org.services.length} services`);
        });
      }
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n💡 Insight: The UI shows organisation groups, not individual services!');
  console.log('   If you see "29" in the UI, that means 29 organisation groups.');
}

debugGrouping().catch(console.error);