import { test, expect } from '@playwright/test';

test.describe('SWEP (Severe Weather Emergency Protocol) Functionality', () => {
  const mockActiveSwepData = {
    id: 'swep-manchester-1',
    locationSlug: 'manchester',
    title: 'Severe Weather Emergency Protocol - Manchester',
    body: `<p>Due to severe weather conditions, additional emergency accommodation and support services are now available in Manchester.</p>
    <h3>Emergency Accommodation</h3>
    <ul>
      <li>Emergency shelter spaces available at several locations across the city</li>
      <li>No appointment necessary - walk-in service available</li>
      <li>Hot meals and warm drinks provided</li>
    </ul>`,
    image: '/assets/img/swep-manchester.jpg',
    shortMessage: 'Emergency accommodation and services are available due to severe weather conditions.',
    swepActiveFrom: '2024-01-15T18:00:00Z',
    swepActiveUntil: '2024-01-18T09:00:00Z',
    isActive: true
  };

  const mockInactiveSwepData = {
    ...mockActiveSwepData,
    isActive: false
  };

  test.describe('SWEP Banner on Location Pages', () => {
    test('displays SWEP banner when SWEP is active', async ({ page }) => {
      // Mock the SWEP API endpoint to return active SWEP data
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockActiveSwepData,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      // Navigate to Manchester location page
      await page.goto('/manchester');

      // Wait for the page to load and SWEP data to be fetched
      await page.waitForLoadState('networkidle');

      // Check that SWEP banner is visible
      await expect(page.getByText('Severe Weather Emergency Protocol (SWEP) Active')).toBeVisible();
      await expect(page.getByText('Emergency accommodation and services are available due to severe weather conditions.')).toBeVisible();
      
      // Check that the banner has correct styling
      const banner = page.locator('.bg-brand-g').first();
      await expect(banner).toBeVisible();
      
      // Check that the "View SWEP Information" link is present and correct
      const swepLink = page.getByRole('link', { name: 'View SWEP Information' });
      await expect(swepLink).toBeVisible();
      await expect(swepLink).toHaveAttribute('href', '/manchester/swep');
    });

    test('does not display SWEP banner when SWEP is inactive', async ({ page }) => {
      // Mock the SWEP API endpoint to return inactive SWEP data
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockInactiveSwepData,
              isActive: false,
              location: 'manchester'
            }
          })
        });
      });

      // Navigate to Manchester location page
      await page.goto('/manchester');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check that SWEP banner is not visible
      await expect(page.getByText('Severe Weather Emergency Protocol (SWEP) Active')).not.toBeVisible();
    });

    test('does not display SWEP banner when no SWEP data exists', async ({ page }) => {
      // Mock the SWEP API endpoint to return no SWEP data
      await page.route('**/api/locations/leeds/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: null,
              isActive: false,
              location: 'leeds'
            }
          })
        });
      });

      // Navigate to Leeds location page (which has no SWEP data)
      await page.goto('/leeds');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check that SWEP banner is not visible
      await expect(page.getByText('Severe Weather Emergency Protocol (SWEP) Active')).not.toBeVisible();
    });

    test('SWEP banner appears below hero section', async ({ page }) => {
      // Mock active SWEP data
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockActiveSwepData,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      await page.goto('/manchester');
      await page.waitForLoadState('networkidle');

      // Check that hero section exists
      await expect(page.getByText('Street Support Manchester')).toBeVisible();
      
      // Check that SWEP banner appears after hero
      const hero = page.locator('.hero-section');
      const swepBanner = page.locator('.bg-brand-g').first();
      
      await expect(hero).toBeVisible();
      await expect(swepBanner).toBeVisible();
      
      // Check vertical order (SWEP banner should be after hero in DOM)
      const heroBox = await hero.boundingBox();
      const bannerBox = await swepBanner.boundingBox();
      
      if (heroBox && bannerBox) {
        expect(bannerBox.y).toBeGreaterThan(heroBox.y);
      }
    });
  });

  test.describe('SWEP Information Page', () => {
    test('displays SWEP information page when SWEP is active', async ({ page }) => {
      // Mock active SWEP data
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockActiveSwepData,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      // Navigate directly to SWEP page
      await page.goto('/manchester/swep');
      await page.waitForLoadState('networkidle');

      // Check that page loads successfully (not 404)
      await expect(page.getByText('Severe Weather Emergency Protocol - Manchester')).toBeVisible();
      
      // Check that active period is displayed
      await expect(page.getByText(/SWEP is currently active from/)).toBeVisible();
      
      // Check that body content is displayed
      await expect(page.getByText('Emergency shelter spaces available')).toBeVisible();
      
      // Check emergency contacts section
      await expect(page.getByText('Emergency Contacts')).toBeVisible();
      await expect(page.getByText('Call 999')).toBeVisible();
      await expect(page.getByText('Report via StreetLink')).toBeVisible();
    });

    test('returns 404 when SWEP is inactive', async ({ page }) => {
      // Mock inactive SWEP data
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockInactiveSwepData,
              isActive: false,
              location: 'manchester'
            }
          })
        });
      });

      // Navigate to SWEP page
      const response = await page.goto('/manchester/swep');
      
      // Should return 404 status
      expect(response?.status()).toBe(404);
    });

    test('returns 404 when no SWEP data exists', async ({ page }) => {
      // Mock no SWEP data
      await page.route('**/api/locations/leeds/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: null,
              isActive: false,
              location: 'leeds'
            }
          })
        });
      });

      // Navigate to SWEP page for location without SWEP data
      const response = await page.goto('/leeds/swep');
      
      // Should return 404 status
      expect(response?.status()).toBe(404);
    });

    test('displays image when provided', async ({ page }) => {
      // Mock SWEP data with image
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockActiveSwepData,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      await page.goto('/manchester/swep');
      await page.waitForLoadState('networkidle');

      // Check that image is displayed
      const image = page.locator('img[alt*="SWEP information"]');
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('src', '/assets/img/swep-manchester.jpg');
    });

    test('works without image when not provided', async ({ page }) => {
      // Mock SWEP data without image
      const swepDataWithoutImage = { ...mockActiveSwepData };
      delete swepDataWithoutImage.image;

      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: swepDataWithoutImage,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      await page.goto('/manchester/swep');
      await page.waitForLoadState('networkidle');

      // Page should still load successfully
      await expect(page.getByText('Severe Weather Emergency Protocol - Manchester')).toBeVisible();
      
      // Image should not be present
      const image = page.locator('img[alt*="SWEP information"]');
      await expect(image).not.toBeVisible();
    });

    test('has correct breadcrumb navigation', async ({ page }) => {
      // Mock active SWEP data
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockActiveSwepData,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      await page.goto('/manchester/swep');
      await page.waitForLoadState('networkidle');

      // Check breadcrumb structure
      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Manchester' })).toBeVisible();
      await expect(page.getByText('SWEP Information')).toBeVisible();
      
      // Test breadcrumb navigation
      await page.getByRole('link', { name: 'Manchester' }).click();
      await expect(page).toHaveURL('/manchester');
    });
  });

  test.describe('SWEP Navigation Flow', () => {
    test('can navigate from SWEP banner to SWEP information page', async ({ page }) => {
      // Mock active SWEP data for both requests
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockActiveSwepData,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      // Start on Manchester location page
      await page.goto('/manchester');
      await page.waitForLoadState('networkidle');

      // Click on SWEP banner link
      await page.getByRole('link', { name: 'View SWEP Information' }).click();

      // Should navigate to SWEP page
      await expect(page).toHaveURL('/manchester/swep');
      await expect(page.getByText('Severe Weather Emergency Protocol - Manchester')).toBeVisible();
    });

    test('SWEP banner link has proper accessibility attributes', async ({ page }) => {
      // Mock active SWEP data
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockActiveSwepData,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      await page.goto('/manchester');
      await page.waitForLoadState('networkidle');

      const swepLink = page.getByRole('link', { name: 'View SWEP Information' });
      
      // Check that link is focusable and has proper styling
      await swepLink.focus();
      await expect(swepLink).toBeFocused();
      
      // Check keyboard navigation works
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/manchester/swep');
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('SWEP banner displays correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Mock active SWEP data
      await page.route('**/api/locations/manchester/swep', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: {
              swep: mockActiveSwepData,
              isActive: true,
              location: 'manchester'
            }
          })
        });
      });

      await page.goto('/manchester');
      await page.waitForLoadState('networkidle');

      // Check that SWEP banner is visible and properly formatted on mobile
      await expect(page.getByText('Severe Weather Emergency Protocol (SWEP) Active')).toBeVisible();
      await expect(page.getByRole('link', { name: 'View SWEP Information' })).toBeVisible();
      
      // Check that banner doesn't overflow viewport
      const banner = page.locator('.bg-brand-g').first();
      const bannerBox = await banner.boundingBox();
      
      if (bannerBox) {
        expect(bannerBox.width).toBeLessThanOrEqual(375);
      }
    });
  });
});