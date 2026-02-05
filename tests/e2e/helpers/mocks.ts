import { Page } from '@playwright/test';

export const TEST_POSTCODE = 'M1 1AA';
export const TEST_COORDINATES = {
  lat: 53.4808,
  lng: -2.2426,
  postcode: 'M1 1AA'
};

const mockServices = [
  {
    _id: '1',
    ServiceProviderName: 'Test Health Service',
    Info: 'A test health service providing GP and medical support',
    ParentCategoryKey: 'health',
    SubCategoryKey: 'gp',
    ServiceProviderKey: 'test-health-service',
    Address: {
      Location: {
        coordinates: [-2.2426, 53.4808]
      }
    },
    ClientGroups: ['adults'],
    OpeningTimes: [],
    distance: 0.5
  },
  {
    _id: '2',
    ServiceProviderName: 'Test Support Service',
    Info: 'A test support service for counselling',
    ParentCategoryKey: 'support',
    SubCategoryKey: 'counselling',
    ServiceProviderKey: 'test-support-service',
    Address: {
      Location: {
        coordinates: [-2.2430, 53.4810]
      }
    },
    ClientGroups: ['adults', 'families'],
    OpeningTimes: [],
    distance: 1.2
  }
];

const mockStats = {
  organisations: 25,
  services: 150,
  partnerships: 8
};

export async function setupAPIMocks(page: Page) {
  await page.route('**/api/geocode**', async (route) => {
    const url = new URL(route.request().url());
    const postcode = url.searchParams.get('postcode');

    if (postcode === TEST_POSTCODE || postcode === 'M1 1AA') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          location: TEST_COORDINATES,
          postcode: TEST_POSTCODE
        })
      });
    } else if (postcode === 'INVALID' || postcode === 'XX1 1XX') {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid postcode format'
        })
      });
    } else {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Postcode not found'
        })
      });
    }
  });

  await page.route('**/api/services**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: mockServices,
        total: mockServices.length
      })
    });
  });

  await page.route('**/api/stats**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockStats)
    });
  });

  await page.route('**/api/service-providers**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        total: 2,
        results: [
          {
            Key: 'test-health-service',
            Name: 'Test Health Service Organisation',
            ShortDescription: 'Health services for all',
            IsVerified: true,
            IsPublished: true
          }
        ]
      })
    });
  });

  await page.route('**/api/locations**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        data: [
          {
            id: 'manchester',
            name: 'Manchester',
            slug: 'manchester',
            isPublic: true,
            latitude: 53.4808,
            longitude: -2.2426
          },
          {
            id: 'leeds',
            name: 'Leeds',
            slug: 'leeds',
            isPublic: true,
            latitude: 53.8008,
            longitude: -1.5491
          }
        ]
      })
    });
  });

  await page.route('**/api/categories**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        data: [
          {
            key: 'health',
            name: 'Health',
            subCategories: [
              { key: 'gp', name: 'GP Services' },
              { key: 'mental-health', name: 'Mental Health' }
            ]
          },
          {
            key: 'support',
            name: 'Support',
            subCategories: [
              { key: 'counselling', name: 'Counselling' }
            ]
          }
        ]
      })
    });
  });

  await page.route('**/api/organisation-request**', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Organisation request submitted successfully'
        })
      });
    } else {
      await route.continue();
    }
  });
}
