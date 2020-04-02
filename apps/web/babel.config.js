module.exports = function (api) {
  const isWorker = process.env.TARGET === 'worker'
  if (isWorker) {
    api.cache(true)
  }
  const plugins = [
    !isWorker && !api.env('production') && 'react-refresh/babel',
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
