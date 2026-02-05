import { test, expect } from './fixtures/test-fixtures';

test.describe('Organisation Pages', () => {
  test('non-existent organisation returns 404', async ({ page }) => {
    const response = await page.goto('/find-help/organisation/non-existent-organisation-xyz');

    expect(response?.status()).toBe(404);
  });

  test('organisation page has correct heading structure', async ({ page }) => {
    await page.route('**/api/service-providers/test-org**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          organisation: {
            Key: 'test-org',
            Name: 'Test Organisation',
            ShortDescription: 'A test organisation providing support services',
            IsVerified: true,
            IsPublished: true,
            Website: 'https://example.com',
            Telephone: '0161 123 4567',
            Email: 'info@test.org'
          },
          services: []
        })
      });
    });

    await page.goto('/find-help/organisation/test-org');

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('back navigation from organisation page works', async ({ page }) => {
    await page.route('**/api/service-providers/test-org**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          organisation: {
            Key: 'test-org',
            Name: 'Test Organisation',
            ShortDescription: 'A test organisation',
            IsVerified: true,
            IsPublished: true
          },
          services: []
        })
      });
    });

    await page.goto('/find-help');
    await page.goto('/find-help/organisation/test-org');
    await page.goBack();

    await expect(page.getByText('Find Services Near You')).toBeVisible();
  });
});
