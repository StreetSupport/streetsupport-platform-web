// src/app/api/locations/route.ts

import { NextResponse } from 'next/server';
import { getLocations } from './helper';

export async function GET() {
  try {
    const locations = await getLocations();
    return NextResponse.json({ status: 'success', data: locations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
