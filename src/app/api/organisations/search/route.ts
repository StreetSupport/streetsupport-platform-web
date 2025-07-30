import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { status: 'error', message: 'Search query is required' },
      { status: 400 }
    );
  }

  if (limit < 1 || limit > 50) {
    return NextResponse.json(
      { status: 'error', message: 'Limit must be between 1 and 50' },
      { status: 400 }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const collection = db.collection('ServiceProviders');

    // Create text search query
    const searchQuery = {
      $and: [
        { IsPublished: true }, // Only show published organisations
        {
          $or: [
            { Name: { $regex: query.trim(), $options: 'i' } }, // Case-insensitive search on name
            { ShortDescription: { $regex: query.trim(), $options: 'i' } }, // Also search description
          ]
        }
      ]
    };

    const results = await collection
      .find(searchQuery)
      .limit(limit)
      .project({
        _id: 0,
        Key: 1,
        Name: 1,
        ShortDescription: 1,
        IsVerified: 1,
        Website: 1,
        Telephone: 1,
        Email: 1,
      })
      .toArray();

    // Transform results to match expected format
    const organisations = results.map((org) => ({
      slug: org.Key,
      name: org.Name,
      shortDescription: org.ShortDescription,
      isVerified: org.IsVerified || false,
      website: org.Website,
      telephone: org.Telephone,
      email: org.Email,
    }));

    return NextResponse.json({
      status: 'success',
      query: query.trim(),
      count: organisations.length,
      organisations,
    });
  } catch (error) {
    console.error('[API ERROR] /api/organisations/search:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to search organisations' },
      { status: 500 }
    );
  }
}