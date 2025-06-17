import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location'); // e.g. 'leeds'

    const client = await clientPromise;
    const db = client.db('streetsupport');

    const query: any = {};

    if (location) {
      query.Location = location;
    }

    // If location is provided, filter by it — otherwise get general FAQs
    const faqs = await db.collection('FAQs').find(query).toArray();

    const output = faqs.map((faq) => ({
      id: faq._id,
      question: faq.Question,
      answer: faq.Answer,
      location: faq.Location || null,
    }));

    return NextResponse.json({
      status: 'success',
      data: output,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
