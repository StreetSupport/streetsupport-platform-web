import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
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
        headers: { 'Content-Type': 'application/json' },
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
