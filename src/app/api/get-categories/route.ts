import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = 'https://ssn-api-prod.azurewebsites.net/v2/service-categories/';

    const response = await fetch(apiUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}
