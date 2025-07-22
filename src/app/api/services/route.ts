import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import fallbackProviders from '@/data/service-providers.json';
import { decodeText } from '@/utils/htmlDecode';

interface MongoQuery {
  IsPublished: boolean;
  'Address.City'?: { $regex: RegExp };
  ParentCategoryKey?: { $regex: RegExp };
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
  $skip?: number;
  $limit?: number;
  $count?: string;
}

interface RawProvider {
  name: string;
  slug: string;
  verified: boolean;
  services?: RawService[];
}

interface RawService {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  openTimes?: unknown[];
  clientGroups?: string[];
  latitude?: number;
  longitude?: number;
}

interface ServiceWithDistance extends RawService {
  distance?: number;
  organisation: {
    name: string;
    slug: string;
    isVerified: boolean;
  };
  organisationSlug: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
  const category = searchParams.get('category');
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

  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const servicesCol = db.collection('ProvidedServices');
    const providersCol = db.collection('ServiceProviders');

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

    // Add pagination
    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    let services;
    let total;

    if (latitude !== undefined && longitude !== undefined) {
      // Use aggregation pipeline for geospatial queries
      services = await servicesCol.aggregate(pipeline).toArray();
      
      // Get total count for geospatial queries
      const countPipeline = [...pipeline];
      countPipeline.splice(-2, 2); // Remove skip and limit
      countPipeline.push({ $count: "total" });
      const countResult = await servicesCol.aggregate(countPipeline).toArray();
      total = countResult.length > 0 ? countResult[0].total : 0;
    } else {
      // Use traditional find for non-geospatial queries
      total = await servicesCol.countDocuments(query);
      services = await servicesCol
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    }

    const results = await Promise.all(
      services.map(async (service) => {
        const provider = await providersCol.findOne(
          { Key: service.ServiceProviderKey },
          {
            projection: {
              _id: 0,
              Key: 1,
              Name: 1,
              IsVerified: 1,
              ShortDescription: 1,
              Website: 1,
              Telephone: 1,
              Email: 1
            }
          }
        );

        const result: Record<string, unknown> = {
          ...service,
          name: decodeText(service.ServiceProviderName || ''),
          description: decodeText(service.Info || ''),
          organisation: provider
            ? {
                name: decodeText(provider.Name),
                slug: provider.Key,
                isVerified: provider.IsVerified
              }
            : null
        };

        // Add distance to result if it was calculated by geospatial query
        if (service.distance !== undefined) {
          result.distance = Math.round(service.distance / 1000 * 100) / 100; // Convert to km and round to 2 decimal places
        }

        return result;
      })
    );

    return NextResponse.json({
      status: 'success',
      total,
      page,
      limit,
      results
    });
  } catch (error) {
    console.error('[API ERROR] /api/services:', error);

    // Fallback with proper typing
    try {
      // Check if fallback data is available and valid
      if (!fallbackProviders || !Array.isArray(fallbackProviders)) {
        throw new Error('Fallback data is not available or invalid');
      }

      const rawProviders = fallbackProviders as RawProvider[];

      let allServices: ServiceWithDistance[] = rawProviders.flatMap((provider) =>
        (provider.services ?? []).map((service: RawService): ServiceWithDistance => ({
          id: service.id,
          name: decodeText(service.name),
          category: service.category,
          subCategory: service.subCategory,
          description: decodeText(service.description),
          openTimes: service.openTimes ?? [],
          clientGroups: service.clientGroups ?? [],
          latitude: service.latitude,
          longitude: service.longitude,
          organisation: {
            name: decodeText(provider.name),
            slug: provider.slug,
            isVerified: provider.verified,
          },
          organisationSlug: provider.slug,
        }))
      );

      // Apply geospatial filtering to fallback data if coordinates provided
      if (latitude !== undefined && longitude !== undefined && radiusKm !== undefined) {
        allServices = allServices
          .map((service: ServiceWithDistance) => {
            if (service.latitude && service.longitude) {
              // Calculate distance using Haversine formula
              const distance = calculateDistance(latitude, longitude, service.latitude, service.longitude);
              return { ...service, distance };
            }
            return service;
          })
          .filter((service: ServiceWithDistance) => service.distance !== undefined && service.distance <= radiusKm)
          .sort((a: ServiceWithDistance, b: ServiceWithDistance) => (a.distance || 0) - (b.distance || 0));
      }

      const total = allServices.length;
      const start = (page - 1) * limit;
      const results = allServices.slice(start, start + limit);

      return NextResponse.json({
        status: 'success',
        total,
        page,
        limit,
        results,
      });
    } catch (fallbackError) {
      console.error('[API ERROR] Fallback services failed:', fallbackError);
      return NextResponse.json(
        { status: 'error', message: 'Failed to fetch services' },
        { status: 500 }
      );
    }
  }
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}