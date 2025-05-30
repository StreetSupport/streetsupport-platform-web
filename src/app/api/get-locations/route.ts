import { NextResponse } from 'next/server';
import locations from '@/data/locations.json';

export function GET() {
  return NextResponse.json(locations);
}
