# Street Support Button Design System

## Overview
This document defines the button hierarchy and styling for the Street Support platform, using exclusively our custom brand colours for consistency and brand recognition.

## Brand Colour Palette Reference
- **brand-a**: `#38ae8e` - Primary brand green (teal)
- **brand-b**: `#0b9b75` - Darker teal green
- **brand-c**: `#086049` - Deep teal green
- **brand-d**: `#ffa200` - Orange
- **brand-e**: `#ffde00` - Bright yellow
- **brand-f**: `#8d8d8d` - Medium grey
- **brand-g**: `#a90000` - Red
- **brand-h**: `#5a497f` - Purple
- **brand-i**: `#f6e9d2` - Light cream/beige
- **brand-j**: `#e1c116` - Gold
- **brand-k**: `#48484a` - Dark grey
- **brand-l**: `#29272a` - Very dark grey
- **brand-m**: `#101011` - Almost black
- **brand-n**: `#9886bf` - Light purple
- **brand-p**: `#086149` - Alternative dark teal
- **brand-q**: `#f3f3f3` - Light grey
- **brand-r**: `#0A8564` - Medium teal
- **brand-s**: `#E1B500` - Dark gold

## Button Hierarchy

### Primary Actions (Most Important)
**Class: `btn-primary`**
- **Colour**: `brand-a` background with `brand-q` text
- **Usage**: Main CTAs, form submissions, primary navigation
- **Examples**: "Find Services", "Search", "Submit", "Get Help Now"
- **Hover**: `brand-b` background

### Secondary Actions (Supporting)
**Class: `btn-secondary`**
- **Colour**: `brand-a` border with `brand-a` text, `brand-q` background
- **Usage**: Alternative actions, secondary navigation
- **Examples**: "View Details", "Learn More", "Back"
- **Hover**: `brand-i` background

### Success/Confirmation Actions
**Class: `btn-success`**
- **Colour**: `brand-b` background with `brand-q` text
- **Usage**: Confirmation, successful completion
- **Examples**: "Confirm", "Save", "Complete Registration"
- **Hover**: `brand-c` background

### Warning/Caution Actions
**Class: `btn-warning`**
- **Colour**: `brand-j` background with `brand-k` text
- **Usage**: Actions requiring attention or caution
- **Examples**: "Review Information", "Important Notice"
- **Hover**: `brand-s` background

### Destructive/Danger Actions
**Class: `btn-danger`**
- **Colour**: `brand-g` background with `brand-q` text
- **Usage**: Irreversible or destructive actions
- **Examples**: "Delete", "Remove", "Cancel Permanently"
- **Hover**: Darker `brand-g` (achieved with opacity)

### Neutral/Info Actions
**Class: `btn-neutral`**
- **Colour**: `brand-f` background with `brand-q` text
- **Usage**: Neutral actions, information display
- **Examples**: "More Info", "Help", "Settings"
- **Hover**: `brand-k` background

### Subtle/Tertiary Actions
**Class: `btn-tertiary`**
- **Colour**: `brand-k` border with `brand-k` text, transparent background
- **Usage**: Less prominent actions, utility functions
- **Examples**: "Edit", "Cancel", "Skip"
- **Hover**: `brand-q` background

## Size Variants

### Large Buttons
**Class: `btn-lg`**
- **Padding**: `px-6 py-3`
- **Text**: `text-base font-medium`
- **Usage**: Hero CTAs, main page actions

### Medium Buttons (Default)
**Class: `btn-md`**
- **Padding**: `px-4 py-2`
- **Text**: `text-sm font-medium`
- **Usage**: Standard form buttons, general actions

### Small Buttons
**Class: `btn-sm`**
- **Padding**: `px-3 py-1.5`
- **Text**: `text-xs font-medium`
- **Usage**: Compact spaces, secondary actions

### Icon Buttons
**Class: `btn-icon`**
- **Padding**: `p-2`
- **Usage**: Icon-only buttons, minimal space requirements

## Interactive States

### Focus State
- Ring: `ring-2 ring-brand-a ring-offset-2`
- Background: `ring-offset-brand-q`

### Disabled State
- Background: `brand-q`
- Text: `brand-f`
- Cursor: `cursor-not-allowed`
- Opacity: `opacity-60`

### Loading State
- Maintains original colours
- Shows spinner icon in `brand-a` or appropriate contrast colour
- Disabled interaction during loading

## Usage Guidelines

### ✅ Do's
- Use `btn-primary` for the most important action on each page/section
- Limit primary buttons to 1-2 per view to maintain hierarchy
- Use `btn-secondary` for alternative or supporting actions
- Apply `btn-danger` only for truly destructive actions
- Ensure sufficient colour contrast for accessibility
- Use consistent sizing within related button groups

### ❌ Don'ts
- Don't use multiple primary buttons in the same context
- Don't use `btn-danger` for non-destructive actions
- Don't mix button styles arbitrarily
- Don't use custom colours outside the brand palette
- Don't compromise accessibility for visual design

## Code Examples

### Primary Button
```tsx
<button className="btn-base btn-primary btn-md">
  Find Services
</button>
```

### Secondary Button with Icon
```tsx
<button className="btn-base btn-secondary btn-sm">
  <ArrowLeftIcon className="w-4 h-4 mr-2" />
  Back
</button>
```

### Danger Button (Large)
```tsx
<button className="btn-base btn-danger btn-lg">
  Delete Account
</button>
```

### Loading State
```tsx
<button className="btn-base btn-primary btn-md" disabled>
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-q mr-2"></div>
  Searching...
</button>
```

## Accessibility Considerations

- All buttons meet WCAG AA contrast requirements
- Focus indicators are clearly visible
- Disabled states are properly communicated to screen readers
- Loading states include appropriate aria-labels
- Button text clearly describes the action

## Implementation Notes

- All button classes should be combined with `btn-base` for consistent foundation styles
- Size classes (`btn-lg`, `btn-md`, `btn-sm`, `btn-icon`) should be used alongside type classes
- Custom focus-visible styles override browser defaults for consistency
- Hover effects are disabled on touch devices to prevent sticky states

## Brand Color Combinations Summary

| Button Type | Background | Text | Border | Hover BG |
|-------------|------------|------|--------|----------|
| Primary | brand-a | brand-q | - | brand-b |
| Secondary | brand-q | brand-a | brand-a | brand-i |
| Success | brand-b | brand-q | - | brand-c |
| Warning | brand-j | brand-k | - | brand-s |
| Danger | brand-g | brand-q | - | darker brand-g |
| Neutral | brand-f | brand-q | - | brand-k |
| Tertiary | transparent | brand-k | brand-k | brand-q |