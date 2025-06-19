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
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: path.resolve(__dirname, '../babel.config.json') }],
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
    'node_modules/(?!(react-leaflet|@react-leaflet|leaflet|@esm|lodash-es)/)',
  ],
  testTimeout: 20000, // NEW: Allow mongo memory server spin up time
  collectCoverage: true,
};
