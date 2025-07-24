#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('./src/data/service-providers.json', 'utf8'));
const COVENTRY_LAT = 52.40709;
const COVENTRY_LNG = -1.507613;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

// First, let's examine the data structure
console.log('🔍 Coventry Services Analysis');
console.log('============================');
console.log(`📍 Coventry coordinates: ${COVENTRY_LAT}, ${COVENTRY_LNG}`);
console.log(`📊 Total providers: ${data.length}`);

// Sample the first few providers to understand structure
console.log('\n🔬 Sample provider structures:');
data.slice(0, 3).forEach((provider, i) => {
  console.log(`   Provider ${i+1}: ${provider.name}`);
  console.log(`   Services: ${provider.services ? provider.services.length : 'none'}`);
  if (provider.services && provider.services[0]) {
    const firstService = provider.services[0];
    console.log(`   First service coords: lat=${firstService.latitude}, lng=${firstService.longitude}`);
  }
  console.log('');
});

let allServices = data.flatMap(provider => 
  (provider.services || []).map(service => ({
    ...service,
    provider: provider.name,
    distance: service.latitude && service.longitude ? 
      calculateDistance(COVENTRY_LAT, COVENTRY_LNG, service.latitude, service.longitude) : null
  }))
);

console.log(`📊 Total services: ${allServices.length}`);
console.log(`📊 Services with coordinates: ${allServices.filter(s => s.distance !== null).length}`);
console.log(`📊 Services without coordinates: ${allServices.filter(s => s.distance === null).length}`);

// Show sample services with coordinates
const withCoords = allServices.filter(s => s.distance !== null).slice(0, 10);
console.log('\n📍 Sample services with coordinates:');
withCoords.forEach((s, i) => {
  console.log(`   ${i+1}. ${s.provider} - ${s.name} (lat: ${s.latitude}, lng: ${s.longitude}, distance: ${s.distance}km)`);
});

// Filter services within different radii
let within5km = allServices.filter(s => s.distance !== null && s.distance <= 5);
let within10km = allServices.filter(s => s.distance !== null && s.distance <= 10);
let within25km = allServices.filter(s => s.distance !== null && s.distance <= 25);
let within100km = allServices.filter(s => s.distance !== null && s.distance <= 100);

console.log('\n📏 Services by radius:');
console.log(`   Within 5km: ${within5km.length}`);
console.log(`   Within 10km: ${within10km.length}`);
console.log(`   Within 25km: ${within25km.length}`);
console.log(`   Within 100km: ${within100km.length}`);

// Show the closest services to Coventry
const sortedByDistance = allServices.filter(s => s.distance !== null).sort((a,b) => a.distance - b.distance);
console.log('\n🎯 Closest services to Coventry:');
sortedByDistance.slice(0, 10).forEach((s, i) => 
  console.log(`   ${i+1}. ${s.provider} - ${s.name} (${s.distance}km)`)
);