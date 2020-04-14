const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const _ = require('lodash')
const Webpack = require('webpack')
const ClosurePlugin = require('closure-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = process.env.NODE_ENV === 'production'

// 'ssr' | 'worker' | 'preact' | 'client'
const TARGET = process.env.TARGET || 'client'
console.log('TARGET', TARGET)
const appEntry = path.resolve(path.join(__dirname, 'web', 'index.web.tsx'))

module.exports = async function(env = { mode: process.env.NODE_ENV }, argv) {
  // @ts-ignore
  const config = await createExpoWebpackConfigAsync(
    {
      projectRoot: '.',
      platform: 'web',
      mode: isProduction ? 'production' : 'development',
      pwa: false,
      offline: false,
      removeUnusedImportExports: isProduction,
    },
    argv
  )

  config.plugins.push(
    new Webpack.DefinePlugin({
      'process.env.TARGET': JSON.stringify(TARGET || null),
    })
  )

  config.devtool =
    env.mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map'

  config.optimization = config.optimization || {}

  if (config.optimization) {
    config.optimization.splitChunks = isProduction
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
  config.entry.app = config.entry.app.filter((x) => {
    return x !== 'app.json'
  })

  config.externals = {
    './web/mapkit.js': 'mapkit',
  }

  if (!isProduction) {
    config.optimization.minimize = false
  } else {
    // test closure compiler, could be more performant if it extracts functions from render better
    config.optimization.minimizer = [
      new ClosurePlugin({
        mode: 'STANDARD', // 'AGGRESSIVE_BUNDLE' seems to fail on mjs files in webpack
      }),
    ]
  }

  if (TARGET === 'ssr') {
    config.entry.app = config.entry.app.filter((x) => {
      return x.indexOf('webpackHotDevClient') < 0
    })
    config.target = 'node'
    config.output.path = path.join(__dirname, 'web-build-ssr')
    config.output.libraryTarget = 'commonjs'
    config.output.filename = `static/js/app.${TARGET}.js`
    config.optimization.minimize = false
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'WebpackPWAManifest'
    )
  }

  if (TARGET === 'preact') {
    config.resolve.alias = {
      react$: 'preact/compat',
      'react-dom$': 'preact/compat',
      'react-dom/unstable-native-dependencies': 'preact-responder-event-plugin',
    }
    console.log('config.resolve.alias', config.resolve.alias)
  }

  if (TARGET === 'worker') {
    if (!isProduction) {
      config.entry.app = config.entry.app.slice(1) // remove hot
    }
    if (config.devServer) {
      config.devServer.hot = false
    }
    config.output.globalObject = 'this'
    config.plugins = config.plugins.filter((plugin) => {
      return plugin.constructor.name !== 'HotModuleReplacementPlugin'
    })

    // exec patch
    const exec = require('child_process').exec
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          exec('node ./worker-patch.js', (err, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout)
            if (stderr) process.stderr.write(stderr)
          })
        })
      },
    })
  }

  if (env.mode === 'development' && TARGET !== 'worker') {
    config.plugins.push(
      new ReactRefreshWebpackPlugin({
        disableRefreshCheck: true,
        forceEnable: true,
      })
    )
  }

  if (process.env.NO_MINIFY) {
    config.optimization.minimize = false
  }

  if (config.optimization.minimize == false) {
    delete config.optimization.minifier
  }

  // prettyjson is choking on a possibly self-referencing recursion when building
  // with Docker.
  // console.log('Config:\n', prettifyWebpackConfig(config))
  if (process.env.VERBOSE) {
    console.log('Config:\n', prettifyWebpackConfig(config))
  } else {
    console.log(`Start building ${TARGET}... entry ${config.entry.app}`)
  }

  return config
}

function prettifyWebpackConfig(config) {
  const prettyConfig = _.clone(config, true)
  prettyConfig.plugins = config.plugins.map((p) => {
    return { name: p.constructor.name, settings: p }
  })
  return require('prettyjson').render(prettyConfig)
}
