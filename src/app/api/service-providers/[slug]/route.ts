import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET(
  req: Request,
  context: any
) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json(
      { status: 'error', message: 'Slug is required' },
      { status: 400 }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');

    const providersCol = db.collection('ServiceProviders');
    const servicesCol = db.collection('ProvidedServices');

    // ✅ 1️⃣ Get the full ServiceProvider with all expected details
    const provider = await providersCol.findOne(
      { Key: { $regex: new RegExp(`^${slug}$`, 'i') } },
      {
        projection: {
          _id: 0,
          Key: 1,
          Name: 1,
          ShortDescription: 1,
          Description: 1,         // ✅ The long text for main overview
          Website: 1,
          Telephone: 1,
          Email: 1,
          Facebook: 1,
          Twitter: 1,
          Instagram: 1,
          Bluesky: 1,
          IsVerified: 1,
          IsPublished: 1,
          AssociatedLocationIds: 1,
          Tags: 1,
          Addresses: 1,            // ✅ Use inline addresses
        },
      }
    );

    if (!provider) {
      return NextResponse.json(
        { status: 'error', message: 'Organisation not found' },
        { status: 404 }
      );
    }

    // ✅ 2️⃣ Get all ProvidedServices for this provider (correct source for Info!)
    const services = await servicesCol
      .find({
        ServiceProviderKey: provider.Key,
        IsPublished: true
      })
      .project({
        _id: 1,
        ParentCategoryKey: 1,
        SubCategoryKey: 1,
        SubCategoryName: 1,
        Info: 1,             // ✅ The real service description
        OpeningTimes: 1,
        ClientGroups: 1,
        Address: 1           // ✅ This may override or complement org addresses
      })
      .toArray();

    // ✅ 3️⃣ Response
    return NextResponse.json({
      status: 'success',
      organisation: provider,
      addresses: provider.Addresses || [],
      services: services
    });

  } catch (error) {
    console.error('[API ERROR] /api/service-providers/[slug]:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch organisation details' },
      { status: 500 }
    );
  }
}
