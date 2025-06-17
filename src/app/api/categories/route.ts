import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');

    const categories = await db.collection('NestedServiceCategories').find({}).toArray();

    const output = categories.map((cat) => ({
      key: cat.Key,
      name: cat.Name,
      subCategories: (cat.SubCategories || []).map((sub: any) => ({
        key: sub.Key,
        name: sub.Name,
      })),
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
