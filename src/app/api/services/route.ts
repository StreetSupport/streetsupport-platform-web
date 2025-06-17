import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('streetsupport');

    const query: any = {};

    if (location) {
      query.Locations = location;
    }

    if (category) {
      query.Category = category;
    }

    // Count matching services
    const total = await db.collection('ProvidedServices').countDocuments(query);

    // Get paginated services, with basic projection
    const services = await db
      .collection('ProvidedServices')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Join with organisations and addresses manually
    const results = await Promise.all(
      services.map(async (service) => {
        // Fetch linked organisation
        const organisation = await db
          .collection('ServiceProviders')
          .findOne({ _id: service.ServiceProviderId });

        // Fetch linked addresses if needed (optional)
        const addresses = await db
          .collection('ServiceProviderAddresses')
          .find({ ServiceProviderId: service.ServiceProviderId })
          .toArray();

        return {
          id: service._id,
          title: service.Title,
          description: service.Description,
          category: service.Category,
          subCategory: service.SubCategory,
          locations: service.Locations || [],
          openTimes: service.OpenTimes || [],
          organisation: organisation
            ? {
                id: organisation._id,
                name: organisation.Name,
                slug: organisation.Slug,
                contact: {
                  email: organisation.Email || null,
                  phone: organisation.Phone || null,
                  website: organisation.Website || null,
                },
              }
            : null,
          addresses: addresses || [],
        };
      })
    );

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
