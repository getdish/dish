module.exports = function (api) {
  api.cache(true)

  if (process.env.TARGET === 'web') {
    return {
      presets: ['@o/babel-preset'],
    }
  }

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: ['transform-inline-environment-variables'],
  }
}
