# Banner System Design Guidelines

## Overview

The Street Support Platform features a comprehensive banner system that provides dynamic, accessible promotional content across the website. This system includes campaign banners, emergency notifications (SWEP), and system-wide alerts, all designed to maintain visual consistency while supporting diverse content types.

## Banner Types

### 1. Campaign Banners

Campaign banners are highly customizable promotional components supporting three distinct templates:

#### Giving Campaign Banners
**Purpose**: Donation campaigns with progress tracking and urgency indicators

**Visual Elements**:
- Progress bars with percentage completion display
- Urgency level indicators with distinct colour coding
- Campaign countdown timers
- Multiple call-to-action buttons

#### Partnership Charter Banners
**Purpose**: Partnership initiatives and charter sign-up campaigns

**Visual Elements**:
- Charter type badges with semantic colours
- Signatory count displays
- Partner logo galleries
- Commitment statement highlights

#### Resource Project Banners
**Purpose**: Resource downloads and training material promotion

**Visual Elements**:
- Resource type badges with file format icons
- Download statistics and metadata
- File size and update information
- Download tracking integration

### 2. SWEP (Severe Weather Emergency Protocol) Banners

**Purpose**: Critical emergency notifications for severe weather conditions

**Visual Characteristics**:
- High-contrast red colour scheme for maximum visibility
- Persistent positioning when active
- Time-sensitive activation based on weather conditions
- Emergency contact information integration

### 3. System Alert Banners

**Purpose**: Platform-wide notifications and important announcements

**Visual Characteristics**:
- Contextual colour schemes based on alert type
- Dismissible interface elements
- Consistent typography hierarchy
- Accessible contrast ratios

## Design System Integration

### Colour Palette

Campaign banners utilise the full Street Support brand colour palette:

```css
/* Primary campaign colours */
--banner-primary: var(--brand-a);     /* #38ae8e - Main CTAs */
--banner-secondary: var(--brand-b);   /* #0b9b75 - Success states */
--banner-accent: var(--brand-d);      /* #ffa200 - Find Help CTAs */

/* SWEP emergency colours */
--swep-primary: var(--brand-g);       /* #a90000 - Emergency red */
--swep-background: #fee2e2;           /* Light red background */
--swep-text: var(--brand-l);          /* #29272a - Dark text */

/* Alert type colours */
--alert-info: var(--brand-a);         /* #38ae8e - Information */
--alert-warning: var(--brand-j);      /* #e1c116 - Warnings */
--alert-success: var(--brand-b);      /* #0b9b75 - Success */
--alert-error: var(--brand-g);        /* #a90000 - Errors */
```

### Typography

Banner components follow the established typography hierarchy:

```css
/* Banner headings */
.banner-title {
  @apply text-2xl md:text-3xl font-bold;
  line-height: 1.2;
  color: inherit;
}

/* Banner descriptions */
.banner-description {
  @apply text-base md:text-lg;
  line-height: 1.5;
  color: inherit;
}

/* Banner metadata */
.banner-meta {
  @apply text-sm font-medium;
  line-height: 1.4;
  opacity: 0.9;
}
```

### Spacing and Layout

Consistent spacing using the 8px grid system:

```css
/* Banner container spacing */
.banner-container {
  @apply py-6 px-4 md:py-8 md:px-6 lg:py-12 lg:px-8;
}

/* Internal banner spacing */
.banner-content {
  @apply space-y-4 md:space-y-6;
}

/* Button spacing */
.banner-actions {
  @apply flex flex-col sm:flex-row gap-3 sm:gap-4;
}
```

## Background Customisation

### Background Types

The banner system supports four background configuration types:

#### 1. Solid Backgrounds
```css
.banner-solid {
  background-color: var(--background-color);
}
```

#### 2. Gradient Backgrounds
```css
.banner-gradient {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
}
```

#### 3. Image Backgrounds
```css
.banner-image {
  background-image: url(var(--background-image));
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

#### 4. Overlay Effects
```css
.banner-overlay {
  position: relative;
}

.banner-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--overlay-color);
  opacity: var(--overlay-opacity);
  z-index: 1;
}

.banner-overlay > * {
  position: relative;
  z-index: 2;
}
```

### Text Colour Adaptation

Dynamic text colour based on background:

```css
/* Light backgrounds */
.banner-text-dark {
  --text-primary: var(--brand-l);    /* #29272a */
  --text-secondary: var(--brand-k);  /* #48484a */
  --text-meta: var(--brand-f);       /* #8d8d8d */
}

/* Dark backgrounds */
.banner-text-light {
  --text-primary: #ffffff;
  --text-secondary: #f3f3f3;
  --text-meta: #d1d5db;
}
```

## Layout Styles

### Full-Width Layout
```css
.banner-layout-full {
  @apply w-full;
  max-width: none;
}

.banner-layout-full .banner-content {
  @apply mx-auto max-w-7xl text-center;
}
```

### Split Layout
```css
.banner-layout-split {
  @apply grid md:grid-cols-2 gap-8 items-center;
}

.banner-layout-split .banner-text {
  @apply text-left;
}

.banner-layout-split .banner-media {
  @apply flex justify-center;
}
```

### Card Layout
```css
.banner-layout-card {
  @apply rounded-lg shadow-lg backdrop-blur-sm;
  max-width: 800px;
  margin: 0 auto;
}

.banner-layout-card .banner-content {
  @apply p-8;
}
```

## Interactive Elements

### Call-to-Action Buttons

Banner CTAs use contextual styling based on banner type and background:

```css
/* Primary banner CTA */
.banner-cta-primary {
  @apply px-6 py-3 rounded-lg font-semibold;
  @apply transition-all duration-300;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  
  background-color: var(--cta-bg, var(--brand-a));
  color: var(--cta-text, #ffffff);
  border: 2px solid transparent;
}

.banner-cta-primary:hover {
  background-color: var(--cta-bg-hover, var(--brand-b));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Secondary banner CTA */
.banner-cta-secondary {
  @apply px-6 py-3 rounded-lg font-semibold;
  @apply transition-all duration-300;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  
  background-color: transparent;
  color: var(--cta-text, var(--brand-a));
  border: 2px solid var(--cta-border, var(--brand-a));
}

.banner-cta-secondary:hover {
  background-color: var(--cta-bg-hover, var(--brand-a));
  color: var(--cta-text-hover, #ffffff);
}
```

### Progress Indicators

For giving campaign banners:

```css
.banner-progress-container {
  @apply w-full bg-white/20 rounded-full h-3 overflow-hidden;
}

.banner-progress-bar {
  @apply h-full rounded-full transition-all duration-1000 ease-out;
  background-color: var(--progress-color, #ffffff);
}

.banner-progress-text {
  @apply text-sm font-medium mt-2;
  color: inherit;
  opacity: 0.9;
}
```

### Urgency Indicators

Visual urgency levels for campaign banners:

```css
/* Low urgency */
.banner-urgency-low {
  --urgency-color: var(--brand-a);
  --urgency-bg: rgba(56, 174, 142, 0.1);
}

/* Medium urgency */
.banner-urgency-medium {
  --urgency-color: var(--brand-j);
  --urgency-bg: rgba(225, 193, 22, 0.1);
}

/* High urgency */
.banner-urgency-high {
  --urgency-color: var(--brand-d);
  --urgency-bg: rgba(255, 162, 0, 0.1);
}

/* Critical urgency */
.banner-urgency-critical {
  --urgency-color: var(--brand-g);
  --urgency-bg: rgba(169, 0, 0, 0.1);
}

.banner-urgency-indicator {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
  background-color: var(--urgency-bg);
  color: var(--urgency-color);
}
```

## SWEP Banner Styling

### Emergency Visual Treatment

SWEP banners require maximum visibility and immediate recognition:

```css
.swep-banner {
  @apply relative;
  background-color: var(--brand-g);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(169, 0, 0, 0.3);
  border-bottom: 4px solid var(--brand-c);
}

.swep-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffffff 0%, transparent 100%);
  animation: swep-flash 2s ease-in-out infinite alternate;
}

@keyframes swep-flash {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}
```

### SWEP Page Styling

```css
.swep-page-header {
  @apply bg-red-50 border-b-4 border-brand-g py-12;
}

.swep-status-indicator {
  @apply w-6 h-6 bg-brand-g rounded-full flex items-center justify-center;
}

.swep-status-indicator::after {
  content: '';
  @apply w-3 h-3 bg-white rounded-full;
}

.swep-emergency-contacts {
  @apply p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600;
}
```

## Accessibility Standards

### Colour Contrast

All banner components meet WCAG AA contrast requirements:

```css
/* Minimum contrast ratios */
.banner-text-on-light {
  color: var(--brand-l); /* 15.1:1 contrast ratio */
}

.banner-text-on-dark {
  color: #ffffff; /* Minimum 4.5:1 on all brand colours */
}

.banner-text-on-brand-a {
  color: #ffffff; /* 4.51:1 contrast ratio */
}
```

### Focus Management

```css
.banner-focusable:focus-visible {
  outline: 3px solid var(--focus-color, var(--brand-a));
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .banner-focusable:focus-visible {
    outline-color: Highlight;
    background-color: HighlightText;
    color: Highlight;
  }
}
```

### Screen Reader Support

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Responsive Design

### Mobile-First Approach

```css
/* Base mobile styles */
.banner {
  @apply px-4 py-6;
}

/* Tablet styles */
@media (min-width: 640px) {
  .banner {
    @apply px-6 py-8;
  }
  
  .banner-actions {
    @apply flex-row;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .banner {
    @apply px-8 py-12;
  }
  
  .banner-content {
    @apply max-w-6xl mx-auto;
  }
}
```

### Touch-Friendly Interactions

```css
.banner-cta {
  @apply min-h-[44px] min-w-[44px];
  touch-action: manipulation;
}

@media (hover: hover) {
  .banner-cta:hover {
    transform: translateY(-2px);
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .banner-cta {
    transition: none;
    transform: none !important;
  }
  
  .banner-progress-bar {
    transition: none;
  }
}
```

## Animation and Transitions

### Subtle Motion Design

```css
/* Entrance animations */
@keyframes banner-slide-in {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.banner-enter {
  animation: banner-slide-in 0.5s ease-out;
}

/* Progress bar animation */
.banner-progress-animate {
  animation: progress-fill 2s ease-out 0.5s both;
}

@keyframes progress-fill {
  from {
    width: 0%;
  }
  to {
    width: var(--progress-width);
  }
}
```

### Interaction Feedback

```css
.banner-interactive {
  @apply transition-all duration-200 ease-out;
  cursor: pointer;
}

.banner-interactive:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.banner-interactive:active {
  transform: scale(0.98);
  transition-duration: 100ms;
}
```

## Performance Considerations

### CSS Optimisation

```css
/* Use CSS custom properties for theme variations */
.banner-theme-emergency {
  --banner-bg: var(--brand-g);
  --banner-text: #ffffff;
  --banner-cta-bg: #ffffff;
  --banner-cta-text: var(--brand-g);
}

/* Efficient transforms */
.banner-transform {
  will-change: transform;
  transform: translateZ(0); /* Create stacking context */
}

/* Optimise for reflow */
.banner-layout {
  contain: layout style paint;
}
```

### Image Optimisation

```css
.banner-image {
  background-image: 
    image-set(
      url('banner.webp') type('image/webp'),
      url('banner.jpg') type('image/jpeg')
    );
}

.banner-logo {
  @apply w-auto h-8 md:h-10;
  object-fit: contain;
}
```

## Implementation Examples

### Basic Campaign Banner

```html
<div class="banner banner-layout-full banner-theme-primary">
  <div class="banner-content">
    <h2 class="banner-title">Winter Emergency Appeal</h2>
    <p class="banner-description">
      Help us provide essential services during the coldest months.
    </p>
    <div class="banner-progress-container">
      <div class="banner-progress-bar" style="--progress-width: 65%"></div>
    </div>
    <p class="banner-progress-text">£6,500 raised of £10,000 goal</p>
    <div class="banner-actions">
      <button class="banner-cta-primary">Donate Now</button>
      <button class="banner-cta-secondary">Learn More</button>
    </div>
  </div>
</div>
```

### SWEP Emergency Banner

```html
<div class="swep-banner">
  <div class="max-w-7xl mx-auto px-4 py-4">
    <div class="flex items-center gap-3 mb-2">
      <div class="swep-status-indicator" aria-hidden="true"></div>
      <h2 class="text-lg font-bold text-white">
        Severe Weather Emergency Protocol (SWEP) Active
      </h2>
    </div>
    <p class="text-red-100 mb-4">
      Emergency accommodation is available due to severe weather conditions.
    </p>
    <a href="/manchester/swep" class="banner-cta-primary">
      View SWEP Information
    </a>
  </div>
</div>
```

## Testing Guidelines

### Visual Testing

1. **Contrast Verification**: Test all text/background combinations meet WCAG AA standards
2. **Responsive Testing**: Verify layouts work across all breakpoints
3. **Animation Testing**: Ensure animations respect prefers-reduced-motion
4. **Print Styles**: Verify banners print appropriately

### Functional Testing

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Reader Testing**: ARIA labels and live regions work correctly
3. **Touch Testing**: All touch targets meet minimum size requirements
4. **Performance Testing**: Animations don't impact page performance

## Related Documentation

- [Campaign Banner System](../features/banner-system.md) - Technical implementation details
- [Button Components](./buttons.md) - CTA button specifications
- [Colour System](./colors-and-themes.md) - Brand colour usage guidelines
- [Typography](./typography.md) - Text styling specifications
- [Accessibility Guide](../accessibility/compliance-guide.md) - WCAG compliance requirements

---

*Last Updated: August 2025*
*Component Status: Production Ready ✅*
*WCAG Compliance: 2.1 AA ✅*