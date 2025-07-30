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
    
    // Count unique services grouped by organisation + category + subcategory
    const uniqueServices = await db.collection('ProvidedServices').aggregate([
      {
        $match: {
          ServiceProviderKey: { $in: orgKeys },
          IsPublished: true
        }
      },
      {
        $group: {
          _id: {
            provider: '$ServiceProviderKey',
            category: '$ParentCategoryKey',
            subcategory: '$SubCategoryKey'
          }
        }
      },
      {
        $count: 'total'
      }
    ]).toArray();
    
    const servicesCount = uniqueServices[0]?.total || 0;
    
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
      const serviceProviders = await import('@/data/service-providers.json');
      const locations = await import('@/data/locations.json');
      
      // Count organisations from JSON (all are considered public in fallback)
      const organisationsCount = serviceProviders.default.length;
      
      // Count unique services grouped by organisation + category + subcategory
      const uniqueServiceKeys = new Set<string>();
      serviceProviders.default.forEach((provider: { id: string; services?: { category: string; subCategory: string }[] }) => {
        if (provider.services && Array.isArray(provider.services)) {
          provider.services.forEach((service: { category: string; subCategory: string }) => {
            const uniqueKey = `${provider.id}-${service.category}-${service.subCategory}`;
            uniqueServiceKeys.add(uniqueKey);
          });
        }
      });
      const servicesCount = uniqueServiceKeys.size;
      
      // Count locations that are public
      const publicLocations = locations.default.filter((location: { isPublic: boolean }) => 
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