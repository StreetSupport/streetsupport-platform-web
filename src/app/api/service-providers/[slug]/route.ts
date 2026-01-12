import { NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import { decodeText } from '@/utils/htmlDecode';
import { loadAccommodationDataForProvider, type AccommodationData } from '@/utils/accommodationData';

// This function is now replaced by loadAccommodationDataForProvider() from utils/accommodationData.ts

// Function to transform accommodation to service format for organisation pages
function transformAccommodationToOrganisationService(accommodation: AccommodationData) {
  return {
    _id: accommodation.id,
    ParentCategoryKey: 'accom',
    SubCategoryKey: accommodation.accommodation?.type || 'other',
    SubCategoryName: accommodation.accommodation?.type || 'Other',
    Info: accommodation.synopsis || accommodation.description || '',
    OpeningTimes: [],
    ClientGroups: [],
    Address: {
      Location: {
        type: 'Point',
        coordinates: [accommodation.address?.longitude || 0, accommodation.address?.latitude || 0]
      },
      City: accommodation.address?.city || '',
      Street: accommodation.address?.street1 || '',
      Postcode: accommodation.address?.postcode || ''
    },
    IsAppointmentOnly: false,
    IsTelephoneService: false,
    IsOpen247: false,
    // Add accommodation-specific data for the accordion display
    accommodationData: {
      type: accommodation.accommodation?.type,
      isOpenAccess: accommodation.accommodation?.isOpenAccess,
      referralRequired: accommodation.accommodation?.referralRequired,
      referralNotes: accommodation.accommodation?.referralNotes,
      price: accommodation.accommodation?.price,
      foodIncluded: accommodation.accommodation?.foodIncluded,
      availabilityOfMeals: accommodation.accommodation?.availabilityOfMeals,
      features: accommodation.features || {},
      residentCriteria: accommodation.residentCriteria || {},
      support: accommodation.support || {},
      contact: accommodation.contact || {},
      synopsis: decodeText(accommodation.synopsis || ''),
      description: decodeText(accommodation.description || '')
    },
    sourceType: 'accommodation'
  };
}

export async function GET(req: Request) {
  // ✅ App Router API routes do not receive `context.params`
  // So parse slug manually:
  const url = new URL(req.url);
  const parts = url.pathname.split('/');
  const slug = parts[parts.length - 1];

  // Extract search parameters for location-based filtering
  const searchParams = url.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius');

  if (!slug) {
    return NextResponse.json(
      { status: 'error', message: 'Slug is required' },
      { status: 400 }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');

    const providersCol = db.collection('ServiceProviders');
    const servicesCol = db.collection('ProvidedServices');

    const rawProvider = await providersCol.findOne(
      {
        Key: { $regex: new RegExp(`^${slug}$`, 'i') },
        IsPublished: true,
      },
      {
        projection: {
          _id: 0,
          Key: 1,
          Name: 1,
          ShortDescription: 1,
          Description: 1,
          Website: 1,
          Telephone: 1,
          Email: 1,
          Facebook: 1,
          Twitter: 1,
          Instagram: 1,
          Bluesky: 1,
          IsVerified: 1,
          IsPublished: 1,
          AssociatedLocationIds: 1,
          Tags: 1,
          RegisteredCharity: 1,
          Addresses: 1,
        },
      }
    );

    if (!rawProvider) {
      return NextResponse.json(
        { status: 'error', message: 'Organisation not found' },
        { status: 404 }
      );
    }

    // Build query for services with location filtering if provided
    const servicesQuery = {
      ServiceProviderKey: rawProvider.Key,
      IsPublished: true,
    };

    // Add user context for distance calculations (but don't filter)
    const userContext = lat && lng ? {
      lat: parseFloat(lat) || null,
      lng: parseFloat(lng) || null,
      radius: radius ? parseFloat(radius) : null,
      location: null // Could add location name if needed
    } : null;

    // Fetch services and accommodation in parallel for better performance
    const [servicesResult, organisationAccommodation] = await Promise.all([
      // Always return all services for this organisation (no geospatial filtering)
      // Organisation pages should show ALL services, not filter by user location
      servicesCol
        .find(servicesQuery)
        .project({
          _id: 1,
          ParentCategoryKey: 1,
          SubCategoryKey: 1,
          SubCategoryName: 1,
          Info: 1,
          OpeningTimes: 1,
          // We don't use ClientGroups, but I leave it because afraid to break something
          ClientGroups: 1,
          Address: 1,
          IsAppointmentOnly: 1,
          IsTelephoneService: 1
        })
        .toArray(),
      // Load accommodation data for this organisation from database
      loadAccommodationDataForProvider(rawProvider.Key)
    ]);

    // Transform accommodation to service format
    const accommodationServices = organisationAccommodation.map(transformAccommodationToOrganisationService);
    
    // Combine regular services with accommodation services
    const services = [...servicesResult, ...accommodationServices];

    const provider = {
      key: rawProvider.Key,
      name: decodeText(rawProvider.Name),
      shortDescription: decodeText(rawProvider.ShortDescription || ''),
      description: decodeText(rawProvider.Description || ''),
      website: rawProvider.Website,
      telephone: rawProvider.Telephone,
      email: rawProvider.Email,
      facebook: rawProvider.Facebook,
      twitter: rawProvider.Twitter,
      instagram: rawProvider.Instagram,
      bluesky: rawProvider.Bluesky,
      isVerified: rawProvider.IsVerified,
      isPublished: rawProvider.IsPublished,
      associatedLocationIds: rawProvider.AssociatedLocationIds,
      tags: rawProvider.Tags,
      RegisteredCharity: rawProvider.RegisteredCharity,
      addresses: rawProvider.Addresses || [],
    };

    const decodedServices = services.map(service => {
      const decoded = {
        ...service,
        isTelephoneService: (service.IsTelephoneService as boolean) || false,
        isAppointmentOnly: (service.IsAppointmentOnly as boolean) || false,
        isOpen247: (service.Address as Record<string, unknown>)?.IsOpen247 as boolean || false,
        Info: decodeText(service.Info || ''),
        SubCategoryName: decodeText(service.SubCategoryName || ''),
        // Ensure accommodation data is preserved
        ...(service.accommodationData && { accommodationData: service.accommodationData }),
        ...(service.sourceType && { sourceType: service.sourceType })
      };
      
      
      return decoded;
    });

    const response = NextResponse.json({
      status: 'success',
      organisation: provider,
      addresses: provider.addresses,
      services: decodedServices,
      userContext: userContext,
    });

    // Enhanced cache headers for better performance  
    response.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400'); // 30 min browser, 60 min CDN, 24h stale
    response.headers.set('ETag', `org-${slug}-${services.length}-${Date.now().toString(36)}`);
    response.headers.set('Vary', 'Accept-Encoding, Accept');
    response.headers.set('Last-Modified', new Date().toUTCString());
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;

  } catch (error) {
    console.error('[API ERROR] /api/service-providers/[slug]:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch organisation details' },
      { status: 500 }
    );
  }
}
