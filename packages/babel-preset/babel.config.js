module.exports = function (api) {
  const isSSR = process.env.TARGET === 'ssr'
  // NOTE: we dont use this for NATIVE, we use metro-babel
  const isLegacy = process.env.TARGET === 'native' || process.env.LEGACY === '1'
  const isTest = process.env.NODE_ENV === 'test'
  const isDev = api.env('development') || process.env.NODE_ENV === 'development'
  const isProd = !isDev

  api.cache.using(() => `${isProd}${isLegacy}${isSSR}`)

  const shouldOptimize = isProd && !isSSR

  const config = {
    env: {
      // development: {
      //   plugins: ['@babel/plugin-transform-modules-commonjs'],
      // },
      test: {
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    },
    plugins: [
      'react-native-reanimated/plugin',
      isSSR && '@loadable/babel-plugin',
      isDev && !isSSR && 'react-refresh/babel',
      ...(isDev
        ? ['@babel/plugin-transform-function-name', 'babel-plugin-react-wrapped-display-name']
        : []),
      ...(shouldOptimize
        ? [
            'babel-plugin-lodash',
            '@babel/plugin-transform-react-inline-elements',
            '@babel/plugin-transform-react-constant-elements',
          ]
        : []),
      ...(isTest
        ? [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
            ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
            'babel-plugin-react-native-web',
            '@babel/plugin-syntax-typescript',
            '@babel/plugin-proposal-nullish-coalescing-operator',
          ]
        : []),
      isProd && require.resolve('./babel.strip-invariant.plugin.js'),
    ]
      .filter(Boolean)
      .map(resolvePlugin),
    presets: [
      ...(isTest
        ? [
            [
              '@babel/preset-typescript',
              { onlyRemoveTypeImports: true, isTSX: true, allExtensions: true },
            ],
            [
              '@babel/preset-react',
              {
                // auto adds react import if necessaty
                runtime: 'automatic',
                useBuiltIns: true,
                development: isDev,
                ...(isDev && {
                  importSource: '@welldone-software/why-did-you-render',
                }),
              },
            ],
            isLegacy && [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                  browsers: ['>3%'],
                },
                exclude: ['@babel/plugin-transform-regenerator'],
              },
            ],
          ]
        : []),
    ]
      .filter(Boolean)
      .map(resolvePlugin),
  }

  // console.log('got', config)

  return config
}

function resolvePlugin(plugin) {
  if (Array.isArray(plugin)) {
    const [name, options] = plugin
    return [require.resolve(name), options].filter(Boolean)
  }
  return require.resolve(plugin)
}
