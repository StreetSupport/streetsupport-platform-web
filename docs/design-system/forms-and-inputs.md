# Street Support Forms & Input System

## Overview
Forms are critical touchpoints for users seeking help, often during stressful situations. Our form system prioritises clarity, accessibility, and emotional safety while ensuring efficient data collection for essential services.

## Design Principles
- **Accessibility First**: Full keyboard navigation, screen reader support, clear error messages
- **Stress-Aware Design**: Minimal cognitive load, forgiving validation, clear progress indication
- **Mobile-First**: Touch-friendly targets, optimised keyboards, responsive layouts
- **Trust Building**: Clear privacy notices, optional fields marked, secure appearance

## Form Layout Patterns

### Standard Form Layout
```css
.form-container {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--spacing-6);
}

.form-section {
  margin-bottom: var(--spacing-8);
}

.form-section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-brand-k);
  margin-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-brand-q);
  padding-bottom: var(--spacing-2);
}
```

### Multi-Step Form Layout
```css
.multi-step-form {
  max-width: 768px;
  margin: 0 auto;
}

.form-progress {
  margin-bottom: var(--spacing-8);
  padding: var(--spacing-4) 0;
  border-bottom: 1px solid var(--color-brand-q);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: 0.875rem;
  color: var(--color-brand-f);
}

.progress-step.active {
  color: var(--color-brand-a);
  font-weight: 600;
}

.progress-step.completed {
  color: var(--color-brand-b);
}
```

## Input Components

### Text Input
```css
.input-field {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--color-brand-q);
  border-radius: 6px;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-brand-k);
  background-color: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-brand-a);
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}

.input-field:disabled {
  background-color: var(--color-brand-q);
  color: var(--color-brand-f);
  cursor: not-allowed;
}

.input-field.error {
  border-color: var(--color-brand-g);
}

.input-field.success {
  border-color: var(--color-brand-b);
}
```

### Text Area
```css
.textarea-field {
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
}

.textarea-field.large {
  min-height: 200px;
}
```

### Select Dropdown
```css
.select-field {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right var(--spacing-3) center;
  background-size: 16px;
  padding-right: var(--spacing-10);
}

.select-field:focus {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338ae8e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}
```

### Checkbox
```css
.checkbox-field {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-brand-f);
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  position: relative;
  margin-right: var(--spacing-3);
  flex-shrink: 0;
}

.checkbox-field:checked {
  background-color: var(--color-brand-a);
  border-color: var(--color-brand-a);
}

.checkbox-field:checked::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 6px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-field:focus {
  outline: none;
  border-color: var(--color-brand-a);
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}
```

### Radio Button
```css
.radio-field {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-brand-f);
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  position: relative;
  margin-right: var(--spacing-3);
  flex-shrink: 0;
}

.radio-field:checked {
  border-color: var(--color-brand-a);
}

.radio-field:checked::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-brand-a);
}

.radio-field:focus {
  outline: none;
  border-color: var(--color-brand-a);
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}
```

### Toggle Switch
```css
.toggle-field {
  appearance: none;
  width: 48px;
  height: 24px;
  background-color: var(--color-brand-f);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.toggle-field::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.toggle-field:checked {
  background-color: var(--color-brand-a);
}

.toggle-field:checked::after {
  transform: translateX(24px);
}

.toggle-field:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}
```

## Form Field Groups

### Basic Field Group
```css
.field-group {
  margin-bottom: var(--spacing-6);
}

.field-label {
  display: block;
  font-weight: 600;
  color: var(--color-brand-k);
  margin-bottom: var(--spacing-2);
  font-size: 0.875rem;
}

.field-label.required::after {
  content: " *";
  color: var(--color-brand-g);
}

.field-help {
  font-size: 0.75rem;
  color: var(--color-brand-f);
  margin-top: var(--spacing-2);
  line-height: 1.4;
}

.field-error {
  font-size: 0.75rem;
  color: var(--color-brand-g);
  margin-top: var(--spacing-2);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.field-success {
  font-size: 0.75rem;
  color: var(--color-brand-b);
  margin-top: var(--spacing-2);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}
```

### Checkbox/Radio Group
```css
.choice-group {
  margin-bottom: var(--spacing-6);
}

.choice-group-label {
  display: block;
  font-weight: 600;
  color: var(--color-brand-k);
  margin-bottom: var(--spacing-4);
  font-size: 0.875rem;
}

.choice-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.choice-option {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.choice-option:hover {
  background-color: var(--color-brand-i);
}

.choice-option-label {
  font-size: 0.875rem;
  color: var(--color-brand-k);
  line-height: 1.4;
  cursor: pointer;
}

.choice-option-description {
  font-size: 0.75rem;
  color: var(--color-brand-f);
  margin-top: var(--spacing-1);
  line-height: 1.3;
}
```

## Specialized Form Patterns

### Search Input
```css
.search-field {
  position: relative;
}

.search-input {
  padding-left: var(--spacing-10);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3ccircle cx='11' cy='11' r='8'%3e%3c/circle%3e%3cpath d='m21 21-4.35-4.35'%3e%3c/path%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left var(--spacing-3) center;
  background-size: 16px;
}

.search-clear {
  position: absolute;
  right: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-brand-f);
  padding: var(--spacing-1);
}
```

### Date Input
```css
.date-field {
  position: relative;
}

.date-input[type="date"] {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3e%3c/rect%3e%3cline x1='16' y1='2' x2='16' y2='6'%3e%3c/line%3e%3cline x1='8' y1='2' x2='8' y2='6'%3e%3c/line%3e%3cline x1='3' y1='10' x2='21' y2='10'%3e%3c/line%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right var(--spacing-3) center;
  background-size: 16px;
  padding-right: var(--spacing-10);
}
```

### File Upload
```css
.file-upload {
  position: relative;
  display: inline-block;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px dashed var(--color-brand-f);
  border-radius: 6px;
  background-color: var(--color-brand-q);
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-label:hover {
  border-color: var(--color-brand-a);
  background-color: var(--color-brand-i);
}

.file-input:focus + .file-label {
  border-color: var(--color-brand-a);
  box-shadow: 0 0 0 3px rgba(56, 174, 142, 0.1);
}
```

## Form States & Validation

### Loading State
```css
.form-loading {
  position: relative;
  opacity: 0.7;
  pointer-events: none;
}

.form-loading::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-brand-q);
  border-top: 2px solid var(--color-brand-a);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Error States
```css
.form-errors {
  background-color: #fef2f2;
  border: 1px solid var(--color-brand-g);
  border-radius: 6px;
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.form-errors-title {
  font-weight: 600;
  color: var(--color-brand-g);
  margin-bottom: var(--spacing-2);
  font-size: 0.875rem;
}

.form-errors-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.form-errors-list li {
  color: var(--color-brand-g);
  font-size: 0.75rem;
  margin-bottom: var(--spacing-1);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}
```

### Success States
```css
.form-success {
  background-color: #f0f9f7;
  border: 1px solid var(--color-brand-b);
  border-radius: 6px;
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.form-success-content {
  flex: 1;
}

.form-success-title {
  font-weight: 600;
  color: var(--color-brand-b);
  margin-bottom: var(--spacing-1);
  font-size: 0.875rem;
}

.form-success-message {
  color: var(--color-brand-k);
  font-size: 0.75rem;
  line-height: 1.4;
}
```

## Form Actions

### Action Bar
```css
.form-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--color-brand-q);
  margin-top: var(--spacing-8);
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions .btn-base {
    width: 100%;
  }
}

.form-actions-left {
  margin-right: auto;
}
```

## Accessibility Features

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

.field-description {
  font-size: 0.75rem;
  color: var(--color-brand-f);
  margin-top: var(--spacing-2);
}
```

### Keyboard Navigation
```css
.form-container:focus-within {
  /* Visual indication that form has focus */
}

.field-group:focus-within .field-label {
  color: var(--color-brand-a);
}

/* Skip to error handling */
.skip-to-error {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-brand-g);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
}

.skip-to-error:focus {
  top: 6px;
}
```

## Usage Examples

### Contact Form
```tsx
<form className="form-container" onSubmit={handleSubmit}>
  <div className="form-section">
    <h2 className="form-section-title">Contact Information</h2>
    
    <div className="field-group">
      <label htmlFor="name" className="field-label required">
        Full Name
      </label>
      <input
        type="text"
        id="name"
        className="input-field"
        required
        aria-describedby="name-help"
      />
      <div id="name-help" className="field-help">
        This helps us personalize our response to you
      </div>
    </div>
    
    <div className="field-group">
      <label htmlFor="email" className="field-label required">
        Email Address
      </label>
      <input
        type="email"
        id="email"
        className="input-field"
        required
        aria-describedby="email-help"
      />
      <div id="email-help" className="field-help">
        We'll use this to respond to your inquiry
      </div>
    </div>
  </div>
  
  <div className="form-actions">
    <button type="button" className="btn-base btn-tertiary btn-md">
      Cancel
    </button>
    <button type="submit" className="btn-base btn-primary btn-md">
      Send Message
    </button>
  </div>
</form>
```

### Service Search Form
```tsx
<form className="search-form">
  <div className="field-group">
    <label htmlFor="location" className="field-label">
      Your Location
    </label>
    <div className="search-field">
      <input
        type="text"
        id="location"
        className="input-field search-input"
        placeholder="Enter postcode or area"
        aria-describedby="location-help"
      />
    </div>
    <div id="location-help" className="field-help">
      We'll show services near this location
    </div>
  </div>
  
  <div className="choice-group">
    <div className="choice-group-label">Type of Support Needed</div>
    <div className="choice-options">
      <label className="choice-option">
        <input type="checkbox" className="checkbox-field" value="housing" />
        <div>
          <div className="choice-option-label">Housing & Accommodation</div>
          <div className="choice-option-description">
            Emergency shelter, temporary housing, permanent accommodation
          </div>
        </div>
      </label>
      
      <label className="choice-option">
        <input type="checkbox" className="checkbox-field" value="food" />
        <div>
          <div className="choice-option-label">Food & Meals</div>
          <div className="choice-option-description">
            Free meals, food banks, soup kitchens
          </div>
        </div>
      </label>
    </div>
  </div>
</form>
```

This form system ensures that all interactions are accessible, clear, and supportive for users who may be in stressful situations while seeking essential services.