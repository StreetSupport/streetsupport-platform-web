import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../tests/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 60000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Improved timeouts for Next.js routes
    navigationTimeout: 45000,
    actionTimeout: 20000,
    // Add better error handling
    ignoreHTTPSErrors: true,
    // Add locale for consistent testing
    locale: 'en-GB',
    // Add timezone for consistent testing
    timezoneId: 'Europe/London',
    // Add better handling for strict mode violations
    strictSelectors: false,
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        // Add permissions for geolocation tests
        permissions: ['geolocation'],
        // Add geolocation for consistent testing
        geolocation: { latitude: 53.4808, longitude: -2.2426 }, // Manchester coordinates
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 180 * 1000, // Increased timeout for Next.js startup
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      NODE_ENV: 'test',
      // Add test database URL if needed
      MONGODB_URI: process.env.MONGODB_URI || process.env.TEST_MONGODB_URI,
      // Ensure Next.js handles routes properly in test mode
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdout: 'pipe',
    stderr: 'pipe',
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  expect: {
    timeout: 20000, // Increased timeout for assertions
  },
  globalSetup: '../tests/e2e/global-setup.ts',
  // Add better test isolation
  fullyParallel: false,
  workers: process.env.CI ? 1 : 2,
});
