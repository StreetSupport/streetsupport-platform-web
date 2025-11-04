import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import { decodeText } from '@/utils/htmlDecode';
import queryCache from '@/utils/queryCache';
import { loadFilteredAccommodationData, type AccommodationData } from '@/utils/accommodationData';

interface MongoQuery {
  IsPublished: boolean;
  'Address.City'?: { $regex: RegExp };
  ParentCategoryKey?: { $regex: RegExp };
  SubCategoryKey?: { $regex: RegExp };
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

interface AggregationStage {
  $match?: MongoQuery;
  $geoNear?: GeospatialQuery;
  $lookup?: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
    pipeline?: Array<{ $project?: Record<string, number | string> }>;
  };
  $addFields?: Record<string, unknown>;
  $unwind?: string | { path: string; preserveNullAndEmptyArrays?: boolean };
  $project?: Record<string, number | string>;
  $skip?: number;
  $limit?: number;
  $count?: string;
}

// This function is now replaced by loadAccommodationDataFromDatabase() from utils/accommodationData.ts

// Function to transform accommodation entry to service format
function transformAccommodationToService(accommodation: AccommodationData) {
  return {
    _id: accommodation.id,
    name: accommodation.name || '',
    description: accommodation.synopsis || accommodation.description || '',
    ParentCategoryKey: 'accom',
    SubCategoryKey: accommodation.accommodation?.type || 'other',
    ServiceProviderName: accommodation.serviceProviderName || accommodation.name || '',
    ServiceProviderKey: accommodation.serviceProviderId,
    OpeningTimes: [],
    ClientGroups: [],
    Address: {
      Location: {
        type: 'Point',
        coordinates: [accommodation.address?.longitude || 0, accommodation.address?.latitude || 0]
      },
      City: accommodation.address?.city || '',
      Street1: accommodation.address?.street1 || '',
      Street2: accommodation.address?.street2 || '',
      Street3: accommodation.address?.street3 || '',
      Postcode: accommodation.address?.postcode || ''
    },
    IsAppointmentOnly: false,
    IsTelephoneService: false,
    IsOpen247: false,
    // Add accommodation-specific data
    accommodationData: {
      type: accommodation.accommodation?.type,
      isOpenAccess: accommodation.accommodation?.isOpenAccess,
      referralRequired: accommodation.accommodation?.referralRequired,
      referralNotes: accommodation.accommodation?.referralNotes,
      price: accommodation.accommodation?.price,
      foodIncluded: accommodation.accommodation?.foodIncluded,
      availabilityOfMeals: accommodation.accommodation?.availabilityOfMeals,
      features: accommodation.features,
      residentCriteria: accommodation.residentCriteria,
      support: accommodation.support,
      contact: accommodation.contact
    },
    // Mark as accommodation source
    sourceType: 'accommodation'
  };
}

// Function to filter accommodation by geospatial criteria
function filterAccommodationByLocation(accommodations: AccommodationData[], latitude: number, longitude: number, radiusKm: number) {
  return accommodations.filter(accommodation => {
    const lat = accommodation.address?.latitude;
    const lng = accommodation.address?.longitude;
    
    if (!lat || !lng) return false;
    
    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (lat - latitude) * Math.PI / 180;
    const dLng = (lng - longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance <= radiusKm;
  }).map(accommodation => {
    // Calculate and add distance
    const lat = accommodation.address.latitude;
    const lng = accommodation.address.longitude;
    const R = 6371;
    const dLat = (lat - latitude) * Math.PI / 180;
    const dLng = (lng - longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000; // Convert to meters for consistency
    
    return {
      ...transformAccommodationToService(accommodation),
      distance
    };
  });
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

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

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { status: 'error', message: 'Latitude must be between -90 and 90, longitude must be between -180 and 180' },
        { status: 400 }
      );
    }

    radiusKm = radius ? parseFloat(radius) : 5; // Default 5km radius
    if (isNaN(radiusKm) || radiusKm <= 0) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid radius value' },
        { status: 400 }
      );
    }
  }

  // Generate cache key from query parameters
  const cacheKey = queryCache.generateKey({
    location,
    category,
    subcategory,
    lat,
    lng,
    radius,
    page,
    limit
  });
  
  // Check cache first
  const cachedResult = queryCache.get(cacheKey);
  if (cachedResult) {
    const response = NextResponse.json(cachedResult);
    const isTestEnv = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === '1';
    
    if (isTestEnv) {
      response.headers.set('Cache-Control', 'no-cache');
    } else {
      response.headers.set('Cache-Control', 'public, max-age=900, s-maxage=1800, stale-while-revalidate=86400');
    }
    
    response.headers.set('X-Cache', 'HIT');
    response.headers.set('Vary', 'Accept-Encoding');
    response.headers.set('ETag', `services-${cacheKey.slice(-8)}-hit`);
    return response;
  }

  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const servicesCol = db.collection('ProvidedServices');

    const query: MongoQuery = {
      IsPublished: true
    };

    // Build aggregation pipeline for geospatial queries
    const pipeline: AggregationStage[] = [
      { $match: query }
    ];

    // Add geospatial filtering if coordinates are provided
    if (latitude !== undefined && longitude !== undefined && radiusKm !== undefined) {
      // Add geospatial query using $geoNear
      const geoNearStage: AggregationStage = {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          distanceField: "distance",
          maxDistance: radiusKm * 1000, // Convert km to meters
          spherical: true,
          query: query
        }
      };
      
      pipeline.unshift(geoNearStage);
      
      // Remove the initial match stage since $geoNear includes filtering
      pipeline.splice(1, 1);
    } else {
      // Add traditional location filtering if no coordinates provided
      if (location) {
        query['Address.City'] = { $regex: new RegExp(`^${location}`, 'i') };
      }
    }

    // Add category filtering
    if (category) {
      if (latitude !== undefined && longitude !== undefined) {
        // For geospatial queries, add category filter to the $geoNear query
        const geoNearStage = pipeline[0];
        if (geoNearStage.$geoNear) {
          geoNearStage.$geoNear.query.ParentCategoryKey = { $regex: new RegExp(`^${category}`, 'i') };
        }
      } else {
        query.ParentCategoryKey = { $regex: new RegExp(`^${category}`, 'i') };
      }
    }

    // Add subcategory filtering
    if (subcategory) {
      if (latitude !== undefined && longitude !== undefined) {
        // For geospatial queries, add subcategory filter to the $geoNear query
        const geoNearStage = pipeline[0];
        if (geoNearStage.$geoNear) {
          geoNearStage.$geoNear.query.SubCategoryKey = { $regex: new RegExp(`^${subcategory}`, 'i') };
        }
      } else {
        query.SubCategoryKey = { $regex: new RegExp(`^${subcategory}`, 'i') };
      }
    }

    // Optimized $lookup to join with ServiceProviders collection - only fetch essential fields
    pipeline.push({
      $lookup: {
        from: 'ServiceProviders',
        localField: 'ServiceProviderKey',
        foreignField: 'Key',
        as: 'provider',
        pipeline: [{
          $project: {
            _id: 0,
            Key: 1,
            Name: 1,
            IsVerified: 1,
            ShortDescription: 1
          }
        }]
      }
    });

    // Add computed fields and unwind provider array
    pipeline.push(
      {
        $unwind: {
          path: '$provider',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          name: '$ServiceProviderName',
          description: '$Info',
          organisation: {
            $cond: {
              if: { $ne: ['$provider', null] },
              then: {
                name: '$provider.Name',
                slug: '$provider.Key',
                isVerified: { $ifNull: ['$provider.IsVerified', false] },
                tags: { $ifNull: ['$provider.Tags', []] }
              },
              else: null
            }
          }
        }
      }
    );

    // Add lightweight projection to reduce payload size
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        IsVerified: 1,
        ParentCategoryKey: 1,
        SubCategoryKey: 1,
        ServiceProviderName: 1,
        ServiceProviderKey: 1,
        OpeningTimes: 1,
        // We don't use ClientGroups, but I leave it because afraid to break something
        ClientGroups: 1,
        'Address.Location': 1,
        organisation: 1,
        distance: 1,
        IsAppointmentOnly: 1,
        IsTelephoneService: 1,
        'Address.IsOpen247': 1,
      }
    });

    // Add pagination
    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    // Load filtered accommodation data from database (only what we need)
    const accommodationData = await loadFilteredAccommodationData({
      location: location || undefined,
      category: category || undefined,
      subcategory: subcategory || undefined,
      latitude,
      longitude,
      radiusKm
    });

    // Transform accommodation data to service format
    let accommodationResults: ReturnType<typeof transformAccommodationToService>[] = [];
    if (accommodationData.length > 0) {
      if (latitude !== undefined && longitude !== undefined && radiusKm !== undefined) {
        accommodationResults = filterAccommodationByLocation(accommodationData, latitude, longitude, radiusKm);
      } else {
        accommodationResults = accommodationData.map(transformAccommodationToService);
      }
    }

    // Remove pagination from pipeline for accommodation integration
    const pipelineWithoutPagination = [...pipeline];
    pipelineWithoutPagination.splice(-2, 2); // Remove skip and limit

    // Use aggregation pipeline for regular services
    const services = await servicesCol.aggregate(pipelineWithoutPagination).toArray();
    
    // Get total count of services using optimized pipeline
    const countPipeline = [...pipelineWithoutPagination];
    countPipeline.push({ $count: "total" });
    const countResult = await servicesCol.aggregate(countPipeline).toArray();
    const servicesTotal = countResult.length > 0 ? countResult[0].total : 0;

    // Combine services and accommodation results
    const combinedResults: Array<Record<string, unknown> & { distance?: number }> = [...services, ...accommodationResults];
    const total = servicesTotal + accommodationResults.length;


    // Sort combined results by distance if available, otherwise keep original order
    const sortedResults = combinedResults.sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });

    // Apply pagination to combined results
    const paginatedResults = sortedResults.slice((page - 1) * limit, page * limit);


    // Process results with HTML decoding and distance conversion
    const results = paginatedResults.map((service) => {
      const serviceAny = service as Record<string, unknown>;
      const result: Record<string, unknown> = {
        ...service,
        name: decodeText((serviceAny.name as string) || (serviceAny.ServiceProviderName as string) || ''),
        description: decodeText((serviceAny.description as string) || (serviceAny.Info as string) || ''),
        organisationSlug: (serviceAny.organisation as { slug?: string })?.slug || (serviceAny.ServiceProviderKey as string),
        // Ensure organisation data is properly decoded
        organisation: serviceAny.organisation ? {
          name: decodeText((serviceAny.organisation as { name?: string })?.name || ''),
          slug: (serviceAny.organisation as { slug?: string })?.slug || '',
          isVerified: (serviceAny.organisation as { isVerified?: boolean })?.isVerified || false
        } : {
          name: decodeText((serviceAny.ServiceProviderName as string) || ''),
          slug: (serviceAny.ServiceProviderKey as string) || '',
          isVerified: Boolean(serviceAny.IsVerified) || false
        }
      };

      // Add distance to result if it was calculated by geospatial query
      if (service.distance !== undefined) {
        result.distance = Math.round(service.distance / 1000 * 100) / 100; // Convert to km and round to 2 decimal places
      }

      return result;
    });

    const responseData = {
      status: 'success',
      total,
      page,
      limit,
      results
    };

    // Cache the result (shorter cache in test environments)
    const cacheTime = process.env.NODE_ENV === 'test' ? 60000 : 900000; // 1min for tests, 15min for production
    queryCache.set(cacheKey, responseData, cacheTime);

    const response = NextResponse.json(responseData);

    // Add cache headers (less aggressive in test environments)
    const isTestEnv = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === '1';
    if (isTestEnv) {
      // Minimal caching for tests
      response.headers.set('Cache-Control', 'no-cache');
    } else {
      // Enhanced cache headers for production
      response.headers.set('Cache-Control', 'public, max-age=900, s-maxage=1800, stale-while-revalidate=86400'); // 15 min browser, 30 min CDN, 24h stale
      response.headers.set('X-RateLimit-Limit', '100'); // Rate limiting info
      response.headers.set('X-RateLimit-Remaining', '99'); // Rate limiting info
    }
    
    response.headers.set('ETag', `services-${cacheKey.slice(-8)}-${total}-${page}`); // Use cache key for better ETag
    response.headers.set('X-Cache', 'MISS');
    response.headers.set('Vary', 'Accept-Encoding, Accept'); // Enhanced vary header
    response.headers.set('X-Content-Type-Options', 'nosniff'); // Security header
    
    return response;
  } catch (error) {
    console.error('[API ERROR] /api/services:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Service temporarily unavailable. Please try again later.' 
      },
      { status: 503 }
    );
  }
}
