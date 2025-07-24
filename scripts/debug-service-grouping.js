#!/usr/bin/env node

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const COVENTRY_LAT = 52.40709;
const COVENTRY_LNG = -1.507613;

async function debugServiceGrouping() {
  console.log('🔍 Debugging Service Grouping Issue');
  console.log('===================================\n');

  const url = `${BASE_URL}/api/services?lat=${COVENTRY_LAT}&lng=${COVENTRY_LNG}&radius=5&limit=100`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results) {
      // Find Coventry Foodbank
      const foodbankServices = data.results.filter(s => 
        s.organisation?.name?.toLowerCase().includes('coventry foodbank') ||
        s.ServiceProviderName?.toLowerCase().includes('coventry foodbank')
      );
      
      console.log(`Found ${foodbankServices.length} services for Coventry Foodbank:\n`);
      
      // Group by unique service type/subcategory
      const uniqueServices = new Map();
      
      foodbankServices.forEach((service, index) => {
        console.log(`Service ${index + 1}:`);
        console.log(`  Name: ${service.name || service.ServiceProviderName}`);
        console.log(`  Category: ${service.ParentCategoryKey || service.category}`);
        console.log(`  SubCategory: ${service.SubCategoryKey || service.subCategory}`);
        console.log(`  Description: ${(service.description || service.Info || '').substring(0, 100)}...`);
        console.log(`  Distance: ${service.distance}km`);
        console.log(`  Location: ${service.Address?.Location?.coordinates || 'N/A'}`);
        console.log('');
        
        // Track unique services by subcategory
        const key = service.SubCategoryKey || service.subCategory || 'unknown';
        if (!uniqueServices.has(key)) {
          uniqueServices.set(key, []);
        }
        uniqueServices.get(key).push(service);
      });
      
      console.log('\n📊 Summary:');
      console.log(`Total service entries: ${foodbankServices.length}`);
      console.log(`Unique service types: ${uniqueServices.size}`);
      console.log('\nService types breakdown:');
      uniqueServices.forEach((services, key) => {
        console.log(`  - ${key}: ${services.length} location(s)`);
      });
      
      // Check for duplicate entries
      console.log('\n🔍 Checking for potential duplicates...');
      const servicesByLocation = new Map();
      foodbankServices.forEach(service => {
        const coords = service.Address?.Location?.coordinates;
        if (coords) {
          const locKey = `${coords[0]},${coords[1]}`;
          if (!servicesByLocation.has(locKey)) {
            servicesByLocation.set(locKey, []);
          }
          servicesByLocation.get(locKey).push(service);
        }
      });
      
      console.log(`\nUnique locations: ${servicesByLocation.size}`);
      if (servicesByLocation.size < foodbankServices.length) {
        console.log('⚠️  Multiple services at same location detected!');
        servicesByLocation.forEach((services, location) => {
          if (services.length > 1) {
            console.log(`\nLocation ${location} has ${services.length} services:`);
            services.forEach(s => {
              console.log(`  - ${s.SubCategoryKey || s.subCategory || 'unknown'}`);
            });
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugServiceGrouping().catch(console.error);