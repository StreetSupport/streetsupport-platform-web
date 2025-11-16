import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';

// Disable caching for this API route to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Define interface matching MongoDB schema (PascalCase)
interface ILocationLogoDocument {
  _id: { toString: () => string };
  Name: string;
  DisplayName: string;
  LocationSlug: string;
  LocationName: string;
  LogoPath: string;
  Url: string;
  CreatedBy: string;
  DocumentCreationDate: Date;
  DocumentModifiedDate: Date;
}

// Define public-facing interface (camelCase for web)
interface Supporter {
  name: string;
  displayName: string;
  logoPath: string | null;
  url: string;
}

export async function GET(
  request: Request,
  context: RouteParams
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { status: 'error', message: 'Location slug is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const logosCol = db.collection('LocationLogos');
    
    // Fetch location logos for this location
    const rawLogos = await logosCol
      .find({ LocationSlug: slug })
      .sort({ DisplayName: 1 })
      .toArray() as unknown as ILocationLogoDocument[];

    // Transform MongoDB documents (PascalCase) to Supporter format (camelCase for web)
    const supporters: Supporter[] = rawLogos.map((logo) => ({
      name: logo.Name,
      displayName: logo.DisplayName,
      logoPath: logo.LogoPath,
      url: logo.Url
    }));

    // Return the transformed data with cache control headers
    return NextResponse.json({
      status: 'success',
      data: supporters,
      location: slug
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('[API ERROR] /api/locations/[slug]/logos:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Unable to fetch location logos at this time',
        data: [],
        location: 'unknown'
      },
      { status: 500 }
    );
  }
}
