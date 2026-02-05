import { test, expect, TEST_LOCATION, HAS_DATABASE } from './fixtures/base-test';

test.describe('Map Integration', () => {
  test('homepage map renders', async ({ page }) => {
    // This test doesn't need database - homepage map uses static location data
    await page.goto('/');

    // Wait for map container to be visible (500px height container)
    const mapContainer = page.locator('.h-\\[500px\\]').first();
    await expect(mapContainer).toBeVisible();

    // Check that Google Maps has initialised (will have child elements once loaded)
    await expect(mapContainer.locator('div').first()).toBeVisible();
  });

  test('find-help map shows service locations', async ({ page }) => {
    // This test requires database access for services
    test.skip(!HAS_DATABASE, 'Skipping - requires database connection (MONGODB_URI)');

    await page.goto(`/find-help?lat=${TEST_LOCATION.lat}&lng=${TEST_LOCATION.lng}`);

    // Wait for services to load
    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible({ timeout: 30000 });

    // Show map
    await page.getByRole('button', { name: /show map/i }).click();

    // Map should be visible
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
  });
});
