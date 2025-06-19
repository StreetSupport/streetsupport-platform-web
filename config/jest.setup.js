require('@testing-library/jest-dom');

// ✅ Add TextEncoder / TextDecoder for mongodb-memory-server + bson compatibility
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Provide a global fetch mock for components using fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
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
);

// Capture original console.error before overriding it
const originalError = console.error;

// Suppress only specific React test warnings
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg) => {
    const [text] = Array.isArray(msg) ? msg : [msg];
    if (typeof text === 'string' && text.includes('not wrapped in act')) return;
    originalError(...(Array.isArray(msg) ? msg : [msg]));
  });
});

// ✅ Define global alert as jest mock to avoid jsdom crash
global.alert = jest.fn();
