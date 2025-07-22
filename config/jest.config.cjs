/** @type {import('jest').Config} */
const path = require('path');
console.log('[JEST CONFIG] Using unified CJS config');

module.exports = {
  rootDir: '..',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
    '<rootDir>/.next/',
    '<rootDir>/playwright/',
  ],
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest for TS/TSX
    '^.+\\.(ts|tsx)': ['babel-jest', { configFile: path.resolve(__dirname, '../babel.config.json') }],
    // Fallback for JS if needed:
    '^.+\\.(js|jsx)': ['babel-jest', { configFile: path.resolve(__dirname, '../babel.config.json') }],
  },
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  moduleNameMapper: {
    // App directory imports
    '^@/(.*)': '<rootDir>/src/$1',
    // Handle Next.js app directory imports
    '^app/(.*)': '<rootDir>/src/app/$1',
    '^components/(.*)': '<rootDir>/src/components/$1',
    '^contexts/(.*)': '<rootDir>/src/contexts/$1',
    '^utils/(.*)': '<rootDir>/src/utils/$1',
    '^types/(.*)': '<rootDir>/src/types/$1',
    '^data/(.*)': '<rootDir>/src/data/$1',
    // Handle CSS imports
    '\\.css': 'identity-obj-proxy',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)': '<rootDir>/tests/__mocks__/styleMock.js',
    // Enhanced JSON handling
    '\\.(json)': '<rootDir>/tests/__mocks__/jsonMock.js',
    // Mock Next.js modules
    '^next/navigation': '<rootDir>/tests/__mocks__/next-navigation.js',
    '^next/router': '<rootDir>/tests/__mocks__/next-router.js',
    '^next/image': '<rootDir>/tests/__mocks__/next-image.js',
    '^next/link': '<rootDir>/tests/__mocks__/next-link.js',
    '^next/font/(.*)': '<rootDir>/tests/__mocks__/styleMock.js',
    // Mock third-party libraries
    '^leaflet': '<rootDir>/tests/__mocks__/leaflet.js',
    '^react-leaflet': '<rootDir>/tests/__mocks__/react-leaflet.ts',
    // Mock markdown components to avoid ESM issues
    'react-markdown': '<rootDir>/tests/__mocks__/react-markdown.js',
    'rehype-raw': '<rootDir>/tests/__mocks__/rehype-raw.js',
  },
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: [
    // Keep ESM packages unignored if needed for transpile
    'node_modules/(?!(react-leaflet|@react-leaflet|leaflet|@esm|lodash-es|react-markdown|rehype-raw|unified|remark-parse|remark-rehype|rehype-stringify|micromark|mdast-util-from-markdown|mdast-util-to-hast|hast-util-to-html|vfile|unist-util-stringify-position|bail|is-plain-obj|trough|zwitch|property-information|space-separated-tokens|comma-separated-tokens|hast-util-parse-selector|hastscript|html-void-elements|web-namespaces)/)',
  ],
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text', 'clover'],
  // Add Next.js specific configuration
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  // Handle ESM in Node.js environment
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}