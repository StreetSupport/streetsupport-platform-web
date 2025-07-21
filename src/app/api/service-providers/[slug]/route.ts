import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import { decodeText } from '@/utils/htmlDecode';

export async function GET(req: Request) {
  // ✅ App Router API routes do not receive `context.params`
  // So parse slug manually:
  const url = new URL(req.url);
  const parts = url.pathname.split('/');
  const slug = parts[parts.length - 1];

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

    const rawProvider = await providersCol.findOne(
      { Key: { $regex: new RegExp(`^${slug}$`, 'i') } },
      {
        projection: {
          _id: 0,
          Key: 1,
          Name: 1,
          ShortDescription: 1,
          Description: 1,
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
          Addresses: 1,
        },
      }
    );

    if (!rawProvider) {
      return NextResponse.json(
        { status: 'error', message: 'Organisation not found' },
        { status: 404 }
      );
    }

    const services = await servicesCol
      .find({
        ServiceProviderKey: rawProvider.Key,
        IsPublished: true,
      })
      .project({
        _id: 1,
        ParentCategoryKey: 1,
        SubCategoryKey: 1,
        SubCategoryName: 1,
        Info: 1,
        OpeningTimes: 1,
        ClientGroups: 1,
        Address: 1,
      })
      .toArray();

    const provider = {
      key: rawProvider.Key,
      name: decodeText(rawProvider.Name),
      shortDescription: decodeText(rawProvider.ShortDescription || ''),
      description: decodeText(rawProvider.Description || ''),
      website: rawProvider.Website,
      telephone: rawProvider.Telephone,
      email: rawProvider.Email,
      facebook: rawProvider.Facebook,
      twitter: rawProvider.Twitter,
      instagram: rawProvider.Instagram,
      bluesky: rawProvider.Bluesky,
      isVerified: rawProvider.IsVerified,
      isPublished: rawProvider.IsPublished,
      associatedLocationIds: rawProvider.AssociatedLocationIds,
      tags: rawProvider.Tags,
      addresses: rawProvider.Addresses || [],
    };

    const decodedServices = services.map(service => ({
      ...service,
      Info: decodeText(service.Info || ''),
      SubCategoryName: decodeText(service.SubCategoryName || '')
    }));

    return NextResponse.json({
      status: 'success',
      organisation: provider,
      addresses: provider.addresses,
      services: decodedServices,
    });

  } catch (error) {
    console.error('[API ERROR] /api/service-providers/[slug]:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch organisation details' },
      { status: 500 }
    );
  }
}
