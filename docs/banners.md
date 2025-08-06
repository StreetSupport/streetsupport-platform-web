# Banner Template System Documentation

## Overview

The banner template system provides reusable, CMS-driven campaign banners for location pages across the Street Support Network platform. This system replaces hardcoded campaign banners with dynamic, configurable templates that can be managed through a content management system.

## Project Context

**Problem**: Location pages (e.g., /manchester, /birmingham) previously used hardcoded campaign banners that were difficult to update and maintain across multiple locations.

**Solution**: A flexible template system that allows content managers to create, customise, and deploy campaign banners dynamically through CMS integration.

**Status**: Template implementation complete. CMS and database integration pending.

## Architecture

### Core Components

```
src/
├── components/Banners/
│   ├── GivingCampaignBanner.tsx      # Donation campaigns with progress tracking
│   ├── PartnershipCharterBanner.tsx  # Charter campaigns with signatory counts
│   ├── ResourceProjectBanner.tsx     # Resource downloads with file metadata
│   └── BannerContainer.tsx           # Template switching and management
├── types/banners.ts                  # TypeScript interfaces and unions
└── utils/bannerUtils.ts              # Styling and validation utilities
```

### Template Types

#### 1. Giving Campaign Banner
**Purpose**: Promote donation campaigns with progress tracking and urgency indicators.

**Key Features**:
- Donation goal progress bars with percentage completion
- Urgency levels (critical, high, medium, low) with visual indicators
- Campaign end date countdown
- Currency formatting (GBP default)
- Multiple CTA buttons with analytics tracking

**Use Cases**:
- Emergency fundraising campaigns
- Seasonal giving appeals
- Specific project funding drives

#### 2. Partnership Charter Banner
**Purpose**: Promote partnership initiatives and charter sign-ups.

**Key Features**:
- Charter type badges (homeless charter, real change, alternative giving, partnership)
- Signatory count displays with locale formatting
- Partner logo galleries
- Commitment statements for different charter types
- Multi-variant CTA buttons

**Use Cases**:
- Homeless Charter campaigns
- Real Change initiatives
- Alternative giving programmes
- Partnership recruitment

#### 3. Resource Project Banner
**Purpose**: Promote resource downloads and training materials.

**Key Features**:
- Resource type badges (guide, toolkit, research, training, event)
- File type indicators with icons (PDF, DOC, XLS, PPT, ZIP, MP4, MP3)
- Download statistics and file metadata
- Automatic file download tracking
- Resource metadata descriptions

**Use Cases**:
- Training material distribution
- Research report promotion
- Toolkit downloads
- Event promotion

## Technical Implementation

### Type System

The system uses discriminated unions to ensure type safety across template types:

```typescript
export type AnyBannerProps = GivingCampaignProps | PartnershipCharterProps | ResourceProjectProps;

// Each template has a unique templateType for switching
interface BaseBannerProps {
  templateType: 'giving-campaign' | 'partnership-charter' | 'resource-project';
  // ... shared properties
}
```

### Customisation Options

All banners support comprehensive styling customisation:

#### Background Types
- **Solid**: Single colour backgrounds with hex values
- **Gradient**: CSS gradient backgrounds
- **Image**: Background images with cover/center positioning
- **Overlay**: Optional colour overlays with opacity control

#### Layout Styles
- **Full-width**: Centred content layout for maximum impact
- **Split**: Two-column layout with content and media
- **Card**: Contained layout with backdrop blur effects

#### Text Colours
- **White**: For dark backgrounds
- **Black**: For light backgrounds

### Accessibility Implementation

All banners comply with WCAG AA standards:

- **Semantic HTML**: Proper heading structure and landmark roles
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Colour Contrast**: Tested contrast ratios for text readability

### Analytics Integration

Comprehensive tracking for all user interactions:

```typescript
// CTA click tracking
window.gtag('event', 'giving_campaign_cta_click', {
  campaign_title: title,
  button_label: buttonLabel,
  button_position: index,
  tracking_context: context
});

// File download tracking (Resource banners)
window.gtag('event', 'file_download', {
  file_name: fileName,
  file_type: fileType,
  resource_type: resourceType
});
```

### Component Architecture

#### BannerContainer
The main orchestration component that:
- Validates banner props using utility functions
- Filters banners by location and active status
- Sorts by priority and limits display count
- Handles template switching based on `templateType`
- Provides error handling and logging

#### useBanners Hook
A React hook for CMS integration that provides:
- State management for banner collections
- CRUD operations (add, update, delete, toggle visibility)
- Loading states and error handling
- Validation integration

## Styling System

### Utility Functions

The `bannerUtils.ts` file provides functions for dynamic styling:

```typescript
// Background class generation
generateBackgroundClasses(background: BannerBackground): string
generateBackgroundStyles(background: BannerBackground): React.CSSProperties

// Layout and typography
generateLayoutClasses(layoutStyle: LayoutStyle): string
generateTextColourClasses(textColour: TextColour): string

// Interactive elements
generateCTAClasses(button: CTAButton, textColour: TextColour): string
generateUrgencyClasses(urgencyLevel: UrgencyLevel): string
```

### Responsive Design

Mobile-first approach with Tailwind CSS breakpoints:
- **Base**: Mobile layout (320px+)
- **sm**: Small tablets (640px+)
- **md**: Tablets and small desktops (768px+)
- **lg**: Desktops (1024px+)
- **xl**: Large desktops (1280px+)

## Testing Strategy

### Test Coverage
- **Total Tests**: 133 passing
- **Component Coverage**: 90%+ statement coverage
- **Utility Coverage**: 91% statement coverage
- **Integration Tests**: Template switching and error handling

### Test Types

#### Unit Tests
- Component rendering with various prop combinations
- Utility function edge cases and validation
- Analytics tracking verification
- Accessibility attribute testing

#### Integration Tests
- BannerContainer template switching
- Validation error handling
- useBanners hook state management
- Mock component integration

### Mock Strategy
```typescript
// Next.js components
jest.mock('next/image', () => MockImage);
jest.mock('next/link', () => MockLink);

// Analytics
const mockGtag = jest.fn();
Object.defineProperty(window, 'gtag', { value: mockGtag });
```

## Development Workflow

### File Organisation
- **Components**: Individual banner templates with focused responsibilities
- **Types**: Centralised TypeScript definitions for consistency
- **Utils**: Reusable styling and validation logic
- **Tests**: Comprehensive test suites for each component and utility

### Code Quality
- **ESLint**: Enforced code standards and best practices
- **TypeScript**: Full type safety with discriminated unions
- **British English**: Consistent spelling throughout as per project requirements
- **Professional Standards**: No references to AI tools or automated generation

## Current Limitations

### CMS Integration
The banner system is template-complete but requires CMS integration:

1. **Data Persistence**: Banners currently exist only in component state
2. **API Integration**: No backend endpoints for banner CRUD operations
3. **Image Management**: No integration with CMS media library
4. **Content Validation**: Server-side validation not implemented

### Database Schema
Proposed database structure for future implementation:

```sql
CREATE TABLE banners (
  id VARCHAR(255) PRIMARY KEY,
  template_type ENUM('giving-campaign', 'partnership-charter', 'resource-project'),
  location_slug VARCHAR(255),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  cta_buttons JSON,
  background JSON,
  text_colour ENUM('white', 'black'),
  layout_style ENUM('full-width', 'split', 'card'),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Template-specific fields
  -- Giving Campaign
  donation_goal JSON NULL,
  urgency_level ENUM('low', 'medium', 'high', 'critical') NULL,
  campaign_end_date DATETIME NULL,
  
  -- Partnership Charter  
  charter_type ENUM('homeless-charter', 'real-change', 'alternative-giving', 'partnership') NULL,
  signatories_count INTEGER NULL,
  partner_logos JSON NULL,
  
  -- Resource Project
  resource_type ENUM('guide', 'toolkit', 'research', 'training', 'event') NULL,
  file_type VARCHAR(50) NULL,
  file_size VARCHAR(50) NULL,
  download_count INTEGER NULL,
  last_updated DATETIME NULL,
  
  INDEX idx_location_active (location_slug, is_active),
  INDEX idx_priority_created (priority DESC, created_at DESC)
);
```

## Next Steps

### Phase 1: Database Integration
1. **Schema Implementation**: Create banner database tables
2. **API Endpoints**: Build REST endpoints for banner CRUD operations
3. **Data Migration**: Tools for importing existing campaign data
4. **Validation**: Server-side prop validation and sanitisation

### Phase 2: CMS Integration  
1. **Admin Interface**: Banner creation and editing forms
2. **Media Management**: Integration with existing media library
3. **Preview Functionality**: Live preview of banner configurations
4. **Publishing Workflow**: Draft/review/publish states

### Phase 3: Location Integration
1. **Page Integration**: Render BannerContainer on location pages
2. **Caching Strategy**: Implement appropriate caching for banner data
3. **Performance Optimisation**: Lazy loading and image optimisation
4. **A/B Testing**: Framework for campaign performance testing

### Phase 4: Advanced Features
1. **Scheduling**: Time-based banner activation/deactivation
2. **Targeting**: Audience-based banner personalisation
3. **Analytics Dashboard**: Campaign performance metrics
4. **Template Builder**: Visual banner creation interface

## Usage Examples

### Basic Implementation
```tsx
import BannerContainer from '@/components/Banners/BannerContainer';

// In location page component
export default function LocationPage({ locationSlug }: { locationSlug: string }) {
  return (
    <main>
      {/* Page content */}
      
      <BannerContainer 
        banners={banners}
        locationSlug={locationSlug}
        maxDisplay={3}
        onBannerError={(error, bannerId) => console.error(`Banner ${bannerId}: ${error}`)}
      />
      
      {/* More page content */}
    </main>
  );
}
```

### CMS Hook Usage (Future)
```tsx
import { useBanners } from '@/components/Banners/BannerContainer';

function BannerManagement({ locationSlug }: { locationSlug: string }) {
  const { banners, loading, error, addBanner, updateBanner, deleteBanner } = useBanners(locationSlug);
  
  // CMS interface implementation
}
```

### Individual Banner Usage
```tsx
import GivingCampaignBanner from '@/components/Banners/GivingCampaignBanner';

const campaignProps: GivingCampaignProps = {
  templateType: 'giving-campaign',
  title: 'Emergency Winter Appeal',
  description: 'Help us provide essential services during cold weather.',
  donationGoal: {
    target: 10000,
    current: 3500,
    currency: 'GBP'
  },
  urgencyLevel: 'high',
  ctaButtons: [
    { label: 'Donate Now', url: '/donate', variant: 'primary' }
  ],
  background: { type: 'solid', value: '#1f2937' },
  textColour: 'white',
  layoutStyle: 'full-width'
};

<GivingCampaignBanner {...campaignProps} />
```

## Maintenance

### Regular Tasks
- **Test Suite**: Run tests before any modifications
- **Accessibility Audit**: Regular WCAG compliance checking  
- **Performance Review**: Monitor bundle size and rendering performance
- **Analytics Review**: Ensure tracking events remain functional

### Update Process
1. **Component Updates**: Modify templates while maintaining backward compatibility
2. **Type Updates**: Update interfaces for new features
3. **Test Updates**: Maintain test coverage above 90%
4. **Documentation**: Keep this document current with implementation

## Conclusion

The banner template system provides a solid foundation for dynamic campaign content on the Street Support Network platform. The implementation prioritises type safety, accessibility, and maintainability while preparing for future CMS integration.

The system successfully separates content from presentation, enabling non-technical users to manage campaign banners through a future CMS interface whilst maintaining full design flexibility and technical performance standards.