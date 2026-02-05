import { test, expect } from '@playwright/test';

test.describe('Location Journey', () => {
  test('view location page content', async ({ page }) => {
    await page.goto('/manchester');

    // Should show location name
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/manchester/i);

    // Should show main content
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('navigate to find-help from location page', async ({ page }) => {
    await page.goto('/manchester');

    // Click find help link/button
    await page.getByRole('link', { name: /find help/i }).first().click();

    // Should be on find-help
    await expect(page).toHaveURL(/find-help/);
  });

  test('homepage location selector', async ({ page }) => {
    await page.goto('/');

    // Find and use location selector
    const locationLink = page.getByRole('link', { name: /manchester/i }).first();

    if (await locationLink.isVisible()) {
      await locationLink.click();
      await expect(page).toHaveURL(/manchester/);
    }
  });
});
