import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import { decodeText } from '@/utils/htmlDecode';
import queryCache from '@/utils/queryCache';
import fs from 'fs';
import path from 'path';

interface TemporaryAccommodation {
  id: string;
  name: string;
  synopsis: string;
  description: string;
  serviceProvider: string;
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

interface MongoQuery {
  IsPublished: boolean;
  'Address.City'?: { $regex: RegExp };
  AccommodationType?: { $regex: RegExp };
}

interface GeospatialQuery {
  near: {
    type: string;
    coordinates: [number, number];
  };
  distanceField: string;
  maxDistance: number;
  spherical: boolean;
  query: MongoQuery;
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
    const client = await getClientPromise();
    const db = client.db('streetsupport');

    // Try database first, fall back to JSON file if needed
    let accommodationData: TemporaryAccommodation[] = [];
    let total = 0;

    try {
      // Build MongoDB query
      const baseQuery: MongoQuery = { IsPublished: true };

      if (location) {
        baseQuery['Address.City'] = { $regex: new RegExp(location, 'i') };
      }

      if (accommodationType) {
        baseQuery.AccommodationType = { $regex: new RegExp(accommodationType, 'i') };
      }

      let pipeline: Array<any> = [];

      if (latitude && longitude && radiusKm) {
        // Geospatial query
        const geoNearStage: { $geoNear: GeospatialQuery } = {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            distanceField: 'distance',
            maxDistance: radiusKm * 1000, // Convert km to meters
            spherical: true,
            query: baseQuery
          }
        };
        pipeline.push(geoNearStage);
      } else {
        // Non-geospatial query
        pipeline.push({ $match: baseQuery });
      }

      // Add pagination
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });

      // Execute aggregation
      const results = await db
        .collection('temporaryaccommodation')
        .aggregate(pipeline)
        .toArray();

      // Get total count for pagination
      const countPipeline = pipeline.slice(0, -2); // Remove skip and limit
      countPipeline.push({ $count: 'total' });
      const countResult = await db
        .collection('temporaryaccommodation')
        .aggregate(countPipeline)
        .toArray();

      total = countResult.length > 0 ? countResult[0].total : 0;

      // Transform data
      accommodationData = results.map((item: any) => ({
        id: item._id.toString(),
        name: decodeText(item.Name || ''),
        synopsis: decodeText(item.Synopsis || ''),
        description: decodeText(item.Description || ''),
        serviceProvider: decodeText(item.ServiceProvider || ''),
        address: {
          street: decodeText(item.Address?.Street || ''),
          street1: decodeText(item.Address?.Street1 || ''),
          street2: decodeText(item.Address?.Street2 || ''),
          street3: decodeText(item.Address?.Street3 || ''),
          city: decodeText(item.Address?.City || ''),
          postcode: item.Address?.Postcode || '',
          latitude: item.Address?.Location?.coordinates?.[1] || null,
          longitude: item.Address?.Location?.coordinates?.[0] || null
        },
        contact: {
          telephone: item.Telephone || '',
          email: item.Email || '',
          website: item.Website || '',
          facebook: item.Facebook || '',
          twitter: item.Twitter || ''
        },
        availability: {
          isOpen24Hour: item.IsOpen24Hour || false,
          openingTimes: item.OpeningTimes || []
        },
        accommodation: {
          type: decodeText(item.AccommodationType || ''),
          residentCriteria: decodeText(item.ResidentCriteria || ''),
          referralRequired: item.ReferralRequired || false,
          referralNotes: decodeText(item.ReferralNotes || ''),
          features: Array.isArray(item.Features) ? item.Features.map((f: string) => decodeText(f)) : []
        },
        metadata: {
          createdDate: item.CreationDate || null,
          lastModifiedDate: item.LastModifiedDate || null
        },
        distance: item.distance // Include distance if geospatial query
      }));

    } catch (dbError) {
      console.warn('[API] Database query failed, falling back to JSON file:', dbError);
      
      // Fallback to JSON file
      const jsonPath = path.join(process.cwd(), 'src/data/temporary-accommodation.json');
      if (fs.existsSync(jsonPath)) {
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // Apply filtering to JSON data
        let filteredData = jsonData;
        
        if (location) {
          filteredData = filteredData.filter((item: TemporaryAccommodation) =>
            item.address.city.toLowerCase().includes(location.toLowerCase())
          );
        }
        
        if (accommodationType) {
          filteredData = filteredData.filter((item: TemporaryAccommodation) =>
            item.accommodation.type.toLowerCase().includes(accommodationType.toLowerCase())
          );
        }
        
        // Apply geospatial filtering if needed
        if (latitude && longitude && radiusKm) {
          filteredData = filteredData.filter((item: TemporaryAccommodation) => {
            if (!item.address.latitude || !item.address.longitude) return false;
            
            // Simple distance calculation (Haversine formula)
            const lat1 = latitude!;
            const lon1 = longitude!;
            const lat2 = item.address.latitude;
            const lon2 = item.address.longitude;
            
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                     Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            
            return distance <= radiusKm!;
          });
        }
        
        total = filteredData.length;
        
        // Apply pagination
        const skip = (page - 1) * limit;
        accommodationData = filteredData.slice(skip, skip + limit);
      } else {
        console.error('[API] No fallback JSON file found');
        accommodationData = [];
        total = 0;
      }
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const responseData = {
      status: 'success',
      data: accommodationData,
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