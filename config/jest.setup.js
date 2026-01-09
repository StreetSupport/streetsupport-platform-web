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

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => {
    const urlObj = new URL(url || 'http://localhost:3000');
    const headersMap = new Map(Object.entries(init?.headers || {}));
    return {
      url: urlObj.href,
      method: (init?.method) || 'GET',
      headers: {
        get: (key) => headersMap.get(key),
        has: (key) => headersMap.has(key),
        set: (key, value) => headersMap.set(key, value),
        delete: (key) => headersMap.delete(key),
        entries: () => headersMap.entries(),
        keys: () => headersMap.keys(),
        values: () => headersMap.values(),
        forEach: (callback) => headersMap.forEach(callback),
      },
      nextUrl: {
        pathname: urlObj.pathname,
        search: urlObj.search,
        searchParams: new URLSearchParams(urlObj.search),
        href: urlObj.href,
        origin: urlObj.origin,
      },
      body: init?.body,
      json: jest.fn().mockResolvedValue({}),
      text: jest.fn().mockResolvedValue(''),
      formData: jest.fn().mockResolvedValue(new FormData()),
    };
  }),
  NextResponse: Object.assign(
    jest.fn().mockImplementation((body, init) => {
      const headersMap = new Map(Object.entries(init?.headers || {}));
      return {
        ok: true,
        status: (init?.status) || 200,
        statusText: 'OK',
        headers: {
          get: (key) => headersMap.get(key),
          has: (key) => headersMap.has(key),
          set: (key, value) => headersMap.set(key, value),
          delete: (key) => headersMap.delete(key),
          entries: () => headersMap.entries(),
          keys: () => headersMap.keys(),
          values: () => headersMap.values(),
          forEach: (callback) => headersMap.forEach(callback),
        },
        body,
        json: jest.fn().mockImplementation(() => {
          try {
            return Promise.resolve(JSON.parse(body || '{}'));
          } catch {
            return Promise.reject(new Error('Invalid JSON'));
          }
        }),
        text: jest.fn().mockResolvedValue(body || ''),
      };
    }),
    {
      json: jest.fn().mockImplementation((data, init) => {
        const headersMap = new Map(Object.entries(init?.headers || {}));
        return {
          ok: true,
          status: (init?.status) || 200,
          statusText: 'OK',
          headers: {
            get: (key) => headersMap.get(key),
            has: (key) => headersMap.has(key),
            set: (key, value) => headersMap.set(key, value),
            delete: (key) => headersMap.delete(key),
            entries: () => headersMap.entries(),
            keys: () => headersMap.keys(),
            values: () => headersMap.values(),
            forEach: (callback) => headersMap.forEach(callback),
          },
          body: JSON.stringify(data),
          json: jest.fn().mockResolvedValue(data),
          text: jest.fn().mockResolvedValue(JSON.stringify(data)),
        };
      }),
    }
  ),
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

// Suppress specific React test warnings and jsdom navigation errors
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const message = args[0];

    // Extract text from string or Error object
    const getText = (val) => {
      if (typeof val === 'string') return val;
      if (val instanceof Error) return val.message;
      if (val && typeof val.toString === 'function') return val.toString();
      return '';
    };

    const text = getText(message);

    // Suppress known test noise
    if (text.includes('not wrapped in act')) return;
    if (text.includes('Not implemented: navigation')) return;
    if (text.includes('[API ERROR]')) return;
    if (text.includes('Error loading filtered accommodation data')) return;
    if (text.includes('Error loading accommodation data')) return;

    originalError(...args);
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

// Mock IntersectionObserver for progressive loading tests
global.IntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  callback,
  options,
}));

// Mock ResizeObserver if needed
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Next.js server web APIs
global.Request = jest.fn().mockImplementation((url, init) => ({
  url: url || 'http://localhost:3000',
  method: (init?.method) || 'GET',
  headers: new Headers(init?.headers),
  body: init?.body,
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(''),
  formData: jest.fn().mockResolvedValue(new FormData()),
}));

global.Response = jest.fn().mockImplementation((body, init) => ({
  ok: true,
  status: (init?.status) || 200,
  statusText: 'OK',
  headers: new Headers(init?.headers),
  body,
  json: jest.fn().mockImplementation(() => {
    try {
      return Promise.resolve(JSON.parse(body || '{}'));
    } catch {
      return Promise.reject(new Error('Invalid JSON'));
    }
  }),
  text: jest.fn().mockResolvedValue(body || ''),
}));