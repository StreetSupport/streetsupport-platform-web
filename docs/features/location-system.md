# Location System and Dynamic Routing

## Overview

The Street Support Platform uses a sophisticated location system that combines dynamic routing, geospatial search, and user location services to provide location-aware homelessness support services. The system handles multiple cities through a single dynamic route template while maintaining SEO optimization and performance.

## Architecture Overview

### Core Components

```
Location System Architecture:
├── Dynamic Routes
│   ├── [location]/page.tsx           # Main location pages
│   ├── [location]/services/page.tsx  # Location-specific services
│   └── [location]/organisations/[slug]/page.tsx # Organisation profiles
│
├── Geolocation Services
│   ├── LocationContext              # User location state
│   ├── Browser Geolocation API      # GPS positioning
│   └── Postcode Geocoding          # Address to coordinates
│
├── Location Data Management
│   ├── /api/locations               # Available locations
│   ├── /api/geocode                 # Postcode conversion
│   └── Static location data         # Pre-configured cities
│
└── Search & Filtering
    ├── Radius-based search          # Distance filtering
    ├── Geospatial queries          # MongoDB geo operations
    └── Location-aware results      # Distance calculations
```

## Dynamic Routing Implementation

### Location Page Structure (`[location]/page.tsx`)

The primary location page uses Next.js dynamic routing to handle multiple cities:

```typescript
// src/app/[location]/page.tsx
interface LocationPageProps {
  params: { location: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LocationPage({ 
  params, 
  searchParams 
}: LocationPageProps) {
  const locationSlug = params.location;
  
  // Validate and fetch location data
  const location = await getLocationBySlug(locationSlug);
  
  if (!location || !location.IsPublished) {
    notFound();
  }

  // Parse optional search parameters for user context
  const userLat = searchParams.lat ? parseFloat(searchParams.lat as string) : undefined;
  const userLng = searchParams.lng ? parseFloat(searchParams.lng as string) : undefined;
  const radius = searchParams.radius ? parseInt(searchParams.radius as string) : 5;

  // Fetch location-specific content
  const [services, organisations, news] = await Promise.all([
    getLocationServices(location, { lat: userLat, lng: userLng, radius }),
    getLocationOrganisations(location, { limit: 6 }),
    getLocationNews(locationSlug, { limit: 3 })
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <LocationHero location={location} />
      
      <ServiceSearchSection 
        location={location} 
        initialServices={services}
        userLocation={userLat && userLng ? { lat: userLat, lng: userLng } : undefined}
      />
      
      <QuickAccessSection location={location} />
      
      <OrganisationHighlights 
        organisations={organisations}
        location={location}
      />
      
      <NewsSection 
        news={news}
        locationSlug={locationSlug}
      />
      
      <PartnerSection location={location} />
      
      <LocationFooter location={location} />
    </main>
  );
}

// Generate static params for known locations
export async function generateStaticParams(): Promise<{ location: string }[]> {
  const locations = await getPublishedLocations();
  
  return locations.map(location => ({
    location: location.Key
  }));
}

// Generate SEO metadata for each location
export async function generateMetadata({ 
  params 
}: LocationPageProps): Promise<Metadata> {
  const location = await getLocationBySlug(params.location);
  
  if (!location) {
    return {
      title: 'Location Not Found | Street Support',
      description: 'The requested location could not be found.'
    };
  }

  const title = `Street Support ${location.Name} | Find Local Homelessness Support`;
  const description = `Find local homelessness support services in ${location.Name}. Connect with organisations providing meals, accommodation, and essential services for people experiencing homelessness.`;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://streetsupport.net';

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${location.Key}`,
    },
    openGraph: {
      title: `Street Support ${location.Name}`,
      description,
      url: `${baseUrl}/${location.Key}`,
      siteName: 'Street Support Network',
      type: 'website',
      locale: 'en_GB',
      images: [
        {
          url: `${baseUrl}/images/locations/${location.Key}-og.jpg`,
          width: 1200,
          height: 630,
          alt: `Street Support services in ${location.Name}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@streetsupport',
      title: `Street Support ${location.Name}`,
      description,
    },
    robots: {
      index: location.IsPublished,
      follow: location.IsPublished,
    }
  };
}
```

### Organisation Profile Pages (`[location]/organisations/[slug]/page.tsx`)

Nested dynamic routing for organisation profiles with location context:

```typescript
// src/app/[location]/organisations/[slug]/page.tsx
interface OrganisationPageProps {
  params: { 
    location: string; 
    slug: string; 
  };
  searchParams: { 
    lat?: string; 
    lng?: string; 
    radius?: string; 
  };
}

export default async function OrganisationPage({ 
  params, 
  searchParams 
}: OrganisationPageProps) {
  const { location: locationSlug, slug: orgSlug } = params;
  
  // Parse user location for distance calculations
  const userLocation = {
    lat: searchParams.lat ? parseFloat(searchParams.lat) : undefined,
    lng: searchParams.lng ? parseFloat(searchParams.lng) : undefined,
  };
  
  const radius = searchParams.radius ? parseInt(searchParams.radius) : 10;

  // Parallel data fetching for performance
  const [organisation, location] = await Promise.all([
    getOrganisationBySlug(orgSlug, {
      includeServices: true,
      userLocation: userLocation.lat && userLocation.lng ? userLocation : undefined,
      radius
    }),
    getLocationBySlug(locationSlug)
  ]);

  // Validation
  if (!organisation || !organisation.IsPublished) {
    notFound();
  }
  
  if (!location || !location.IsPublished) {
    notFound();
  }

  // Generate breadcrumb navigation
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: location.Name, href: `/${locationSlug}` },
    { label: 'Organisations', href: `/${locationSlug}/organisations` },
    { label: organisation.Name, href: `/${locationSlug}/organisations/${orgSlug}` }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Breadcrumbs items={breadcrumbs} />
      
      <OrganisationHeader 
        organisation={organisation}
        location={location}
        userLocation={userLocation.lat && userLocation.lng ? userLocation : undefined}
      />
      
      <OrganisationDetails organisation={organisation} />
      
      <ServicesList 
        services={organisation.Services || []}
        userLocation={userLocation.lat && userLocation.lng ? userLocation : undefined}
      />
      
      <ContactInformation organisation={organisation} />
      
      <LocationMap 
        organisation={organisation}
        userLocation={userLocation.lat && userLocation.lng ? userLocation : undefined}
      />
      
      <SocialShare 
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/${locationSlug}/organisations/${orgSlug}`}
        title={`${organisation.Name} | Street Support ${location.Name}`}
      />
    </main>
  );
}

// Generate static params for organisation pages
export async function generateStaticParams({ 
  params 
}: { 
  params: { location: string } 
}): Promise<{ slug: string }[]> {
  const organisations = await getOrganisationsByLocation(params.location);
  
  return organisations
    .filter(org => org.IsPublished)
    .map(org => ({
      slug: org.Key
    }));
}
```

## Geolocation Services

### LocationContext Integration

The LocationContext provides comprehensive location management:

```typescript
// Enhanced location context with location-aware features
interface LocationContextType {
  // User's current GPS location
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  
  // Selected location from dropdown/search
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  
  // Available locations for selection
  availableLocations: Location[];
  
  // Location request functionality
  requestUserLocation: () => Promise<void>;
  geocodePostcode: (postcode: string) => Promise<{ lat: number; lng: number } | null>;
  
  // State management
  isLoading: boolean;
  error: string | null;
  
  // Utility functions
  getDistanceFromUser: (lat: number, lng: number) => number | null;
  formatDistance: (distance: number) => string;
  getNearestLocation: (lat: number, lng: number) => Location | null;
  isWithinLocationBounds: (lat: number, lng: number, locationKey: string) => boolean;
}

// Implementation with enhanced location services
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available locations on mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        const { data } = await response.json();
        setAvailableLocations(data || []);
      } catch (error) {
        console.warn('Failed to load locations:', error);
      }
    };

    loadLocations();
  }, []);

  // Enhanced geolocation with error handling
  const requestUserLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000 // 5 minutes cache
          }
        );
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setUserLocation(location);
      
      // Store in localStorage with timestamp
      localStorage.setItem('userLocation', JSON.stringify({
        ...location,
        timestamp: Date.now()
      }));

      // Auto-select nearest location
      const nearest = getNearestLocation(location.lat, location.lng);
      if (nearest && !selectedLocation) {
        setSelectedLocation(nearest);
      }

    } catch (error) {
      const message = error instanceof GeolocationPositionError 
        ? getGeolocationErrorMessage(error.code)
        : 'Unable to get your location. Please try again or enter your postcode.';
        
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation, availableLocations]);

  // Postcode geocoding
  const geocodePostcode = useCallback(async (postcode: string) => {
    try {
      const response = await fetch(`/api/geocode?postcode=${encodeURIComponent(postcode)}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.location) {
        return {
          lat: data.location.lat,
          lng: data.location.lng
        };
      }
      
      return null;
    } catch (error) {
      console.warn('Geocoding failed:', error);
      return null;
    }
  }, []);

  // Find nearest location to coordinates
  const getNearestLocation = useCallback((lat: number, lng: number) => {
    if (!availableLocations.length) return null;

    let nearest = availableLocations[0];
    let shortestDistance = calculateDistance(lat, lng, nearest.Latitude, nearest.Longitude);

    for (const location of availableLocations.slice(1)) {
      const distance = calculateDistance(lat, lng, location.Latitude, location.Longitude);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearest = location;
      }
    }

    return shortestDistance <= 50 ? nearest : null; // Within 50 miles
  }, [availableLocations]);

  // Check if coordinates are within location service area
  const isWithinLocationBounds = useCallback((lat: number, lng: number, locationKey: string) => {
    const location = availableLocations.find(loc => loc.Key === locationKey);
    if (!location) return false;

    const distance = calculateDistance(lat, lng, location.Latitude, location.Longitude);
    return distance <= 25; // 25 mile service radius
  }, [availableLocations]);

  // Load persisted location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const { lat, lng, timestamp } = JSON.parse(savedLocation);
        
        // Check if location is still fresh (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setUserLocation({ lat, lng });
        } else {
          localStorage.removeItem('userLocation');
        }
      } catch (error) {
        console.warn('Failed to parse saved location:', error);
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  return (
    <LocationContext.Provider value={{
      userLocation,
      setUserLocation,
      selectedLocation,
      setSelectedLocation,
      availableLocations,
      requestUserLocation,
      geocodePostcode,
      isLoading,
      error,
      getDistanceFromUser,
      formatDistance,
      getNearestLocation,
      isWithinLocationBounds
    }}>
      {children}
    </LocationContext.Provider>
  );
}
```

### Postcode Geocoding Service

The geocoding API converts UK postcodes to coordinates:

```typescript
// src/app/api/geocode/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postcode = searchParams.get('postcode');
    
    if (!postcode) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required parameter: postcode' },
        { status: 400 }
      );
    }

    // Validate UK postcode format
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();
    
    if (!postcodeRegex.test(cleanPostcode)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid postcode format' },
        { status: 400 }
      );
    }

    // Use postcodes.io API (free UK postcode service)
    const apiUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`;
    
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { status: 'error', message: 'Postcode not found' },
          { status: 404 }
        );
      }
      
      throw new Error(`Geocoding service error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.result) {
      return NextResponse.json(
        { status: 'error', message: 'No location data available for this postcode' },
        { status: 404 }
      );
    }

    const result = NextResponse.json({
      status: 'success',
      location: {
        lat: data.result.latitude,
        lng: data.result.longitude
      },
      postcode: data.result.postcode,
      district: data.result.admin_district,
      region: data.result.region
    });

    // Cache successful responses for 1 hour
    result.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
    
    return result;

  } catch (error) {
    console.error('[API ERROR] /api/geocode:', error);
    
    return NextResponse.json(
      { status: 'error', message: 'Unable to geocode postcode at this time' },
      { status: 500 }
    );
  }
}
```

## Geospatial Search Implementation

### MongoDB Geospatial Queries

The platform uses MongoDB's geospatial features for location-based search:

```typescript
// src/utils/geoSearch.ts
import { MongoClient, Collection } from 'mongodb';

interface GeoSearchOptions {
  lat: number;
  lng: number;
  radius: number; // in miles
  category?: string;
  subCategory?: string;
  clientGroup?: string;
  openNow?: boolean;
  limit?: number;
  offset?: number;
}

export async function searchNearbyServices({
  lat,
  lng,
  radius,
  category,
  subCategory,
  clientGroup,
  openNow,
  limit = 50,
  offset = 0
}: GeoSearchOptions) {
  const { db } = await connectToDatabase();
  const servicesCollection = db.collection('services');

  // Build aggregation pipeline
  const pipeline: any[] = [
    {
      $geoNear: {
        near: { 
          type: 'Point', 
          coordinates: [lng, lat] // Note: MongoDB uses [longitude, latitude]
        },
        distanceField: 'distance',
        maxDistance: radius * 1609.34, // Convert miles to meters
        spherical: true,
        query: {
          IsPublished: true
        }
      }
    }
  ];

  // Add category filters
  if (category) {
    pipeline.push({
      $match: { ParentCategoryKey: category }
    });
  }

  if (subCategory) {
    pipeline.push({
      $match: { SubCategoryKey: subCategory }
    });
  }

  if (clientGroup) {
    pipeline.push({
      $match: { ClientGroups: clientGroup }
    });
  }

  // Add opening hours filter
  if (openNow) {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format

    pipeline.push({
      $match: {
        $or: [
          // 24/7 services
          { 'OpeningTimes.IsOpen24Hour': true },
          // Services open now
          {
            'OpeningTimes': {
              $elemMatch: {
                Day: currentDay,
                StartTime: { $lte: currentTime },
                EndTime: { $gte: currentTime }
              }
            }
          }
        ]
      }
    });
  }

  // Add sorting, pagination
  pipeline.push(
    { $sort: { distance: 1 } }, // Sort by distance
    { $skip: offset },
    { $limit: limit }
  );

  // Execute query
  const services = await servicesCollection.aggregate(pipeline).toArray();

  // Format distances for display
  return services.map(service => ({
    ...service,
    distance: Number((service.distance / 1609.34).toFixed(1)) // Convert to miles
  }));
}

// Geographic boundary checking for location-specific services
export async function getServicesWithinLocationBounds(
  locationKey: string,
  userLocation?: { lat: number; lng: number }
) {
  const { db } = await connectToDatabase();
  const locationsCollection = db.collection('locations');
  const servicesCollection = db.collection('services');

  // Get location boundaries
  const location = await locationsCollection.findOne({ Key: locationKey });
  if (!location) return [];

  // Define search area (polygon or circle around location center)
  const searchRadius = 25; // 25 mile radius for location services
  
  const pipeline: any[] = [
    {
      $geoNear: {
        near: { 
          type: 'Point', 
          coordinates: [location.Longitude, location.Latitude]
        },
        distanceField: 'distanceFromCenter',
        maxDistance: searchRadius * 1609.34, // 25 miles in meters
        spherical: true,
        query: {
          IsPublished: true
        }
      }
    }
  ];

  // Add user distance calculation if provided
  if (userLocation) {
    pipeline.push({
      $addFields: {
        userDistance: {
          $multiply: [
            {
              $divide: [
                {
                  $sqrt: {
                    $add: [
                      {
                        $pow: [
                          {
                            $multiply: [
                              { $subtract: [userLocation.lat, '$Address.Location.coordinates.1'] },
                              111.32 // Approximate km per degree latitude
                            ]
                          },
                          2
                        ]
                      },
                      {
                        $pow: [
                          {
                            $multiply: [
                              { $subtract: [userLocation.lng, '$Address.Location.coordinates.0'] },
                              { $cos: { $multiply: [userLocation.lat, Math.PI / 180] } },
                              111.32
                            ]
                          },
                          2
                        ]
                      }
                    ]
                  }
                },
                1.609344 // Convert km to miles
              ]
            },
            1
          ]
        }
      }
    });
  }

  return await servicesCollection.aggregate(pipeline).toArray();
}
```

### Client-Side Location Components

Location-aware UI components handle user interactions:

```typescript
// src/components/LocationSelector.tsx
import { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { ChevronDownIcon, MapPinIcon, GlobeIcon } from '@heroicons/react/24/outline';

interface LocationSelectorProps {
  showCurrentLocation?: boolean;
  onLocationChange?: (location: Location) => void;
  className?: string;
}

export function LocationSelector({
  showCurrentLocation = true,
  onLocationChange,
  className = ''
}: LocationSelectorProps) {
  const {
    selectedLocation,
    setSelectedLocation,
    availableLocations,
    userLocation,
    requestUserLocation,
    getNearestLocation,
    isLoading,
    error
  } = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [postcodeInput, setPostcodeInput] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onLocationChange?.(location);
    setIsOpen(false);
  };

  const handleCurrentLocation = async () => {
    await requestUserLocation();
    setIsOpen(false);
  };

  const handlePostcodeSearch = async () => {
    if (!postcodeInput.trim()) return;

    setIsGeocoding(true);
    try {
      const coords = await geocodePostcode(postcodeInput.trim());
      if (coords) {
        const nearest = getNearestLocation(coords.lat, coords.lng);
        if (nearest) {
          handleLocationSelect(nearest);
        } else {
          // No nearby location found
          alert('No nearby service areas found for this postcode');
        }
      } else {
        alert('Please check your postcode and try again');
      }
    } catch (error) {
      alert('Unable to find this postcode');
    } finally {
      setIsGeocoding(false);
      setPostcodeInput('');
    }
  };

  // Group locations by region
  const locationGroups = availableLocations.reduce((groups, location) => {
    const region = location.Region || 'Other Areas';
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(location);
    return groups;
  }, {} as Record<string, Location[]>);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          {selectedLocation ? (
            <>
              <MapPinIcon className="w-5 h-5 text-brand-a" />
              <span className="font-medium">{selectedLocation.Name}</span>
            </>
          ) : (
            <>
              <GlobeIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Select your area</span>
            </>
          )}
        </div>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-3 border-b border-gray-200">
            {/* Current Location Option */}
            {showCurrentLocation && (
              <button
                onClick={handleCurrentLocation}
                disabled={isLoading}
                className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-left"
              >
                <MapPinIcon className="w-5 h-5 text-brand-a" />
                <span>
                  {isLoading ? 'Finding your location...' : 'Use current location'}
                </span>
              </button>
            )}

            {/* Postcode Search */}
            <div className="mt-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={postcodeInput}
                  onChange={(e) => setPostcodeInput(e.target.value)}
                  placeholder="Enter postcode"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-a focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handlePostcodeSearch()}
                />
                <button
                  onClick={handlePostcodeSearch}
                  disabled={isGeocoding || !postcodeInput.trim()}
                  className="px-3 py-2 bg-brand-a text-white rounded-md text-sm hover:bg-brand-b disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeocoding ? '...' : 'Find'}
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Location List */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(locationGroups).map(([region, locations]) => (
              <div key={region}>
                <div className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                  {region}
                </div>
                {locations.map(location => (
                  <button
                    key={location.Key}
                    onClick={() => handleLocationSelect(location)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedLocation?.Key === location.Key 
                        ? 'bg-brand-a text-white hover:bg-brand-b' 
                        : ''
                    }`}
                  >
                    {location.Name}
                    {userLocation && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({formatDistance(calculateDistance(
                          userLocation.lat, 
                          userLocation.lng, 
                          location.Latitude, 
                          location.Longitude
                        ))} away)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Performance Optimisations

### Static Generation with ISR

Location pages use Incremental Static Regeneration for optimal performance:

```typescript
// Enhanced static generation with revalidation
export async function generateStaticParams() {
  const locations = await getPublishedLocations();
  
  // Generate static params for primary locations
  return locations
    .filter(location => location.IsPrimary) // Only primary locations at build time
    .map(location => ({
      location: location.Key
    }));
}

// Add revalidation for dynamic content
export const revalidate = 3600; // Revalidate every hour

// Force dynamic rendering for user-specific content
export const dynamic = 'force-static'; // Static by default, dynamic for user context
```

### Location-Based Caching

```typescript
// Enhanced caching strategy for location data
export const setCacheHeaders = (
  response: NextResponse,
  locationType: 'static' | 'dynamic' | 'user-specific'
) => {
  switch (locationType) {
    case 'static':
      // Static location data (boundaries, basic info)
      response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800'); // 1 day / 1 week
      break;
    case 'dynamic':
      // Dynamic location content (services, organisations)
      response.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600'); // 30 min / 1 hour
      break;
    case 'user-specific':
      // User-specific location data (distances, personalised results)
      response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes, private cache
      break;
  }
  
  response.headers.set('Vary', 'Accept-Encoding, Authorization');
  return response;
};
```

## SEO and Structured Data

### Location Schema Markup

```typescript
// Generate location-specific structured data
export function generateLocationStructuredData(location: Location, services?: Service[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `Street Support ${location.Name}`,
    description: `Homelessness support services in ${location.Name}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.Name,
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.Latitude,
      longitude: location.Longitude
    },
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${location.Key}`,
    containsPlace: services?.map(service => ({
      '@type': 'LocalBusiness',
      name: service.ServiceProviderName,
      description: service.Info,
      address: {
        '@type': 'PostalAddress',
        streetAddress: service.Address.Street,
        addressLocality: service.Address.City,
        postalCode: service.Address.Postcode,
        addressCountry: 'GB'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: service.Address.Location.coordinates[1],
        longitude: service.Address.Location.coordinates[0]
      }
    })) || [],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: location.Latitude,
        longitude: location.Longitude
      },
      geoRadius: '25 miles'
    }
  };
}
```

### Dynamic Sitemap Generation

```typescript
// Enhanced sitemap with location hierarchy
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://streetsupport.net';
  
  // Location pages with priority based on service count
  const locations = await getPublishedLocations();
  const locationPages = await Promise.all(
    locations.map(async location => {
      const serviceCount = await getLocationServiceCount(location.Key);
      
      return {
        url: `${baseUrl}/${location.Key}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: Math.min(0.5 + (serviceCount / 100), 1.0), // Dynamic priority based on content
      };
    })
  );

  // Organisation pages grouped by location
  const organisationPages: MetadataRoute.Sitemap = [];
  for (const location of locations) {
    const orgs = await getOrganisationsByLocation(location.Key);
    
    orgs.forEach(org => {
      organisationPages.push({
        url: `${baseUrl}/${location.Key}/organisations/${org.Key}`,
        lastModified: new Date(org.LastUpdated || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      });
    });
  }

  return [...locationPages, ...organisationPages];
}
```

## Testing Location Features

### Location System Testing

```typescript
// tests/__tests__/location-system.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationProvider, useLocation } from '@/contexts/LocationContext';

// Mock geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

// Mock API responses
jest.mock('@/utils/api', () => ({
  getLocationBySlug: jest.fn(),
  getPublishedLocations: jest.fn().mockResolvedValue([
    { Key: 'manchester', Name: 'Manchester', Latitude: 53.4808, Longitude: -2.2426 },
    { Key: 'birmingham', Name: 'Birmingham', Latitude: 52.4862, Longitude: -1.8904 },
  ]),
}));

function TestComponent() {
  const { 
    userLocation, 
    selectedLocation, 
    requestUserLocation, 
    getNearestLocation,
    formatDistance 
  } = useLocation();
  
  return (
    <div>
      <div data-testid="user-location">
        {userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'No location'}
      </div>
      <div data-testid="selected-location">
        {selectedLocation ? selectedLocation.Name : 'No selection'}
      </div>
      <button onClick={requestUserLocation}>Get Location</button>
    </div>
  );
}

describe('Location System', () => {
  beforeEach(() => {
    mockGeolocation.getCurrentPosition.mockClear();
  });

  it('should request user location successfully', async () => {
    const user = userEvent.setup();
    
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
      success({
        coords: { latitude: 53.4808, longitude: -2.2426 },
        timestamp: Date.now(),
      });
    });

    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    await user.click(screen.getByText('Get Location'));

    await waitFor(() => {
      expect(screen.getByTestId('user-location')).toHaveTextContent('53.4808, -2.2426');
    });
  });

  it('should handle geolocation errors gracefully', async () => {
    const user = userEvent.setup();
    
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
      error({
        code: GeolocationPositionError.PERMISSION_DENIED,
        message: 'Permission denied',
      });
    });

    render(
      <LocationProvider>
        <TestComponent />
      </LocationProvider>
    );

    await user.click(screen.getByText('Get Location'));

    await waitFor(() => {
      expect(screen.getByTestId('user-location')).toHaveTextContent('No location');
    });
  });

  it('should find nearest location correctly', async () => {
    const { result } = renderHook(() => useLocation(), {
      wrapper: LocationProvider,
    });

    await waitFor(() => {
      expect(result.current.availableLocations).toHaveLength(2);
    });

    // Test Manchester coordinates
    const nearest = result.current.getNearestLocation(53.4808, -2.2426);
    expect(nearest?.Key).toBe('manchester');
  });
});

// Integration tests for location pages
describe('Location Page Integration', () => {
  it('should render location page with services', async () => {
    const mockLocation = {
      Key: 'manchester',
      Name: 'Manchester',
      Latitude: 53.4808,
      Longitude: -2.2426,
      IsPublished: true,
    };

    (require('@/utils/api').getLocationBySlug as jest.Mock).mockResolvedValue(mockLocation);

    const { container } = render(
      <LocationProvider>
        <LocationPage params={{ location: 'manchester' }} searchParams={{}} />
      </LocationProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Street Support Manchester')).toBeInTheDocument();
    });

    expect(container).toHaveTextContent('Find local support services');
  });
});
```

## Related Documentation

- [API Documentation](../api/README.md) - Location and geocoding endpoints
- [State Management](./state-management.md) - LocationContext implementation
- [Next.js Implementation](./nextjs-implementation.md) - Dynamic routing patterns
- [Testing Strategy](../testing/README.md) - Location testing approaches

---

*Last Updated: August 2025*
*Features: Dynamic Routing, Geolocation, Geocoding*
*Status: Production Ready ✅*