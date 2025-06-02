// jest.setup.ts
import '@testing-library/jest-dom';

// Provide a global fetch mock for components using fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      {
        key: 'health',
        name: 'Health',
        subCategories: [
          { key: 'dentist', name: 'Dentist' },
          { key: 'gp', name: 'GP' },
        ],
      },
      {
        key: 'foodbank',
        name: 'Foodbank',
        subCategories: [
          { key: 'meals', name: 'Meals' },
          { key: 'parcels', name: 'Parcels' },
        ],
      },
    ]),
  })
) as jest.Mock;

// Suppress React act(...) warnings globally (Jest syntax)
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg) => {
    if (typeof msg === 'string' && msg.includes('not wrapped in act')) return;
    console.error(msg);
  });
});
