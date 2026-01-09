import { NextResponse } from 'next/server';
import { statsRepository } from '@/repositories/stats';

export async function GET() {
  try {
    const stats = await statsRepository.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { organisations: 0, services: 0, partnerships: 0 },
      { status: 500 }
    );
  }
}
