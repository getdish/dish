module.exports = function (api) {
  api.cache(true)

  if (process.env.TARGET === 'web') {
    return {
      presets: ['@dish/babel-preset'],
    }
  }

  return {
    presets: ['babel-preset-expo'],
  }
}
