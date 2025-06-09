import { test, expect } from '@playwright/test';

test.describe.skip('Organisation pages', () => {

const slug = 'manchester-organisation-8d0eba';

async function enterPostcode(page) {
  await page.route('**/api/geocode?**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ location: { lat: 53, lng: -2 } }),
    });
  });
  await page.goto('/find-help');
  await page.getByLabel(/postcode/i).fill('LN4 2LE');
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);
}

  test('loads organisation details directly', async ({ page }) => {
    await page.goto(`/find-help/organisation/${slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Organisation');
  });

  test('service card links to organisation page', async ({ page }) => {
    await enterPostcode(page);
    const link = page.locator('a[href^="/find-help/organisation/"]').first();
    await expect(link).toBeVisible();
  });
});
