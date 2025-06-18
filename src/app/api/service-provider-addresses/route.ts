import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const collection = db.collection('ServiceProviderAddresses');

    // Get all addresses
    const addresses = await collection
      .find({})
      .project({
        _id: 0, // Remove MongoDB ID
        Key: 1,
        ServiceProviderKey: 1,
        Line1: 1,
        Line2: 1,
        City: 1,
        Postcode: 1,
        Latitude: 1,
        Longitude: 1,
      })
      .toArray();

    return NextResponse.json({
      status: 'success',
      total: addresses.length,
      results: addresses,
    });
  } catch (error) {
    console.error('[API ERROR] /api/service-provider-addresses:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}
