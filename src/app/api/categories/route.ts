// src/app/api/categories/route.ts

import { NextResponse } from 'next/server';
import { getCategories } from './helper';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
