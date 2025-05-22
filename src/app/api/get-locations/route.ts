import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://ssn-api-prod.azurewebsites.net/v1/cities/', {
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (!response.ok || !text) {
      return NextResponse.json(
        { error: 'Failed to fetch locations', details: text || 'No response body' },
        { status: response.status || 500 }
      );
    }

    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Expected JSON but got something else', details: text },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in get-locations route:', error);
    return NextResponse.json({ error: 'Error fetching locations' }, { status: 500 });
  }
}
