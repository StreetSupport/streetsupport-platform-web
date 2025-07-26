# Street Support Typography System

## Overview
Typography is fundamental to creating an accessible, readable, and trustworthy platform for homelessness support services. Our typography system prioritises clarity, hierarchy, and emotional warmth while maintaining professional credibility.

## Design Principles
- **Accessibility First**: High contrast ratios, readable sizes, clear hierarchy
- **Emotional Warmth**: Human-centered, approachable tone without compromising professionalism
- **Scannable Content**: Clear hierarchy helps users quickly find critical information
- **Multi-Device Readability**: Responsive scaling ensures readability on all devices

## Font Stack

### Primary Font: System UI Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Rationale**: System fonts provide:
- Optimal performance (no web font loading)
- Familiar reading experience for users
- Excellent accessibility and readability
- Native feel across all platforms

### Fallback Stack
```css
font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
```

## Typography Scale

### Headings

#### H1 - Page Titles
```css
.heading-1 {
  font-size: 2.5rem;      /* 40px */
  font-weight: 700;       /* Bold */
  line-height: 1.2;       /* 48px */
  color: var(--color-brand-k);
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .heading-1 { font-size: 3rem; }      /* 48px */
}

@media (min-width: 1024px) {
  .heading-1 { font-size: 3.5rem; }    /* 56px */
}
```

**Usage**: Page titles, hero headings
**Examples**: "About Street Support", "Find Help Near You"

#### H2 - Section Headings
```css
.heading-2 {
  font-size: 2rem;        /* 32px */
  font-weight: 600;       /* Semibold */
  line-height: 1.3;       /* 42px */
  color: var(--color-brand-k);
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .heading-2 { font-size: 2.25rem; }   /* 36px */
}
```

**Usage**: Major section headings, content area titles
**Examples**: "Our Team", "How We Help", "Emergency Advice"

#### H3 - Subsection Headings
```css
.heading-3 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;       /* Semibold */
  line-height: 1.4;       /* 34px */
  color: var(--color-brand-k);
  margin-bottom: 0.75rem;
}

@media (min-width: 768px) {
  .heading-3 { font-size: 1.75rem; }   /* 28px */
}
```

**Usage**: Subsection headings, card titles, service categories
**Examples**: "Our Mission", "Contact Information", service names

#### H4 - Component Headings
```css
.heading-4 {
  font-size: 1.25rem;     /* 20px */
  font-weight: 600;       /* Semibold */
  line-height: 1.4;       /* 28px */
  color: var(--color-brand-k);
  margin-bottom: 0.5rem;
}
```

**Usage**: Component headings, form section titles, FAQ questions
**Examples**: Person names in team cards, form field groups

#### H5 - Small Headings
```css
.heading-5 {
  font-size: 1.125rem;    /* 18px */
  font-weight: 600;       /* Semibold */
  line-height: 1.4;       /* 25px */
  color: var(--color-brand-k);
  margin-bottom: 0.5rem;
}
```

**Usage**: Small component headings, sidebar titles
**Examples**: Widget titles, metadata labels

#### H6 - Micro Headings
```css
.heading-6 {
  font-size: 1rem;        /* 16px */
  font-weight: 600;       /* Semibold */
  line-height: 1.4;       /* 22px */
  color: var(--color-brand-k);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Usage**: Table headings, form labels, category tags
**Examples**: "SERVICES", "CONTACT INFO", "URGENT"

### Body Text

#### Large Body Text
```css
.text-large {
  font-size: 1.125rem;    /* 18px */
  font-weight: 400;       /* Normal */
  line-height: 1.6;       /* 29px */
  color: var(--color-brand-l);
}
```

**Usage**: Hero descriptions, intro paragraphs, important notices
**Examples**: Page introductions, key information callouts

#### Regular Body Text
```css
.text-base {
  font-size: 1rem;        /* 16px */
  font-weight: 400;       /* Normal */
  line-height: 1.6;       /* 26px */
  color: var(--color-brand-l);
}
```

**Usage**: Standard body text, descriptions, general content
**Examples**: Service descriptions, about text, general paragraphs

#### Small Body Text
```css
.text-small {
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;       /* Normal */
  line-height: 1.5;       /* 21px */
  color: var(--color-brand-k);
}
```

**Usage**: Secondary information, metadata, captions
**Examples**: Timestamps, addresses, helper text

#### Caption Text
```css
.text-caption {
  font-size: 0.75rem;     /* 12px */
  font-weight: 400;       /* Normal */
  line-height: 1.4;       /* 17px */
  color: var(--color-brand-f);
}
```

**Usage**: Fine print, disclaimers, very secondary information
**Examples**: Legal text, image captions, status indicators

### Specialized Text Styles

#### Lead Text (Introduction)
```css
.text-lead {
  font-size: 1.25rem;     /* 20px */
  font-weight: 300;       /* Light */
  line-height: 1.6;       /* 32px */
  color: var(--color-brand-k);
}

@media (min-width: 768px) {
  .text-lead { font-size: 1.375rem; }  /* 22px */
}
```

**Usage**: Article introductions, page summaries
**Examples**: Page description under main heading

#### Quote Text
```css
.text-quote {
  font-size: 1.125rem;    /* 18px */
  font-weight: 400;       /* Normal */
  font-style: italic;
  line-height: 1.6;       /* 29px */
  color: var(--color-brand-k);
  border-left: 4px solid var(--color-brand-a);
  padding-left: 1rem;
}
```

**Usage**: Testimonials, important quotes, callout text
**Examples**: User testimonials, featured quotes from team members

## Text Colors

### Primary Text Colors
- **Primary**: `brand-k` (#48484a) - Main body text
- **Secondary**: `brand-l` (#29272a) - Supporting text
- **Tertiary**: `brand-f` (#8d8d8d) - Metadata, captions

### Contextual Text Colors
- **Success**: `brand-b` (#0b9b75) - Success messages, positive indicators
- **Warning**: `brand-j` (#e1c116) - Warnings, important notices
- **Error**: `brand-g` (#a90000) - Error messages, urgent alerts
- **Info**: `brand-a` (#38ae8e) - Links, information highlights

### Text on Colored Backgrounds
- **On Dark**: `brand-q` (#f3f3f3) - Text on dark backgrounds
- **On Brand**: `brand-q` (#f3f3f3) - Text on brand-colored backgrounds
- **On Light**: `brand-k` (#48484a) - Text on light backgrounds

## Lists and Content Structure

### Unordered Lists
```css
.list-default {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.list-default li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.list-default li::marker {
  color: var(--color-brand-a);
}
```

### Ordered Lists
```css
.list-numbered {
  margin: 1rem 0;
  padding-left: 1.5rem;
  counter-reset: list-counter;
}

.list-numbered li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  counter-increment: list-counter;
}

.list-numbered li::marker {
  color: var(--color-brand-a);
  font-weight: 600;
}
```

### Definition Lists (For Contact Info, etc.)
```css
.definition-list dt {
  font-weight: 600;
  color: var(--color-brand-k);
  margin-top: 1rem;
}

.definition-list dd {
  margin-left: 0;
  margin-bottom: 0.5rem;
  color: var(--color-brand-l);
}
```

## Accessibility Guidelines

### Contrast Requirements
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI elements**: Minimum 3:1 contrast ratio

### Font Size Guidelines
- **Minimum body text**: 16px (1rem)
- **Minimum touch targets**: 44px minimum
- **Reading measure**: 45-75 characters per line optimal

### Focus States
```css
.focusable:focus {
  outline: 2px solid var(--color-brand-a);
  outline-offset: 2px;
}
```

## Usage Examples

### Page Header
```tsx
<header>
  <h1 className="heading-1">Find Help Near You</h1>
  <p className="text-lead">
    Connect with local support services and resources in your area.
  </p>
</header>
```

### Content Section
```tsx
<section>
  <h2 className="heading-2">Emergency Support</h2>
  <p className="text-base">
    If you're in immediate danger or need urgent help, contact emergency services.
  </p>
  <ul className="list-default">
    <li>Emergency services: 999</li>
    <li>Samaritans: 116 123 (free, 24/7)</li>
    <li>Crisis text line: Text SHOUT to 85258</li>
  </ul>
</section>
```

### Team Member Card
```tsx
<div className="team-card">
  <h3 className="heading-4">Matt Lambert</h3>
  <p className="text-small">Interim Managing Director</p>
  <p className="text-base">
    Working closely with partners across the network...
  </p>
</div>
```

## Implementation Notes

### CSS Custom Properties
All typography styles should use CSS custom properties for consistency and easy theming.

### Responsive Considerations
- Use `rem` units for font sizes to respect user preferences
- Implement fluid typography with `clamp()` where appropriate
- Test on various devices and zoom levels up to 200%

### Performance
- System fonts eliminate web font loading time
- Minimal font variations reduce complexity
- Progressive enhancement for advanced typography features

This typography system provides a solid foundation for clear, accessible, and professional communication across the Street Support platform while maintaining the warmth and approachability essential for serving vulnerable populations.