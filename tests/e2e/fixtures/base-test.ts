import { test as base, Page } from '@playwright/test';
import { setupAPIMocks, setupBasicMocks } from '../helpers/setup-api-mocks';

// Define types for our custom fixtures
type MockSetupFixtures = {
  mockSetup: void;
  setupMocks: {
    api: () => Promise<void>;
    basic: () => Promise<void>;
  };
};

// Extend Playwright test with custom fixtures
export const test = base.extend<MockSetupFixtures>({
  // Auto-setup API mocks before each test
  mockSetup: [async ({ page }, use) => {
    // Set up mocks before test starts
    await setupAPIMocks(page);
    
    // Pass control to the test
    await use();
    
    // Cleanup happens automatically when page context is destroyed
  }, { auto: true }],

  // Provide a manual mock setup for tests that need custom behavior
  setupMocks: async ({ page }, use) => {
    const setupMocks = {
      api: () => setupAPIMocks(page),
      basic: () => setupBasicMocks(page)
    };
    
    await use(setupMocks);
  }
});

// Re-export expect for convenience
export { expect } from '@playwright/test';

// Test constants for consistency
export const TEST_POSTCODE = 'M1 1AA';
export const TEST_COORDINATES = {
  lat: 53.4808,
  lng: -2.2426
};