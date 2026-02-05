import { test, expect } from './fixtures/test-fixtures';

test.describe('Smoke Tests', () => {
  test('homepage loads with hero, location dropdown, and statistics', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /working together to tackle homelessness/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /find help/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /where we are/i })).toBeVisible();
    await expect(page.getByText(/organisations/i).first()).toBeVisible();
    await expect(page.getByText(/services/i).first()).toBeVisible();
  });

  test('Find Help page loads with LocationPrompt', async ({ page }) => {
    await page.goto('/find-help');

    await expect(page.getByText('Find Services Near You')).toBeVisible();
    await expect(page.getByRole('button', { name: /use my current location/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /enter postcode or choose a location/i })).toBeVisible();
  });

  test('Contact page loads with heading and email link', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByRole('heading', { name: /contact us/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /admin@streetsupport.net/i })).toBeVisible();
  });

  test('Organisation request form loads with form elements', async ({ page }) => {
    await page.goto('/organisation-request-form');

    await expect(page.getByRole('heading', { name: /organisation request/i })).toBeVisible();
    await expect(page.getByLabel(/organisation name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /submit request/i })).toBeVisible();
  });
});
