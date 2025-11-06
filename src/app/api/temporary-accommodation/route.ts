import { NextResponse } from 'next/server';
import { loadFilteredAccommodationData } from '@/utils/accommodationData';
import queryCache from '@/utils/queryCache';

interface TemporaryAccommodation {
  id: string;
  name: string;
  synopsis: string;
  description: string;
  serviceProvider: string;
  serviceProviderName: string;
  isVerified: boolean;
  address: {
    street: string;
    street1: string;
    street2: string;
    street3: string;
    city: string;
    postcode: string;
    latitude: number | null;
    longitude: number | null;
  };
  contact: {
    telephone: string;
    email: string;
    website: string;
    facebook: string;
    twitter: string;
  };
  availability: {
    isOpen24Hour: boolean;
    openingTimes: Array<{
      Day?: string;
      StartTime?: string;
      EndTime?: string;
    }>;
  };
  accommodation: {
    type: string;
    residentCriteria: string;
    referralRequired: boolean;
    referralNotes: string;
    features: string[];
  };
  metadata: {
    createdDate: string | null;
    lastModifiedDate: string | null;
  };
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
  const accommodationType = searchParams.get('type');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid page or limit value' },
      { status: 400 }
    );
  }

  // Validate geospatial parameters
  let latitude: number | undefined;
  let longitude: number | undefined;
  let radiusKm: number | undefined;

  if (lat || lng) {
    if (!lat || !lng) {
      return NextResponse.json(
        { status: 'error', message: 'Both lat and lng parameters are required for geospatial queries' },
        { status: 400 }
      );
    }

    latitude = parseFloat(lat);
    longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid latitude or longitude values' },
        { status: 400 }
      );
    }

    radiusKm = radius ? parseFloat(radius) : 5; // Default 5km radius
    if (isNaN(radiusKm) || radiusKm <= 0) {
      radiusKm = 5;
    }
  }

  // Create cache key
  const cacheKey = queryCache.generateKey({
    collection: 'temporary-accommodation',
    location,
    accommodationType,
    lat: latitude?.toString(),
    lng: longitude?.toString(),
    radius: radiusKm?.toString(),
    page: page.toString(),
    limit: limit.toString()
  });

  // Check cache first
  const cachedResult = queryCache.get(cacheKey);
  if (cachedResult) {
    const response = NextResponse.json(cachedResult);
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400');
    response.headers.set('X-Cache', 'HIT');
    response.headers.set('Vary', 'Accept-Encoding');
    return response;
  }

  try {
    // Use our new database-based accommodation loading
    const accommodationDataRaw = await loadFilteredAccommodationData({
      location: location || undefined,
      category: 'accom', // Always accommodation for this endpoint
      subcategory: accommodationType || undefined,
      latitude,
      longitude,
      radiusKm
    });

    // Transform to match the expected TemporaryAccommodation interface
    const accommodationData: TemporaryAccommodation[] = accommodationDataRaw.map((item) => ({
      id: item.id,
      name: item.name,
      synopsis: item.synopsis,
      description: item.description,
      serviceProvider: item.serviceProviderId,
      serviceProviderName: item.serviceProviderName,
      isVerified: item.isVerified,
      address: {
        street: item.address.street1,
        street1: item.address.street1,
        street2: item.address.street2,
        street3: item.address.street3,
        city: item.address.city,
        postcode: item.address.postcode,
        latitude: item.address.latitude || null,
        longitude: item.address.longitude || null
      },
      contact: {
        telephone: item.contact.telephone,
        email: item.contact.email,
        website: '',
        facebook: '',
        twitter: ''
      },
      availability: {
        isOpen24Hour: false,
        openingTimes: []
      },
      accommodation: {
        type: item.accommodation.type,
        residentCriteria: '', // This data structure differs
        referralRequired: item.accommodation.referralRequired,
        referralNotes: item.accommodation.referralNotes,
        features: []
      },
      metadata: {
        createdDate: null,
        lastModifiedDate: null
      }
    }));

    const total = accommodationData.length;

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedData = accommodationData.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const responseData = {
      status: 'success',
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
        nextPage: hasNextPage ? page + 1 : null,
        previousPage: hasPreviousPage ? page - 1 : null
      },
      filters: {
        location: location || null,
        accommodationType: accommodationType || null,
        coordinates: latitude && longitude ? { lat: latitude, lng: longitude, radius: radiusKm } : null
      }
    };

    // Cache the result
    queryCache.set(cacheKey, responseData, 300000); // 5 minutes

    const response = NextResponse.json(responseData);

    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400');
    response.headers.set('ETag', `temp-acc-${cacheKey.slice(-8)}-${total}-${page}`);
    response.headers.set('X-Cache', 'MISS');
    response.headers.set('Vary', 'Accept-Encoding');
    
    return response;

  } catch (error) {
    console.error('[API ERROR] /api/temporary-accommodation:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}