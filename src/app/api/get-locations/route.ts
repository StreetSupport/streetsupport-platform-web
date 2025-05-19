import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://ssn-api-prod.azurewebsites.net/v1/cities/', {
      cache: 'no-store',
    });

    const text = await response.text();  // Read as text first
    console.log('Raw Response:', text);  // Log the raw output

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch locations', details: text }, { status: response.status });
    }

    const data = JSON.parse(text);  // Safely parse after reading as text
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching locations' }, { status: 500 });
  }
}
