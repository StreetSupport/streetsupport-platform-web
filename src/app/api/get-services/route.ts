import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    let apiUrl = 'https://ssn-api-prod.azurewebsites.net/v2/categorised-service-providers/show/';

    const params = new URLSearchParams();

    if (lat && lon) {
      params.append('lat', lat);
      params.append('lon', lon);
    }

    if ([...params].length > 0) {
      apiUrl += `?${params.toString()}`;
    }

    const response = await fetch(apiUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch services' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching services' }, { status: 500 });
  }
}
