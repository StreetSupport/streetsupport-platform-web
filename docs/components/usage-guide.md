# Component Usage Guide

This guide provides practical examples for implementing the Street Support Platform Web design system components with Next.js App Router and TypeScript.

## Design System Integration

Our components follow the design system specifications documented in `/docs/design-system/`. This guide shows how to implement them in practice.

---

## Core UI Components

### 🎨 **Card Component**

**Location**: `src/components/ui/Card.tsx`

**Basic Usage:**
```tsx
import Card from '@/components/ui/Card';

function ServiceList() {
  return (
    <div className="grid gap-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Service Name</h3>
        <p className="text-gray-600">Service description...</p>
      </Card>
    </div>
  );
}
```

**With Header and Footer:**
```tsx
<Card>
  <Card.Header>
    <h3>Manchester Food Bank</h3>
    <span className="text-brand-a">Open Now</span>
  </Card.Header>
  
  <Card.Content>
    <p>Free food parcels for families in need.</p>
  </Card.Content>
  
  <Card.Footer>
    <button className="btn-primary">View Details</button>
  </Card.Footer>
</Card>
```

### 🗺️ **GoogleMap Component**

**Location**: `src/components/GoogleMap.tsx`

**Basic Implementation:**
```tsx
import GoogleMap from '@/components/GoogleMap';
import type { ServiceLocation } from '@/types';

interface MapProps {
  services: ServiceLocation[];
  userLocation?: { lat: number; lng: number };
}

function ServiceMap({ services, userLocation }: MapProps) {
  const mapOptions = {
    center: userLocation || { lat: 53.4808, lng: -2.2426 },
    zoom: 12,
    styles: [] // Custom map styling
  };

  return (
    <GoogleMap
      locations={services}
      mapOptions={mapOptions}
      onMarkerClick={(serviceId) => {
        console.log('Service clicked:', serviceId);
      }}
      className="h-96 w-full rounded-lg"
    />
  );
}
```

**With Custom Markers:**
```tsx
<GoogleMap
  locations={services}
  markerIcon="/icons/service-marker.svg"
  userMarkerIcon="/icons/user-location.svg"
  clusteredView={true}
  onBoundsChanged={(bounds) => {
    // Update visible services
  }}
/>
```

### 🎛️ **FilterPanel Component**

**Location**: `src/components/FilterPanel.tsx`

**Complete Filter Implementation:**
```tsx
import FilterPanel from '@/components/FilterPanel';
import { useFilterContext } from '@/contexts/FilterContext';

function ServiceFilters() {
  const {
    selectedCategory,
    selectedSubCategory,
    selectedClientGroups,
    openNow,
    sortOrder,
    updateFilters,
    clearFilters
  } = useFilterContext();

  return (
    <FilterPanel
      categories={categories}
      clientGroups={clientGroups}
      selectedCategory={selectedCategory}
      selectedSubCategory={selectedSubCategory}
      selectedClientGroups={selectedClientGroups}
      openNow={openNow}
      sortOrder={sortOrder}
      onFilterChange={updateFilters}
      onClearFilters={clearFilters}
      className="bg-white shadow-sm rounded-lg p-6"
    />
  );
}
```

---

## Service Components

### 📋 **ServiceCard Component**

**Location**: `src/components/ServiceCard.tsx`

**Standard Service Display:**
```tsx
import ServiceCard from '@/components/ServiceCard';
import type { FlattenedService } from '@/types';

interface ServiceListProps {
  services: FlattenedService[];
  userLocation?: { lat: number; lng: number };
}

function ServiceList({ services, userLocation }: ServiceListProps) {
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          userContext={userLocation}
          onViewDetails={(serviceId) => {
            // Navigate to service details
            router.push(`/services/${serviceId}`);
          }}
          showDistance={!!userLocation}
          showOpeningTimes={true}
          className="hover:shadow-md transition-shadow"
        />
      ))}
    </div>
  );
}
```

**Compact Card Layout:**
```tsx
<ServiceCard
  service={service}
  variant="compact"
  showOrganisation={false}
  showDescription={false}
  actions={
    <button className="btn-sm btn-outline">
      Quick View
    </button>
  }
/>
```

### 🏢 **Organisation Components**

**OrganisationOverview:**
```tsx
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';

function OrganisationPage({ organisation }: { organisation: OrganisationDetails }) {
  return (
    <div className="max-w-4xl mx-auto">
      <OrganisationOverview 
        organisation={organisation}
        showVerificationBadge={true}
        showRegisteredCharity={true}
      />
    </div>
  );
}
```

**OrganisationServicesAccordion:**
```tsx
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';

function ServicesSection({ organisation, userContext }: Props) {
  const [selectedLocationForService, setSelectedLocationForService] = useState<Record<string, number>>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <OrganisationServicesAccordion
      organisation={organisation}
      userContext={userContext}
      selectedLocationForService={selectedLocationForService}
      setSelectedLocationForService={setSelectedLocationForService}
      openAccordion={openAccordion}
      setOpenAccordion={setOpenAccordion}
    />
  );
}
```

---

## Layout Components

### 🧭 **Navigation Component**

**Location**: `src/components/Nav.tsx`

**Header Implementation:**
```tsx
import Nav from '@/components/Nav';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav 
        currentPath="/find-help"
        showSearchButton={true}
        mobileMenuBreakpoint="md"
      />
      <main className="min-h-screen pt-16">
        {children}
      </main>
    </>
  );
}
```

### 🏠 **Hero Component**

**Location**: `src/components/Hero.tsx`

**Homepage Hero:**
```tsx
import Hero from '@/components/Hero';

function Homepage() {
  return (
    <Hero
      title="Find Support Near You"
      subtitle="Discover local services for housing, food, healthcare, and more"
      backgroundImage="/images/hero-bg.jpg"
      actions={
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
          <button className="btn-primary btn-lg w-full sm:w-auto">
            Find Services
          </button>
          <button className="btn-outline btn-lg w-full sm:w-auto">
            Learn More
          </button>
        </div>
      }
    />
  );
}
```

---

## Context Integration

### 🌍 **LocationContext Usage**

```tsx
import { useLocationContext } from '@/contexts/LocationContext';

function LocationAwareComponent() {
  const {
    location,
    locationLabel,
    radius,
    updateLocation,
    clearLocation,
    locationSource
  } = useLocationContext();

  const handleLocationUpdate = async (postcode: string) => {
    try {
      const coords = await geocodePostcode(postcode);
      updateLocation(coords, postcode, 'postcode');
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  return (
    <div>
      {location ? (
        <p>Showing results for {locationLabel}</p>
      ) : (
        <button onClick={() => handleLocationUpdate('M1 1AA')}>
          Set Location
        </button>
      )}
    </div>
  );
}
```

### 🎛️ **FilterContext Usage**

```tsx
import { useFilterContext } from '@/contexts/FilterContext';

function FilterableServicesList() {
  const { 
    filters, 
    updateFilters, 
    clearFilters,
    filteredServices 
  } = useFilterContext();

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <FilterPanel 
          {...filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
        />
      </aside>
      
      <main className="lg:col-span-3">
        <div className="space-y-4">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

---

## Form Components

### 📝 **Form Implementation**

**Location**: `src/components/ui/Form.tsx`

**Postcode Search Form:**
```tsx
import Form from '@/components/ui/Form';
import { useState } from 'react';

function PostcodeForm({ onSubmit }: { onSubmit: (postcode: string) => void }) {
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }
    
    if (!isValidPostcode(postcode)) {
      setError('Please enter a valid UK postcode');
      return;
    }
    
    setError('');
    onSubmit(postcode);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label htmlFor="postcode" className="form-label">
          Enter your postcode
        </label>
        <input
          id="postcode"
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          placeholder="M1 1AA"
          className="form-input"
          aria-describedby={error ? "postcode-error" : undefined}
        />
        {error && (
          <p id="postcode-error" className="text-red-600 text-sm mt-1">
            {error}
          </p>
        )}
      </Form.Field>
      
      <button type="submit" className="btn-primary w-full">
        Find Services
      </button>
    </Form>
  );
}
```

---

## Custom Hooks Integration

### ⏱️ **useDebounce Hook**

```tsx
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search services..."
      className="form-input"
    />
  );
}
```

### 👁️ **useIntersectionObserver Hook**

```tsx
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useRef } from 'react';

function InfiniteServiceList({ services, onLoadMore }: Props) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  useIntersectionObserver(
    loadMoreRef,
    () => {
      onLoadMore();
    },
    { threshold: 0.1 }
  );

  return (
    <div>
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
      
      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        <span className="text-gray-500">Loading more...</span>
      </div>
    </div>
  );
}
```

---

## TypeScript Interfaces

### Common Type Definitions

```tsx
// Service Types
interface FlattenedService {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  organisation: string;
  organisationSlug: string;
  description: string;
  openTimes: OpenTime[];
  clientGroups: string[];
  latitude: number;
  longitude: number;
  distance?: number;
}

interface OpenTime {
  day: number; // 0-6 (Sunday-Saturday)
  start: number; // 24-hour format (e.g., 900 = 9:00 AM)
  end: number;
}

// Organisation Types
interface OrganisationDetails {
  key: string;
  name: string;
  shortDescription?: string;
  description?: string;
  website?: string;
  telephone?: string;
  email?: string;
  addresses: Address[];
  services: FlattenedService[];
  groupedServices: Record<string, Record<string, FlattenedService[]>>;
}

// Location Types
interface UserLocation {
  lat: number;
  lng: number;
  label?: string;
  radius?: number;
  source?: 'geolocation' | 'postcode' | 'navigation';
}
```

---

## Accessibility Implementation

### ARIA Labels and Roles

```tsx
// Proper ARIA implementation
<section aria-labelledby="services-heading">
  <h2 id="services-heading">Available Services</h2>
  
  <nav aria-label="Service filters">
    <FilterPanel />
  </nav>
  
  <div role="main" aria-live="polite" aria-busy={loading}>
    {loading ? (
      <div role="status" aria-label="Loading services">
        <span className="sr-only">Loading services...</span>
      </div>
    ) : (
      <ul role="list">
        {services.map(service => (
          <li key={service.id} role="listitem">
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
    )}
  </div>
</section>
```

### Keyboard Navigation

```tsx
function NavigableComponent() {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleAction();
        break;
      case 'Escape':
        handleClose();
        break;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleAction}
      className="focus:outline-none focus:ring-2 focus:ring-brand-a"
    >
      Interactive Content
    </div>
  );
}
```

---

## Performance Best Practices

### Lazy Loading Components

```tsx
import { lazy, Suspense } from 'react';

const GoogleMap = lazy(() => import('@/components/GoogleMap'));

function ServicePage() {
  return (
    <div>
      <ServiceList />
      
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
        <GoogleMap locations={services} />
      </Suspense>
    </div>
  );
}
```

### Memoization

```tsx
import { memo, useMemo } from 'react';

const ServiceCard = memo(function ServiceCard({ service, userLocation }: Props) {
  const distance = useMemo(() => {
    if (!userLocation) return null;
    return calculateDistance(userLocation, service);
  }, [userLocation, service]);

  return (
    <Card>
      {/* Service content */}
      {distance && <span>{distance} miles away</span>}
    </Card>
  );
});
```

---

## Testing Integration

### Component Testing Setup

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterProvider } from '@/contexts/FilterContext';
import ServiceList from './ServiceList';

function renderWithProviders(component: React.ReactElement) {
  return render(
    <FilterProvider>
      {component}
    </FilterProvider>
  );
}

test('filters services by category', async () => {
  renderWithProviders(<ServiceList services={mockServices} />);
  
  const categoryFilter = screen.getByLabelText('Service Category');
  fireEvent.change(categoryFilter, { target: { value: 'meals' } });
  
  expect(screen.getByText('Food Bank Services')).toBeInTheDocument();
  expect(screen.queryByText('Housing Services')).not.toBeInTheDocument();
});
```

---

This guide provides the foundation for implementing Street Support Platform Web components. For specific design system specifications, refer to the individual component documentation in `/docs/design-system/`.

**Need Help?** Check the component source code in `/src/components/` for implementation details and TypeScript interfaces.