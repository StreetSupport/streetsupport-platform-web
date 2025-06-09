import { test, expect } from '@playwright/test';

const slug = 'manchester-organisation-8d0eba';

async function enterPostcode(page) {
  await page.goto('/find-help');
  await page.getByLabel(/postcode/i).fill('LN4 2LE');
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);
}

test.describe('Organisation pages', () => {
  test('loads organisation details directly', async ({ page }) => {
    await page.goto(`/find-help/organisation/${slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Organisation');
  });

  test('service card links to organisation page', async ({ page }) => {
    await enterPostcode(page);
    await page.locator('a[href^="/find-help/organisation/"]').first().click();
    await expect(page).toHaveURL(/\/find-help\/organisation\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
