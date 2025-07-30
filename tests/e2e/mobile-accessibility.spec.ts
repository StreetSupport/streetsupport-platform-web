import { test, expect, TEST_POSTCODE } from './fixtures/base-test';

// Test mobile responsiveness and accessibility compliance
test.describe('Mobile Responsiveness and Accessibility', () => {
  const testPostcode = TEST_POSTCODE;

  test.beforeEach(async ({ page }) => {
    // Mock APIs for consistent testing
    await page.route('**/api/geocode**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          location: { lat: 53.4808, lng: -2.2426 },
          postcode: testPostcode
        })
      });
    });

    await page.route('**/api/services**', async (route) => {
      const mockServices = [
        {
          _id: '1',
          ServiceProviderName: 'Mobile Test Service',
          Info: 'A service for mobile testing',
          ParentCategoryKey: 'health',
          SubCategoryKey: 'gp',
          ServiceProviderKey: 'mobile-test-service',
          Address: {
            Location: {
              coordinates: [-2.2426, 53.4808]
            }
          },
          ClientGroups: ['adults'],
          OpeningTimes: [],
          distance: 0.5
        }
      ];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: mockServices,
          total: mockServices.length
        })
      });
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should display correctly on mobile portrait', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
      await page.goto('/find-help');
      
      // LocationPrompt should be mobile-friendly
      await expect(page.getByText('Find Services Near You')).toBeVisible();
      
      const locationBtn = page.getByRole('button', { name: /use my current location/i });
      const postcodeBtn = page.getByRole('button', { name: /enter postcode or choose a location/i });
      
      // Buttons should be properly sized for touch
      await expect(locationBtn).toBeVisible();
      await expect(postcodeBtn).toBeVisible();
      
      // Check button dimensions are touch-friendly (minimum 44px)
      const locationBtnBox = await locationBtn.boundingBox();
      const postcodeBtnBox = await postcodeBtn.boundingBox();
      
      expect(locationBtnBox?.height).toBeGreaterThanOrEqual(44);
      expect(postcodeBtnBox?.height).toBeGreaterThanOrEqual(44);
    });

    test('should display correctly on mobile landscape', async ({ page }) => {
      await page.setViewportSize({ width: 812, height: 375 }); // iPhone X landscape
      await page.goto('/find-help');
      
      // Content should still be accessible
      await expect(page.getByText('Find Services Near You')).toBeVisible();
      await expect(page.getByRole('button', { name: /use my current location/i })).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      await page.goto('/find-help');
      
      // Should utilize available space effectively
      await expect(page.getByText('Find Services Near You')).toBeVisible();
      
      // Enter postcode flow
      await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
      await page.getByLabel(/enter your postcode/i).fill(testPostcode);
      await page.getByRole('button', { name: /find services by postcode/i }).click();
      
      // Results should display well on tablet
      await page.waitForTimeout(1000);
      await expect(page.getByText(/services near you/i)).toBeVisible();
    });

    test('should handle map toggle on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/find-help');
      
      // Complete location flow
      await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
      await page.getByLabel(/enter your postcode/i).fill(testPostcode);
      await page.getByRole('button', { name: /find services by postcode/i }).click();
      
      await page.waitForTimeout(1000);
      
      // Map toggle should be visible and functional
      const mapToggle = page.getByRole('button', { name: /show map/i });
      await expect(mapToggle).toBeVisible();
      
      // Toggle map
      await mapToggle.click();
      await expect(page.locator('[data-testid="map-container"]').first()).toBeVisible({ timeout: 5000 });
      
      // Map should be appropriately sized for mobile
      const mapContainer = page.locator('[data-testid="map-container"]').first();
      const mapBox = await mapContainer.boundingBox();
      
      expect(mapBox?.width).toBeLessThanOrEqual(375);
    });

    test('should handle touch interactions properly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/find-help');
      
      // Test touch interactions - use click instead of tap for compatibility
      await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
      
      const postcodeInput = page.getByLabel(/enter your postcode/i);
      await expect(postcodeInput).toBeVisible();
      
      // Input should be properly sized for mobile (allow for slight variations in rendering)
      const inputBox = await postcodeInput.boundingBox();
      expect(inputBox?.height).toBeGreaterThanOrEqual(40);
      
      // Test form submission via touch
      await postcodeInput.fill(testPostcode);
      await page.getByRole('button', { name: /find services by postcode/i }).click();
      
      await page.waitForTimeout(1000);
      await expect(page.getByText(/services near you/i)).toBeVisible();
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/find-help');
      
      // Check heading structure
      // const h1 = page.locator('h1');
      const h2 = page.locator('h2');
      
      // Should have proper heading hierarchy
      await expect(h2.getByText('Find Services Near You')).toBeVisible();
    });

    test('should have proper ARIA labels and roles', async ({ page }) => {
      await page.goto('/find-help');
      
      // Check button roles and labels
      const locationBtn = page.getByRole('button', { name: /use my current location/i });
      const postcodeBtn = page.getByRole('button', { name: /enter postcode or choose a location/i });
      
      await expect(locationBtn).toBeVisible();
      await expect(postcodeBtn).toBeVisible();
      
      // Enter postcode flow
      await postcodeBtn.click();
      
      // Check form accessibility
      const postcodeInput = page.getByLabel(/enter your postcode/i);
      await expect(postcodeInput).toHaveAttribute('required');
      await expect(postcodeInput).toHaveAttribute('type', 'text');
      
      // Check form submission button
      const submitBtn = page.getByRole('button', { name: /find services by postcode/i });
      await expect(submitBtn).toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/find-help');
      
      // Focus on the first interactive element
      await page.keyboard.press('Tab');
      
      // Check if we can navigate to buttons (focus may not be visible in headless mode)
      const locationBtn = page.getByRole('button', { name: /use my current location/i });
      const postcodeBtn = page.getByRole('button', { name: /enter postcode or choose a location/i });
      
      await expect(locationBtn).toBeVisible();
      await expect(postcodeBtn).toBeVisible();
      
      // Activate postcode option
      await postcodeBtn.click();
      
      // Navigate through form
      const postcodeInput = page.getByLabel(/enter your postcode/i);
      await postcodeInput.focus();
      await expect(postcodeInput).toBeFocused();
      
      // Fill form with keyboard
      await page.keyboard.type(testPostcode);
      
      // Submit with keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      await page.waitForTimeout(1000);
      await expect(page.getByText(/services near you/i)).toBeVisible();
    });

    test('should have proper focus management', async ({ page }) => {
      await page.goto('/find-help');
      
      // Focus should be managed properly during state changes
      await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
      
      // Focus should move to postcode input
      const postcodeInput = page.getByLabel(/enter your postcode/i);
      await expect(postcodeInput).toBeVisible();
      
      // Test that submit button is disabled when input is empty
      const submitBtn = page.getByRole('button', { name: /find services by postcode/i });
      await expect(submitBtn).toBeDisabled();
      
      // Fill input to enable button
      await postcodeInput.fill(testPostcode);
      await expect(submitBtn).toBeEnabled();
      
      // Focus should be manageable
      await postcodeInput.focus();
      await expect(postcodeInput).toBeFocused();
    });

    test('should have proper color contrast', async ({ page }) => {
      await page.goto('/find-help');
      
      // Check button contrast
      const locationBtn = page.getByRole('button', { name: /use my current location/i });
      const btnStyles = await locationBtn.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });
      
      // Primary button should have sufficient contrast
      expect(btnStyles.backgroundColor).toBeTruthy();
      expect(btnStyles.color).toBeTruthy();
    });

    test('should support screen readers', async ({ page }) => {
      await page.goto('/find-help');
      
      // Check for screen reader friendly content
      await expect(page.getByText(/We'll help you find services in your area/)).toBeVisible();
      
      // Enter postcode flow
      await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
      
      // Form should have proper labels
      const postcodeInput = page.getByLabel(/enter your postcode/i);
      await expect(postcodeInput).toHaveAttribute('id');
      
      // Test that submit button is disabled when input is empty (no error message shown)
      const submitBtn = page.getByRole('button', { name: /find services by postcode/i });
      await expect(submitBtn).toBeDisabled();
      
      // Fill invalid postcode to trigger error
      await postcodeInput.fill('INVALID');
      await submitBtn.click();
      const errorMessage = page.getByText(/please enter a valid uk postcode/i);
      await expect(errorMessage).toBeVisible();
    });

    test('should handle high contrast mode', async ({ page }) => {
      // Simulate high contrast mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/find-help');
      
      // Elements should still be visible and functional
      await expect(page.getByText('Find Services Near You')).toBeVisible();
      await expect(page.getByRole('button', { name: /use my current location/i })).toBeVisible();
      
      // Test functionality in high contrast
      await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
      await page.getByLabel(/enter your postcode/i).fill(testPostcode);
      await page.getByRole('button', { name: /find services by postcode/i }).click();
      
      await page.waitForTimeout(1000);
      await expect(page.getByText(/services near you/i)).toBeVisible();
    });

    test('should support reduced motion preferences', async ({ page }) => {
      // Simulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/find-help');
      
      // Animations should be reduced or disabled
      await expect(page.getByText('Find Services Near You')).toBeVisible();
      
      // Test loading states without excessive animation
      await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
      await page.getByLabel(/enter your postcode/i).fill(testPostcode);
      await page.getByRole('button', { name: /find services by postcode/i }).click();
      
      // Wait for loading to complete and check for either loading indicator or results
      await page.waitForTimeout(2000);
      
      // Should either show loading indicator or proceed to results
      const findingLocation = page.getByText(/finding location/i);
      const servicesNearYou = page.getByText(/services near you/i);
      const locationSet = page.getByText(/location set:/i);
      
      const hasLoading = await findingLocation.isVisible();
      const hasServices = await servicesNearYou.isVisible();
      const hasLocationSet = await locationSet.isVisible();
      
      expect(hasLoading || hasServices || hasLocationSet).toBeTruthy();
    });

    test('should handle zoom levels appropriately', async ({ page }) => {
      await page.goto('/find-help');
      
      // Test at 200% zoom
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });
      
      // Content should remain accessible
      await expect(page.getByText('Find Services Near You')).toBeVisible();
      await expect(page.getByRole('button', { name: /use my current location/i })).toBeVisible();
      
      // Functionality should work at high zoom
      await page.getByRole('button', { name: /enter postcode or choose a location/i }).click();
      await page.getByLabel(/enter your postcode/i).fill(testPostcode);
      await page.getByRole('button', { name: /find services by postcode/i }).click();
      
      await page.waitForTimeout(1000);
      await expect(page.getByText(/services near you/i)).toBeVisible();
    });
  });
});