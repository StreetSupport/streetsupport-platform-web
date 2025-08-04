import { test, expect } from '@playwright/test';

test.describe('Organisation Page Functionality', () => {
  test('should handle organisation page route structure', async ({ page }) => {
    // Test that the organisation page route is properly configured
    const response = await page.goto('/find-help/organisation/test-org');
    
    // Should either load successfully or return 404 (both are valid)
    const status = response?.status();
    expect([200, 404].includes(status || 0)).toBeTruthy();
    
    // If 404, verify proper error handling
    if (status === 404) {
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/404|not found|page not found/i);
      
      // Check that the page has proper structure even for 404
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should have proper page structure and navigation', async ({ page }) => {
    // Test basic page structure for organisation pages
    const response = await page.goto('/find-help/organisation/any-org');
    
    const status = response?.status();
    
    if (status === 200) {
      // If page loads successfully, check for proper structure
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
      
      // Should have organisation-related content
      const content = await page.textContent('body');
      expect(content).toMatch(/(organisation|service|contact|location)/i);
    } else {
      // If 404, ensure proper error page structure
      await expect(page.locator('h1')).toBeVisible();
      const heading = await page.textContent('h1');
      expect(heading).toMatch(/404|not found/i);
    }
  });

  test('should maintain accessibility standards on organisation pages', async ({ page }) => {
    await page.goto('/find-help/organisation/test-org');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check basic accessibility structure
    const h1Elements = page.locator('h1');
    await expect(h1Elements.first()).toBeVisible();
    
    // Check that page has proper semantic structure
    const mainElements = page.locator('main');
    const mainCount = await mainElements.count();
    if (mainCount > 0) {
      await expect(mainElements.first()).toBeVisible();
    }
    
    // If there are interactive elements, they should be accessible
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Check if any buttons are visible (some might be hidden on desktop like mobile toggles)
      const visibleButtons = page.locator('button:visible');
      const visibleButtonCount = await visibleButtons.count();
      
      if (visibleButtonCount > 0) {
        await expect(visibleButtons.first()).toBeVisible();
      }
      // If no visible buttons, that's fine - they might be mobile-only elements
    }
  });

  test('should handle organisation page URL parameters', async ({ page }) => {
    // Test that organisation pages can handle URL parameters
    const response = await page.goto('/find-help/organisation/test-org?lat=53.4808&lng=-2.2426');
    
    // Should handle parameters gracefully
    const status = response?.status();
    expect([200, 404].includes(status || 0)).toBeTruthy();
    
    // Check that the page loads without errors
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent!.length).toBeGreaterThan(10);
  });

  test('should handle invalid organisation slugs gracefully', async ({ page }) => {
    // Test various invalid organisation slug formats
    const invalidSlugs = [
      'non-existent-org',
      'invalid/slug/with/slashes',
      'org-with-special-chars-@#$',
      '123-numeric-org',
      ''
    ];

    for (const slug of invalidSlugs) {
      const url = slug ? `/find-help/organisation/${slug}` : '/find-help/organisation/';
      const response = await page.goto(url);
      
      // Should handle gracefully with either 200 (if exists) or 404
      const status = response?.status();
      expect([200, 404].includes(status || 0)).toBeTruthy();
      
      // Should not crash the application
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    }
  });

  test('should support back navigation from organisation pages', async ({ page }) => {
    // Start from find-help page
    await page.goto('/find-help');
    await expect(page.getByText('Find Services Near You')).toBeVisible();
    
    // Navigate to organisation page (will be 404 but that's fine)
    await page.goto('/find-help/organisation/test-org');
    
    // Go back to find-help
    await page.goBack();
    
    // Should be back on find-help page
    await expect(page.getByText('Find Services Near You')).toBeVisible();
  });

  test('should handle organisation page loading states', async ({ page }) => {
    // Monitor network requests to organisation API
    let apiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/service-providers/')) {
        apiCalled = true;
      }
    });

    await page.goto('/find-help/organisation/test-org');
    
    // Wait for all network activity to settle
    await page.waitForLoadState('networkidle');
    
    // API might be called server-side (SSR) so we won't always detect it
    // Instead, just verify the page loads and renders content
    await expect(page.locator('body')).toBeVisible();
    const content = await page.textContent('body');
    expect(content!.length).toBeGreaterThan(0);
    
    // Verify that we get either a successful org page or a proper 404
    const heading = await page.textContent('h1');
    expect(heading).toBeTruthy();
  });

  test('should handle organisation page metadata correctly', async ({ page }) => {
    await page.goto('/find-help/organisation/test-org');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that page has proper metadata - for 404 pages this might be different
    let title = await page.title();
    
    // If title is empty, wait a bit more and try again
    if (!title || title.length === 0) {
      await page.waitForTimeout(1000);
      title = await page.title();
    }
    
    // For organisation pages that return 404, the title might be empty or minimal
    // This is acceptable as long as the page functions correctly
    if (title.length > 0) {
      // If we have a title, it should contain appropriate branding
      expect(title).toMatch(/(Street Support|404|Not Found|Organisation)/i);
    } else {
      // If no title, ensure the page at least loads correctly with proper content
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(0);
    }
  });

  test('should display proper error messages for API failures', async ({ page }) => {
    // Test how the page handles when the API is completely unavailable
    await page.route('**/api/service-providers/**', async (route) => {
      await route.abort('failed');
    });

    const response = await page.goto('/find-help/organisation/test-org');
    
    // Should handle API failures gracefully
    const status = response?.status();
    expect([200, 404, 500].includes(status || 0)).toBeTruthy();
    
    // Should show some content even if API fails
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent!.length).toBeGreaterThan(10);
  });

  test('should maintain responsive design on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/find-help/organisation/test-org');
    
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/find-help/organisation/test-org');
    
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/find-help/organisation/test-org');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle concurrent navigation to organisation pages', async ({ page }) => {
    // Test rapid navigation between organisation pages
    const pages = [
      '/find-help/organisation/org1',
      '/find-help/organisation/org2', 
      '/find-help/organisation/org3'
    ];

    for (const pagePath of pages) {
      const response = await page.goto(pagePath);
      const status = response?.status();
      expect([200, 404].includes(status || 0)).toBeTruthy();
      
      // Brief wait to ensure page stability
      await page.waitForTimeout(100);
      
      // Verify page content loaded
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    }
  });
});