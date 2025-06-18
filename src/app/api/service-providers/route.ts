import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
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
    const collection = db.collection('ServiceProviders');

    // Build query
    const query: any = {};
    if (location) {
      query.AssociatedLocationIds = { $in: [location] };
    }

    const total = await collection.countDocuments(query);

    const results = await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        _id: 0, // remove MongoDB ObjectId from response
        Key: 1,
        Name: 1,
        ShortDescription: 1,
        IsVerified: 1,
        IsPublished: 1,
        AssociatedLocationIds: 1,
        Website: 1,
        Telephone: 1,
        Email: 1,
      })
      .toArray();

    return NextResponse.json({
      status: 'success',
      total,
      page,
      limit,
      results,
    });
  } catch (error) {
    console.error('[API ERROR] /api/service-providers:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch service providers' },
      { status: 500 }
    );
  }
}
