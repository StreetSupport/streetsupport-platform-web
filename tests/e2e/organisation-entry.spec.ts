// tests/e2e/organisation-entry.spec.ts

import { test, expect } from '@playwright/test';

// ⚠️ Update this slug to one that definitely exists in your test data or mock environment
const slug = 'the-men39s-room';  
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const orgUrl = `${baseUrl}/find-help/organisation/${slug}`;

test.describe('Organisation Entry Page', () => {
  // Increase timeout to allow page to fully load if needed
  test.setTimeout(15000);

  test('loads and displays organisation details', async ({ page }) => {
    await page.goto(orgUrl);

    // Debug helper (uncomment to debug page content)
    // console.log(await page.content());

    // Check main heading is visible and not empty
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).not.toHaveText('');

    // Check subheadings — case insensitive match, adjust if your markup differs
    await expect(page.getByRole('heading', { name: /Locations/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Services/i, level: 2 })).toBeVisible();

    // Check footer disclaimer or info text is visible
    await expect(page.getByText(/Information provided/i)).toBeVisible();
  });

  test('accordions expand and collapse', async ({ page }) => {
    await page.goto(orgUrl);
    const accordionButtons = page.locator('button[aria-expanded]');
    const first = accordionButtons.first();

    // Expand accordion
    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    // Collapse accordion
    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  test('displays correct organisation name in heading', async ({ page }) => {
    await page.goto(orgUrl);

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(/The Men(?:'|&#39;)s Room/i);
  });

  test('footer disclaimer is visible', async ({ page }) => {
    await page.goto(orgUrl);
    await expect(page.getByText(/Information provided/i)).toBeVisible();
  });
});
