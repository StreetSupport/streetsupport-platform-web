import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import fallbackProviders from '@/data/service-providers.json';
import type { ServiceProvider } from '@/types';

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

    // ✅ Always filter to only published services
    const query: any = {
      IsPublished: true
    };

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

    // Embed related org info in correct shape for ServiceCard
    const results = await Promise.all(
      services.map(async (service) => {
        const provider = await providersCol.findOne(
          { Key: service.ServiceProviderKey },
          {
            projection: {
              _id: 0,
              Key: 1,
              Name: 1,
              IsVerified: 1,
              ShortDescription: 1,
              Website: 1,
              Telephone: 1,
              Email: 1
            }
          }
        );

        return {
          ...service,
          organisation: provider
            ? {
                name: provider.Name,
                slug: provider.Key,
                isVerified: provider.IsVerified
              }
            : null
        };
      })
    );

    return NextResponse.json({
      status: 'success',
      total,
      page,
      limit,
      results
    });
  } catch (error) {
    console.error('[API ERROR] /api/services:', error);

    // Fallback to static mock data if DB access fails
    try {
      const providers = fallbackProviders as ServiceProvider[];
      const allServices = providers.flatMap((provider) =>
        (provider.services || []).map((service) => ({
          ...service,
          organisation: {
            Key: provider.slug,
            Name: provider.name,
            ShortDescription: '',
            Website: '',
            Telephone: '',
            Email: '',
            IsVerified: provider.verified,
          },
        }))
      );

      const total = allServices.length;
      const start = (page - 1) * limit;
      const results = allServices.slice(start, start + limit);

      return NextResponse.json({
        status: 'success',
        total,
        page,
        limit,
        results,
      });
    } catch (fallbackError) {
      console.error('[API ERROR] Fallback services failed:', fallbackError);
      return NextResponse.json(
        { status: 'error', message: 'Failed to fetch services' },
        { status: 500 }
      );
    }
  }
}
