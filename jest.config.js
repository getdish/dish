module.exports = {
  watchman: false,
  testMatch: ['**/tests/*.[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  bail: true,
  transformIgnorePatterns: ['node_modules/(?!@expo)/'],
  testTimeout: 240_000,
  // fixes if any library imports and tries to change source-maps
  moduleNameMapper: {
    'source-map-support/register': 'identity-obj-proxy',
  },
}
