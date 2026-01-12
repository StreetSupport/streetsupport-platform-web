import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locationsParam = searchParams.get('locations');

    if (!locationsParam) {
      return NextResponse.json(
        { status: 'error', message: 'Locations parameter is required' },
        { status: 400 }
      );
    }

    const locationSlugs = locationsParam.split(',').map(s => s.trim());

    if (locationSlugs.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'At least one location slug is required' },
        { status: 400 }
      );
    }

    const client = await getClientPromise();
    const db = client.db('streetsupport');

    const organisationsCol = db.collection('ServiceProviders');
    const servicesCol = db.collection('ProvidedServices');

    // Find unique organisations that are tagged to ANY of the locations
    const organisations = await organisationsCol.find({
      IsPublished: true,
      AssociatedLocationIds: { $in: locationSlugs }
    }).toArray();

    const organisationKeys = organisations.map(org => org.Key);

    // Count unique services from those organisations
    const uniqueServices = await servicesCol.aggregate([
      {
        $match: {
          IsPublished: true,
          ServiceProviderKey: { $in: organisationKeys }
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

    const serviceCount = uniqueServices[0]?.total || 0;

    const stats = {
      organisations: organisations.length,
      services: serviceCount,
      locations: locationSlugs
    };

    const response = NextResponse.json({
      status: 'success',
      data: stats
    });

    // Add cache headers
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');

    return response;
  } catch (error) {
    console.error('[API ERROR] /api/locations/regional-stats:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch regional statistics. Please try again later.'
      },
      { status: 503 }
    );
  }
}
