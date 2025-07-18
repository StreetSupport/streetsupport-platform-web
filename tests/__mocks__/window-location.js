// Mock for window.location
const mockLocation = {
  href: 'http://localhost/',
  reload: jest.fn(),
  assign: jest.fn(),
  replace: jest.fn(),
  pathname: '/',
  search: '',
  hash: '',
  host: 'localhost:3000',
  hostname: 'localhost',
  origin: 'http://localhost:3000',
  port: '3000',
  protocol: 'http:',
};

// Export the mock
module.exports = mockLocation;