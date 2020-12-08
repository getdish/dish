module.exports = function (api) {
  api.cache(true)

  const useOurBabel =
    process.env.TARGET === 'web' || process.env.TARGET === 'ssr'
  if (useOurBabel) {
    return {
      presets: ['@dish/babel-preset'],
    }
  }

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      '@snackui/babel-plugin',
      'transform-inline-environment-variables',
    ],
  }
}
