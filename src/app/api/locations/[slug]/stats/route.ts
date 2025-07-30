import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

interface LocationStatsParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: Request, context: LocationStatsParams) {
  try {
    const { slug } = await context.params;
    
    if (!slug) {
      return NextResponse.json(
        { status: 'error', message: 'Location slug is required' },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db('streetsupport');
    
    // Get published organisations for this location
    const organisationsCol = db.collection('ServiceProviders');
    const servicesCol = db.collection('ProvidedServices');
    
    // Find organisations tagged to this location that are published
    const organisations = await organisationsCol.find({
      IsPublished: true,
      AssociatedLocationIds: slug
    }).toArray();
    
    const organisationKeys = organisations.map(org => org.Key);
    
    // Count services provided by these organisations
    const serviceCount = await servicesCol.countDocuments({
      IsPublished: true,
      ServiceProviderKey: { $in: organisationKeys }
    });
    
    const stats = {
      organisations: organisations.length,
      services: serviceCount,
      location: slug
    };

    const response = NextResponse.json({
      status: 'success',
      data: stats
    });

    // Add cache headers
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=7200'); // 1 hour browser, 2 hours CDN
    
    return response;
  } catch (error) {
    console.error('[API ERROR] /api/locations/[slug]/stats:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch location statistics. Please try again later.' 
      },
      { status: 503 }
    );
  }
}