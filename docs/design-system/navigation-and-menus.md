# Street Support Navigation & Menu System

## Overview
Navigation is critical for helping users quickly find essential services, especially during crisis situations. Our navigation system emphasises clarity, accessibility, and progressive disclosure while maintaining a clean, uncluttered interface.

## Design Principles
- **Clarity Over Cleverness**: Obvious navigation paths with clear labels
- **Crisis-Aware**: Emergency services always accessible, minimal cognitive load
- **Progressive Disclosure**: Advanced features don't overwhelm primary use cases
- **Mobile-First**: Touch-friendly navigation optimised for all devices

## Primary Navigation

### Header Navigation
```css
.main-nav {
  background-color: white;
  border-bottom: 1px solid var(--color-brand-q);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

@media (min-width: 640px) {
  .nav-container {
    padding: 0 var(--spacing-6);
  }
}
```

### Logo & Brand
```css
.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-brand-k);
  gap: var(--spacing-2);
}

.nav-logo:hover {
  color: var(--color-brand-a);
}

.nav-logo-icon {
  width: 32px;
  height: 32px;
  color: var(--color-brand-a);
}

@media (max-width: 640px) {
  .nav-logo-text {
    display: none;
  }
}
```

### Desktop Navigation Links
```css
.nav-links {
  display: none;
  align-items: center;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  color: var(--color-brand-k);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: var(--spacing-2) 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--color-brand-a);
  border-bottom-color: var(--color-brand-a);
}

.nav-link.active {
  color: var(--color-brand-a);
  border-bottom-color: var(--color-brand-a);
}

.nav-link:focus {
  outline: none;
  color: var(--color-brand-a);
  border-bottom-color: var(--color-brand-a);
}
```

### Mobile Menu Toggle
```css
.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  color: var(--color-brand-k);
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

@media (min-width: 768px) {
  .mobile-menu-toggle {
    display: none;
  }
}

.mobile-menu-toggle:hover {
  background-color: var(--color-brand-q);
}

.mobile-menu-toggle:focus {
  outline: none;
  background-color: var(--color-brand-i);
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}

.menu-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease;
}

.mobile-menu-toggle[aria-expanded="true"] .menu-icon {
  transform: rotate(90deg);
}
```

## Dropdown Menus

### Location Dropdown
```css
.nav-dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--color-brand-k);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.dropdown-trigger:hover {
  background-color: var(--color-brand-q);
  color: var(--color-brand-a);
}

.dropdown-trigger:focus {
  outline: none;
  background-color: var(--color-brand-i);
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.dropdown-trigger[aria-expanded="true"] .dropdown-icon {
  transform: rotate(180deg);
}
```

### Dropdown Panel
```css
.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  margin-top: var(--spacing-2);
  background: white;
  border: 1px solid var(--color-brand-q);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 320px;
  max-width: 600px;
  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .dropdown-panel {
    left: 0;
    right: 0;
    transform: none;
    margin: var(--spacing-2) var(--spacing-4) 0;
    min-width: auto;
  }
}

.dropdown-content {
  padding: var(--spacing-4);
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-1);
}

.dropdown-item {
  display: block;
  padding: var(--spacing-2) var(--spacing-3);
  color: var(--color-brand-k);
  text-decoration: none;
  font-size: 0.875rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--color-brand-i);
  color: var(--color-brand-a);
}

.dropdown-item:focus {
  outline: none;
  background-color: var(--color-brand-a);
  color: white;
}
```

## Mobile Navigation

### Mobile Menu Panel
```css
.mobile-menu {
  display: block;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 150;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: var(--spacing-6) var(--spacing-4);
}

.mobile-nav-section {
  margin-bottom: var(--spacing-8);
}

.mobile-nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-brand-k);
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-2);
  border-bottom: 1px solid var(--color-brand-q);
}
```

### Mobile Navigation Links
```css
.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--color-brand-k);
  text-decoration: none;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  min-height: 48px;
}

.mobile-nav-link:hover {
  background-color: var(--color-brand-i);
  color: var(--color-brand-a);
}

.mobile-nav-link:focus {
  outline: none;
  background-color: var(--color-brand-a);
  color: white;
}

.mobile-nav-link.primary {
  background-color: var(--color-brand-a);
  color: white;
  font-weight: 600;
}

.mobile-nav-link.primary:hover {
  background-color: var(--color-brand-b);
}
```

### Mobile Location Grid
```css
.mobile-location-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2);
  max-height: 300px;
  overflow-y: auto;
}

.mobile-location-item {
  display: block;
  padding: var(--spacing-3);
  color: var(--color-brand-k);
  text-decoration: none;
  border: 1px solid var(--color-brand-q);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.mobile-location-item:hover {
  border-color: var(--color-brand-a);
  background-color: var(--color-brand-i);
}

.mobile-location-item:focus {
  outline: none;
  border-color: var(--color-brand-a);
  background-color: var(--color-brand-a);
  color: white;
}
```

## Emergency Navigation

### Emergency Bar
```css
.emergency-bar {
  background-color: var(--color-brand-g);
  color: white;
  padding: var(--spacing-2) 0;
  text-align: center;
  font-size: 0.875rem;
  position: sticky;
  top: 0;
  z-index: 200;
}

.emergency-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
}

.emergency-text {
  font-weight: 600;
}

.emergency-link {
  color: white;
  text-decoration: underline;
  font-weight: 600;
}

.emergency-link:hover {
  color: var(--color-brand-e);
}

@media (max-width: 640px) {
  .emergency-content {
    flex-direction: column;
    gap: var(--spacing-2);
  }
}
```

### Quick Actions
```css
.quick-actions {
  position: fixed;
  bottom: var(--spacing-6);
  right: var(--spacing-6);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

@media (max-width: 640px) {
  .quick-actions {
    bottom: var(--spacing-4);
    right: var(--spacing-4);
  }
}

.quick-action-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--color-brand-a);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background-color: var(--color-brand-b);
  transform: scale(1.05);
}

.quick-action-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.3);
}

.quick-action-btn.emergency {
  background-color: var(--color-brand-g);
}

.quick-action-btn.emergency:hover {
  background-color: var(--color-brand-g);
  opacity: 0.9;
}
```

## Breadcrumb Navigation

### Standard Breadcrumbs
```css
.breadcrumb {
  background-color: var(--color-brand-q);
  border-bottom: 1px solid var(--color-brand-i);
  padding: var(--spacing-3) 0;
}

.breadcrumb-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.breadcrumb-link {
  color: var(--color-brand-f);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-brand-a);
  text-decoration: underline;
}

.breadcrumb-current {
  color: var(--color-brand-k);
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--color-brand-f);
  font-size: 0.75rem;
}
```

## Tab Navigation

### Horizontal Tabs
```css
.tab-navigation {
  border-bottom: 1px solid var(--color-brand-q);
  margin-bottom: var(--spacing-6);
}

.tab-list {
  display: flex;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
}

.tab-item {
  flex-shrink: 0;
}

.tab-link {
  display: block;
  padding: var(--spacing-4) var(--spacing-6);
  color: var(--color-brand-f);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.tab-link:hover {
  color: var(--color-brand-a);
  background-color: var(--color-brand-i);
}

.tab-link.active {
  color: var(--color-brand-a);
  border-bottom-color: var(--color-brand-a);
  background-color: white;
}

.tab-link:focus {
  outline: none;
  background-color: var(--color-brand-a);
  color: white;
}

@media (max-width: 640px) {
  .tab-link {
    padding: var(--spacing-3) var(--spacing-4);
    font-size: 0.875rem;
  }
}
```

## Pagination Navigation

### Standard Pagination
```css
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  margin: var(--spacing-8) 0;
}

.pagination-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-brand-q);
  border-radius: 6px;
  color: var(--color-brand-k);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-item:hover {
  border-color: var(--color-brand-a);
  background-color: var(--color-brand-i);
  color: var(--color-brand-a);
}

.pagination-item.active {
  background-color: var(--color-brand-a);
  border-color: var(--color-brand-a);
  color: white;
}

.pagination-item:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}

.pagination-item.disabled {
  color: var(--color-brand-f);
  cursor: not-allowed;
  border-color: var(--color-brand-q);
}

.pagination-item.disabled:hover {
  background-color: transparent;
  border-color: var(--color-brand-q);
  color: var(--color-brand-f);
}
```

### Load More Navigation
```css
.load-more {
  text-align: center;
  margin: var(--spacing-8) 0;
}

.load-more-btn {
  padding: var(--spacing-3) var(--spacing-6);
  border: 2px solid var(--color-brand-a);
  background: white;
  color: var(--color-brand-a);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
}

.load-more-btn:hover {
  background-color: var(--color-brand-a);
  color: white;
}

.load-more-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}

.load-more-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}
```

## Accessibility Features

### Skip Links
```css
.skip-links {
  position: absolute;
  top: -40px;
  left: 6px;
  z-index: 1000;
}

.skip-link {
  position: absolute;
  background: var(--color-brand-k);
  color: white;
  padding: var(--spacing-2) var(--spacing-3);
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.skip-link:focus {
  top: 6px;
  position: absolute;
}
```

### Focus Management
```css
.nav-container:focus-within {
  /* Enhanced focus styles when navigation has focus */
}

/* Focus trap for mobile menu */
.mobile-menu.open {
  /* Ensures focus stays within mobile menu when open */
}

.mobile-menu.open .mobile-menu-content {
  /* Focus styles for mobile menu content */
}
```

## Usage Examples

### Complete Header Navigation
```tsx
<header className="main-nav" role="banner">
  <div className="nav-container">
    <Link href="/" className="nav-logo">
      <HeartIcon className="nav-logo-icon" />
      <span className="nav-logo-text">Street Support</span>
    </Link>
    
    <nav className="nav-links" role="navigation" aria-label="Main navigation">
      <Link href="/find-help" className="nav-link">
        Find Help
      </Link>
      
      <div className="nav-dropdown">
        <button 
          className="dropdown-trigger"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          Locations
          <ChevronDownIcon className="dropdown-icon" />
        </button>
        
        {isOpen && (
          <div className="dropdown-panel" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-grid">
                {locations.map(location => (
                  <Link 
                    key={location.slug}
                    href={`/${location.slug}`}
                    className="dropdown-item"
                    role="menuitem"
                  >
                    {location.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Link href="/about" className="nav-link">
        About
      </Link>
      <Link href="/contact" className="nav-link">
        Contact
      </Link>
    </nav>
    
    <button 
      className="mobile-menu-toggle"
      aria-expanded={mobileMenuOpen}
      aria-label="Toggle mobile menu"
    >
      <MenuIcon className="menu-icon" />
    </button>
  </div>
</header>
```

This navigation system provides clear, accessible paths to essential services while maintaining professional appearance and mobile-friendly interaction patterns.