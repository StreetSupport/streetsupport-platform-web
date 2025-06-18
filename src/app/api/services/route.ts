import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid page or limit value' },
      { status: 400 }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const servicesCol = db.collection('ProvidedServices');
    const providersCol = db.collection('ServiceProviders');

        // Build filter
    const query: any = {};
    if (location) {
      query['Address.City'] = { $regex: new RegExp(`^${location}$`, 'i') };
    }
    if (category) {
      query.ParentCategoryKey = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const total = await servicesCol.countDocuments(query);

    const services = await servicesCol
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Optionally embed related org info
    const results = await Promise.all(
      services.map(async (service) => {
        const provider = await providersCol.findOne(
          { Key: service.ServiceProviderKey },
          {
            projection: {
              _id: 0,
              Key: 1,
              Name: 1,
              ShortDescription: 1,
              Website: 1,
              Telephone: 1,
              Email: 1,
              IsVerified: 1,
            },
          }
        );
        return {
          ...service,
          organisation: provider || null,
        };
      })
    );

    return NextResponse.json({
      status: 'success',
      total,
      page,
      limit,
      results,
    });
  } catch (error) {
    console.error('[API ERROR] /api/services:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
