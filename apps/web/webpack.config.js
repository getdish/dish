const { DuplicatesPlugin } = require('inspectpack/plugin')
const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const _ = require('lodash')
const Webpack = require('webpack')
const ClosurePlugin = require('closure-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const LodashPlugin = require('lodash-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = process.env.NODE_ENV === 'production'

// 'ssr' | 'worker' | 'preact' | 'client'
const TARGET = process.env.TARGET || 'client'
console.log('TARGET', TARGET)
const appEntry = path.resolve(path.join(__dirname, 'web', 'index.web.tsx'))

module.exports = async function (env = { mode: process.env.NODE_ENV }, argv) {
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

  config.stats = 'normal'

  if (!!process.env.INSPECT || isProduction) {
    config.plugins.push(
      new DuplicatesPlugin({
        // Emit compilation warning or error? (Default: `false`)
        emitErrors: false,
        // Handle all messages with handler function (`(report: string)`)
        // Overrides `emitErrors` output.
        emitHandler: undefined,
        // List of packages that can be ignored. (Default: `[]`)
        // - If a string, then a prefix match of `{$name}/` for each module.
        // - If a regex, then `.test(pattern)` which means you should add slashes
        //   where appropriate.
        //
        // **Note**: Uses posix paths for all matching (e.g., on windows `/` not `\`).
        ignoredPackages: undefined,
        // Display full duplicates information? (Default: `false`)
        verbose: false,
      })
    )
  }

  // global plugin changes
  config.plugins = config.plugins.filter(
    (x) =>
      x.constructor.name !== 'ProgressPlugin' &&
      x.constructor.name !== 'WebpackBar' &&
      x.constructor.name !== 'HtmlWebpackPlugin' &&
      x.constructor.name !== 'CleanWebpackPlugin'
  )

  // PLUGINS

  config.plugins.push(new LodashPlugin())

  config.plugins.push(
    new Webpack.DefinePlugin({
      'process.env.TARGET': JSON.stringify(TARGET || null),
    })
  )

  config.plugins.push(
    new HTMLWebpackPlugin({
      inject: true,
      template: path.join(__dirname, 'web/index.html'),
    })
  )

  config.devtool =
    env.mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map'

  config.optimization = config.optimization || {}

  if (config.optimization) {
    config.optimization.splitChunks = isProduction ? {} : false
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
    return (
      x !== 'app.json' &&
      !x.includes('resize-observer-polyfill/dist/ResizeObserver.global.js')
    )
  })

  if (TARGET !== 'ssr' && process.env.NODE_ENV !== 'development') {
    // in production just use <script /> tag...
    // dev its nice to have it local so no internet required
    config.externals = {
      [path.join(__dirname, 'web/mapkit.js')]: 'mapkit',
    }
  }

  // hackkk try to get tree shaking from ts
  config.resolve.mainFields = ['tsmain', 'browser', 'module', 'main']
  config.module.rules.push({
    test: /\.tsx?$/,
    use: {
      loader: 'babel-loader',
    },
  })

  config.context = __dirname
  config.devServer = {
    ...config.devServer,
    historyApiFallback: true,
    disableHostCheck: true,
    overlay: false,
    quiet: false,
    stats: {
      colors: true,
      assets: true,
      chunks: false,
      modules: true,
      reasons: false,
      children: true,
      errors: true,
      errorDetails: true,
      warnings: true,
    },
  }

  if (!isProduction) {
    config.optimization.minimize = false
  } else {
    // test closure compiler, could be more performant if it extracts functions from render better
    // config.optimization.minimizer = [
    //   new ClosurePlugin({
    //     // 'AGGRESSIVE_BUNDLE' seems to fail on mjs files in webpack
    //     mode: 'STANDARD',
    //     // See: https://github.com/webpack-contrib/closure-webpack-plugin/issues/82
    //     // Unfortunately, compared to the default 'java', this is really slow and prone
    //     // to RAM exhaustion
    //     platform: 'javascript',
    //   }),
    // ]
  }

  if (TARGET === 'preact') {
    config.resolve.alias = {
      react$: 'preact/compat',
      'react-dom$': 'preact/compat',
      'react-dom/unstable-native-dependencies': 'preact-responder-event-plugin',
    }
    console.log('config.resolve.alias', config.resolve.alias)
  } else {
    const graphRoot = path.join(require.resolve('@dish/graph'), '..', '..')
    console.log('graphRoot', graphRoot)
    config.resolve.alias = {
      react: path.join(require.resolve('react'), '..'),
      'react-dom': path.join(require.resolve('react-dom'), '..'),
      '@dish/graph': require.resolve('@dish/graph'),
      gqless: path.join(graphRoot, 'node_modules', 'gqless'),
    }
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
    config.devServer = {
      ...config.devServer,
      overlay: false,
    }
    config.plugins = config.plugins.filter(
      (x) => x.constructor.name !== 'HotModuleReplacementPlugin'
    )
    config.plugins.push(
      new ReactRefreshWebpackPlugin({
        overlay: false,
        // {
        //   entry: path.join(__dirname, 'web', 'errors.web.tsx'),
        //   module: path.join(__dirname, 'web', 'errors.web.tsx'),
        // },
      })
    )
  }

  if (TARGET === 'ssr') {
    config.entry.app = config.entry.app.filter((x) => {
      return x.indexOf('webpackHotDevClient') < 0
    })
    config.target = 'node'
    config.output.path = path.join(__dirname, 'web-build-ssr')
    config.output.libraryTarget = 'commonjs'
    config.output.filename = `static/js/app.ssr.js`
    config.optimization.minimize = false
    config.optimization.minimizer = []
    config.plugins.push(
      new Webpack.ProvidePlugin({
        mapkit: path.join(__dirname, 'web/mapkitExport.js'),
      })
    )
    config.plugins = config.plugins.filter(
      (plugin) =>
        plugin.constructor.name !== 'WebpackPWAManifest' &&
        plugin.constructor.name !== 'CopyPlugin' &&
        plugin.constructor.name !== 'CleanWebpackPlugin' &&
        plugin.constructor.name !== 'HtmlWebpackPlugin' &&
        plugin.constructor.name !== 'InterpolateHtmlPlugin' &&
        plugin.constructor.name !== 'MiniCssExtractPlugin' &&
        plugin.constructor.name !== 'ManifestPlugin' &&
        plugin.constructor.name !== 'CompressionPlugin'
    )
  }

  if (process.env.NO_MINIFY) {
    config.optimization.minimize = false
  }

  if (config.optimization.minimize == false) {
    delete config.optimization.minifier
  }

  function getConfig() {
    if (TARGET === 'ssr' || TARGET === 'worker' || TARGET === 'preact') {
      return config
    }

    function getLegacyConfig() {
      return {
        ...config,
        output: {
          ...config.output,
          filename: 'static/js/app.legacy.js',
          path: path.join(__dirname, 'web-build-legacy'),
        },
        entry: {
          app: [
            path.join(__dirname, 'web', 'polyfill.legacy.js'),
            ...config.entry.app,
          ],
        },
      }
    }

    function getModernConfig() {
      return {
        ...config,
        output: {
          ...config.output,
          path: path.join(__dirname, 'web-build'),
        },
      }
    }

    if (process.env.ONLY_MODERN) {
      return getModernConfig()
    }

    if (process.env.NODE_ENV === 'production') {
      // lets generate a legacy and modern build
      return [getModernConfig(), getLegacyConfig()]
    } else {
      // just serve larger legacy bundle in development
      return getLegacyConfig()
    }
  }

  const finalConfig = getConfig()

  if (process.env.VERBOSE) {
    console.log('Config:\n', finalConfig)
    if (!Array.isArray(finalConfig)) {
      console.log('rules', JSON.stringify(finalConfig.module.rules, null, 2))
    }
  } else {
    console.log(`Start building ${TARGET}...`)
  }

  return finalConfig
}
