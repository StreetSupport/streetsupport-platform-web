import { NextResponse } from 'next/server';
import { getFaqs } from './helper';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const location = url.searchParams.get('location');

    const faqs = await getFaqs(location ?? undefined);

    return NextResponse.json({
      status: 'success',
      data: faqs,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}
