const useOurBabel = process.env.TAMAGUI_TARGET === 'web' || process.env.TAMAGUI_TARGET === 'node'

console.log('env is', useOurBabel, process.env.BABEL_ENV, process.env.NODE_ENV)

module.exports = function (api) {
  api.cache(true)

  if (!process.env.BABEL_ENV) {
    process.env.BABEL_ENV = process.env.NODE_ENV
  }
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
    return {
      presets: ['@dish/babel-preset'],
    }
  }

  // really helpful to log this in case you accidently use wrong config
  console.log('⚙️ using metro babel config', process.env.TAMAGUI_TARGET)

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-transform-react-jsx',
      'react-native-reanimated/plugin',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      [
        '@tamagui/babel-plugin',
        {
          exclude: /node_modules/,
          components: ['@dish/ui'],
          config: './src/tamagui.config.ts',
        },
      ],
      '@dish/babel-plugin-inline-env',
    ],
  }
}
