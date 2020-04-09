module.exports = function(api) {
  const isWorker = process.env.TARGET === 'worker'
  const isSSR = process.env.TARGET === 'ssr'
  if (isWorker || isSSR) {
    api.cache(true)
  }
  const plugins = [
    !isWorker && !isSSR && !api.env('production') && 'react-refresh/babel',
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
