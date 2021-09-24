const useOurBabel = process.env.TARGET === 'web' || process.env.TARGET === 'node'

module.exports = function (api) {
  api.cache(true)

  if (process.env.BABEL_ENV !== process.env.NODE_ENV) {
    console.log(
      `BABEL_ENV !== NODE_ENV, this will cause errors in metro babel preset, changing to NODE_ENV val`
    )
    process.env.BABEL_ENV = process.env.NODE_ENV
  }

  if (process.env.NODE_ENV === 'test') {
    return {}
  }

  if (useOurBabel) {
    console.log('using our babel', process.env.TARGET)
    return {
      presets: ['@dish/babel-preset'],
    }
  }

  // really helpful to log this in case you accidently use wrong config
  console.log('⚙️ using metro babel config', process.env.TARGET)

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      '@babel/plugin-transform-react-jsx',
      'react-native-reanimated/plugin',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      [
        '@snackui/babel-plugin',
        {
          exclude: /node_modules/,
        },
      ],
      '@dish/babel-plugin-inline-env',
    ],
  }
}
