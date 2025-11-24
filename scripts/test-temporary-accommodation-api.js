// scripts/test-temporary-accommodation-api.js

import fs from 'fs';
import path from 'path';

async function testAPI() {
  console.log('🧪 Testing Temporary Accommodation API...');
  
  // Check if the JSON file exists
  const dataPath = path.join('./src/data/temporary-accommodation.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('❌ Data file does not exist at:', dataPath);
    return;
  }
  
  // Read and validate JSON structure
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`✅ JSON file loaded successfully`);
    console.log(`📊 Total accommodations: ${data.length}`);
    
    if (data.length > 0) {
      const sample = data[0];
      console.log(`📋 Sample accommodation:`, {
        id: sample.id,
        name: sample.name,
        city: sample.address?.city,
        type: sample.accommodation?.type,
        hasCoordinates: !!(sample.address?.latitude && sample.address?.longitude)
      });
      
      // Check required fields
      const requiredFields = ['id', 'name', 'address', 'accommodation'];
      const missingFields = requiredFields.filter(field => !sample[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields present');
      } else {
        console.warn('⚠️  Missing required fields:', missingFields);
      }
      
      // Check data types
      const typeChecks = [
        { field: 'accommodation.referralRequired', expected: 'boolean', actual: typeof sample.accommodation?.referralRequired },
        { field: 'features.acceptsHousingBenefit', expected: 'number', actual: typeof sample.features?.acceptsHousingBenefit },
        { field: 'residentCriteria.acceptsMen', expected: 'boolean', actual: typeof sample.residentCriteria?.acceptsMen }
      ];
      
      typeChecks.forEach(check => {
        if (check.actual === check.expected) {
          console.log(`✅ ${check.field}: ${check.expected}`);
        } else {
          console.warn(`⚠️  ${check.field}: expected ${check.expected}, got ${check.actual}`);
        }
      });
    }
    
    // Test filtering capabilities
    const accommodationTypes = [...new Set(
      data.map(item => item.accommodation?.type).filter(Boolean)
    )];
    
    const cities = [...new Set(
      data.map(item => item.address?.city).filter(Boolean)
    )];
    
    console.log(`🏠 Accommodation types: ${accommodationTypes.slice(0, 5).join(', ')}${accommodationTypes.length > 5 ? '...' : ''}`);
    console.log(`🏙️  Cities: ${cities.slice(0, 5).join(', ')}${cities.length > 5 ? '...' : ''}`);
    
    // Test geospatial data
    const withCoordinates = data.filter(item => 
      item.address?.latitude && item.address?.longitude
    ).length;
    
    console.log(`📍 Entries with coordinates: ${withCoordinates}/${data.length} (${Math.round(withCoordinates/data.length*100)}%)`);
    
    console.log('✅ Temporary Accommodation API data validation completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to validate JSON data:', error.message);
  }
}

testAPI();