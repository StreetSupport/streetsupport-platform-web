import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Optional query params
    const location = searchParams.get('location'); // e.g. "leeds"
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const skip = (page - 1) * limit;

    const client = await getClientPromise();
    const db = client.db('streetsupport');

    const query: any = {};

    if (location) {
      // Match orgs linked to the location key
      query.Locations = location;
    }

    // Count total matching docs for pagination
    const total = await db.collection('ServiceProviders').countDocuments(query);

    // Fetch paginated results
    const serviceProviders = await db
      .collection('ServiceProviders')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Shape output
    const results = serviceProviders.map((org) => ({
      id: org._id,
      name: org.Name,
      slug: org.Slug,
      locations: org.Locations || [],
      contact: {
        email: org.Email || null,
        phone: org.Phone || null,
        website: org.Website || null,
      },
    }));

    return NextResponse.json({
      status: 'success',
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
