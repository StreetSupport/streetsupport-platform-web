# Street Support Design System

## Overview
The Street Support Design System provides a comprehensive foundation for building accessible, consistent, and user-friendly interfaces for homelessness support services. This system prioritizes clarity, emotional warmth, and trust while maintaining professional credibility.

## Design Philosophy

### Core Principles
- **Accessibility First**: Every component meets WCAG AA standards and supports diverse user needs
- **Stress-Aware Design**: Interfaces designed for users who may be in crisis or stressful situations
- **Progressive Enhancement**: Essential functionality works for everyone, enhancements improve the experience
- **Trust & Warmth**: Professional credibility balanced with human approachability
- **Mobile-First**: Optimized for the devices most likely to be used by people seeking help

### Target Users
- **Primary**: People experiencing homelessness seeking immediate support
- **Secondary**: Service providers, volunteers, and community members
- **Tertiary**: Researchers, policymakers, and partner organisations

## System Components

### 1. [Buttons](./buttons.md)
Complete button hierarchy using custom brand colors exclusively:
- **Primary**: Main actions (brand-a green)
- **Secondary**: Supporting actions (outlined brand-a)
- **Success**: Confirmations (brand-b darker green)
- **Warning**: Important notices (brand-j gold)
- **Danger**: Destructive actions (brand-g red)
- **Neutral**: General actions (brand-f grey)
- **Tertiary**: Subtle actions (brand-k outlined)

### 2. [Typography](./typography.md)
Accessible typography system optimized for readability:
- System font stack for performance and familiarity
- Six heading levels with responsive scaling
- Four body text sizes with optimal line heights
- Specialized styles for leads, quotes, and captions
- Color hierarchy for clear information architecture

### 3. [Colors & Themes](./colors-and-themes.md)
Brand-focused colour system with accessibility-first approach:
- 18 custom brand colors (brand-a through brand-s)
- Semantic colour mappings for service categories
- WCAG AA compliant contrast ratios
- Colour-blind friendly combinations
- Dark mode and high contrast support

### 4. [Layout & Spacing](./layout-and-spacing.md)
Consistent spacing and layout patterns:
- 8px grid-based spacing system
- Responsive container patterns
- CSS Grid and Flexbox layouts
- Component spacing guidelines
- Mobile-first responsive breakpoints

### 5. [Forms & Inputs](./forms-and-inputs.md)
Stress-aware form design for critical interactions:
- Accessible form controls with clear validation
- Multi-step form patterns with progress indication
- Search and filter patterns
- Error handling that doesn't blame users
- Mobile-optimized input types

### 6. [Navigation & Menus](./navigation-and-menus.md)
Clear navigation paths to essential services:
- Primary header navigation with emergency access
- Mobile-first menu patterns
- Breadcrumb and pagination systems
- Tab navigation for content organisation
- Skip links and keyboard navigation support

### 7. [Cards & Content](./cards-and-content.md)
Flexible content containers for service information:
- Service cards with status indicators
- Organization profile cards
- Team member cards
- FAQ and article cards
- Alert and notification patterns

## Implementation Guidelines

### Getting Started
1. **Install Dependencies**: Ensure Tailwind CSS is configured with custom brand colors
2. **Include Base Styles**: Import the design system CSS into your project
3. **Use Semantic HTML**: Start with proper HTML structure before adding design system classes
4. **Test Accessibility**: Verify keyboard navigation and screen reader compatibility

### Class Naming Convention
```css
/* Component-based naming */
.btn-base .btn-primary .btn-lg    /* Button: base + variant + size */
.card .card-featured .card-compact /* Card: base + variant + modifier */
.nav-link .nav-link-active         /* Navigation: component + state */
```

### Responsive Approach
```css
/* Mobile-first breakpoints */
.component-class {
  /* Mobile styles (default) */
}

@media (min-width: 640px) {
  .component-class {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component-class {
    /* Desktop styles */
  }
}
```

### Accessibility Checklist
- [ ] Minimum 4.5:1 contrast ratio for text
- [ ] 44px minimum touch target size
- [ ] Keyboard navigation support
- [ ] Screen reader labels and descriptions
- [ ] Focus indicators clearly visible
- [ ] Color not used as sole indicator
- [ ] Responsive text scaling up to 200%

## Brand Colour Reference

### Primary Colors
- **brand-a** (`#38ae8e`): Primary green - main CTAs, navigation
- **brand-b** (`#0b9b75`): Success green - confirmations, success states
- **brand-c** (`#086049`): Deep green - hover states, emphasis

### Accent Colors
- **brand-d** (`#ffa200`): Warm orange - Find Help CTAs, attention-grabbing actions
- **brand-e** (`#ffde00`): Bright yellow - hover states, notifications
- **brand-j** (`#e1c116`): Gold - warnings, important notices

### Utility Colors
- **brand-g** (`#a90000`): Alert red - errors, destructive actions
- **brand-k** (`#48484a`): Charcoal - primary text, icons
- **brand-l** (`#29272a`): Dark grey - secondary text
- **brand-f** (`#8d8d8d`): Medium grey - disabled states, metadata
- **brand-q** (`#f3f3f3`): Light grey - backgrounds, borders

## Usage Examples

### Basic Page Structure
```tsx
<main className="min-h-screen bg-gray-50">
  <section className="section-spacing">
    <div className="page-container">
      <header className="mb-8">
        <h1 className="heading-1">Find Help Near You</h1>
        <p className="text-lead">
          Connect with local support services in your area.
        </p>
      </header>
      
      <div className="card-grid cols-2">
        <ServiceCard />
        <ServiceCard />
      </div>
    </div>
  </section>
</main>
```

### Service Card Implementation
```tsx
<div className="card service-card">
  <div className="card-header">
    <h3 className="card-title">Crisis Support Centre</h3>
    <span className="service-distance">0.3 miles</span>
  </div>
  
  <div className="card-content">
    <p className="card-description">
      24/7 emergency support for people experiencing homelessness.
    </p>
    <div className="service-tags">
      <span className="service-tag emergency">Emergency</span>
      <span className="service-tag verified">Verified</span>
    </div>
  </div>
  
  <div className="card-footer">
    <button className="btn-base btn-secondary btn-sm">More Info</button>
    <button className="btn-base btn-primary btn-sm">Get Directions</button>
  </div>
</div>
```

## Performance Considerations

### CSS Strategy
- **Critical CSS**: Inline essential styles for above-the-fold content
- **Component CSS**: Load component styles as needed
- **CSS Custom Properties**: Use for theming and dynamic values
- **Minimized Bundle**: Tree-shake unused styles in production

### Font Loading
- **System Fonts**: Primary strategy for immediate rendering
- **Font Display**: Use `font-display: swap` if custom fonts are needed
- **Preload**: Preload critical font files when necessary

### Asset Optimization
- **SVG Icons**: Inline for critical icons, sprite sheets for others
- **Image Optimization**: WebP with fallbacks, responsive images
- **Progressive Enhancement**: Core functionality works without JavaScript

## Browser Support

### Minimum Requirements
- **Desktop**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+, Samsung Internet 13+
- **Assistive Technology**: NVDA, JAWS, VoiceOver, TalkBack

### Progressive Enhancement
- **CSS Grid**: Fallback to Flexbox for older browsers
- **CSS Custom Properties**: Fallback values provided
- **Focus-visible**: Polyfill included for older browsers

## Contributing Guidelines

### Adding New Components
1. Follow existing naming conventions
2. Include accessibility considerations
3. Test with keyboard navigation
4. Provide responsive behavior
5. Document usage examples
6. Test with screen readers

### Modifying Existing Components
1. Ensure backward compatibility
2. Update documentation
3. Test across supported browsers
4. Verify accessibility compliance
5. Consider performance impact

## Resources

### Tools
- **Accessibility**: axe-core, WAVE, Lighthouse
- **Color Contrast**: WebAIM Contrast Checker
- **Testing**: Jest, Playwright, Storybook
- **Design**: Figma design system components

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
- [Government Digital Service Design Principles](https://www.gov.uk/guidance/government-design-principles)

## Recent Updates (2025)

### Navigation Enhancements
- **Grouped Location Dropdowns**: Locations now grouped by Greater Manchester and West Midlands regions for better organisation
- **Logo Integration**: Street Support logo now displayed in navigation header
- **Breadcrumb Styling**: Updated to white background with subtle borders for better accessibility

### Button System Updates
- **Find Help CTA Colour**: Changed from green (brand-a) to orange (brand-d) to improve visual hierarchy and avoid clashing with hero banners
- **Enhanced Hover Effects**: Improved button interactions with transform effects and better shadows

### Card System Improvements
- **Consistent Heights**: Card grids now use flexbox to ensure uniform card heights
- **Enhanced Shadows**: Improved card shadows for better depth and visual separation
- **Hover Transitions**: Added subtle transform effects on hover for better user feedback

### New Components
- **Social Sharing Component**: Reusable social share component for Bluesky, Facebook, and X (Twitter)
- **Real Statistics Integration**: Dynamic data fetching for organisation and service counts
- **Partner Logo Sections**: Structured display of supporter logos by location

### Accessibility Improvements
- **WCAG AA Compliance**: All new components meet accessibility standards
- **Keyboard Navigation**: Enhanced focus states and keyboard interaction patterns
- **Screen Reader Support**: Improved ARIA labels and semantic HTML structure

### Performance Optimisations
- **CSS Efficiency**: Streamlined CSS with better organisation and reduced redundancy
- **Mobile-First Responsive**: Improved mobile experience with touch-friendly interactions
- **Loading States**: Better user feedback during data fetching operations

This design system serves as the foundation for creating trustworthy, accessible, and effective interfaces that help connect vulnerable populations with essential support services.