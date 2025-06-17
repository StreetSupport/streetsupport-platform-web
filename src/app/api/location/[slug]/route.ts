import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const slug = segments[segments.length - 1];

  return NextResponse.json({ slug, message: `API response for ${slug}` });
}
