require('@testing-library/jest-dom');

// Enhanced Next.js navigation mock
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
  redirect: jest.fn(),
  notFound: jest.fn(),
  headers: jest.fn(() => new Headers()),
  cookies: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), delete: jest.fn() })),
}));

// Enhanced Next.js image component mock
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} data-testid="next-image" />;
  },
}));

// Provide a global fetch mock for components using fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
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
);

// Mock window.matchMedia if it doesn't exist
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  }
}

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

// Define global alert as jest mock to avoid jsdom crash
global.alert = jest.fn();

// Create a mock location object
const mockLocation = {
  hash: '',
  host: 'localhost:3000',
  hostname: 'localhost',
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  port: '3000',
  protocol: 'http:',
  search: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Export the mock location for tests to use
global.mockLocation = mockLocation;