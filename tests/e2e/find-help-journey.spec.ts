import { test, expect, TEST_LOCATION, HAS_DATABASE } from './fixtures/base-test';

test.describe('Find Help Journey', () => {
  // All tests in this suite require database access
  test.beforeEach(async () => {
    test.skip(!HAS_DATABASE, 'Skipping - requires database connection (MONGODB_URI)');
  });

  test('find services by selecting location', async ({ page }) => {
    await page.goto('/find-help');

    // Click to show location options
    await page.getByRole('button', { name: /enter postcode/i }).click();

    // Select Manchester from the location dropdown
    await page.locator('#location-select').selectOption(TEST_LOCATION.slug);

    // Click find services
    await page.getByRole('button', { name: /find services in/i }).click();

    // Should show services results page - wait for service cards to appear
    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible({ timeout: 30000 });
  });

  test('filter services by category', async ({ page }) => {
    // Start with location already set via URL params
    await page.goto(`/find-help?lat=${TEST_LOCATION.lat}&lng=${TEST_LOCATION.lng}`);

    // Wait for services to load
    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible({ timeout: 30000 });

    // Select a category filter
    const categorySelect = page.locator('#category');
    await categorySelect.selectOption({ index: 1 });

    // Page should update (either show filtered results or "no results")
    await expect(
      page.locator('[data-testid="service-card"], [data-testid="no-results"]').first()
    ).toBeVisible();
  });

  test('view service details', async ({ page }) => {
    await page.goto(`/find-help?lat=${TEST_LOCATION.lat}&lng=${TEST_LOCATION.lng}`);

    // Wait for services
    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible();

    // Click first service
    await page.locator('[data-testid="service-card"]').first().click();

    // Should navigate to organisation page
    await expect(page).toHaveURL(/\/find-help\/organisation\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('toggle map view', async ({ page }) => {
    await page.goto(`/find-help?lat=${TEST_LOCATION.lat}&lng=${TEST_LOCATION.lng}`);

    // Wait for services
    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible({ timeout: 30000 });

    // Toggle map on
    await page.getByRole('button', { name: /show map/i }).click();
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();

    // Toggle map off
    await page.getByRole('button', { name: /hide map/i }).click();
    await expect(page.locator('[data-testid="map-container"]')).not.toBeVisible();
  });

  test('use geolocation', async ({ page, context }) => {
    // Grant geolocation permission
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: TEST_LOCATION.lat, longitude: TEST_LOCATION.lng });

    await page.goto('/find-help');

    // Click use location
    await page.getByRole('button', { name: /use my current location/i }).click();

    // Should show services
    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible({ timeout: 30000 });
  });
});
