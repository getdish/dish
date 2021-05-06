module.exports = function (api) {
  const isSSR = process.env.TARGET === 'ssr'
  // NOTE: we dont use this for NATIVE, we use metro-babel
  const isLegacy = process.env.TARGET === 'native' || process.env.LEGACY === '1'
  const isDev = api.env('development') || process.env.NODE_ENV === 'development'
  const isProd = !isDev

  api.cache.using(() => `${process.env.NODE_ENV}${process.env.TARGET}${process.env.LEGACY}`)

  const shouldOptimize = isProd && !isSSR

  return {
    env: {
      development: {
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
      test: {
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    },
    plugins: [
      isSSR && '@loadable/babel-plugin',
      isDev && !isSSR && 'react-refresh/babel',
      ...(isDev
        ? [
            // '@babel/plugin-transform-function-name',
            'babel-plugin-react-wrapped-display-name',
          ]
        : []),
      !isProd && '@babel/plugin-transform-react-display-name',
      ...(shouldOptimize
        ? [
            'babel-plugin-lodash',
            '@babel/plugin-transform-react-inline-elements',
            '@babel/plugin-transform-react-constant-elements',
            // '@eps1lon/babel-plugin-optimize-react',
          ]
        : []),
      // '@babel/plugin-proposal-class-properties',
      // '@babel/plugin-proposal-optional-chaining',
      // ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      'babel-plugin-react-native-web',
      '@babel/plugin-syntax-typescript',
      // '@babel/plugin-proposal-nullish-coalescing-operator',
      isProd && require.resolve('./babel.strip-invariant.plugin.js'),
    ]
      .filter(Boolean)
      .map(resolvePlugin),
    presets: [
      // [
      //   '@babel/preset-typescript',
      //   { onlyRemoveTypeImports: true, isTSX: true, allExtensions: true },
      // ],
      // [
      //   '@babel/preset-react',
      //   {
      //     // auto adds react import if necessaty
      //     runtime: 'automatic',
      //     useBuiltIns: true,
      //     development: isDev,
      //   },
      // ],
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
      .filter(Boolean)
      .map(resolvePlugin),
  }
}

function resolvePlugin(plugin) {
  if (Array.isArray(plugin)) {
    const [name, options] = plugin
    return [require.resolve(name), options].filter(Boolean)
  }
  return require.resolve(plugin)
}
