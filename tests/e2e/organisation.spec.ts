import { test, expect } from './fixtures/test-fixtures';

test.describe('Organisation Pages', () => {
  test('non-existent organisation returns 404', async ({ page }) => {
    const response = await page.goto('/find-help/organisation/non-existent-organisation-xyz');

    expect(response?.status()).toBe(404);
  });

  test('organisation page has correct heading structure', async ({ page }) => {
    const response = await page.goto('/find-help/organisation/booth-centre');

    // Skip if no database connection (CI/PR environment)
    test.skip(response?.status() === 404, 'Database not available — skipping organisation page test');

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('back navigation from organisation page works', async ({ page }) => {
    await page.goto('/find-help');

    const response = await page.goto('/find-help/organisation/booth-centre');

    // Skip if no database connection (CI/PR environment)
    test.skip(response?.status() === 404, 'Database not available — skipping organisation page test');

    await page.goBack();

    await expect(page.getByText('Find Services Near You')).toBeVisible();
  });
});
