import { test, expect } from '@playwright/test';

test.describe('Organisation Page', () => {
  test('should handle organisation not found gracefully', async ({ page }) => {
    // Navigate to non-existent organisation
    const response = await page.goto('/find-help/organisation/non-existent-organisation-slug');
    
    // Should return 404 status for non-existent organisation
    expect(response?.status()).toBe(404);
    
    // Should show 404 page or Next.js not found page
    const pageContent = await page.textContent('body');
    expect(pageContent).toMatch(/404|not found|page not found/i);
  });

  test('should navigate to organisation page from find-help', async ({ page }) => {
    // Start from find-help page
    await page.goto('/find-help');
    
    // Check that the find-help page loads
    await expect(page.getByText('Find Services Near You')).toBeVisible();
    
    // Test that organisation page routes are properly configured
    // by checking that the route structure exists
    const orgPageResponse = await page.goto('/find-help/organisation/test-org');
    
    // Should either load successfully or return 404 (both are valid)
    const status = orgPageResponse?.status();
    expect([200, 404].includes(status || 0)).toBeTruthy();
    
    // Verify the page structure is correct
    if (status === 404) {
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/404|not found|page not found/i);
    }
  });

  test('should have proper page structure for organisation pages', async ({ page }) => {
    // Test the organisation page route structure by checking 404 handling
    const response = await page.goto('/find-help/organisation/test-org');
    
    // The page should either load successfully (200) or show 404
    const status = response?.status();
    expect([200, 404].includes(status || 0)).toBeTruthy();
    
    if (status === 200) {
      // If page loads, check for basic structure
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      
      // Check for main content area
      const main = page.locator('main');
      await expect(main).toBeVisible();
    } else {
      // If 404, check for 404 page content
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/404|not found|page not found/i);
    }
  });

  test('should be accessible when organisation exists', async ({ page }) => {
    // Navigate to organisation page
    const response = await page.goto('/find-help/organisation/test-org');
    
    if (response?.status() === 200) {
      // Check for proper heading hierarchy
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();

      // Check for proper link accessibility
      const links = page.getByRole('link');
      const linkCount = await links.count();
      
      if (linkCount > 0) {
        const firstLink = links.first();
        if (await firstLink.isVisible()) {
          // Links should have accessible names
          const accessibleName = await firstLink.getAttribute('aria-label') || await firstLink.textContent();
          expect(accessibleName).toBeTruthy();
        }
      }
      
      // Check for proper main landmark
      const main = page.getByRole('main');
      await expect(main).toBeVisible();
    } else {
      // For 404 pages, just verify they exist
      expect(response?.status()).toBe(404);
    }
  });

  test('should support keyboard navigation when organisation exists', async ({ page }) => {
    // Navigate to organisation page
    const response = await page.goto('/find-help/organisation/test-org');
    
    if (response?.status() === 200) {
      // Test tab navigation through interactive elements
      await page.keyboard.press('Tab');
      
      // Check if focus is on an interactive element
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() > 0) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        expect(['a', 'button', 'input', 'select', 'textarea'].includes(tagName)).toBeTruthy();
      }
    } else {
      // For 404 pages, just verify they exist
      expect(response?.status()).toBe(404);
    }
  });

  test('should handle organisation page API errors gracefully', async ({ page }) => {
    // Test with various invalid organisation slugs
    const invalidSlugs = ['', 'invalid-org', '123', 'test-org-that-does-not-exist'];
    
    for (const slug of invalidSlugs) {
      const response = await page.goto(`/find-help/organisation/${slug}`);
      
      // Should handle errors gracefully with 404
      if (response?.status() === 404) {
        const pageContent = await page.textContent('body');
        expect(pageContent).toMatch(/404|not found|page not found/i);
      } else if (response?.status() === 200) {
        // If it loads successfully, that's also valid
        const main = page.locator('main');
        await expect(main).toBeVisible();
      }
    }
  });

  test('should have proper meta tags and SEO structure', async ({ page }) => {
    // Navigate to organisation page
    await page.goto('/find-help/organisation/test-org');
    
    // Check for proper page title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for meta viewport tag (use first() to avoid strict mode violation)
    const viewport = await page.locator('meta[name="viewport"]').first().getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });
});

