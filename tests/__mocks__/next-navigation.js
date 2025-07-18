// Enhanced mock for next/navigation
module.exports = {
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
  cookies: jest.fn(() => ({ 
    get: jest.fn(), 
    set: jest.fn(), 
    delete: jest.fn() 
  })),
};