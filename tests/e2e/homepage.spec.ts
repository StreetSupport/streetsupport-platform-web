import { test, expect } from './fixtures/base-test';

test.describe('Homepage Map', () => {
  test('should render the map and show location markers', async ({ page }) => {
    await page.goto('/');

    // Wait for the map container
    const mapContainer = page.locator('div[role="region"] >> nth=0');
    await expect(mapContainer).toBeVisible();

    // Wait for at least one marker icon to appear
    const markerIcons = page.locator('img[src$="map-pin.png"]');
    await expect(markerIcons.first()).toBeVisible({ timeout: 5000 });

    const count = await markerIcons.count();
    expect(count).toBeGreaterThan(0);
  });
});
