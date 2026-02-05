import { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  // Playwright's webServer configuration handles starting and waiting for the dev server.
  // This global setup is a placeholder for any future pre-test setup needs.
  console.warn('E2E test setup complete');
}

export default globalSetup;
