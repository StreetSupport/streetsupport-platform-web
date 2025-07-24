#!/usr/bin/env node

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function debugTrussellTrust() {
  console.log('🔍 Debugging Trussell Trust Location Count Issue');
  console.log('===============================================\n');

  const slug = 'ymcaheartofengland';
  const url = `${BASE_URL}/api/service-providers/${slug}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'success' && data.organisation) {
      const org = data.organisation;
      console.log(`📋 Organisation: ${org.name}`);
      console.log(`📊 Total services: ${org.services?.length || 0}\n`);
      
      // Analyze services structure
      const services = org.services || [];
      console.log('🏪 Service breakdown:');
      
      const categoryMap = new Map();
      const locationMap = new Map();
      
      services.forEach((service, i) => {
        const category = service.categoryName || 'Other';
        const subcategory = service.subCategoryName || 'Other';
        const address = service.address;
        
        console.log(`${i+1}. ${service.name || subcategory}`);
        console.log(`   Category: ${category} / ${subcategory}`);
        
        if (address?.Location?.coordinates) {
          const coords = `${address.Location.coordinates[0]},${address.Location.coordinates[1]}`;
          console.log(`   Address: ${[address.Street, address.City, address.Postcode].filter(Boolean).join(', ')}`);
          console.log(`   Coords: [${coords}]`);
          
          // Track for location deduplication
          if (!locationMap.has(coords)) {
            locationMap.set(coords, []);
          }
          locationMap.get(coords).push({
            service: service.name || subcategory,
            category: `${category}/${subcategory}`
          });
        } else {
          console.log('   Address: No coordinates');
        }
        
        // Track for category grouping (as accordion does)
        const catKey = `${category}/${subcategory}`;
        if (!categoryMap.has(catKey)) {
          categoryMap.set(catKey, []);
        }
        categoryMap.get(catKey).push(service);
        
        console.log('');
      });
      
      console.log('\n📍 Unique locations (as OrganisationLocations would count):');
      console.log(`Total unique coordinates: ${locationMap.size}`);
      locationMap.forEach((services, coords) => {
        console.log(`   ${coords}: ${services.length} service(s)`);
        services.forEach(s => console.log(`     - ${s.service} (${s.category})`));
      });
      
      console.log('\n🎯 Service categories (as accordion groups them):');
      categoryMap.forEach((services, catKey) => {
        console.log(`   ${catKey}: ${services.length} location(s) - accordion would show "Available at ${services.length} locations"`);
      });
      
      // Org addresses count
      const orgAddresses = org.addresses || [];
      const validOrgAddresses = orgAddresses.filter(addr => 
        addr.Location?.coordinates?.length === 2
      );
      
      console.log(`\n🏢 Organisation addresses: ${validOrgAddresses.length}`);
      
      console.log('\n💡 Analysis:');
      console.log(`- OrganisationLocations shows: ${validOrgAddresses.length + locationMap.size} locations (org addresses + unique service locations)`);
      console.log(`- Service accordion shows: varies by service category (each service instance = 1 location)`);
      
      if (categoryMap.size === 1) {
        const firstCategory = Array.from(categoryMap.values())[0];
        console.log(`- For single service type: "${firstCategory.length} locations" in accordion`);
        
        if (firstCategory.length !== locationMap.size) {
          console.log('⚠️  MISMATCH DETECTED! Some services share the same location coordinates.');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugTrussellTrust().catch(console.error);