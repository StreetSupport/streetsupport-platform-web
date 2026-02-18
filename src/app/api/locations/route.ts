// src/app/api/locations/route.ts

import { NextResponse } from 'next/server';
import { getLocations } from './helper';
import { CACHE_HEADERS } from '@/config/constants';

export async function GET() {
  try {
    const locations = await getLocations();
    const response = NextResponse.json({ status: 'success', data: locations });
    
    response.headers.set('Cache-Control', CACHE_HEADERS.locations);
    response.headers.set('ETag', `locations-${locations.length}-${Date.now().toString(36)}`);
    response.headers.set('Vary', 'Accept-Encoding');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
