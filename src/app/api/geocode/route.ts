import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimit';

const GEOCODE_RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60_000,
};

export async function GET(req: NextRequest) {
  const { allowed, remaining, resetTime } = checkRateLimit(req, GEOCODE_RATE_LIMIT);

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(GEOCODE_RATE_LIMIT.maxRequests),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const postcode = searchParams.get('postcode');

  if (!postcode) {
    return new Response(JSON.stringify({ error: 'Postcode is required' }), {
      status: 400,
    });
  }

  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing server API key' }),
      { status: 500 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      postcode
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return new Response(JSON.stringify({ location }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(GEOCODE_RATE_LIMIT.maxRequests),
          'X-RateLimit-Remaining': String(remaining),
        },
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Geocoding failed', details: data }),
        { status: 400 }
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
