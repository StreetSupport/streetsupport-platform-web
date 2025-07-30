import { Page } from '@playwright/test';
import {
  mockServices,
  mockServiceProviders,
  mockServiceProviderWithServices,
  mockStats,
  mockLocationStats,
  mockFaqs,
  mockGeocodeResponse,
  mockOrganisationSearchResults,
  generateMockServicesResponse,
  generateMockServiceProvidersResponse,
  TEST_COORDINATES
} from '../mocks/api-responses';

/**
 * Sets up API mocks for E2E tests when MongoDB is not available
 * Only activates when USE_API_MOCKS environment variable is set to 'true'
 */
export async function setupAPIMocks(page: Page) {
  const shouldUseMocks = process.env.USE_API_MOCKS === 'true';
  
  if (!shouldUseMocks) {
    return;
  }

  console.log('🎭 Setting up API mocks for E2E tests');

  // Mock /api/services endpoint
  await page.route('**/api/services**', async (route) => {
    const url = new URL(route.request().url());
    const mockResponse = generateMockServicesResponse(url.searchParams);
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse)
    });
  });

  // Mock /api/service-providers endpoint
  await page.route('**/api/service-providers**', async (route) => {
    const url = new URL(route.request().url());
    
    // Check if this is a specific provider request
    const pathSegments = url.pathname.split('/');
    const isSpecificProvider = pathSegments.length > 3 && pathSegments[3] !== '';
    
    if (isSpecificProvider) {
      // Mock individual service provider
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          ...mockServiceProviderWithServices
        })
      });
    } else {
      // Mock service providers list
      const mockResponse = generateMockServiceProvidersResponse(url.searchParams);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    }
  });

  // Mock /api/organisations/search endpoint
  await page.route('**/api/organisations/search**', async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get('q') || '';
    
    // Filter results based on search query
    const filteredResults = mockServiceProviders.filter(provider =>
      provider.Name.toLowerCase().includes(query.toLowerCase()) ||
      provider.ShortDescription.toLowerCase().includes(query.toLowerCase())
    );

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        total: filteredResults.length,
        count: filteredResults.length,
        organisations: filteredResults
      })
    });
  });

  // Mock /api/service-provider-addresses endpoint
  await page.route('**/api/service-provider-addresses**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        addresses: [
          {
            id: 'addr-1',
            organisationKey: 'test-food-bank-org',
            street: '123 Test Street',
            city: 'Manchester',
            postcode: 'M1 1AA',
            latitude: 53.4820,
            longitude: -2.2430
          }
        ]
      })
    });
  });

  // Mock /api/stats endpoint
  await page.route('**/api/stats**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockStats)
    });
  });

  // Mock /api/locations/[slug]/stats endpoint
  await page.route('**/api/locations/**/stats**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockLocationStats)
    });
  });

  // Mock /api/faqs endpoint
  await page.route('**/api/faqs**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        faqs: mockFaqs
      })
    });
  });

  // Mock /api/geocode endpoint
  await page.route('**/api/geocode**', async (route) => {
    const url = new URL(route.request().url());
    const postcode = url.searchParams.get('postcode');
    
    if (postcode === TEST_COORDINATES.postcode || postcode === 'M1 1AA') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGeocodeResponse)
      });
    } else {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Postcode not found' })
      });
    }
  });

  // Mock /api/categories endpoint (uses static data, but ensure it works)
  await page.route('**/api/categories**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        categories: [
          { key: 'meals', name: 'Meals' },
          { key: 'accommodation', name: 'Accommodation' },
          { key: 'health', name: 'Health' }
        ]
      })
    });
  });

  // Mock /api/client-groups endpoint (uses static data, but ensure it works)
  await page.route('**/api/client-groups**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        clientGroups: [
          { key: 'everyone', name: 'Everyone' },
          { key: 'homeless', name: 'Homeless' },
          { key: 'families', name: 'Families' }
        ]
      })
    });
  });

  // Mock /api/locations endpoint (uses static data, but ensure it works)
  await page.route('**/api/locations**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        locations: [
          {
            id: 'manchester',
            name: 'Manchester',
            slug: 'manchester',
            isPublic: true,
            latitude: 53.4808,
            longitude: -2.2426
          }
        ]
      })
    });
  });
}

/**
 * Sets up basic mocks that are commonly used across tests
 * This is a simplified version for tests that don't need full API mocking
 */
export async function setupBasicMocks(page: Page) {
  // Always mock geocoding for consistency
  await page.route('**/api/geocode**', async (route) => {
    const url = new URL(route.request().url());
    const postcode = url.searchParams.get('postcode');
    
    if (postcode === TEST_COORDINATES.postcode || postcode === 'M1 1AA') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGeocodeResponse)
      });
    } else {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Postcode not found' })
      });
    }
  });

  // Set up service mocks only if USE_API_MOCKS is enabled
  if (process.env.USE_API_MOCKS === 'true') {
    await setupAPIMocks(page);
  }
}