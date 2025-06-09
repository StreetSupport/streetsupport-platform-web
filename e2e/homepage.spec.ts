import { test, expect } from '@playwright/test';

test.describe.skip('Homepage Map', () => {
  test('should render the map container', async ({ page }) => {
    await page.goto('/');

    const mapContainer = page.locator('div[role="region"] >> nth=0');
    await expect(mapContainer).toBeVisible();
  });
});
