# Street Support Layout & Spacing System

## Overview
A consistent layout and spacing system creates visual harmony, improves readability, and helps users navigate the platform efficiently. Our system prioritises accessibility, responsive design, and clean visual hierarchy suitable for both urgent and informational content.

## Design Principles
- **Predictable Patterns**: Consistent spacing creates familiarity and reduces cognitive load
- **Content Priority**: Spacing emphasises important information and guides user attention
- **Responsive Flexibility**: Layout adapts gracefully across all device sizes
- **Accessibility**: Adequate spacing improves touch targets and readability

## Spacing Scale

### Base Spacing Unit
Our spacing system is based on an 8px grid system, providing consistent rhythm and easy mathematical relationships.

```css
:root {
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
  --spacing-24: 6rem;     /* 96px */
}
```

### Spacing Applications

#### Micro Spacing (4px - 12px)
**Usage**: Between related elements, icon spacing, fine adjustments
```css
.micro-spacing {
  gap: var(--spacing-1); /* 4px - Between icon and text */
  margin-bottom: var(--spacing-2); /* 8px - Between form labels and inputs */
  padding: var(--spacing-3); /* 12px - Small button padding */
}
```

#### Component Spacing (16px - 24px)
**Usage**: Component internal spacing, card padding, button spacing
```css
.component-spacing {
  padding: var(--spacing-4); /* 16px - Card content padding */
  gap: var(--spacing-6); /* 24px - Between form fields */
  margin-bottom: var(--spacing-6); /* 24px - Between paragraphs */
}
```

#### Section Spacing (32px - 48px)
**Usage**: Between content sections, page regions
```css
.section-spacing {
  margin-bottom: var(--spacing-8); /* 32px - Between content sections */
  padding: var(--spacing-12); /* 48px - Section internal padding */
}
```

#### Layout Spacing (64px+)
**Usage**: Page-level spacing, hero sections, major layout regions
```css
.layout-spacing {
  padding: var(--spacing-16); /* 64px - Page sections */
  margin-bottom: var(--spacing-20); /* 80px - Between major page regions */
  padding-top: var(--spacing-24); /* 96px - Hero section padding */
}
```

## Container System

### Max Widths
```css
.container-sm { max-width: 640px; }   /* Forms, narrow content */
.container-md { max-width: 768px; }   /* Articles, single-column content */
.container-lg { max-width: 1024px; }  /* Standard page content */
.container-xl { max-width: 1280px; }  /* Wide layouts, dashboards */
.container-2xl { max-width: 1536px; } /* Full-width sections */
```

### Container Patterns
```css
/* Standard page container */
.page-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

@media (min-width: 640px) {
  .page-container {
    padding: 0 var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .page-container {
    padding: 0 var(--spacing-8);
  }
}

/* Full-width container with max-width content */
.full-width-container {
  width: 100%;
  padding: 0 var(--spacing-4);
}

.full-width-container .content {
  max-width: 1024px;
  margin: 0 auto;
}
```

## Grid System

### CSS Grid Layouts

#### Standard Content Grid
```css
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 2fr 1fr; /* Main content + sidebar */
    gap: var(--spacing-8);
  }
}

@media (min-width: 1024px) {
  .content-grid {
    gap: var(--spacing-12);
  }
}
```

#### Card Grid
```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-8);
  }
}
```

#### Service Grid (for service listings)
```css
.service-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .service-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-6);
  }
}
```

### Flexbox Patterns

#### Horizontal Stack
```css
.stack-horizontal {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.stack-horizontal.tight { gap: var(--spacing-2); }
.stack-horizontal.loose { gap: var(--spacing-6); }
```

#### Vertical Stack
```css
.stack-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.stack-vertical.tight { gap: var(--spacing-2); }
.stack-vertical.loose { gap: var(--spacing-6); }
```

#### Space Between Layout
```css
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
}

@media (max-width: 640px) {
  .space-between {
    flex-direction: column;
    align-items: stretch;
  }
}
```

## Page Layout Patterns

### Standard Page Layout
```css
.page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: var(--color-brand-a);
  padding: var(--spacing-6) 0;
}

.page-main {
  flex: 1;
  padding: var(--spacing-8) 0;
}

.page-footer {
  background: var(--color-brand-l);
  padding: var(--spacing-8) 0;
  margin-top: auto;
}
```

### Hero Section Layout
```css
.hero-section {
  padding: var(--spacing-16) 0;
  text-align: center;
}

@media (min-width: 768px) {
  .hero-section {
    padding: var(--spacing-24) 0;
  }
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  margin-bottom: var(--spacing-6);
}

.hero-description {
  margin-bottom: var(--spacing-8);
}
```

### Two-Column Content Layout
```css
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-8);
}

@media (min-width: 1024px) {
  .two-column-layout {
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-12);
  }
}

.main-content {
  min-width: 0; /* Prevents grid blowout */
}

.sidebar {
  min-width: 0;
}

@media (max-width: 1023px) {
  .sidebar {
    order: -1; /* Sidebar first on mobile */
  }
}
```

## Component Spacing Patterns

### Card Spacing
```css
.card {
  padding: var(--spacing-6);
  border-radius: 8px;
  background: white;
  border: 1px solid var(--color-brand-q);
}

.card-header {
  margin-bottom: var(--spacing-4);
}

.card-content > * + * {
  margin-top: var(--spacing-4);
}

.card-actions {
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--color-brand-q);
}
```

### Form Spacing
```css
.form-group {
  margin-bottom: var(--spacing-6);
}

.form-label {
  margin-bottom: var(--spacing-2);
}

.form-help-text {
  margin-top: var(--spacing-2);
}

.form-actions {
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-6);
}

.form-actions .btn + .btn {
  margin-left: var(--spacing-4);
}
```

### List Spacing
```css
.list-spaced li {
  margin-bottom: var(--spacing-4);
}

.list-compact li {
  margin-bottom: var(--spacing-2);
}

.list-loose li {
  margin-bottom: var(--spacing-6);
}
```

## Responsive Breakpoints

### Breakpoint System
```css
/* Mobile First Approach */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Responsive Spacing
```css
.responsive-spacing {
  padding: var(--spacing-4);
}

@media (min-width: 640px) {
  .responsive-spacing {
    padding: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .responsive-spacing {
    padding: var(--spacing-8);
  }
}
```

## Accessibility Considerations

### Touch Targets
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: var(--spacing-2) var(--spacing-4);
}
```

### Focus Spacing
```css
.focusable:focus {
  outline: 2px solid var(--color-brand-a);
  outline-offset: 2px;
}
```

### Reading Width
```css
.readable-width {
  max-width: 65ch; /* Optimal reading line length */
}
```

## Usage Examples

### Service Card Layout
```tsx
<div className="card">
  <div className="card-header">
    <h3 className="heading-3">Crisis Support Centre</h3>
    <p className="text-small">0.2 miles away</p>
  </div>
  
  <div className="card-content">
    <p className="text-base">
      24/7 emergency support and temporary accommodation for people experiencing homelessness.
    </p>
    
    <div className="stack-horizontal">
      <span className="badge">24/7</span>
      <span className="badge">Walk-in</span>
    </div>
  </div>
  
  <div className="card-actions">
    <div className="space-between">
      <button className="btn-base btn-primary btn-md">Get Directions</button>
      <button className="btn-base btn-secondary btn-md">More Info</button>
    </div>
  </div>
</div>
```

### Page Section Layout
```tsx
<section className="section-spacing">
  <div className="page-container">
    <div className="two-column-layout">
      <div className="main-content">
        <h2 className="heading-2">About Our Services</h2>
        <div className="stack-vertical">
          <p className="text-large">
            We connect people with essential support services...
          </p>
          <p className="text-base">
            Our network includes over 1,800 organizations...
          </p>
        </div>
      </div>
      
      <div className="sidebar">
        <div className="card">
          <h3 className="heading-4">Quick Links</h3>
          <nav className="stack-vertical tight">
            <a href="/emergency">Emergency Support</a>
            <a href="/find-help">Find Services</a>
            <a href="/contact">Contact Us</a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</section>
```

## Implementation Notes

### CSS Custom Properties
Use CSS custom properties for all spacing values to enable easy theme customization.

### Logical Properties
Consider using logical properties for better internationalization:
```css
margin-inline-start: var(--spacing-4);
padding-block: var(--spacing-6);
```

### Performance Considerations
- Use `gap` property instead of margins where possible for better layout performance
- Prefer CSS Grid and Flexbox over float-based layouts
- Use `contain` property for independent layout regions

This spacing system ensures consistent, accessible, and visually pleasing layouts across the Street Support platform while maintaining flexibility for various content types and responsive requirements.