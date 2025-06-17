import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');

    // Query ClientGroups collection
    const groups = await db.collection('ClientGroups').find({}).toArray();

    // Shape: id, name, slug (adjust based on actual fields)
    const output = groups.map((group) => ({
      id: group._id,
      name: group.Name,
      key: group.Key, // If your data uses a Key field
    }));

    return NextResponse.json({ status: 'success', data: output });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
