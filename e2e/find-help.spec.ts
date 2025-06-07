import { test, expect } from '@playwright/test';

const mockServices = [
  {
    id: 'org-1',
    name: 'Mock Org',
    latitude: 53.4808,
    longitude: -2.2426,
    verified: true,
    services: [
      {
        id: 'service-1',
        name: 'Mock Service A',
        category: 'health',
        subCategory: 'gp',
        description: 'Test service A',
        openTimes: [],
        clientGroups: ['all'],
        latitude: 53.4808,
        longitude: -2.2426,
      },
      {
        id: 'service-2',
        name: 'Mock Service B',
        category: 'health',
        subCategory: 'dentist',
        description: 'Test service B',
        openTimes: [],
        clientGroups: ['all'],
        latitude: 53.5000,
        longitude: -2.2426,
      }
    ]
  }
];

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
    await page.route('/api/get-services', (route) => {
      route.fulfill({ body: JSON.stringify(mockServices) });
    });
    await page.goto('/find-help');

    await page.getByLabel('Enter your postcode').fill('M1 1AE');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page.getByText(/services near you/i)).toBeVisible();
  });

  test('should allow selecting category and subcategory', async ({ context, page }) => {
    await context.grantPermissions([], { origin: 'http://localhost:3000' });

    await page.route('/api/get-services', (route) => {
      route.fulfill({ body: JSON.stringify(mockServices) });
    });

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

  test('should show service cards when services are matched', async ({ context, page }) => {
    await context.setGeolocation({ latitude: 53.4808, longitude: -2.2426 });
    await context.grantPermissions(['geolocation']);
    await page.route('/api/get-services', (route) => {
      route.fulfill({ body: JSON.stringify(mockServices) });
    });
    await page.goto('/find-help');

    await expect(page.locator('[data-testid="service-card"]').first()).toBeVisible();
  });

  test('should update services when radius is changed', async ({ context, page }) => {
    await context.setGeolocation({ latitude: 53.4808, longitude: -2.2426 });
    await context.grantPermissions(['geolocation']);
    await page.route('/api/get-services', (route) => {
      route.fulfill({ body: JSON.stringify(mockServices) });
    });
    await page.goto('/find-help');

    await expect(page.locator('[data-testid="service-card"]')).toHaveCount(2);
    await page.selectOption('#radius', '1');
    await expect(page.locator('[data-testid="service-card"]')).toHaveCount(1);
  });

  test('should change sort order to alphabetical', async ({ context, page }) => {
    await context.setGeolocation({ latitude: 53.4808, longitude: -2.2426 });
    await context.grantPermissions(['geolocation']);
    await page.route('/api/get-services', (route) => {
      route.fulfill({ body: JSON.stringify(mockServices) });
    });
    await page.goto('/find-help');

    await page.selectOption('#sortOrder', 'alpha');
    const names = await page.$$eval('[data-testid="service-name"]', els => els.map(e => e.textContent));
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('should toggle map visibility', async ({ context, page }) => {
    await context.setGeolocation({ latitude: 53.4808, longitude: -2.2426 });
    await context.grantPermissions(['geolocation']);
    await page.route('/api/get-services', (route) => {
      route.fulfill({ body: JSON.stringify(mockServices) });
    });
    await page.goto('/find-help');

    await expect(page.locator('[data-testid="service-card"]')).toHaveCount(2);
    await page.waitForSelector('button:has-text("Show Map")');
    await page.getByRole('button', { name: /show map/i }).click();
    await expect(page.getByRole('button', { name: /hide map/i })).toBeVisible();

    await page.getByRole('button', { name: /hide map/i }).click();
    await expect(page.getByRole('button', { name: /show map/i })).toBeVisible();
  });

  test('should handle failed geocode response gracefully', async ({ context, page }) => {
    await context.grantPermissions([], { origin: 'http://localhost:3000' });
    await page.route('/api/get-services', (route) => {
      route.fulfill({ body: JSON.stringify(mockServices) });
    });
    await page.route('/api/geocode?postcode=M1%201AE', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid postcode' })
      });
    });

    await page.goto('/find-help');
    await page.getByLabel('Enter your postcode').fill('M1 1AE');
    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: /continue/i }).click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Invalid postcode');
    await dialog.dismiss();
  });

});