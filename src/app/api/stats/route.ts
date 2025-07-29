import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    
    // Count published organisations
    const organisationsCount = await db.collection('ServiceProviders').countDocuments({
      IsPublished: true
    });
    
    // Get all published organisations to count their services
    const publishedOrgs = await db.collection('ServiceProviders')
      .find({ IsPublished: true })
      .project({ Key: 1 })
      .toArray();
    
    const orgKeys = publishedOrgs.map(org => org.Key);
    
    // Count services from published organisations only
    const servicesCount = await db.collection('ProvidedServices').countDocuments({
      ServiceProviderKey: { $in: orgKeys },
      IsPublished: true
    });
    
    // Count public cities/locations (partnerships)
    const locationsCount = await db.collection('Cities').countDocuments({
      IsPublic: true
    });
    
    return NextResponse.json({
      organisations: organisationsCount,
      services: servicesCount,
      partnerships: locationsCount
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    
    // Fallback to JSON data if database is not available
    try {
      const serviceProviders = require('@/data/service-providers.json');
      const locations = require('@/data/locations.json');
      
      // Count organisations from JSON (all are considered public in fallback)
      const organisationsCount = serviceProviders.length;
      
      // Count services from organisations
      let servicesCount = 0;
      serviceProviders.forEach((provider: any) => {
        if (provider.services && Array.isArray(provider.services)) {
          servicesCount += provider.services.length;
        }
      });
      
      // Count locations that are public
      const publicLocations = locations.filter((location: any) => 
        location.isPublic === true
      );
      
      return NextResponse.json({
        organisations: organisationsCount,
        services: servicesCount,
        partnerships: publicLocations.length
      });
    } catch (fallbackError) {
      console.error('Error with fallback data:', fallbackError);
      return NextResponse.json({
        organisations: 0,
        services: 0,
        partnerships: 0
      });
    }
  }
}