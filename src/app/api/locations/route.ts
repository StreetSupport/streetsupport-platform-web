import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');

    // Query the legacy 'Cities' collection and map to 'locations'
    const cities = await db.collection('Cities').find({}).toArray();

    // Shape output: id, name, slug
    const locations = cities.map((city) => ({
      id: city._id,
      name: city.Name,
      slug: city.Key,
    }));

    return NextResponse.json({ status: 'success', data: locations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
