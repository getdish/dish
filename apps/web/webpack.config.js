const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const _ = require('lodash')
const Webpack = require('webpack')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = process.env.NODE_ENV === 'production'

// 'ssr' | 'worker' | 'preact' | 'client'
const target = process.env.TARGET || 'client'
console.log('TARGET', target)
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

  config.plugins.push(
    new Webpack.DefinePlugin({
      'process.env.TARGET': JSON.stringify(process.env.TARGET || null),
    })
  )

  if (config.optimization) {
    config.optimization.splitChunks = false
    config.optimization.runtimeChunk = false
    if (isProduction) {
      config.optimization.usedExports = true
    }
  }

  if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
        analyzerMode: 'static',
      })
    )
  }

  if (!config.entry.app.some((x) => x.indexOf('index.web.tsx') > -1)) {
    config.entry.app.push(appEntry)
  }

  config.output.filename = 'static/js/app.js'

  if (!isProduction && config.optimization) {
    config.optimization.minimize = false
  }

  if (target === 'ssr') {
    config.target = 'node'
    config.output.path = path.join(__dirname, 'web-build-ssr')
    config.output.libraryTarget = 'commonjs'
    config.output.filename = `static/js/app.${target}.js`
    config.optimization.minimize = false
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'WebpackPWAManifest'
    )
  }

  if (target === 'preact') {
    config.resolve.alias = {
      react$: 'preact/compat',
      'react-dom$': 'preact/compat',
      'react-dom/unstable-native-dependencies': 'preact-responder-event-plugin',
    }
    console.log('config.resolve.alias', config.resolve.alias)
  }

  if (target === 'worker') {
    if (!isProduction) config.entry.app = config.entry.app.slice(1) // remove hot
    config.output.globalObject = 'this'
    if (config.devServer) config.devServer.hot = false
    config.plugins = config.plugins.filter((plugin) => {
      console.log('plugin', plugin.constructor)
      return plugin.constructor.name !== 'HotModuleReplacementPlugin'
    })
  }

  if (env.mode === 'development' && target !== 'worker') {
    config.plugins.push(
      new ReactRefreshWebpackPlugin({
        disableRefreshCheck: true,
        forceEnable: true,
      })
    )
  }

  if (config.optimization) {
    if (process.env.NO_MINIFY) {
      config.optimization.minimize = false
    }
    if (config.optimization.minimize == false) {
      delete config.optimization.minifier
    }
  }

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
