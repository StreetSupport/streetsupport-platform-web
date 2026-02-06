import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../tests/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 30000,
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        permissions: ['geolocation'],
        geolocation: { latitude: 53.4808, longitude: -2.2426 },
      },
    },
  ],
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      NODE_ENV: 'test',
      MONGODB_URI: process.env.MONGODB_URI || process.env.TEST_MONGODB_URI || '',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdout: 'pipe',
    stderr: 'pipe',
  },
  reporter: [['list']],
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 2,
});
