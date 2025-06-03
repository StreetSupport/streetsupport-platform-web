/** @type {import('jest').Config} */
console.log('[JEST CONFIG] Using CJS config');

module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // ← ✅ this is correct
    '^leaflet$': '<rootDir>/__mocks__/leaflet.js',
    '^react-leaflet$': '<rootDir>/__mocks__/react-leaflet.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-leaflet|@react-leaflet|leaflet|@esm|lodash-es)/)',
  ],
};
