module.exports = {
  testMatch: ['**/tests/*.[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  bail: true,
  transformIgnorePatterns: ['node_modules/(?!@expo)/'],
  // verbose: true,
}
