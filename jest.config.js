module.exports = {
  testMatch: ['**/tests/*.[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  // verbose: true,
}
