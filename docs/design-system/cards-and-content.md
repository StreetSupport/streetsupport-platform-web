# Street Support Cards & Content Components

## Overview
Cards and content components are the primary way users interact with service information, organisational details, and resources. These components must be scannable, accessible, and provide clear paths to action while handling varying content lengths gracefully.

## Design Principles
- **Scannable Information**: Key details visible at a glance
- **Consistent Structure**: Predictable layout reduces cognitive load
- **Action-Oriented**: Clear next steps for users seeking help
- **Content Flexibility**: Graceful handling of varying content lengths

## Base Card System

### Standard Card
```css
.card {
  background: white;
  border: 1px solid var(--color-brand-q);
  border-radius: 8px;
  padding: var(--spacing-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--color-brand-a);
}

.card:focus-within {
  border-color: var(--color-brand-a);
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  transform: translateY(-2px);
}
```

### Card Variants
```css
/* Compact card for lists */
.card-compact {
  padding: var(--spacing-4);
}

/* Featured card with emphasis */
.card-featured {
  border-color: var(--color-brand-a);
  background: linear-gradient(135deg, white 0%, var(--color-brand-i) 100%);
}

/* Urgent/emergency card */
.card-urgent {
  border-color: var(--color-brand-g);
  border-width: 2px;
  background: linear-gradient(135deg, white 0%, #fef2f2 100%);
}

/* Success/verified card */
.card-verified {
  border-color: var(--color-brand-b);
  background: linear-gradient(135deg, white 0%, #f0f9f7 100%);
}
```

## Card Structure

### Card Header
```css
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
  gap: var(--spacing-3);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-brand-k);
  line-height: 1.4;
  margin: 0;
  flex: 1;
  min-width: 0; /* Allows text to truncate */
}

.card-title-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.card-title-link:hover {
  color: var(--color-brand-a);
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--color-brand-f);
  margin-top: var(--spacing-1);
  line-height: 1.3;
}

.card-meta {
  flex-shrink: 0;
  text-align: right;
  font-size: 0.75rem;
  color: var(--color-brand-f);
}
```

### Card Content
```css
.card-content {
  margin-bottom: var(--spacing-4);
  line-height: 1.6;
}

.card-content > * + * {
  margin-top: var(--spacing-3);
}

.card-description {
  color: var(--color-brand-l);
  font-size: 0.875rem;
  line-height: 1.5;
}

.card-description.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}
```

### Card Footer
```css
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-brand-q);
  margin-top: auto;
}

.card-actions {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
}

@media (max-width: 640px) {
  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .card-actions {
    width: 100%;
    justify-content: space-between;
  }
}
```

## Service Cards

### Service Card Layout
```css
.service-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.service-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.service-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-brand-k);
  margin: 0;
  line-height: 1.4;
}

.service-organisation {
  font-size: 0.875rem;
  color: var(--color-brand-f);
  margin-top: var(--spacing-1);
  line-height: 1.3;
}

.service-distance {
  font-size: 0.75rem;
  color: var(--color-brand-a);
  font-weight: 600;
  flex-shrink: 0;
  text-align: right;
}
```

### Service Status Indicators
```css
.service-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: 0.75rem;
  font-weight: 600;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: 4px;
  white-space: nowrap;
}

.service-status.available {
  background-color: #f0f9f7;
  color: var(--color-brand-b);
}

.service-status.limited {
  background-color: #fef9e7;
  color: var(--color-brand-j);
}

.service-status.closed {
  background-color: var(--color-brand-q);
  color: var(--color-brand-f);
}

.service-status.emergency {
  background-color: #fef2f2;
  color: var(--color-brand-g);
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin: var(--spacing-3) 0;
}

.service-tag {
  font-size: 0.75rem;
  padding: var(--spacing-1) var(--spacing-2);
  background-color: var(--color-brand-i);
  color: var(--color-brand-k);
  border-radius: 12px;
  font-weight: 500;
}

.service-tag.urgent {
  background-color: var(--color-brand-g);
  color: white;
}

.service-tag.verified {
  background-color: var(--color-brand-b);
  color: white;
}
```

## Organisation Cards

### Team Member Card
```css
.team-card {
  text-align: center;
  padding: var(--spacing-6);
}

.team-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto var(--spacing-4);
  overflow: hidden;
  border: 4px solid var(--color-brand-q);
}

.team-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-brand-k);
  margin-bottom: var(--spacing-1);
}

.team-role {
  font-size: 0.875rem;
  color: var(--color-brand-a);
  font-weight: 500;
  margin-bottom: var(--spacing-3);
}

.team-bio {
  font-size: 0.875rem;
  color: var(--color-brand-l);
  line-height: 1.5;
  text-align: left;
}

.team-contact {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-brand-q);
}
```

### Organisation Summary Card
```css
.org-card {
  border-left: 4px solid var(--color-brand-a);
}

.org-card.verified {
  border-left-color: var(--color-brand-b);
}

.org-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.org-logo {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--color-brand-q);
  display: flex;
  align-items: center;
  justify-content: center;
}

.org-info {
  flex: 1;
  min-width: 0;
}

.org-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-brand-k);
  margin-bottom: var(--spacing-1);
  line-height: 1.4;
}

.org-type {
  font-size: 0.75rem;
  color: var(--color-brand-f);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.org-stats {
  display: flex;
  gap: var(--spacing-4);
  margin: var(--spacing-4) 0;
  font-size: 0.875rem;
}

.org-stat {
  text-align: center;
}

.org-stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-brand-a);
  line-height: 1;
}

.org-stat-label {
  color: var(--color-brand-f);
  font-size: 0.75rem;
  margin-top: var(--spacing-1);
}
```

## Content Cards

### Article/News Card
```css
.article-card {
  overflow: hidden;
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: var(--spacing-4);
}

.article-date {
  font-size: 0.75rem;
  color: var(--color-brand-f);
  margin-bottom: var(--spacing-2);
}

.article-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-brand-k);
  line-height: 1.4;
  margin-bottom: var(--spacing-2);
}

.article-excerpt {
  font-size: 0.875rem;
  color: var(--color-brand-l);
  line-height: 1.5;
  margin-bottom: var(--spacing-4);
}

.article-read-time {
  font-size: 0.75rem;
  color: var(--color-brand-f);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}
```

### FAQ Card
```css
.faq-card {
  border: none;
  box-shadow: none;
  padding: 0;
  background: transparent;
}

.faq-question {
  width: 100%;
  text-align: left;
  background: white;
  border: 1px solid var(--color-brand-q);
  border-radius: 8px;
  padding: var(--spacing-4) var(--spacing-5);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-brand-k);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.faq-question:hover {
  border-color: var(--color-brand-a);
  background-color: var(--color-brand-i);
}

.faq-question:focus {
  outline: none;
  border-color: var(--color-brand-a);
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}

.faq-question[aria-expanded="true"] {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-color: transparent;
}

.faq-icon {
  width: 20px;
  height: 20px;
  color: var(--color-brand-a);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.faq-question[aria-expanded="true"] .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  background: white;
  border: 1px solid var(--color-brand-q);
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: var(--spacing-4) var(--spacing-5);
  font-size: 0.875rem;
  color: var(--color-brand-l);
  line-height: 1.6;
}
```

## Special Purpose Cards

### Statistics Card
```css
.stat-card {
  text-align: center;
  background: linear-gradient(135deg, var(--color-brand-a) 0%, var(--color-brand-b) 100%);
  color: white;
  border: none;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: var(--spacing-2);
  color: var(--color-brand-e);
}

.stat-label {
  font-size: 1.125rem;
  font-weight: 500;
  opacity: 0.95;
}

@media (max-width: 640px) {
  .stat-number {
    font-size: 2.5rem;
  }
  
  .stat-label {
    font-size: 1rem;
  }
}
```

### Alert/Notice Card
```css
.alert-card {
  border-left: 4px solid;
  background-color: var(--color-brand-q);
}

.alert-card.info {
  border-left-color: var(--color-brand-a);
  background-color: #f0f9f7;
}

.alert-card.warning {
  border-left-color: var(--color-brand-j);
  background-color: #fef9e7;
}

.alert-card.error {
  border-left-color: var(--color-brand-g);
  background-color: #fef2f2;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.alert-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-brand-k);
  margin: 0;
}

.alert-content {
  font-size: 0.875rem;
  color: var(--color-brand-l);
  line-height: 1.5;
}
```

### Contact Card
```css
.contact-card {
  background: linear-gradient(135deg, white 0%, var(--color-brand-i) 100%);
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.contact-method {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-2);
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.contact-method:hover {
  background-color: rgba(56, 174, 142, 0.1);
}

.contact-icon {
  width: 24px;
  height: 24px;
  color: var(--color-brand-a);
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
}

.contact-label {
  font-size: 0.75rem;
  color: var(--color-brand-f);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-1);
}

.contact-value {
  font-size: 0.875rem;
  color: var(--color-brand-k);
  font-weight: 500;
}

.contact-value a {
  color: inherit;
  text-decoration: none;
}

.contact-value a:hover {
  color: var(--color-brand-a);
  text-decoration: underline;
}
```

## Grid Layouts

### Card Grid Systems
```css
.card-grid {
  display: grid;
  gap: var(--spacing-6);
  grid-template-columns: 1fr;
}

.card-grid.cols-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.card-grid.cols-3 {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.card-grid.cols-4 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

@media (max-width: 640px) {
  .card-grid {
    gap: var(--spacing-4);
  }
}

/* Masonry-style layout for varying heights */
.card-masonry {
  columns: 1;
  column-gap: var(--spacing-6);
}

@media (min-width: 640px) {
  .card-masonry {
    columns: 2;
  }
}

@media (min-width: 1024px) {
  .card-masonry {
    columns: 3;
  }
}

.card-masonry .card {
  break-inside: avoid;
  margin-bottom: var(--spacing-6);
}
```

## Usage Examples

### Service Listing Card
```tsx
<div className="card service-card">
  <div className="service-header">
    <div>
      <h3 className="service-title">Crisis Support Centre</h3>
      <p className="service-organisation">Manchester City Council</p>
    </div>
    <div className="service-distance">0.3 miles</div>
  </div>
  
  <div className="card-content">
    <p className="card-description">
      24/7 emergency accommodation and support for people experiencing homelessness.
    </p>
    
    <div className="service-tags">
      <span className="service-tag urgent">Emergency</span>
      <span className="service-tag verified">Verified</span>
      <span className="service-tag">24/7</span>
    </div>
    
    <div className="service-status available">
      <Icon name="check" />
      Available Now
    </div>
  </div>
  
  <div className="card-footer">
    <div className="contact-methods">
      <span className="contact-method">
        <Icon name="phone" />
        0161 123 4567
      </span>
    </div>
    
    <div className="card-actions">
      <button className="btn-base btn-secondary btn-sm">More Info</button>
      <button className="btn-base btn-primary btn-sm">Get Directions</button>
    </div>
  </div>
</div>
```

This card system provides consistent, accessible components for displaying service information, organisational details, and content while maintaining visual hierarchy and clear action paths for users seeking help.