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
    const addressesCol = db.collection('ServiceProviderAddresses');
    const servicesCol = db.collection('ProvidedServices');

    // Find the provider by slug (Key)
    const provider = await providersCol.findOne(
      { Key: { $regex: new RegExp(`^${slug}$`, 'i') } },
      {
        projection: {
          _id: 0,
          Key: 1,
          Name: 1,
          ShortDescription: 1,
          LongDescription: 1,
          Website: 1,
          Telephone: 1,
          Email: 1,
          IsVerified: 1,
          IsPublished: 1,
          AssociatedLocationIds: 1,
          Tags: 1,
          SocialLinks: 1,
        },
      }
    );


    if (!provider) {
      return NextResponse.json(
        { status: 'error', message: 'Organisation not found' },
        { status: 404 }
      );
    }

    // Get related addresses
    const addresses = await addressesCol
      .find({ ServiceProviderKey: provider.Key })
      .project({
        _id: 0,
        Key: 1,
        Line1: 1,
        Line2: 1,
        City: 1,
        Postcode: 1,
        Latitude: 1,
        Longitude: 1,
      })
      .toArray();

    // Get related services
    const services = await servicesCol
      .find({ ServiceProviderKey: provider.Key })
      .project({
        _id: 0,
        Key: 1,
        Title: 1,
        ParentCategoryKey: 1,
        SubCategoryKey: 1,
        Description: 1,
        OpeningTimes: 1,
        ClientGroups: 1,
        Address: 1,
      })
      .toArray();

    return NextResponse.json({
      status: 'success',
      organisation: provider,
      addresses,
      services,
    });
  } catch (error) {
    console.error('[API ERROR] /api/service-providers/[slug]:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch organisation details' },
      { status: 500 }
    );
  }
}
