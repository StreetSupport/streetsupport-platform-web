import { NextResponse } from 'next/server';
import { SwepData } from '@/types';
import { isSwepActive } from '@/utils/swep';
import swepPlaceholderData from '@/data/swep-fallback.json';

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

    // Use placeholder data for now - will be replaced with CMS integration later
    const swepData = getSwepPlaceholderData(slug);

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

// Get SWEP placeholder data - this will be replaced with CMS integration later
function getSwepPlaceholderData(locationSlug: string): SwepData | null {
  const placeholderEntry = swepPlaceholderData.find(
    (entry) => entry.locationSlug === locationSlug
  );
  
  return placeholderEntry as SwepData || null;
}