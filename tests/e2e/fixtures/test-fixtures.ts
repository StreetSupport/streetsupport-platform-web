import { test as base } from '@playwright/test';
import { setupAPIMocks, TEST_POSTCODE, TEST_COORDINATES } from '../helpers/mocks';

type TestFixtures = {
  mockSetup: void;
};

export const test = base.extend<TestFixtures>({
  mockSetup: [async ({ page }, use) => {
    await setupAPIMocks(page);
    await use();
  }, { auto: true }]
});

export { expect } from '@playwright/test';
export { TEST_POSTCODE, TEST_COORDINATES };
