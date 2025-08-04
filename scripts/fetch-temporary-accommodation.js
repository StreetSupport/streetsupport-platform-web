// scripts/fetch-temporary-accommodation.js

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  const outputPath = path.join('./src/data/temporary-accommodation.json');
  
  if (!uri || process.env.USE_FALLBACK === 'true') {
    console.log('⚠️  MONGODB_URI not available, using fallback data...');
    
    // Create fallback data structure if fallback file doesn't exist
    const fallbackPath = path.join('./public/data/temporary-accommodation-fallback.json');
    let fallbackData;
    
    if (fs.existsSync(fallbackPath)) {
      fallbackData = fs.readFileSync(fallbackPath, 'utf8');
    } else {
      console.log('⚠️  No fallback file found, creating empty structure...');
      fallbackData = JSON.stringify([], null, 2);
    }
    
    fs.writeFileSync(outputPath, fallbackData);
    console.log(`✅ Fallback temporary accommodation data saved to ${outputPath}`);
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('streetsupport');

    console.log('🔍 Fetching temporary accommodation data...');

    // Fetch from TemporaryAccommodation collection
    const tempAccommodation = await db
      .collection('TemporaryAccommodation')
      .find({ 
        'GeneralInfo.IsPubliclyVisible': true,
        'Address.IsPubliclyHidden': { $ne: true }
      })
      .project({
        _id: 1,
        DocumentCreationDate: 1,
        DocumentModifiedDate: 1,
        GeneralInfo: 1,
        PricingAndRequirementsInfo: 1,
        ContactInformation: 1,
        Address: 1,
        FeaturesWithDiscretionary: 1,
        ResidentCriteriaInfo: 1,
        SupportProvidedInfo: 1
      })
      .toArray();

    console.log(`📊 Found ${tempAccommodation.length} temporary accommodation entries`);

    // Transform data to consistent format
    const transformedData = tempAccommodation.map(item => ({
      id: item._id.toString(),
      name: item.GeneralInfo?.Name || '',
      synopsis: item.GeneralInfo?.Synopsis || '',
      description: item.GeneralInfo?.Description || '',
      serviceProviderId: item.GeneralInfo?.ServiceProviderId || '',
      address: {
        street1: item.Address?.Street1 || '',
        street2: item.Address?.Street2 || '',
        street3: item.Address?.Street3 || '',
        city: item.Address?.City || '',
        postcode: item.Address?.Postcode || '',
        latitude: item.Address?.Location?.coordinates?.[1] || null,
        longitude: item.Address?.Location?.coordinates?.[0] || null,
        publicTransportInfo: item.Address?.PublicTransportInfo || '',
        associatedCityId: item.Address?.AssociatedCityId || ''
      },
      contact: {
        name: item.ContactInformation?.Name || '',
        telephone: item.ContactInformation?.Telephone || '',
        email: item.ContactInformation?.Email || '',
        additionalInfo: item.ContactInformation?.AdditionalInfo || ''
      },
      accommodation: {
        type: item.GeneralInfo?.AccommodationType || '',
        isOpenAccess: item.GeneralInfo?.IsOpenAccess || false,
        supportOffered: item.GeneralInfo?.SupportOffered || [],
        referralRequired: item.PricingAndRequirementsInfo?.ReferralIsRequired || false,
        referralNotes: item.PricingAndRequirementsInfo?.ReferralNotes || '',
        price: item.PricingAndRequirementsInfo?.Price || '',
        foodIncluded: item.PricingAndRequirementsInfo?.FoodIsIncluded || 0,
        availabilityOfMeals: item.PricingAndRequirementsInfo?.AvailabilityOfMeals || ''
      },
      features: {
        acceptsHousingBenefit: item.FeaturesWithDiscretionary?.AcceptsHousingBenefit || 0,
        acceptsPets: item.FeaturesWithDiscretionary?.AcceptsPets || 0,
        acceptsCouples: item.FeaturesWithDiscretionary?.AcceptsCouples || 0,
        hasDisabledAccess: item.FeaturesWithDiscretionary?.HasDisabledAccess || 0,
        isSuitableForWomen: item.FeaturesWithDiscretionary?.IsSuitableForWomen || 0,
        isSuitableForYoungPeople: item.FeaturesWithDiscretionary?.IsSuitableForYoungPeople || 0,
        hasSingleRooms: item.FeaturesWithDiscretionary?.HasSingleRooms || 0,
        hasSharedRooms: item.FeaturesWithDiscretionary?.HasSharedRooms || 0,
        hasShowerBathroomFacilities: item.FeaturesWithDiscretionary?.HasShowerBathroomFacilities || 0,
        hasAccessToKitchen: item.FeaturesWithDiscretionary?.HasAccessToKitchen || 0,
        hasLaundryFacilities: item.FeaturesWithDiscretionary?.HasLaundryFacilities || 0,
        hasLounge: item.FeaturesWithDiscretionary?.HasLounge || 0,
        allowsVisitors: item.FeaturesWithDiscretionary?.AllowsVisitors || 0,
        hasOnSiteManager: item.FeaturesWithDiscretionary?.HasOnSiteManager || 0,
        additionalFeatures: item.FeaturesWithDiscretionary?.AdditionalFeatures || ''
      },
      residentCriteria: {
        acceptsMen: item.ResidentCriteriaInfo?.AcceptsMen || false,
        acceptsWomen: item.ResidentCriteriaInfo?.AcceptsWomen || false,
        acceptsCouples: item.ResidentCriteriaInfo?.AcceptsCouples || false,
        acceptsYoungPeople: item.ResidentCriteriaInfo?.AcceptsYoungPeople || false,
        acceptsFamilies: item.ResidentCriteriaInfo?.AcceptsFamilies || false,
        acceptsBenefitsClaimants: item.ResidentCriteriaInfo?.AcceptsBenefitsClaimants || false
      },
      support: {
        hasOnSiteManager: item.SupportProvidedInfo?.HasOnSiteManager || 0,
        supportOffered: item.SupportProvidedInfo?.SupportOffered || [],
        supportInfo: item.SupportProvidedInfo?.SupportInfo || ''
      },
      metadata: {
        createdDate: item.DocumentCreationDate || null,
        lastModifiedDate: item.DocumentModifiedDate || null
      }
    }));

    // Write to file
    fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

    console.log(`✅ Temporary accommodation data saved to ${outputPath}`);
    console.log(`📈 Total entries: ${transformedData.length}`);
    
    // Log some statistics
    const withCoordinates = transformedData.filter(item => 
      item.address.latitude && item.address.longitude
    ).length;
    
    const accommodationTypes = [...new Set(
      transformedData
        .map(item => item.accommodation.type)
        .filter(type => type)
    )];
    
    const cities = [...new Set(
      transformedData
        .map(item => item.address.city)
        .filter(city => city)
    )];
    
    console.log(`📍 Entries with coordinates: ${withCoordinates}/${transformedData.length}`);
    console.log(`🏠 Accommodation types found: ${accommodationTypes.join(', ')}`);
    console.log(`🏙️  Cities covered: ${cities.slice(0, 10).join(', ')}${cities.length > 10 ? '...' : ''}`);
    
  } catch (err) {
    console.error('❌ Failed to fetch temporary accommodation data:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();