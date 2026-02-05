import { test, expect } from './fixtures/test-fixtures';

test.describe('Forms', () => {
  test('organisation request form shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/organisation-request-form');

    await page.getByRole('button', { name: /submit request/i }).click();

    await expect(page.getByText(/organisation name/i).first()).toBeVisible();
    const errorMessages = page.locator('.text-brand-g');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('form fields have proper accessibility labels', async ({ page }) => {
    await page.goto('/organisation-request-form');

    await expect(page.getByLabel(/organisation name/i)).toBeVisible();
    await expect(page.getByLabel(/organisation email/i)).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/locations served/i)).toBeVisible();
  });

  test('form can be submitted with valid data (mocked API response)', async ({ page }) => {
    await page.goto('/organisation-request-form');

    await page.getByLabel(/organisation name/i).fill('Test Organisation');
    await page.getByLabel(/organisation email/i).fill('test@example.org');
    await page.getByLabel(/phone/i).first().fill('0161 123 4567');

    const locationsSelect = page.getByLabel(/locations served/i);
    await locationsSelect.selectOption({ index: 0 });

    await page.getByLabel(/full name/i).fill('Test Person');
    await page.locator('#contact-email').fill('contact@example.org');

    await page.locator('#service-0-title').fill('Test Service');
    await page.locator('#service-0-description').fill('A test service description');
    await page.locator('#service-0-category').selectOption({ index: 1 });

    await page.waitForTimeout(500);
    const subcategorySelect = page.locator('#service-0-subcategory');
    if (await subcategorySelect.isEnabled()) {
      await subcategorySelect.selectOption({ index: 1 });
    }

    await page.locator('#service-0-address').fill('123 Test Street, Manchester');
    await page.locator('#service-0-open247').check();

    await page.getByLabel(/i confirm the information is accurate/i).check();

    await page.getByRole('button', { name: /submit request/i }).click();

    await expect(page.getByRole('heading', { name: /request submitted/i })).toBeVisible({ timeout: 10000 });
  });
});
