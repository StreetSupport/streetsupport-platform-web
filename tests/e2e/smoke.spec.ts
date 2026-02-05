import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Street Support/);
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('find-help page loads', async ({ page }) => {
    await page.goto('/find-help');
    await expect(page.getByRole('heading', { name: /find/i })).toBeVisible();
  });

  test('location page loads', async ({ page }) => {
    await page.goto('/manchester');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('invalid route shows 404', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-12345');
    expect(response?.status()).toBe(404);
  });
});
