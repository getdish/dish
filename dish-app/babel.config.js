const useOurBabel = process.env.TARGET === 'web' || process.env.TARGET === 'ssr'

module.exports = function (api) {
  api.cache(true)

  if (useOurBabel) {
    return {
      presets: ['@dish/babel-preset'],
    }
  }

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        '@snackui/babel-plugin',
        {
          exclude: /node_modules/,
        },
      ],
      'transform-inline-environment-variables',
    ],
  }
}
