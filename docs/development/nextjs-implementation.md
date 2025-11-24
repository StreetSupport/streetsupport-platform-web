# Next.js 15 Implementation Guide

## Overview

The Street Support Platform is built on Next.js 15 with the App Router architecture, providing a modern, performant foundation for the homelessness support service platform. This guide covers the specific implementation patterns, architectural decisions, and development practices used throughout the project.

## Core Architecture

### App Router Structure

The platform leverages Next.js 15's App Router for clean, file-based routing with enhanced capabilities:

```
src/app/
├── layout.tsx                    # Root layout with global providers
├── page.tsx                      # Homepage
├── globals.css                   # Global styles and design system
├── sitemap.ts                    # Dynamic sitemap generation
├── not-found.tsx                 # Custom 404 page
├── loading.tsx                   # Global loading UI
│
├── api/                          # Serverless API routes
│   ├── services/
│   │   ├── route.ts              # Service discovery endpoint
│   │   └── [id]/route.ts         # Individual service details
│   ├── service-providers/
│   │   ├── route.ts              # Organisation listing
│   │   └── [slug]/route.ts       # Organisation details
│   ├── news/
│   │   └── general/route.ts      # WordPress RSS integration
│   ├── temporary-accommodation/
│   │   └── route.ts              # Emergency accommodation API
│   ├── locations/route.ts        # Location data
│   ├── categories/route.ts       # Service categories
│   ├── client-groups/route.ts    # Target demographics
│   ├── geocode/route.ts          # Postcode to coordinates
│   ├── stats/route.ts            # Platform statistics
│   └── faqs/route.ts             # FAQ content
│
├── about/                        # Static about pages
│   ├── page.tsx                  # About overview
│   ├── jobs/page.tsx             # Jobs and opportunities
│   ├── impact/page.tsx           # Impact statistics
│   └── accessibility/page.tsx    # Accessibility statement
│
├── [location]/                   # Dynamic location pages
│   ├── page.tsx                  # Main location page
│   ├── services/
│   │   └── page.tsx              # Location services
│   └── organisations/
│       └── [slug]/page.tsx       # Organisation profiles
│
└── find-help/                    # Service discovery
    ├── page.tsx                  # Service search interface
    └── results/page.tsx          # Search results display
```

### TypeScript Integration

Full TypeScript implementation with strict configuration ensures type safety across the entire application:

**tsconfig.json Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Type Definitions:**
```typescript
// src/types/index.ts
export interface ServiceProvider {
  _id: string;
  Key: string;
  Name: string;
  ShortDescription: string;
  Description?: string;
  Website?: string;
  Telephone?: string;
  Email?: string;
  IsVerified: boolean;
  IsPublished: boolean;
  Addresses: Address[];
  Services?: Service[];
}

export interface Service {
  _id: string;
  ServiceProviderKey: string;
  ServiceProviderName: string;
  Info: string;
  ParentCategoryKey: string;
  SubCategoryKey: string;
  ClientGroups: string[];
  OpeningTimes: OpeningTime[];
  Address: Address;
  distance?: number;
}

export interface Location {
  _id: string;
  Key: string;
  Name: string;
  Latitude: number;
  Longitude: number;
  IsPublished: boolean;
}
```

## Dynamic Routing Patterns

### Location Pages (`[location]/page.tsx`)

The platform uses dynamic routing to handle multiple cities with a single template:

```typescript
interface LocationPageProps {
  params: { location: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LocationPage({ 
  params, 
  searchParams 
}: LocationPageProps) {
  const locationSlug = params.location;
  
  // Fetch location-specific data
  const location = await getLocationBySlug(locationSlug);
  
  if (!location) {
    notFound();
  }

  // Generate page content based on location
  return (
    <main className="min-h-screen">
      <LocationHeader location={location} />
      <ServiceSearch location={location} />
      <NewsSection locationSlug={locationSlug} />
      <PartnerSection location={location} />
    </main>
  );
}

// Static generation for known locations
export async function generateStaticParams() {
  const locations = await getPublishedLocations();
  
  return locations.map(location => ({
    location: location.Key
  }));
}

// SEO metadata generation
export async function generateMetadata({ 
  params 
}: LocationPageProps): Promise<Metadata> {
  const location = await getLocationBySlug(params.location);
  
  if (!location) {
    return { title: 'Location Not Found' };
  }

  return {
    title: `Street Support ${location.Name} | Find Local Homelessness Support`,
    description: `Find local homelessness support services in ${location.Name}. Connect with organisations providing meals, accommodation, and essential services.`,
    openGraph: {
      title: `Street Support ${location.Name}`,
      description: `Local homelessness support in ${location.Name}`,
      type: 'website',
    },
  };
}
```

### Organisation Profiles (`[location]/organisations/[slug]/page.tsx`)

Nested dynamic routes for organisation pages with location context:

```typescript
interface OrganisationPageProps {
  params: { location: string; slug: string };
  searchParams: { lat?: string; lng?: string; radius?: string };
}

export default async function OrganisationPage({ 
  params, 
  searchParams 
}: OrganisationPageProps) {
  const { location: locationSlug, slug: orgSlug } = params;
  
  // Parallel data fetching
  const [organisation, location] = await Promise.all([
    getOrganisationBySlug(orgSlug, {
      lat: searchParams.lat ? parseFloat(searchParams.lat) : undefined,
      lng: searchParams.lng ? parseFloat(searchParams.lng) : undefined,
      radius: searchParams.radius ? parseInt(searchParams.radius) : undefined,
    }),
    getLocationBySlug(locationSlug)
  ]);

  if (!organisation || !location) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: location.Name, href: `/${locationSlug}` },
          { label: 'Organisations', href: `/${locationSlug}/organisations` },
          { label: organisation.name, href: `/${locationSlug}/organisations/${orgSlug}` }
        ]} 
      />
      
      <OrganisationHeader organisation={organisation} />
      <ServiceList services={organisation.services} />
      <ContactInformation organisation={organisation} />
      <SocialShare 
        url={`/${locationSlug}/organisations/${orgSlug}`}
        title={organisation.name}
      />
    </main>
  );
}
```

## API Route Implementation

### Serverless Functions with Error Handling

All API routes implement comprehensive error handling and caching strategies:

```typescript
// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parameter validation
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (!lat || !lng) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required parameters: lat, lng' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid coordinates provided' },
        { status: 400 }
      );
    }

    // Optional parameters with defaults
    const radius = parseInt(searchParams.get('radius') || '5');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500);
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const clientGroup = searchParams.get('clientGroup');
    const openNow = searchParams.get('openNow') === 'true';

    // Database query with geospatial search
    const { db } = await connectToDatabase();
    
    const pipeline = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          maxDistance: radius * 1609.34, // Convert miles to meters
          spherical: true
        }
      }
    ];

    // Add filters based on parameters
    if (category) {
      pipeline.push({ $match: { ParentCategoryKey: category } });
    }
    
    if (subCategory) {
      pipeline.push({ $match: { SubCategoryKey: subCategory } });
    }
    
    if (clientGroup) {
      pipeline.push({ $match: { ClientGroups: clientGroup } });
    }
    
    if (openNow) {
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      
      pipeline.push({
        $match: {
          'OpeningTimes': {
            $elemMatch: {
              Day: currentDay,
              StartTime: { $lte: currentTime },
              EndTime: { $gte: currentTime }
            }
          }
        }
      });
    }

    pipeline.push({ $limit: limit });

    const services = await db.collection('services').aggregate(pipeline).toArray();

    // Format response
    const response = NextResponse.json({
      status: 'success',
      total: services.length,
      count: services.length,
      data: services.map(service => ({
        ...service,
        distance: Number((service.distance / 1609.34).toFixed(1)) // Convert to miles
      }))
    });

    // Set cache headers
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    
    return response;

  } catch (error) {
    console.error('[API ERROR] /api/services:', error);
    
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### WordPress RSS Integration

Custom RSS parsing for news integration:

```typescript
// src/app/api/news/general/route.ts
export async function GET() {
  try {
    const feedUrl = 'https://news.streetsupport.net/feed/';
    let news: NewsItem[] = [];

    try {
      const response = await fetch(feedUrl, {
        headers: { 'User-Agent': 'StreetSupport-Platform/1.0' },
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const xml = await response.text();
        news = parseRSSFeed(xml);
      }
    } catch (error) {
      console.warn(`Failed to fetch general news feed:`, error);
    }

    // Process and deduplicate news items
    const uniqueNews = news.filter((item, index, arr) => 
      arr.findIndex(i => i.link === item.link) === index
    ).sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    const newsResponse = NextResponse.json({
      status: 'success',
      data: {
        news: uniqueNews.slice(0, 20),
        total: uniqueNews.length
      }
    });

    // Cache for 30 minutes browser, 1 hour CDN
    newsResponse.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    
    return newsResponse;

  } catch (error) {
    console.error('[API ERROR] /api/news/general:', error);
    
    // Graceful fallback
    return NextResponse.json({
      status: 'success',
      data: {
        news: [],
        total: 0,
        error: 'Unable to fetch news at this time'
      }
    });
  }
}
```

## State Management Architecture

### React Context Providers

The application uses React Context for global state management:

```typescript
// src/contexts/LocationContext.tsx
interface LocationContextType {
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  requestUserLocation: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestUserLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to get location';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{
      userLocation,
      setUserLocation,
      selectedLocation,
      setSelectedLocation,
      requestUserLocation,
      isLoading,
      error
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
```

### Filter State Management

```typescript
// src/contexts/FilterContext.tsx
interface FilterState {
  category: string | null;
  subCategory: string | null;
  clientGroup: string | null;
  radius: number;
  openNow: boolean;
  location: { lat: number; lng: number } | null;
}

interface FilterContextType {
  filters: FilterState;
  setCategory: (category: string | null) => void;
  setSubCategory: (subCategory: string | null) => void;
  setClientGroup: (clientGroup: string | null) => void;
  setRadius: (radius: number) => void;
  toggleOpenNow: () => void;
  setLocation: (location: { lat: number; lng: number } | null) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const defaultFilters: FilterState = {
  category: null,
  subCategory: null,
  clientGroup: null,
  radius: 5,
  openNow: false,
  location: null,
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.subCategory ||
    filters.clientGroup ||
    filters.openNow ||
    filters.radius !== 5
  );

  return (
    <FilterContext.Provider value={{
      filters,
      setCategory: (category) => updateFilter({ category }),
      setSubCategory: (subCategory) => updateFilter({ subCategory }),
      setClientGroup: (clientGroup) => updateFilter({ clientGroup }),
      setRadius: (radius) => updateFilter({ radius }),
      toggleOpenNow: () => updateFilter({ openNow: !filters.openNow }),
      setLocation: (location) => updateFilter({ location }),
      resetFilters: () => setFilters(defaultFilters),
      hasActiveFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
}
```

## Performance Optimisation

### Static Site Generation

Optimised static generation for frequently accessed pages:

```typescript
// Pre-generate location pages at build time
export async function generateStaticParams() {
  const locations = await getPublishedLocations();
  
  // Generate params for all published locations
  return locations.map(location => ({
    location: location.Key
  }));
}

// Dynamic metadata generation with caching
export async function generateMetadata({ 
  params 
}: LocationPageProps): Promise<Metadata> {
  // Cache metadata generation to avoid repeated API calls
  const location = await getLocationBySlug(params.location);
  
  if (!location) {
    return { title: 'Location Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://streetsupport.net';
  
  return {
    title: `Street Support ${location.Name} | Find Local Homelessness Support`,
    description: `Find local homelessness support services in ${location.Name}. Connect with organisations providing meals, accommodation, and essential services.`,
    alternates: {
      canonical: `${baseUrl}/${location.Key}`,
    },
    openGraph: {
      title: `Street Support ${location.Name}`,
      description: `Local homelessness support in ${location.Name}`,
      url: `${baseUrl}/${location.Key}`,
      siteName: 'Street Support Network',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/og-${location.Key}.jpg`,
          width: 1200,
          height: 630,
          alt: `Street Support ${location.Name}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@streetsupport',
      title: `Street Support ${location.Name}`,
      description: `Local homelessness support in ${location.Name}`,
    },
  };
}
```

### Image Optimisation

Next.js Image component with responsive loading:

```typescript
// Optimised image component usage
import Image from 'next/image';

export function OptimisedImage({
  src,
  alt,
  priority = false,
  className = ''
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
}
```

### API Response Caching

Comprehensive caching strategy for API responses:

```typescript
// Cache headers for different content types
export const setCacheHeaders = (
  response: NextResponse,
  type: 'static' | 'dynamic' | 'realtime'
) => {
  switch (type) {
    case 'static':
      // Static content (locations, categories) - cache for 1 hour
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
      break;
    case 'dynamic':
      // Dynamic content (services) - cache for 5 minutes
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      break;
    case 'realtime':
      // Real-time content (news) - cache for 30 minutes
      response.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600');
      break;
  }
  
  // Enable browser caching
  response.headers.set('Vary', 'Accept-Encoding');
  
  return response;
};
```

## Error Handling Patterns

### Global Error Boundary

```typescript
// src/app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
    
    // Report to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        <button
          onClick={reset}
          className="btn-base btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

### API Error Handling

```typescript
// Standardised API error handling
export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function handleAPIError(error: unknown): Promise<NextResponse> {
  console.error('API Error:', error);
  
  if (error instanceof APIError) {
    return NextResponse.json(
      { status: 'error', message: error.message, code: error.code },
      { status: error.status }
    );
  }
  
  // Generic error response
  return NextResponse.json(
    { status: 'error', message: 'Internal server error' },
    { status: 500 }
  );
}
```

## SEO Implementation

### Structured Data

JSON-LD structured data for better search visibility:

```typescript
// Generate organisation structured data
export function generateOrganisationStructuredData(organisation: ServiceProvider) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NonProfit',
    name: organisation.Name,
    description: organisation.ShortDescription,
    url: organisation.Website,
    telephone: organisation.Telephone,
    email: organisation.Email,
    address: organisation.Addresses.map(addr => ({
      '@type': 'PostalAddress',
      streetAddress: addr.Street,
      addressLocality: addr.City,
      postalCode: addr.Postcode,
      addressCountry: 'GB'
    })),
    areaServed: {
      '@type': 'City',
      name: organisation.Addresses[0]?.City
    },
    sameAs: organisation.Website ? [organisation.Website] : undefined
  };
}

// Usage in page components
export default function OrganisationPage({ organisation }: { organisation: ServiceProvider }) {
  const structuredData = generateOrganisationStructuredData(organisation);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Page content */}
    </>
  );
}
```

### Sitemap Generation

Dynamic sitemap generation for all pages:

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getPublishedLocations, getPublishedOrganisations } from '@/utils/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://streetsupport.net';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/find-help`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Dynamic location pages
  const locations = await getPublishedLocations();
  const locationPages = locations.map(location => ({
    url: `${baseUrl}/${location.Key}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Organisation pages
  const organisations = await getPublishedOrganisations();
  const organisationPages = organisations.map(org => ({
    url: `${baseUrl}/${org.locationSlug}/organisations/${org.Key}`,
    lastModified: new Date(org.lastUpdated || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...locationPages, ...organisationPages];
}
```

## Testing Integration

### Component Testing with Next.js

```typescript
// tests/__tests__/pages/location.test.tsx
import { render, screen } from '@testing-library/react';
import LocationPage from '@/app/[location]/page';
import { LocationProvider } from '@/contexts/LocationContext';

// Mock Next.js functions
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  notFound: jest.fn(),
}));

// Mock API functions
jest.mock('@/utils/api', () => ({
  getLocationBySlug: jest.fn(),
  getPublishedLocations: jest.fn(),
}));

const renderLocationPage = (props = {}) => {
  const defaultProps = {
    params: { location: 'manchester' },
    searchParams: {},
    ...props,
  };

  return render(
    <LocationProvider>
      <LocationPage {...defaultProps} />
    </LocationProvider>
  );
};

describe('LocationPage', () => {
  beforeEach(() => {
    (require('@/utils/api').getLocationBySlug as jest.Mock).mockResolvedValue({
      _id: '1',
      Key: 'manchester',
      Name: 'Manchester',
      Latitude: 53.4808,
      Longitude: -2.2426,
      IsPublished: true,
    });
  });

  it('renders location page with correct title', async () => {
    await renderLocationPage();
    
    expect(screen.getByText('Street Support Manchester')).toBeInTheDocument();
  });

  it('displays service search functionality', async () => {
    await renderLocationPage();
    
    expect(screen.getByPlaceholderText(/search for services/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find services/i })).toBeInTheDocument();
  });
});
```

## Development Best Practices

### Code Organisation

1. **Component Structure**: Follow the established component hierarchy with clear separation of concerns
2. **Type Safety**: Maintain strict TypeScript compliance with proper interface definitions
3. **Error Boundaries**: Implement error boundaries at appropriate levels
4. **Performance**: Use React.memo, useMemo, and useCallback where beneficial
5. **Accessibility**: Ensure all components meet WCAG AA standards

### Environment Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['news.streetsupport.net', 'images.streetsupport.net'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/old-path/:slug*',
        destination: '/new-path/:slug*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

## Related Documentation

- [API Documentation](../api/README.md) - Comprehensive API reference
- [Testing Strategy](../testing/README.md) - Testing implementation and patterns
- [Design System](../design-system/README.md) - UI component guidelines
- [Performance Optimisation](./IMAGE_OPTIMISATION.md) - Performance best practices

---

*Last Updated: August 2025*
*Next.js Version: 15.0.0*
*Status: Production Ready ✅*