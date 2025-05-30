import { NextResponse } from 'next/server';
import categories from '@/data/service-categories.json';

export function GET() {
  return NextResponse.json(categories);
}
