module.exports = function (api) {
  const isWorker = process.env.TARGET === 'worker'
  const isSSR = process.env.TARGET === 'ssr'
  api.cache.using(() => process.env.NODE_ENV)
  return {
    plugins: [
      !api.env('development') && !isWorker && !isSSR && 'babel-plugin-lodash',
      !api.env('production') && !isWorker && !isSSR && 'react-refresh/babel',
      !api.env('production') && '@babel/plugin-transform-react-display-name',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      'babel-plugin-react-native-web',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ].filter(Boolean),
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
    ],
  }
}
