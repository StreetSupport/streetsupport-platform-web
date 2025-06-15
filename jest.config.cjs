/** @type {import('jest').Config} */
console.log('[JEST CONFIG] Using CJS config');

module.exports = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '<rootDir>/.next/',
  ],
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest for TS/TSX
    '^.+\\.(ts|tsx)$': 'babel-jest',
    // Fallback for JS if needed:
    '^.+\\.(js|jsx)$': 'babel-jest',
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
    // Keep ESM packages unignored if needed for transpile
    'node_modules/(?!(react-leaflet|@react-leaflet|leaflet|@esm|lodash-es)/)',
  ],
  // Explicitly disable coverage if using Jest 30 beta:
  // coverage is safe with Jest 29, so no need to disable:
  collectCoverage: true,
};
