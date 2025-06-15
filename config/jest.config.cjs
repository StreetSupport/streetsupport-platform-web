/** @type {import('jest').Config} */
const path = require('path');
console.log('[JEST CONFIG] Using CJS config');

module.exports = {
  rootDir: '..',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
    '<rootDir>/.next/',
  ],
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest for TS/TSX
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: path.resolve(__dirname, '../babel.config.json') }],
    // Fallback for JS if needed:
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: path.resolve(__dirname, '../babel.config.json') }],
  },
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^leaflet$': '<rootDir>/tests/__mocks__/leaflet.js',
    '^react-leaflet$': '<rootDir>/tests/__mocks__/react-leaflet.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: [
    // Keep ESM packages unignored if needed for transpile
    'node_modules/(?!(react-leaflet|@react-leaflet|leaflet|@esm|lodash-es)/)',
  ],
  // Explicitly disable coverage if using Jest 30 beta:
  // coverage is safe with Jest 29, so no need to disable:
  collectCoverage: true,
};
