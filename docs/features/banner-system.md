# Campaign Banner System Documentation

## Overview

The Street Support Platform includes a sophisticated campaign banner system designed to display dynamic, location-specific promotional content across the website. This system provides three distinct banner templates optimised for different campaign types, with full accessibility compliance and comprehensive customisation options.

## System Architecture

### Core Components

The banner system is built around a modular architecture with clear separation of concerns:

```
src/components/Banners/
├── BannerContainer.tsx           # Main orchestration component
├── GivingCampaignBanner.tsx     # Donation campaigns with progress tracking
├── PartnershipCharterBanner.tsx  # Charter sign-up campaigns
└── ResourceProjectBanner.tsx     # Resource download campaigns

src/types/banners.ts              # TypeScript definitions
src/utils/bannerUtils.ts          # Styling and validation utilities
```

### Template System

#### 1. Giving Campaign Banner (`GivingCampaignBanner.tsx`)

**Purpose**: Promote donation campaigns with visual progress tracking and urgency indicators.

**Key Features:**
- **Progress Visualisation**: Real-time donation progress bars with percentage completion
- **Urgency Levels**: Four urgency states (low, medium, high, critical) with distinct visual styling
- **Campaign Countdown**: End date display with time-sensitive messaging
- **Multi-CTA Support**: Multiple call-to-action buttons with different variants
- **Currency Formatting**: Localised currency display (GBP default)

**Technical Implementation:**
```tsx
interface GivingCampaignProps {
  templateType: 'giving-campaign';
  donationGoal: {
    target: number;
    current: number;
    currency: 'GBP' | 'USD' | 'EUR';
  };
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  campaignEndDate?: string;
  // ... other shared properties
}
```

#### 2. Partnership Charter Banner (`PartnershipCharterBanner.tsx`)

**Purpose**: Promote partnership initiatives and charter sign-ups with social proof elements.

**Key Features:**
- **Charter Types**: Four charter variants (homeless charter, real change, alternative giving, partnership)
- **Social Proof**: Signatory count displays with locale-appropriate formatting
- **Partner Recognition**: Logo galleries for partner organisations
- **Commitment Messaging**: Charter-specific commitment statements
- **Multi-variant CTAs**: Contextual call-to-action buttons

**Technical Implementation:**
```tsx
interface PartnershipCharterProps {
  templateType: 'partnership-charter';
  charterType: 'homeless-charter' | 'real-change' | 'alternative-giving' | 'partnership';
  signatoriesCount?: number;
  partnerLogos?: Array<{ src: string; alt: string; href?: string }>;
  // ... other shared properties
}
```

#### 3. Resource Project Banner (`ResourceProjectBanner.tsx`)

**Purpose**: Promote resource downloads and training materials with detailed metadata.

**Key Features:**
- **Resource Classification**: Five resource types (guide, toolkit, research, training, event)
- **File Type Recognition**: Visual indicators for common file formats (PDF, DOC, XLS, PPT, ZIP, MP4, MP3)
- **Download Metrics**: Download statistics and file metadata display
- **Auto-tracking**: Automatic download event tracking via Google Analytics
- **Accessibility**: Screen reader optimised file descriptions

**Technical Implementation:**
```tsx
interface ResourceProjectProps {
  templateType: 'resource-project';
  resourceType: 'guide' | 'toolkit' | 'research' | 'training' | 'event';
  fileType: string;
  fileSize?: string;
  downloadCount?: number;
  lastUpdated?: string;
  // ... other shared properties
}
```

## Advanced Customisation System

### Background Configuration

The system supports four background types with comprehensive customisation:

1. **Solid Backgrounds**: Single colour with hex values
   ```tsx
   background: { type: 'solid', value: '#1f2937' }
   ```

2. **Gradient Backgrounds**: CSS gradient definitions
   ```tsx
   background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
   ```

3. **Image Backgrounds**: Full responsive image support
   ```tsx
   background: { 
     type: 'image', 
     value: '/images/campaign-bg.jpg',
     position: 'center',
     size: 'cover'
   }
   ```

4. **Overlay Effects**: Colour overlays with opacity control
   ```tsx
   background: {
     type: 'image',
     value: '/images/bg.jpg',
     overlay: { colour: '#000000', opacity: 0.4 }
   }
   ```

### Layout Styles

Three layout options optimised for different content types:

- **Full-width**: Centred content layout for maximum visual impact
- **Split**: Two-column layout balancing content and media
- **Card**: Contained layout with backdrop blur effects for readability

### Responsive Design

Mobile-first approach with Tailwind CSS breakpoints:
- **320px+**: Base mobile layout with stacked content
- **640px+**: Enhanced mobile with improved spacing
- **768px+**: Tablet layout with split content options
- **1024px+**: Desktop layout with full feature set
- **1280px+**: Large desktop optimisations

## Accessibility Implementation

### WCAG AA Compliance

All banner components meet Web Content Accessibility Guidelines 2.1 AA standards:

**Semantic HTML Structure:**
```tsx
<section 
  className="banner-container" 
  role="banner" 
  aria-labelledby="banner-title"
>
  <h2 id="banner-title">{title}</h2>
  <p className="sr-only">Campaign banner: {description}</p>
  {/* Content structure */}
</section>
```

**Keyboard Navigation:**
- Full keyboard accessibility for all interactive elements
- Logical tab order with proper focus management
- Skip links for banner content when appropriate
- Enter/Space key activation for custom buttons

**Screen Reader Support:**
- Comprehensive ARIA labels and descriptions
- Live regions for dynamic content updates (progress bars, counters)
- Alternative text for all decorative and informational images
- Proper heading hierarchy within banner content

**Visual Accessibility:**
- High contrast text with tested contrast ratios (minimum 4.5:1)
- Focus indicators clearly visible against all background types
- No colour-only information conveyance
- Scalable text up to 200% without horizontal scrolling

## Analytics Integration

### Event Tracking

Comprehensive Google Analytics 4 integration for all user interactions:

**Campaign CTA Clicks:**
```typescript
window.gtag('event', 'giving_campaign_cta_click', {
  campaign_title: title,
  button_label: buttonLabel,
  button_position: index,
  urgency_level: urgencyLevel,
  tracking_context: 'banner_interaction'
});
```

**Resource Downloads:**
```typescript
window.gtag('event', 'file_download', {
  file_name: fileName,
  file_type: fileType.toUpperCase(),
  resource_type: resourceType,
  file_size: fileSize,
  download_source: 'banner_cta'
});
```

**Charter Engagement:**
```typescript
window.gtag('event', 'charter_engagement', {
  charter_type: charterType,
  action_type: 'sign_up_click',
  signatories_count: signatoriesCount
});
```

### Performance Metrics

Built-in performance tracking includes:
- Banner render time measurement
- Image load performance
- User interaction response times
- Error rate monitoring

## Development Architecture

### BannerContainer Orchestration

The `BannerContainer` component serves as the main orchestration layer:

```tsx
interface BannerContainerProps {
  banners: AnyBannerProps[];
  locationSlug?: string;
  maxDisplay?: number;
  onBannerError?: (error: string, bannerId: string) => void;
}
```

**Key Responsibilities:**
- **Template Switching**: Dynamic component rendering based on `templateType`
- **Validation**: Props validation using utility functions
- **Filtering**: Location-based banner filtering and active status checking
- **Prioritisation**: Sorting by priority with display limits
- **Error Handling**: Graceful error handling with optional callbacks

### Type Safety System

Discriminated unions ensure compile-time type safety:

```typescript
export type AnyBannerProps = 
  | GivingCampaignProps 
  | PartnershipCharterProps 
  | ResourceProjectProps;

// Type-safe template switching
const renderBanner = (banner: AnyBannerProps) => {
  switch (banner.templateType) {
    case 'giving-campaign':
      return <GivingCampaignBanner {...banner} />; // TypeScript knows this is GivingCampaignProps
    case 'partnership-charter':
      return <PartnershipCharterBanner {...banner} />;
    case 'resource-project':
      return <ResourceProjectBanner {...banner} />;
    default:
      // TypeScript ensures exhaustive checking
      const _exhaustiveCheck: never = banner;
      return null;
  }
};
```

### Utility Functions

The `bannerUtils.ts` module provides reusable styling and validation logic:

```typescript
// Background styling
export const generateBackgroundClasses = (background: BannerBackground): string => {
  switch (background.type) {
    case 'solid':
      return 'bg-[' + background.value + ']';
    case 'gradient':
      return 'bg-gradient-custom';
    case 'image':
      return 'bg-cover bg-center bg-[url(\'' + background.value + '\')]';
  }
};

// CTA button styling with context awareness
export const generateCTAClasses = (
  button: CTAButton, 
  textColour: TextColour,
  templateType: string
): string => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300';
  const variantClasses = getVariantClasses(button.variant, textColour);
  const templateClasses = getTemplateSpecificClasses(templateType);
  
  return baseClasses + ' ' + variantClasses + ' ' + templateClasses;
};
```

## Testing Strategy

### Test Coverage Metrics
- **Total Test Suites**: 4 comprehensive test files
- **Test Count**: 133 passing tests across all components
- **Coverage**: 90%+ statement coverage for components, 91% for utilities
- **Integration Tests**: Template switching, error handling, and hook functionality

### Testing Approach

**Unit Testing:**
```typescript
describe('GivingCampaignBanner', () => {
  it('displays donation progress correctly', () => {
    const props = createMockGivingCampaignProps({
      donationGoal: { target: 10000, current: 3500, currency: 'GBP' }
    });
    
    render(<GivingCampaignBanner {...props} />);
    
    expect(screen.getByText('£3,500 raised of £10,000 goal')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '35');
  });

  it('handles urgency levels with appropriate styling', () => {
    const props = createMockGivingCampaignProps({ urgencyLevel: 'critical' });
    
    render(<GivingCampaignBanner {...props} />);
    
    expect(screen.getByText(/urgent/i)).toBeInTheDocument();
    expect(screen.getByText(/urgent/i)).toHaveClass('text-red-600');
  });
});
```

**Integration Testing:**
```typescript
describe('BannerContainer Integration', () => {
  it('switches templates correctly based on templateType', () => {
    const banners: AnyBannerProps[] = [
      createMockGivingCampaignProps(),
      createMockPartnershipCharterProps(),
      createMockResourceProjectProps()
    ];
    
    render(<BannerContainer banners={banners} />);
    
    expect(screen.getByTestId('giving-campaign-banner')).toBeInTheDocument();
    expect(screen.getByTestId('partnership-charter-banner')).toBeInTheDocument();
    expect(screen.getByTestId('resource-project-banner')).toBeInTheDocument();
  });
});
```

**Accessibility Testing:**
```typescript
describe('Banner Accessibility', () => {
  it('meets WCAG AA standards', async () => {
    const { container } = render(<GivingCampaignBanner {...mockProps} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    render(<GivingCampaignBanner {...mockProps} />);
    
    const ctaButton = screen.getByRole('button', { name: /donate now/i });
    ctaButton.focus();
    
    expect(ctaButton).toHaveFocus();
    expect(ctaButton).toHaveClass('focus:ring-2');
  });
});
```

## Performance Optimisations

### Rendering Efficiency

**Conditional Rendering:**
```tsx
// Only render banners when data is available
{banners.length > 0 && (
  <BannerContainer 
    banners={validBanners}
    maxDisplay={maxBanners}
  />
)}
```

**Image Optimisation:**
```tsx
// Next.js Image component with optimisation
<Image
  src={banner.background.value}
  alt=""
  fill
  className="object-cover"
  priority={index === 0} // Prioritise first banner
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Lazy Loading:**
```tsx
// Intersection Observer for below-fold banners
const [isVisible, setIsVisible] = useState(false);
const bannerRef = useRef<HTMLElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
      observer.disconnect();
    }
  });

  if (bannerRef.current) {
    observer.observe(bannerRef.current);
  }

  return () => observer.disconnect();
}, []);
```

### Bundle Optimisation

**Tree Shaking:**
- Individual banner imports prevent unused code inclusion
- Utility functions designed for selective importing
- Type definitions separate from implementation

**CSS Optimisation:**
- Tailwind CSS purging removes unused styles
- Component-specific styles minimise CSS bundle
- Critical CSS inlined for above-the-fold banners

## Future Integration Plans

### CMS Integration

**Database Schema Design:**
```sql
-- Core banner table
CREATE TABLE banners (
  id VARCHAR(255) PRIMARY KEY,
  template_type ENUM('giving-campaign', 'partnership-charter', 'resource-project'),
  location_slug VARCHAR(255),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  background JSON,
  text_colour ENUM('white', 'black'),
  layout_style ENUM('full-width', 'split', 'card'),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Template-specific data tables
CREATE TABLE giving_campaigns (
  banner_id VARCHAR(255) PRIMARY KEY,
  donation_target DECIMAL(10,2),
  donation_current DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'GBP',
  urgency_level ENUM('low', 'medium', 'high', 'critical'),
  campaign_end_date DATETIME,
  FOREIGN KEY (banner_id) REFERENCES banners(id)
);
```

**API Endpoints:**
```typescript
// Future API structure
GET    /api/banners?location={slug}&active=true
POST   /api/banners
PUT    /api/banners/{id}
DELETE /api/banners/{id}
PATCH  /api/banners/{id}/toggle-active
```

### Advanced Features

**A/B Testing Framework:**
```typescript
interface BannerVariant {
  id: string;
  weight: number;
  props: AnyBannerProps;
}

const ABTestBanner: React.FC<{
  variants: BannerVariant[];
  testId: string;
}> = ({ variants, testId }) => {
  const selectedVariant = useABTest(testId, variants);
  return <BannerContainer banners={[selectedVariant.props]} />;
};
```

**Scheduling System:**
```typescript
interface ScheduledBanner extends AnyBannerProps {
  schedule: {
    startDate: string;
    endDate: string;
    timezone: string;
    daysOfWeek?: number[];
    hoursOfDay?: { start: number; end: number };
  };
}
```

## Usage Examples

### Basic Implementation

```tsx
import BannerContainer from '@/components/Banners/BannerContainer';

export default function LocationPage({ params }: { params: { slug: string } }) {
  const banners: AnyBannerProps[] = [
    {
      templateType: 'giving-campaign',
      id: 'winter-appeal-2025',
      title: 'Emergency Winter Appeal',
      description: 'Help us provide essential services during the coldest months.',
      donationGoal: {
        target: 10000,
        current: 3500,
        currency: 'GBP'
      },
      urgencyLevel: 'high',
      campaignEndDate: '2025-02-28',
      ctaButtons: [
        { 
          label: 'Donate Now', 
          url: '/donate/winter-appeal', 
          variant: 'primary' 
        },
        { 
          label: 'Learn More', 
          url: '/campaigns/winter-appeal', 
          variant: 'secondary' 
        }
      ],
      background: { type: 'solid', value: '#1f2937' },
      textColour: 'white',
      layoutStyle: 'full-width',
      isActive: true,
      priority: 1
    }
  ];

  return (
    <main>
      <BannerContainer 
        banners={banners}
        locationSlug={params.slug}
        maxDisplay={2}
        onBannerError={(error, bannerId) => {
          console.error(`Banner error ${bannerId}:`, error);
          // Optional: Report to monitoring service
        }}
      />
      {/* Rest of page content */}
    </main>
  );
}
```

### Advanced Customisation

```tsx
const advancedBanner: GivingCampaignProps = {
  templateType: 'giving-campaign',
  id: 'complex-campaign',
  title: 'Multi-Goal Emergency Fund',
  description: 'Supporting multiple emergency initiatives across the region.',
  donationGoal: {
    target: 50000,
    current: 23750,
    currency: 'GBP'
  },
  urgencyLevel: 'critical',
  campaignEndDate: '2025-01-31T23:59:59Z',
  ctaButtons: [
    { 
      label: 'Donate £10', 
      url: '/donate?amount=10&campaign=emergency', 
      variant: 'primary',
      ariaLabel: 'Donate ten pounds to emergency fund'
    },
    { 
      label: 'Donate £25', 
      url: '/donate?amount=25&campaign=emergency', 
      variant: 'primary',
      ariaLabel: 'Donate twenty-five pounds to emergency fund'
    },
    { 
      label: 'Custom Amount', 
      url: '/donate?campaign=emergency', 
      variant: 'secondary',
      ariaLabel: 'Donate custom amount to emergency fund'
    }
  ],
  background: {
    type: 'image',
    value: '/images/emergency-campaign-bg.jpg',
    position: 'center',
    size: 'cover',
    overlay: { colour: '#1f2937', opacity: 0.6 }
  },
  textColour: 'white',
  layoutStyle: 'split',
  isActive: true,
  priority: 10,
  locationSlug: 'manchester'
};
```

## Troubleshooting

### Common Issues

**Banner Not Displaying:**
1. Check `isActive` property is `true`
2. Verify `locationSlug` matches current page
3. Ensure `priority` is set appropriately
4. Check `maxDisplay` limit hasn't been exceeded

**Styling Issues:**
1. Verify background type and value are correctly formatted
2. Check text colour contrast against background
3. Ensure image URLs are accessible and properly formatted
4. Validate layout style is supported by content type

**Analytics Not Tracking:**
1. Verify Google Analytics is properly configured
2. Check that `gtag` is available on `window` object
3. Validate event names match GA4 requirements
4. Ensure tracking context is properly passed

### Debugging Tools

**Development Mode:**
```tsx
const BannerContainer: React.FC<BannerContainerProps> = ({ 
  banners, 
  onBannerError 
}) => {
  const validBanners = banners.filter(banner => {
    const isValid = validateBannerProps(banner);
    if (!isValid && process.env.NODE_ENV === 'development') {
      console.warn('Invalid banner props:', banner);
    }
    return isValid;
  });

  // Development-only prop logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Rendering banners:', validBanners.map(b => b.id));
  }

  // Component rendering logic
};
```

**Error Boundaries:**
```tsx
class BannerErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Banner rendering error:', error, errorInfo);
    
    // Optional: Report to error monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: `Banner error: ${error.message}`,
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return null; // Gracefully hide broken banners
    }

    return this.props.children;
  }
}
```

## Related Documentation

- [API Documentation](../api/README.md) - Future API endpoints for banner management
- [Design System](../design-system/README.md) - Design principles and component guidelines  
- [Testing Strategy](../testing/README.md) - Comprehensive testing approach
- [Accessibility Guide](../design-system/README.md#accessibility-checklist) - WCAG compliance requirements

---

*Last Updated: August 2025*
*System Status: Template Complete - Awaiting CMS Integration ⏳*