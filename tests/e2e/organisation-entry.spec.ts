import { test, expect } from '@playwright/test';

const slug = 'manchester-organisation-8d0eba';
const baseUrl = 'http://localhost:3000';
const orgUrl = `${baseUrl}/find-help/organisation/${slug}`;

test.describe('Organisation Entry Page', () => {
  test('loads and displays organisation details', async ({ page }) => {
    await page.goto(orgUrl);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/.+/);
    await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
    await expect(page.getByText(/Information provided/i)).toBeVisible();
  });

  test('accordions expand and collapse', async ({ page }) => {
    await page.goto(orgUrl);
    const accordionButtons = page.locator('button[aria-expanded]');

    const first = accordionButtons.first();
    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  test('displays correct organisation name in heading', async ({ page }) => {
    await page.goto(orgUrl);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText('Manchester Organisation 8d0eba');
  });


  test('footer disclaimer is visible', async ({ page }) => {
    await page.goto(orgUrl);
    await expect(page.getByText(/Information provided/i)).toBeVisible();
  });
});