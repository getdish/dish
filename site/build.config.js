module.exports = async function buildOptions() {
  return {
    glossOptions: {
      whitelistStaticModules: [
        require.resolve('./src/constants.ts'),
        require.resolve('@o/ui/_/constants.js'),
      ],
    },
  }
}
