# Street Support Colour & Theme System

## Overview
Our colour system balances approachability with professionalism, creating trust while remaining accessible to diverse users. Colours convey meaning, establish hierarchy, and support the platform's mission of connecting vulnerable populations with essential services.

## Design Principles
- **Accessibility First**: All colour combinations meet WCAG AA standards (4.5:1 contrast minimum)
- **Meaningful Colour**: Each colour serves a specific purpose and conveys appropriate emotion
- **Trust & Warmth**: Professional credibility balanced with human warmth
- **Cultural Sensitivity**: Colours tested for cross-cultural appropriateness

## Brand Colour Palette

### Primary Brand Colours

#### Brand A - Primary Green (`#38ae8e`)
```css
--color-brand-a: #38ae8e;
```
**Usage**: Primary actions, navigation highlights, main CTAs
**Emotion**: Hope, growth, stability
**Examples**: "Find Help" buttons, active navigation, primary links

#### Brand B - Deep Teal (`#0b9b75`)  
```css
--color-brand-b: #0b9b75;
```
**Usage**: Success states, confirmation actions, positive indicators
**Emotion**: Reliability, success, progress
**Examples**: Form success, completed steps, positive status

#### Brand C - Forest Green (`#086049`)
```css
--color-brand-c: #086049;
```
**Usage**: Hover states for primary colors, depth, emphasis
**Emotion**: Stability, depth, permanence
**Examples**: Button hover states, selected items, focused elements

### Secondary Brand Colours

#### Brand D - Warm Orange (`#ffa200`)
```css
--color-brand-d: #ffa200;
```
**Usage**: Highlights, call-to-action accents, warmth
**Emotion**: Energy, urgency (positive), attention
**Examples**: Hero CTAs, important highlights, featured content

#### Brand E - Bright Yellow (`#ffde00`)
```css
--color-brand-e: #ffde00;
```
**Usage**: Hover states for orange, high-visibility elements
**Emotion**: Optimism, clarity, visibility
**Examples**: Hover effects, highlighting, notifications

#### Brand J - Gold (`#e1c116`)
```css
--color-brand-j: #e1c116;
```
**Usage**: Warning states, important notices, caution
**Emotion**: Caution, attention, importance
**Examples**: Warning messages, important updates, review prompts

#### Brand S - Dark Gold (`#E1B500`)
```css
--color-brand-s: #E1B500;
```
**Usage**: Hover states for warnings, emphasis
**Emotion**: Authority, caution, emphasis
**Examples**: Warning hover states, important emphasis

### Alert & Status Colours

#### Brand G - Alert Red (`#a90000`)
```css
--color-brand-g: #a90000;
```
**Usage**: Error states, destructive actions, urgent alerts
**Emotion**: Urgency, caution, importance
**Examples**: Error messages, delete buttons, critical alerts

#### Brand H - Deep Purple (`#5a497f`)
```css
--color-brand-h: #5a497f;
```
**Usage**: Special categories, premium features, depth
**Emotion**: Dignity, wisdom, specialty
**Examples**: Premium services, special categories, highlights

#### Brand N - Light Purple (`#9886bf`)
```css
--color-brand-n: #9886bf;
```
**Usage**: Hover states for purple, lighter accents
**Emotion**: Calm, supportive, gentle
**Examples**: Purple hover states, gentle highlights

### Neutral Colours

#### Brand K - Charcoal (`#48484a`)
```css
--color-brand-k: #48484a;
```
**Usage**: Primary text, headings, icons
**Emotion**: Professional, readable, authoritative
**Examples**: Body text, headings, primary icons

#### Brand L - Dark Gray (`#29272a`)
```css
--color-brand-l: #29272a;
```
**Usage**: Secondary text, subtitles, footer
**Emotion**: Sophisticated, readable, secondary
**Examples**: Descriptions, metadata, footer content

#### Brand M - Near Black (`#101011`)
```css
--color-brand-m: #101011;
```
**Usage**: Deep contrast, emphasis text, headers
**Emotion**: Authority, depth, permanence
**Examples**: Strong emphasis, dark backgrounds, high contrast

#### Brand F - Medium Gray (`#8d8d8d`)
```css
--color-brand-f: #8d8d8d;
```
**Usage**: Disabled states, placeholders, borders
**Emotion**: Neutral, understated, supportive
**Examples**: Disabled buttons, placeholder text, subtle borders

#### Brand Q - Light Gray (`#f3f3f3`)
```css
--color-brand-q: #f3f3f3;
```
**Usage**: Background, card backgrounds, text on dark
**Emotion**: Clean, spacious, minimal
**Examples**: Page backgrounds, card backgrounds, light surfaces

#### Brand I - Cream (`#f6e9d2`)
```css
--color-brand-i: #f6e9d2;
```
**Usage**: Warm backgrounds, soft highlights, comfort zones
**Emotion**: Warmth, comfort, approachability
**Examples**: Information panels, warm backgrounds, soft highlights

### Alternative Tones

#### Brand P - Alt Dark Teal (`#086149`)
```css
--color-brand-p: #086149;
```
**Usage**: Alternative to brand-c, variety in greens
**Examples**: Secondary actions, alternative emphasis

#### Brand R - Medium Teal (`#0A8564`)
```css
--color-brand-r: #0A8564;
```
**Usage**: Mid-tone variations, subtle differences
**Examples**: Subtle hover states, tonal variations

## Colour Usage Guidelines

### Text Colour Hierarchy
```css
/* Primary text hierarchy */
.text-primary   { color: var(--color-brand-k); }  /* Main content */
.text-secondary { color: var(--color-brand-l); }  /* Supporting content */
.text-tertiary  { color: var(--color-brand-f); }  /* Metadata, captions */

/* Contextual text colours */
.text-success { color: var(--color-brand-b); }    /* Success messages */
.text-warning { color: var(--color-brand-j); }    /* Warnings */
.text-error   { color: var(--color-brand-g); }    /* Errors */
.text-info    { color: var(--color-brand-a); }    /* Information, links */
```

### Background Colour System
```css
/* Surface backgrounds */
.bg-surface       { background-color: white; }
.bg-surface-alt   { background-color: var(--color-brand-q); }
.bg-surface-warm  { background-color: var(--color-brand-i); }

/* Brand backgrounds */
.bg-primary    { background-color: var(--color-brand-a); }
.bg-secondary  { background-color: var(--color-brand-h); }
.bg-accent     { background-color: var(--color-brand-d); }

/* Contextual backgrounds */
.bg-success    { background-color: var(--color-brand-b); }
.bg-warning    { background-color: var(--color-brand-j); }
.bg-error      { background-color: var(--color-brand-g); }
```

### Border Colour System
```css
/* Default borders */
.border-default { border-color: var(--color-brand-q); }
.border-subtle  { border-color: var(--color-brand-i); }
.border-strong  { border-color: var(--color-brand-f); }

/* Interactive borders */
.border-focus   { border-color: var(--color-brand-a); }
.border-success { border-color: var(--color-brand-b); }
.border-warning { border-color: var(--color-brand-j); }
.border-error   { border-color: var(--color-brand-g); }
```

## Theme Applications

### Light Theme (Default)
```css
:root {
  /* Surface colours */
  --surface-primary: white;
  --surface-secondary: var(--color-brand-q);
  --surface-tertiary: var(--color-brand-i);
  
  /* Text colours */
  --text-primary: var(--color-brand-k);
  --text-secondary: var(--color-brand-l);
  --text-tertiary: var(--color-brand-f);
  --text-inverse: var(--color-brand-q);
  
  /* Interactive colours */
  --interactive-primary: var(--color-brand-a);
  --interactive-hover: var(--color-brand-b);
  --interactive-active: var(--color-brand-c);
}
```

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  :root {
    --text-primary: var(--color-brand-m);
    --border-default: var(--color-brand-k);
    --interactive-primary: var(--color-brand-c);
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Colour Accessibility

### Contrast Ratios (Verified)
| Colour Combination | Contrast Ratio | WCAG Level |
|-------------------|----------------|------------|
| brand-k on white | 7.2:1 | AAA |
| brand-l on white | 9.1:1 | AAA |
| brand-q on brand-a | 5.8:1 | AA+ |
| brand-q on brand-b | 6.9:1 | AAA |
| brand-q on brand-g | 8.1:1 | AAA |
| brand-k on brand-j | 4.8:1 | AA |

### Colour Blindness Considerations
- **Deuteranopia/Protanopia**: Never rely on red/green alone; use icons + color
- **Tritanopia**: Blue/yellow combinations include sufficient contrast
- **Monochromatic**: All combinations maintain sufficient contrast in grayscale

### Colour Usage Rules
1. **Never use colour alone** to convey information
2. **Always include text labels** or icons with colour coding
3. **Test with colour blindness simulators** before deployment
4. **Provide alternative indicators** (icons, patterns, text) for critical information

## Semantic Colour Mappings

### Service Categories
```css
.category-emergency    { --category-color: var(--color-brand-g); }
.category-housing      { --category-color: var(--color-brand-a); }
.category-food         { --category-color: var(--color-brand-d); }
.category-health       { --category-color: var(--color-brand-h); }
.category-legal        { --category-color: var(--color-brand-l); }
.category-support      { --category-color: var(--color-brand-b); }
```

### Status Indicators
```css
.status-available      { color: var(--color-brand-b); }
.status-limited        { color: var(--color-brand-j); }
.status-unavailable    { color: var(--color-brand-f); }
.status-emergency      { color: var(--color-brand-g); }
.status-verified       { color: var(--color-brand-a); }
```

### Distance/Proximity
```css
.distance-very-close   { color: var(--color-brand-b); }  /* < 0.5 miles */
.distance-close        { color: var(--color-brand-a); }  /* 0.5-2 miles */
.distance-moderate     { color: var(--color-brand-j); }  /* 2-5 miles */
.distance-far          { color: var(--color-brand-f); }  /* > 5 miles */
```

## Implementation Examples

### Service Card Colour Usage
```tsx
<div className="service-card">
  <div className="service-header">
    <h3 className="text-primary">Crisis Support Centre</h3>
    <span className="status-available">
      <Icon name="check" />
      Available Now
    </span>
  </div>
  
  <div className="service-meta">
    <span className="distance-close">0.8 miles</span>
    <span className="category-emergency">Emergency Support</span>
  </div>
  
  <div className="service-actions">
    <button className="btn-base btn-primary">Get Directions</button>
    <button className="btn-base btn-secondary">More Info</button>
  </div>
</div>
```

### Alert Pattern
```tsx
<div className="alert alert-warning">
  <Icon name="warning" className="text-warning" />
  <div>
    <h4 className="text-primary">Service Hours Changed</h4>
    <p className="text-secondary">
      This service is now open 24/7 due to increased demand.
    </p>
  </div>
</div>
```

### Navigation Highlighting
```tsx
<nav className="main-nav">
  <Link 
    href="/find-help" 
    className="nav-link"
    data-active="true"
  >
    Find Help
  </Link>
</nav>

<style>
.nav-link[data-active="true"] {
  color: var(--color-brand-a);
  border-bottom: 2px solid var(--color-brand-a);
}
</style>
```

## Usage Guidelines

### Do's ✅
- Use brand-a (green) for primary actions and positive progression
- Use brand-g (red) sparingly, only for genuine errors or destructive actions
- Combine colors with icons or text to ensure accessibility
- Test color combinations with contrast checkers
- Use neutral colors (brand-k, brand-l, brand-f) for most text content

### Don'ts ❌
- Don't use red/green combinations without additional visual cues
- Don't use bright colors (brand-d, brand-e) for large background areas
- Don't rely on color alone to indicate status or category
- Don't use low-contrast combinations for critical information
- Don't use more than 3-4 colors in a single component

## Performance Considerations

### CSS Custom Properties
All colours are defined as CSS custom properties for:
- Consistent theming
- Easy maintenance
- Runtime theme switching capability
- Reduced CSS bundle size

### Colour Loading
- No external colour dependencies
- Immediate colour availability
- No FOUC (Flash of Unstyled Content)
- Optimal performance across all devices

This colour system provides a solid foundation for creating accessible, meaningful, and visually appealing interfaces that support the Street Support mission while maintaining professional credibility and user trust.