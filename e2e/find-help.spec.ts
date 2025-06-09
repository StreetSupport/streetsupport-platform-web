import { test, expect } from '@playwright/test';

const postcode = 'LN4 2LE';

async function enterPostcode(page) {
  await page.route('**/api/geocode?**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ location: { lat: 53, lng: -2 } }),
    });
  });
  await page.goto('/find-help');
  await page.getByLabel(/postcode/i).fill(postcode);
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);
}

test.describe.skip('Find Help Page', () => {
  test('should load Find Help page and show fallback form when geolocation is blocked', async ({ page }) => {
    await page.goto('/find-help');
    await expect(page.getByLabel(/postcode/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
  });

  test('should allow postcode entry and show service results', async ({ page }) => {
    await enterPostcode(page);
    await expect(page.getByText(/services near you/i)).toBeVisible();
  });

  test('should allow selecting category and subcategory', async ({ page }) => {
    await enterPostcode(page);
    await expect(page.locator('#category')).toBeVisible();
    await page.locator('#category').selectOption('medical');
    await expect(page.locator('#subCategory')).toBeVisible();
  });

  test('should toggle map visibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await enterPostcode(page);

    const toggleBtn = page.getByRole('button', { name: /show map/i });
    await toggleBtn.click();
    await expect(page.locator('[data-testid="map-container"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show results interface elements after postcode entry', async ({ page }) => {
    await enterPostcode(page);

    await expect(page.getByText(/services near you/i)).toBeVisible();
    await expect(page.locator('#category')).toBeVisible();
    await expect(page.getByRole('button', { name: /show map/i })).toBeVisible();
  });
});
