const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const _ = require('lodash')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = process.env.NODE_ENV === 'production'
const target = process.env.TARGET || 'client'
const appEntry = path.resolve(path.join(__dirname, 'web', 'index.web.tsx'))

module.exports = async function (env = { mode: process.env.NODE_ENV }, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      projectRoot: '.',
      platform: 'web',
      production: isProduction,
      pwa: false,
      offline: false,
      removeUnusedImportExports: true,
    },
    argv
  )

  if (target === 'ssr') {
    config.target = 'node'
    config.output.path = path.join(__dirname, 'web-build-ssr')
    config.output.libraryTarget = 'commonjs'
    config.output.filename = `static/js/app.${target}.js`
    config.optimization.minimize = false
    config.optimization.splitChunks = false
    config.optimization.runtimeChunk = false
    config.plugins = config.plugins.filter((plugin) => {
      if (plugin.constructor.name === 'WebpackPWAManifest') {
        return false
      }
      return true
    })
  }

  if (!config.entry.app.some((x) => x.indexOf('index.web.tsx') > -1)) {
    config.entry.app.push(appEntry)
  }

  // Customize the config before returning it.

  if (env.mode === 'development') {
    config.plugins.push(
      new ReactRefreshWebpackPlugin({
        disableRefreshCheck: true,
        forceEnable: true,
      })
    )
  }

  // config.target = 'node'

  console.log('Config:\n', prettifyWebpackConfig(config))

  return config
}

function prettifyWebpackConfig(config) {
  const prettyConfig = _.clone(config, true)
  prettyConfig.plugins = config.plugins.map((p) => {
    return { name: p.constructor.name, settings: p }
  })
  return require('prettyjson').render(prettyConfig)
}
