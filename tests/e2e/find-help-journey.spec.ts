import { test, expect, TEST_POSTCODE } from './fixtures/test-fixtures';

test.describe('Find Help Journey', () => {
  test('user can find services via postcode entry', async ({ page }) => {
    await page.goto('/find-help');

    await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
    await page.getByLabel(/enter your postcode/i).fill(TEST_POSTCODE);
    await page.getByRole('button', { name: /find services by postcode/i }).click();

    await expect(page.getByRole('heading', { name: /services near you/i })).toBeVisible({ timeout: 10000 });
  });

  test('services list displays with name and category', async ({ page }) => {
    await page.goto('/find-help');

    await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
    await page.getByLabel(/enter your postcode/i).fill(TEST_POSTCODE);
    await page.getByRole('button', { name: /find services by postcode/i }).click();

    await expect(page.getByRole('heading', { name: /services near you/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Test Health Service').first()).toBeVisible();
    await expect(page.getByText('Test Support Service').first()).toBeVisible();
  });

  test('location prompt shows both options (geolocation/postcode)', async ({ page }) => {
    await page.goto('/find-help');

    await expect(page.getByText('Find Services Near You')).toBeVisible();
    await expect(page.getByRole('button', { name: /use my current location/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /enter postcode or choose a location/i })).toBeVisible();
  });

  test('invalid postcode shows validation error', async ({ page }) => {
    await page.goto('/find-help');

    await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
    await page.getByLabel(/enter your postcode/i).fill('INVALID');
    await page.getByRole('button', { name: /find services by postcode/i }).click();

    await expect(page.getByText(/please enter a valid uk postcode/i)).toBeVisible();
  });

  test('users can toggle map visibility', async ({ page }) => {
    await page.goto('/find-help');

    await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
    await page.getByLabel(/enter your postcode/i).fill(TEST_POSTCODE);
    await page.getByRole('button', { name: /find services by postcode/i }).click();

    await expect(page.getByRole('heading', { name: /services near you/i })).toBeVisible({ timeout: 10000 });

    const showMapBtn = page.getByRole('button', { name: /show map/i });
    await expect(showMapBtn).toBeVisible({ timeout: 5000 });
    await showMapBtn.evaluate((el: HTMLElement) => el.click());

    const mapContainer = page.locator('[data-testid="map-container"]').first();
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    const hideMapBtn = page.getByRole('button', { name: /hide map/i });
    await expect(hideMapBtn).toBeVisible({ timeout: 5000 });
    await hideMapBtn.evaluate((el: HTMLElement) => el.click());

    await expect(mapContainer).not.toBeVisible({ timeout: 5000 });
  });
});
