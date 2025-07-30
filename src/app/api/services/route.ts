import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import { decodeText } from '@/utils/htmlDecode';
import queryCache from '@/utils/queryCache';

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
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.headers.set('X-Cache', 'HIT');
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

    // Add $lookup to join with ServiceProviders collection to eliminate N+1 queries
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
            ShortDescription: 1,
            Website: 1,
            Telephone: 1,
            Email: 1
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
                isVerified: { $ifNull: ['$provider.IsVerified', false] }
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
        ParentCategoryKey: 1,
        SubCategoryKey: 1,
        ServiceProviderName: 1,
        ServiceProviderKey: 1,
        OpeningTimes: 1,
        ClientGroups: 1,
        'Address.Location': 1,
        organisation: 1,
        distance: 1
      }
    });

    // Add pagination
    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    // Use aggregation pipeline for all queries now (optimized with $lookup)
    const services = await servicesCol.aggregate(pipeline).toArray();
    
    // Get total count using optimized pipeline
    const countPipeline = [...pipeline];
    countPipeline.splice(-2, 2); // Remove skip and limit  
    countPipeline.push({ $count: "total" });
    const countResult = await servicesCol.aggregate(countPipeline).toArray();
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Process results with HTML decoding and distance conversion
    const results = services.map((service) => {
      const result: Record<string, unknown> = {
        ...service,
        name: decodeText(service.name || service.ServiceProviderName || ''),
        description: decodeText(service.description || service.Info || ''),
        organisationSlug: service.organisation?.slug || service.ServiceProviderKey,
        // Ensure organisation data is properly decoded
        organisation: service.organisation ? {
          name: decodeText(service.organisation.name),
          slug: service.organisation.slug,
          isVerified: service.organisation.isVerified
        } : {
          name: decodeText(service.ServiceProviderName || ''),
          slug: service.ServiceProviderKey,
          isVerified: false
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

    // Cache the result for 5 minutes
    queryCache.set(cacheKey, responseData, 300000);

    const response = NextResponse.json(responseData);

    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // 5 min browser, 10 min CDN
    response.headers.set('ETag', `services-${Date.now()}-${total}-${page}`);
    response.headers.set('X-Cache', 'MISS');
    
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
