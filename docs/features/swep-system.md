# SWEP (Severe Weather Emergency Protocol) System

## Overview

The SWEP (Severe Weather Emergency Protocol) system provides critical emergency notifications and information during severe weather conditions when additional support services are activated for people experiencing homelessness. This system includes automated banner display, dedicated information pages, and emergency contact integration.

## System Architecture

### Core Components

```
SWEP System Components:
├── SwepBanner.tsx               # Emergency notification banner
├── [slug]/swep/page.tsx         # Dedicated SWEP information pages
├── swep.ts                      # SWEP utility functions
├── fetchSwep.ts                 # SWEP data fetching utilities
├── swep-fallback.json           # Static SWEP data for testing
└── locations-swep API          # Dynamic SWEP data endpoint
```

### Data Flow

```
Weather Monitoring → CMS Updates → API Endpoint → Component Display
                                      ↓
Static Fallback ← Development/Testing ← Database Query
```

## SWEP Banner Component

### Visual Design

The SWEP banner uses high-contrast emergency styling for maximum visibility:

- **Background**: Emergency red (`#a90000` - `var(--brand-g)`)
- **Text**: High-contrast white with red tinting for secondary text
- **Visual Indicator**: Prominent status dot to indicate active emergency
- **Call-to-Action**: White button with red text for maximum contrast
- **Shadow**: Enhanced shadow for prominence over other content

### Implementation

```tsx
// SwepBanner.tsx - Core implementation
export default function SwepBanner({ swepData, locationSlug }: SwepBannerProps) {
  // Time-based activation logic
  const now = new Date();
  const activeFrom = new Date(swepData.swepActiveFrom);
  const activeUntil = new Date(swepData.swepActiveUntil);
  const isActive = now >= activeFrom && now <= activeUntil;

  // Only render when SWEP is active
  if (!isActive) {
    return null;
  }

  return (
    <div className="swep-banner bg-brand-g text-white py-4 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Visual status indicator */}
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-brand-g rounded-full"></div>
              </div>
              <h2 className="text-lg font-bold">
                Severe Weather Emergency Protocol (SWEP) Active
              </h2>
            </div>
            <p className="text-red-100">{swepData.shortMessage}</p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={`/${locationSlug}/swep`}
              onClick={() => trackSwepBannerClick(locationSlug)}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-g font-semibold rounded-md hover:bg-red-50 active:bg-red-100 transition-colors duration-200"
            >
              View SWEP Information
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Accessibility Features

- **High Contrast**: Emergency red background with white text exceeds WCAG AAA standards
- **Clear Hierarchy**: Prominent heading and supporting text structure
- **Focus Management**: Keyboard-accessible with visible focus indicators
- **Screen Reader Support**: Descriptive text and proper heading structure
- **Touch Targets**: Minimum 44px touch target size on mobile devices

## SWEP Information Pages

### Page Structure

SWEP information pages provide comprehensive emergency information at `/[location]/swep`:

#### Header Section
- Emergency visual treatment with red colour scheme
- Active period display with formatted dates and times
- Status indicator matching banner design
- Clear emergency messaging

#### Content Section
- Detailed SWEP information and instructions
- Emergency procedures and contact information
- Location-specific support service details
- Image support for visual communication

#### Emergency Contacts Section
- Prominent emergency contact information
- 999 emergency services contact
- StreetLink rough sleeping reporting integration
- Accessible contact methods with proper links

### Implementation

```tsx
// SWEP page implementation with emergency styling
export default async function SwepPage(props) {
  const { slug } = await props.params;
  const location = locations.find(loc => loc.slug === slug && loc.isPublic);
  
  if (!location) notFound();

  const swepData = swepPlaceholderData.find(
    (entry: SwepData) => entry.locationSlug === slug
  ) || null;

  // Security: Only show when SWEP is active
  if (!swepData || !isSwepActive(swepData)) {
    notFound();
  }

  return (
    <main>
      {/* Emergency header with visual prominence */}
      <div className="bg-red-50 border-b-4 border-brand-g py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-brand-g rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="heading-2 text-red-800 mb-0">
              {swepData.title}
            </h1>
          </div>
          <p className="text-lead text-red-700 mb-4">
            {formatSwepActivePeriod(swepData)}
          </p>
          <div className="bg-brand-g text-white px-4 py-2 rounded-md inline-block">
            <strong>Emergency Support Active</strong>
          </div>
        </div>
      </div>

      {/* Content section with emergency contacts */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: parseSwepBody(swepData.body) }}
          />
          
          {/* Emergency contacts with accessible styling */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">
              Emergency Contacts
            </h3>
            <div className="space-y-2">
              <p className="text-blue-700">
                <strong>Immediate danger:</strong>
                <a href="tel:999" className="text-blue-600 hover:text-blue-800 underline font-semibold">
                  Call 999
                </a>
              </p>
              <p className="text-blue-700">
                <strong>Someone sleeping rough:</strong>
                <a 
                  href="https://thestreetlink.org.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  Report via StreetLink
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

## SWEP Utility Functions

### Time Management

The SWEP system includes utilities for managing time-based activation:

```typescript
// swep.ts - Core utility functions
export function isSwepActive(swepData: SwepData): boolean {
  const now = new Date();
  const activeFrom = new Date(swepData.swepActiveFrom);
  const activeUntil = new Date(swepData.swepActiveUntil);
  
  return now >= activeFrom && now <= activeUntil;
}

export function formatSwepActivePeriod(swepData: SwepData): string {
  const activeFrom = new Date(swepData.swepActiveFrom);
  const activeUntil = new Date(swepData.swepActiveUntil);
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const fromString = activeFrom.toLocaleDateString('en-GB', formatOptions);
  const untilString = activeUntil.toLocaleDateString('en-GB', formatOptions);
  
  return `SWEP is currently active from ${fromString} until ${untilString}`;
}
```

### Content Processing

HTML content processing for CMS integration:

```typescript
export function parseSwepBody(body: string): string {
  // Basic HTML entity decoding for CMS content
  return body
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
```

## Data Structure

### SWEP Data Interface

```typescript
interface SwepData {
  id: string;
  locationSlug: string;
  title: string;
  shortMessage: string;
  body: string;
  swepActiveFrom: string;    // ISO 8601 datetime
  swepActiveUntil: string;   // ISO 8601 datetime
  image?: string;
  isActive: boolean;
  lastUpdated: string;
}
```

### API Response Format

```json
{
  "status": "success",
  "data": {
    "id": "swep-manchester-20250203",
    "locationSlug": "manchester",
    "title": "SWEP Activated for Manchester",
    "shortMessage": "Emergency accommodation is available due to severe weather conditions.",
    "body": "<p>The Severe Weather Emergency Protocol has been activated...</p>",
    "swepActiveFrom": "2025-02-03T18:00:00.000Z",
    "swepActiveUntil": "2025-02-05T09:00:00.000Z",
    "image": "https://example.com/swep-image.jpg",
    "isActive": true,
    "lastUpdated": "2025-02-03T16:30:00.000Z"
  }
}
```

## API Integration

### SWEP Data Endpoint

The SWEP system integrates with location-specific API endpoints:

```typescript
// /api/locations/[slug]/swep/route.ts
export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;
    
    // Validate location exists
    const location = locations.find(loc => 
      loc.slug === slug && loc.isPublic
    );
    
    if (!location) {
      return NextResponse.json(
        { status: 'error', message: 'Location not found' },
        { status: 404 }
      );
    }

    // Future: Fetch from CMS/database
    // For now, use fallback data
    const swepData = swepFallbackData.find(
      entry => entry.locationSlug === slug
    );

    if (!swepData) {
      return NextResponse.json(
        { status: 'error', message: 'No SWEP data available' },
        { status: 404 }
      );
    }

    // Only return data if SWEP is currently active
    if (!isSwepActive(swepData)) {
      return NextResponse.json(
        { status: 'error', message: 'SWEP not currently active' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      status: 'success',
      data: swepData
    });

    // Cache for 5 minutes during active SWEP
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    
    return response;

  } catch (error) {
    console.error('[API ERROR] SWEP data fetch:', error);
    
    return NextResponse.json(
      { status: 'error', message: 'Unable to fetch SWEP data' },
      { status: 500 }
    );
  }
}
```

### Data Fetching Utility

```typescript
// fetchSwep.ts - Client-side data fetching
export async function fetchSwepData(locationSlug: string): Promise<SwepData | null> {
  try {
    const response = await fetch(`/api/locations/${locationSlug}/swep`);
    
    if (!response.ok) {
      if (response.status === 404) {
        // SWEP not active or no data available
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.status === 'success' ? data.data : null;

  } catch (error) {
    console.warn(`Failed to fetch SWEP data for ${locationSlug}:`, error);
    return null;
  }
}
```

## Integration Points

### Location Page Integration

SWEP banners automatically display on location pages when active:

```tsx
// Location page component integration
export default async function LocationPage({ params }: LocationPageProps) {
  const { location } = params;
  
  // Fetch SWEP data for this location
  const swepData = await fetchSwepData(location);
  
  return (
    <main>
      {/* SWEP banner displays when active */}
      {swepData && <SwepBanner swepData={swepData} locationSlug={location} />}
      
      {/* Rest of location page content */}
      <LocationContent location={location} />
    </main>
  );
}
```

### Navigation Integration

SWEP pages integrate with the existing navigation and breadcrumb system:

```tsx
<Breadcrumbs 
  items={[
    { href: "/", label: "Home" },
    { href: `/${location.slug}`, label: location.name },
    { label: "SWEP Information", current: true }
  ]} 
/>
```

## Analytics Integration

### SWEP Interaction Tracking

```typescript
// Analytics tracking for SWEP interactions
export function trackSwepBannerClick(locationSlug: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'swep_banner_click', {
      location_slug: locationSlug,
      event_category: 'emergency',
      event_label: 'swep_information',
    });
  }
}

export function trackSwepPageView(locationSlug: string, swepId: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'swep_page_view', {
      location_slug: locationSlug,
      swep_id: swepId,
      event_category: 'emergency',
    });
  }
}
```

## Testing Strategy

### Unit Testing

```typescript
// SWEP utility function tests
describe('SWEP Utilities', () => {
  const mockSwepData: SwepData = {
    id: 'test-swep',
    locationSlug: 'manchester',
    title: 'Test SWEP',
    shortMessage: 'Test message',
    body: 'Test body content',
    swepActiveFrom: '2025-01-01T00:00:00.000Z',
    swepActiveUntil: '2025-01-02T00:00:00.000Z',
    isActive: true,
    lastUpdated: '2025-01-01T00:00:00.000Z'
  };

  describe('isSwepActive', () => {
    it('should return true when SWEP is currently active', () => {
      // Mock current time to be within active period
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T12:00:00.000Z'));
      
      expect(isSwepActive(mockSwepData)).toBe(true);
      
      jest.useRealTimers();
    });

    it('should return false when SWEP is not active', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-03T12:00:00.000Z'));
      
      expect(isSwepActive(mockSwepData)).toBe(false);
      
      jest.useRealTimers();
    });
  });

  describe('formatSwepActivePeriod', () => {
    it('should format SWEP active period correctly', () => {
      const formatted = formatSwepActivePeriod(mockSwepData);
      
      expect(formatted).toContain('SWEP is currently active from');
      expect(formatted).toContain('until');
    });
  });
});
```

### Component Testing

```typescript
// SWEP banner component tests
describe('SwepBanner', () => {
  const mockSwepData: SwepData = {
    id: 'test-swep',
    locationSlug: 'manchester',
    title: 'Test SWEP Active',
    shortMessage: 'Emergency support is available',
    body: 'Full SWEP information',
    swepActiveFrom: '2025-01-01T00:00:00.000Z',
    swepActiveUntil: '2025-01-02T00:00:00.000Z',
    isActive: true,
    lastUpdated: '2025-01-01T00:00:00.000Z'
  };

  it('renders when SWEP is active', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T12:00:00.000Z'));
    
    render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);
    
    expect(screen.getByText(/Severe Weather Emergency Protocol \(SWEP\) Active/)).toBeInTheDocument();
    expect(screen.getByText('Emergency support is available')).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  it('does not render when SWEP is not active', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-03T12:00:00.000Z'));
    
    const { container } = render(
      <SwepBanner swepData={mockSwepData} locationSlug="manchester" />
    );
    
    expect(container.firstChild).toBeNull();
    
    jest.useRealTimers();
  });

  it('has accessible markup', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T12:00:00.000Z'));
    
    render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/SWEP Active/);
    
    const link = screen.getByRole('link', { name: /View SWEP Information/ });
    expect(link).toHaveAttribute('href', '/manchester/swep');
    
    jest.useRealTimers();
  });
});
```

### E2E Testing

```typescript
// E2E SWEP functionality tests
import { test, expect } from '@playwright/test';

test.describe('SWEP Functionality', () => {
  test('should display SWEP banner when active', async ({ page }) => {
    // Mock SWEP data to be active
    await page.route('/api/locations/manchester/swep', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: {
            id: 'test-swep',
            locationSlug: 'manchester',
            title: 'SWEP Activated for Manchester',
            shortMessage: 'Emergency accommodation available',
            swepActiveFrom: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            swepActiveUntil: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
            isActive: true
          }
        })
      });
    });

    await page.goto('/manchester');
    
    // Check SWEP banner is visible
    await expect(page.locator('.swep-banner')).toBeVisible();
    await expect(page.getByText('Severe Weather Emergency Protocol (SWEP) Active')).toBeVisible();
    
    // Test navigation to SWEP page
    await page.click('text=View SWEP Information');
    await expect(page).toHaveURL('/manchester/swep');
  });

  test('should not display SWEP banner when inactive', async ({ page }) => {
    // Mock no SWEP data
    await page.route('/api/locations/manchester/swep', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'error',
          message: 'SWEP not currently active'
        })
      });
    });

    await page.goto('/manchester');
    
    // Check SWEP banner is not present
    await expect(page.locator('.swep-banner')).not.toBeVisible();
  });
});
```

## Performance Considerations

### Efficient Rendering

- **Conditional Rendering**: SWEP components only render when active
- **Time-based Caching**: API responses cached for 5 minutes during active SWEP
- **Lazy Loading**: SWEP page content loads only when accessed
- **Optimised Images**: SWEP images use Next.js Image component for optimization

### Network Optimisation

```typescript
// Efficient SWEP data fetching with caching
const swepCache = new Map<string, { data: SwepData | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedSwepData(locationSlug: string): Promise<SwepData | null> {
  const cached = swepCache.get(locationSlug);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchSwepData(locationSlug);
  swepCache.set(locationSlug, { data, timestamp: Date.now() });
  
  return data;
}
```

## Future Enhancements

### Planned Features

1. **Automatic Weather Integration**: Connect to weather APIs for automated SWEP activation
2. **Multi-language Support**: SWEP content in multiple languages
3. **Push Notifications**: Browser notifications for SWEP activation
4. **SMS Integration**: Text message alerts for registered users
5. **Interactive Maps**: Show SWEP service locations on interactive maps

### CMS Integration

Future CMS integration will include:

- **Content Management**: Easy SWEP content updates via admin interface
- **Scheduling**: Pre-schedule SWEP activation for predicted weather events
- **Multi-location Management**: Manage SWEP across all supported locations
- **Analytics Dashboard**: Track SWEP engagement and effectiveness
- **Approval Workflow**: Multi-step approval process for SWEP activation

## Related Documentation

- [Banner System Design](../design-system/banners.md) - Visual design specifications
- [Location System](./location-system.md) - Integration with location pages
- [API Documentation](../api/README.md) - SWEP API endpoint specifications
- [Testing Strategy](../testing/README.md) - Comprehensive testing approach
- [Accessibility Guide](../accessibility/compliance-guide.md) - WCAG compliance requirements

---

*Last Updated: August 2025*
*System Status: Production Ready ✅*
*Emergency Protocol: Active Monitoring ⚠️*