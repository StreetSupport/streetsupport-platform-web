import { test, expect } from '@playwright/test';

test.describe('Homepage Map', () => {
  test('should render the map and show location markers', async ({ page }) => {
    await page.goto('/');

    const mapContainer = page.locator('div[role="region"] >> nth=0');
    await expect(mapContainer).toBeVisible();

    const markerIcons = page.locator('img[src$="map-pin.png"]');
    const count = await markerIcons.count();

    expect(count).toBeGreaterThan(0);
  });
});
