import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import { formatCategory } from '@/utils/formatCategories';

interface RawCategory {
  key: string;
  name: string;
  subCategories: { key: string; name: string }[];
}


export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');

    const categories = await db
      .collection<RawCategory>('NestedServiceCategories')
      .find({})
      .toArray();

    const formatted = categories.map(formatCategory);

    return NextResponse.json({
      status: 'success',
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
