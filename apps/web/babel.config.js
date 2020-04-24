module.exports = function(api) {
  if (api.cache) {
    api.cache(true)
  }
  return {
    plugins: [
      'react-refresh/babel',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      'babel-plugin-react-native-web',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-transform-react-display-name',
    ],
    presets: ['@babel/preset-typescript', '@babel/preset-react'],
  }

  const isWorker = process.env.TARGET === 'worker'
  const isSSR = process.env.TARGET === 'ssr'
  if (isWorker) {
    api.cache(true)
  }
  const plugins = [
    !isWorker && !isSSR && !api.env('production') && 'react-refresh/babel',
    // add fn name for dev
    !api.env('production') && '@babel/plugin-transform-function-name',
  ].filter(Boolean)
  return {
    plugins,
    presets: [
      'babel-preset-expo',
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv',
    ],
  }
}
