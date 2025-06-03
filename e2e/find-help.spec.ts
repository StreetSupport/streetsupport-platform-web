import { test, expect } from '@playwright/test';

test.describe('Find Help Page', () => {

  test('should load the Find Help page and show fallback form when geolocation is blocked', async ({ context, page }) => {
    await context.grantPermissions([], { origin: 'http://localhost:3000' });
    await page.goto('/find-help');

    await expect(page.getByRole('heading', { name: /find help near you/i })).toBeVisible();
    await expect(page.getByLabel('Enter your postcode')).toBeVisible();
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
  });

  test('should allow postcode entry and show service results', async ({ context, page }) => {
    await context.grantPermissions([], { origin: 'http://localhost:3000' });
    await page.goto('/find-help');

    await page.getByLabel('Enter your postcode').fill('M1 1AE');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page.getByText(/services near you/i)).toBeVisible();
  });

  test('should allow selecting category and subcategory', async ({ context, page }) => {
    await context.grantPermissions([], { origin: 'http://localhost:3000' });

    await page.route('/api/get-categories', async (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            key: 'health',
            name: 'Health',
            subCategories: [
              { key: 'gp', name: 'GP' },
              { key: 'dentist', name: 'Dentist' }
            ],
          },
        ]),
      });
    });

    await page.goto('/find-help');

    await page.getByLabel('Enter your postcode').fill('M1 1AE');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page.getByLabel('Category')).toBeVisible();
    await page.locator('#category').selectOption('health');

    await expect(page.getByLabel('Subcategory')).toBeVisible();
    await page.selectOption('#subCategory', 'gp');
  });

  test('should toggle map visibility', async ({ context, page }) => {
    await context.grantPermissions([], { origin: 'http://localhost:3000' });
    await page.goto('/find-help');

    await page.getByLabel('Enter your postcode').fill('M1 1AE');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByRole('button', { name: /show map/i }).click();
    await expect(page.getByText('🗺️ Map is toggled ON')).toBeVisible();
  });

  test('should show service cards when services are matched', async ({ context, page }) => {
    await context.setGeolocation({ latitude: 53.4808, longitude: -2.2426 });
    await context.grantPermissions(['geolocation']);
    await page.goto('/find-help');

    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible();
  });

});