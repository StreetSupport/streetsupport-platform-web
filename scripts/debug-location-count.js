#!/usr/bin/env node

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function debugLocationCount() {
  console.log('🔍 Debugging Location Count Issue');
  console.log('=================================\n');

  // Test with Coventry Trussell Trust
  const slug = 'coventry-trussell-trust-foodbank';
  const url = `${BASE_URL}/api/service-providers/${slug}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'success' && data.organisation) {
      const org = data.organisation;
      console.log(`📋 Organisation: ${org.name}\n`);
      
      // Count organisation addresses
      const orgAddresses = org.addresses || [];
      const validOrgAddresses = orgAddresses.filter(addr => 
        addr.Location?.coordinates?.length === 2
      );
      
      console.log(`🏢 Organisation addresses: ${validOrgAddresses.length}`);
      validOrgAddresses.forEach((addr, i) => {
        console.log(`   ${i+1}. ${[addr.Street, addr.City, addr.Postcode].filter(Boolean).join(', ')}`);
        console.log(`      Coords: ${addr.Location.coordinates}`);
      });
      
      // Count service locations
      const services = org.services || [];
      const serviceLocationMap = new Map();
      
      services.forEach((service) => {
        const addr = service.address;
        if (addr?.Location?.coordinates?.length === 2) {
          const key = `${addr.Location.coordinates[0]},${addr.Location.coordinates[1]}`;
          if (!serviceLocationMap.has(key)) {
            serviceLocationMap.set(key, {
              address: [addr.Street, addr.City, addr.Postcode].filter(Boolean).join(', '),
              services: []
            });
          }
          serviceLocationMap.get(key).services.push(service.name || service.subCategoryName);
        }
      });
      
      console.log(`\n🏪 Unique service locations: ${serviceLocationMap.size}`);
      let i = 1;
      serviceLocationMap.forEach((loc, coords) => {
        console.log(`   ${i}. ${loc.address}`);
        console.log(`      Coords: [${coords}]`);
        console.log(`      Services: ${loc.services.join(', ')}`);
        i++;
      });
      
      // Check for overlap between org addresses and service addresses
      console.log('\n🔍 Checking for overlapping locations...');
      let overlaps = 0;
      validOrgAddresses.forEach(orgAddr => {
        const orgKey = `${orgAddr.Location.coordinates[0]},${orgAddr.Location.coordinates[1]}`;
        if (serviceLocationMap.has(orgKey)) {
          overlaps++;
          console.log(`   ⚠️ Organisation address overlaps with service location at: ${orgKey}`);
        }
      });
      
      if (overlaps === 0) {
        console.log('   ✅ No overlapping locations found');
      }
      
      // Total unique locations
      const allLocationKeys = new Set();
      validOrgAddresses.forEach(addr => {
        allLocationKeys.add(`${addr.Location.coordinates[0]},${addr.Location.coordinates[1]}`);
      });
      serviceLocationMap.forEach((_, key) => {
        allLocationKeys.add(key);
      });
      
      console.log(`\n📍 Total unique locations: ${allLocationKeys.size}`);
      console.log(`   (${validOrgAddresses.length} org addresses + ${serviceLocationMap.size} service locations - ${overlaps} overlaps)`);
      
      // This is what the UI would show
      const uiLocationCount = validOrgAddresses.length + serviceLocationMap.size;
      console.log(`\n🖥️ UI would show: ${uiLocationCount} locations`);
      
      if (uiLocationCount > allLocationKeys.size) {
        console.log('   ⚠️ This is higher than actual unique locations due to overlaps!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugLocationCount().catch(console.error);