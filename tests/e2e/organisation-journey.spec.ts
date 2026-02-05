import { test, expect, TEST_LOCATION, HAS_DATABASE } from './fixtures/base-test';

test.describe('Organisation Journey', () => {
  // All tests in this suite require database access
  test.beforeEach(async () => {
    test.skip(!HAS_DATABASE, 'Skipping - requires database connection (MONGODB_URI)');
  });

  test('view organisation from search results', async ({ page }) => {
    await page.goto(`/find-help?lat=${TEST_LOCATION.lat}&lng=${TEST_LOCATION.lng}`);

    // Wait for services
    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible();

    // Navigate to organisation
    await page.locator('[data-testid="service-card"]').first().click();

    // Should show organisation details
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('organisation page shows services', async ({ page }) => {
    await page.goto(`/find-help?lat=${TEST_LOCATION.lat}&lng=${TEST_LOCATION.lng}`);

    await page.locator('[data-testid="service-card"]').first().click();

    // Should show services section (accordion)
    await expect(page.locator('[data-testid="services-accordion"]')).toBeVisible();
  });

  test('organisation 404 for invalid slug', async ({ page }) => {
    const response = await page.goto('/find-help/organisation/this-org-does-not-exist-12345');
    expect(response?.status()).toBe(404);
  });
});
