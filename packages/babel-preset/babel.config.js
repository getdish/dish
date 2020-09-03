module.exports = function (api) {
  const isWorker = process.env.TARGET === 'worker'
  const isSSR = process.env.TARGET === 'ssr'
  api.cache.using(() => process.env.NODE_ENV)

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
      ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
      [
        '@babel/preset-react',
        {
          // auto adds react import if necessaty
          // runtime: 'automatic',
          useBuiltIns: true,
          development: api.env('development'),
        },
      ],
    ].map(resolvePlugin),
  }
}

function resolvePlugin(plugin) {
  if (Array.isArray(plugin)) {
    const [name, options] = plugin
    return [require.resolve(name), options].filter(Boolean)
  }
  return require.resolve(plugin)
}
