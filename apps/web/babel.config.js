module.exports = function (api) {
  console.log('what is', api.env('production'))

  // api.cache(true)
  const plugins = [!api.env('production') && 'react-refresh/babel'].filter(
    Boolean
  )
  return {
    plugins,
    presets: [
      'babel-preset-expo',
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv',
    ],
  }
}
