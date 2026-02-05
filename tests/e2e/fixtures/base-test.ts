import { test as base } from '@playwright/test';

export const test = base;
export { expect } from '@playwright/test';

// Test constants
export const TEST_LOCATION = {
  name: 'Manchester',
  slug: 'manchester',
  postcode: 'M1 1AA',
  lat: 53.4808,
  lng: -2.2426
};

// Check if database is available for tests that require it
export const HAS_DATABASE = !!process.env.MONGODB_URI;
