import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET(req: Request) {
  try {
    // ✅ Manually extract the slug from the URL pathname
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const slug = parts[parts.length - 1]; // last part is the slug

    const client = await clientPromise;
    const db = client.db('streetsupport');

    const organisation = await db
      .collection('ServiceProviders')
      .findOne({ Key: slug });

    if (!organisation) {
      return NextResponse.json({
        status: 'error',
        message: `No organisation found for key: ${slug}`,
      }, { status: 404 });
    }

    const addresses = await db
      .collection('ServiceProviderAddresses')
      .find({ ServiceProviderId: organisation._id })
      .toArray();

    const services = await db
      .collection('ProvidedServices')
      .find({ ServiceProviderId: organisation._id })
      .toArray();

    const output = {
      id: organisation._id,
      name: organisation.Name,
      key: organisation.Key,
      locations: organisation.Locations || [],
      contact: {
        email: organisation.Email || null,
        phone: organisation.Phone || null,
        website: organisation.Website || null,
      },
      addresses: addresses || [],
      services: services.map((service) => ({
        id: service._id,
        title: service.Title,
        description: service.Description,
        category: service.Category,
        subCategory: service.SubCategory,
        locations: service.Locations || [],
        openTimes: service.OpenTimes || [],
      })),
    };

    return NextResponse.json({
      status: 'success',
      data: output,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
