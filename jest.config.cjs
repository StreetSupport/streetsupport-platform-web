/** @type {import('jest').Config} */

module.exports = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '<rootDir>/.next/',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^leaflet$': '<rootDir>/__mocks__/leaflet.js',
    '^react-leaflet$': '<rootDir>/__mocks__/react-leaflet.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-leaflet|@react-leaflet|leaflet|@esm|lodash-es)/)',
  ],
};
