const useOurBabel =
  process.env.TARGET === 'web' || process.env.TARGET === 'node'

module.exports = function (api) {
  api.cache(true)

  if (process.env.NODE_ENV === 'test') {
    return {}
  }

  if (useOurBabel) {
    return {
      presets: ['@dish/babel-preset'],
    }
  }

  // really helpful to log this in case you accidently use wrong config
  console.log('⚙️ using metro babel config', process.env.TARGET)

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
