import { NextResponse } from 'next/server';
import { SwepData } from '@/types';
import { isSwepActive } from '@/utils/swep';
import { getClientPromise } from '@/utils/mongodb';

interface SwepApiParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: Request, context: SwepApiParams) {
  try {
    const { slug } = await context.params;
    
    if (!slug) {
      return NextResponse.json(
        { status: 'error', message: 'Location slug is required' },
        { status: 400 }
      );
    }

    // Fetch SWEP data from MongoDB
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const swepCol = db.collection('SwepBanners');

    const rawSwepData = await swepCol.findOne({
      LocationSlug: slug
    });

    // Transform MongoDB document (PascalCase) to SwepData format (camelCase for web)
    const swepData: SwepData | null = rawSwepData ? {
      id: rawSwepData._id.toString(),
      locationSlug: rawSwepData.LocationSlug,
      isActive: rawSwepData.IsActive,
      title: rawSwepData.Title,
      body: rawSwepData.Body,
      image: rawSwepData.Image || '',
      shortMessage: rawSwepData.ShortMessage || '',
      swepActiveFrom: rawSwepData.SwepActiveFrom ? rawSwepData.SwepActiveFrom.toISOString() : '',
      swepActiveUntil: rawSwepData.SwepActiveUntil ? rawSwepData.SwepActiveUntil.toISOString() : '',
      createdBy: rawSwepData.CreatedBy,
      createdAt: rawSwepData.DocumentCreationDate ? rawSwepData.DocumentCreationDate.toISOString() : '',
      updatedAt: rawSwepData.DocumentModifiedDate ? rawSwepData.DocumentModifiedDate.toISOString() : '',
      emergencyContact: rawSwepData.EmergencyContact ? {
        phone: rawSwepData.EmergencyContact.Phone,
        email: rawSwepData.EmergencyContact.Email,
        hours: rawSwepData.EmergencyContact.Hours
      } : undefined
    } : null;

    // If no SWEP data exists for this location
    if (!swepData) {
      return NextResponse.json({
        status: 'success',
        data: {
          swep: null,
          isActive: false,
          location: slug
        }
      });
    }

    // Check if SWEP is currently active
    const active = isSwepActive(swepData);

    const response = NextResponse.json({
      status: 'success',
      data: {
        swep: {
          ...swepData,
          isActive: active
        },
        isActive: active,
        location: slug
      }
    });

    // Add cache headers - shorter cache for SWEP data since it's time-sensitive
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // 5 min browser, 10 min CDN
    
    return response;
  } catch (error) {
    console.error('[API ERROR] /api/locations/[slug]/swep:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Unable to fetch SWEP data at this time',
      data: {
        swep: null,
        isActive: false,
        location: 'unknown'
      }
    }, { status: 500 });
  }
}