module.exports = function(api) {
  const isWorker = process.env.TARGET === 'worker'
  const isSSR = process.env.TARGET === 'ssr'
  // if (!isSSR && !api.env('production') && api.cache) {
  //   api.cache(true)
  // }
  if (isWorker) {
    api.cache(true)
  }
  return {
    plugins: [
      !api.env('production') && !isWorker && !isSSR && 'react-refresh/babel',
      !api.env('production') && '@babel/plugin-transform-react-display-name',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      'babel-plugin-react-native-web',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ].filter(Boolean),
    presets: ['@babel/preset-typescript', '@babel/preset-react'],
  }

  // return {
  //   presets: [
  //     'babel-preset-expo',
  //     'module:metro-react-native-babel-preset',
  //     'module:react-native-dotenv',
  //   ],
  // }
}
