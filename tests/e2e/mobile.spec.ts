import { test, expect, TEST_LOCATION, HAS_DATABASE } from './fixtures/base-test';

test.describe('Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('navigation menu works', async ({ page }) => {
    // This test doesn't need database
    await page.goto('/');

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /toggle menu/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Navigation should be visible
    await expect(page.locator('.mobile-menu')).toBeVisible();

    // Navigation links should be visible
    await expect(page.locator('.mobile-menu').getByRole('link', { name: /find help/i })).toBeVisible();
  });

  test('find-help flow completes on mobile', async ({ page }) => {
    // This test requires database access for services
    test.skip(!HAS_DATABASE, 'Skipping - requires database connection (MONGODB_URI)');

    await page.goto('/find-help');

    // Click to show location options
    await page.getByRole('button', { name: /enter postcode/i }).click();

    // Select Manchester from the location dropdown
    await page.locator('#location-select').selectOption(TEST_LOCATION.slug);

    // Click find services
    await page.getByRole('button', { name: /find services in/i }).click();

    // Should show services - wait for service cards to appear
    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible({ timeout: 30000 });
  });

  test('touch targets are adequate size', async ({ page }) => {
    // This test doesn't need database - just checking UI element sizes
    await page.goto('/find-help');

    // Check main CTA button has adequate touch target (44x44 minimum)
    const button = page.getByRole('button', { name: /use my current location/i });
    const box = await button.boundingBox();

    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});
