import { test, expect } from '@playwright/test';

test.describe('Find Help Page', () => {
  test('loads and shows postcode input', async ({ page }) => {
    await page.goto('/find-help');

    await expect(page.getByLabel('Enter your postcode')).toBeVisible();
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
  });
});
