module.exports = function (api) {
  const isWorker = process.env.TARGET === 'worker'
  const isSSR = process.env.TARGET === 'ssr'
  const isLegacy = process.env.LEGACY === '1'

  api.cache.using(() => `${process.env.NODE_ENV}${process.env.TARGET}`)

  return {
    plugins: [
      isSSR && '@loadable/babel-plugin',
      api.env('development') && !isWorker && !isSSR && 'react-refresh/babel',
      !api.env('production') && '@babel/plugin-transform-react-display-name',
      ...(api.env('production') && !isWorker && !isSSR
        ? [
            'babel-plugin-lodash',
            '@babel/plugin-transform-react-inline-elements',
            '@babel/plugin-transform-react-constant-elements',
            'babel-plugin-optimize-react',
          ]
        : []),
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      'babel-plugin-react-native-web',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      require.resolve('./babel.strip-invariant.plugin.js'),
    ]
      .filter(Boolean)
      .map(resolvePlugin),
    presets: [
      [
        '@babel/preset-typescript',
        { onlyRemoveTypeImports: true, isTSX: true, allExtensions: true },
      ],
      [
        '@babel/preset-react',
        {
          // auto adds react import if necessaty
          // runtime: 'automatic',
          useBuiltIns: true,
          development: api.env('development'),
        },
      ],
      isLegacy && [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
          },
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
