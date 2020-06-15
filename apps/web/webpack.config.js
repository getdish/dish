const { DuplicatesPlugin } = require('inspectpack/plugin')
const ShakePlugin = require('webpack-common-shake').Plugin
const ReactRefreshWebpack4Plugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const _ = require('lodash')
const fs = require('fs')
const Webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const LodashPlugin = require('lodash-webpack-plugin')
// const ClosurePlugin = require('closure-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh')
const { UIStaticWebpackPlugin } = require('@dish/ui-static')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// 'ssr' | 'worker' | 'preact' | 'client'
const TARGET = process.env.TARGET || 'client'
const target =
  TARGET === 'ssr' ? 'node' : TARGET === 'worker' ? 'webworker' : 'web'
const appEntry = path.resolve(path.join(__dirname, 'web', 'index.web.tsx'))

let gqless = require.resolve('@dish/graph')
while (true) {
  const next = path.join(gqless, 'node_modules', 'gqless')
  if (fs.existsSync(next)) {
    gqless = next
    break
  } else {
    gqless = path.join(gqless, '..')
  }
  if (gqless == '/') throw new Error('no graph gqlss')
}

const isProduction = process.env.NODE_ENV === 'production'
// const isClient = TARGET === 'client'
// const isSSR = TARGET === 'ssr'
// const isHot = !isProduction
const isStaticExtracted = !process.env.NO_EXTRACT

console.log('webpack.config', { isProduction, gqless, TARGET })

module.exports = function getWebpackConfig(
  env = {
    /** @type {any} */
    mode: process.env.NODE_ENV,
  },
  argv
) {
  function getConfig() {
    /** @type {Webpack.Configuration} */
    const config = {
      mode: env.mode || process.env.NODE_ENV,
      context: __dirname,
      target,
      stats: 'normal',
      devtool:
        env.mode === 'production' ? 'source-map' : 'cheap-module-source-map',
      // @ts-ignore
      entry: [
        // webpack5
        // isHot && '@webhotelier/webpack-fast-refresh/runtime.js',
        appEntry,
      ].filter(Boolean),
      output: {
        path: path.resolve(__dirname),
        filename: `static/js/app.[hash].js`,
        publicPath: '/',
        // globalObject: 'this',
      },
      // webpack 4
      node: {
        process: 'mock',
        Buffer: false,
        util: false,
        console: false,
        setImmediate: false,
        global: false,
        __filename: false,
        __dirname: false,
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        mainFields: ['tsmain', 'browser', 'module', 'main'],
        alias:
          TARGET === 'preact'
            ? {
                react$: 'preact/compat',
                'react-dom$': 'preact/compat',
                'react-dom/unstable-native-dependencies':
                  'preact-responder-event-plugin',
                gqless,
              }
            : {
                react: path.join(require.resolve('react'), '..'),
                'react-dom': path.join(require.resolve('react-dom'), '..'),
                // '@dish/graph': require.resolve('@dish/graph/index'),
                gqless,
              },
      },
      resolveLoader: {
        modules: ['node_modules'],
      },
      optimization: {
        minimize: !process.env.NO_MINIFY && isProduction && TARGET !== 'ssr',
        concatenateModules: isProduction && !process.env.ANALYZE_BUNDLE,
        usedExports: isProduction,
        splitChunks: false,
        // isProduction && TARGET !== 'ssr'
        //   ? {
        //       // http2
        //       chunks: 'all',
        //       maxInitialRequests: 6,
        //       maxAsyncRequests: 6,
        //       maxSize: 100000,
        //     }
        //   : false,
        runtimeChunk: false,
        minimizer: [
          // new ClosurePlugin(),
          new TerserPlugin(),
        ],
      },
      externals: {
        [path.join(__dirname, 'web/mapkit.js')]: 'mapkit',
      },
      module: {
        rules: [
          {
            oneOf: [
              {
                test: /\.[jt]sx?$/,
                include: babelInclude,
                use: [
                  {
                    loader: 'babel-loader',
                    options: { cacheDirectory: true },
                  },
                  // webpack 5
                  // isHot && {
                  //   loader: '@webhotelier/webpack-fast-refresh/loader.js',
                  // },
                  isStaticExtracted && {
                    loader: require.resolve('@dish/ui-static/loader'),
                  },
                ].filter(Boolean),
              },
              {
                test: /\.css$/i,
                use:
                  // isProduction
                  //   ? ['file-loader', 'extract-loader', 'css-loader']
                  ['style-loader', 'css-loader'],
              },
              {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: {
                  loader: 'url-loader',
                  options: {
                    limit: 1000,
                    name: 'static/media/[name].[hash].[ext]',
                  },
                },
              },
              // fallback loader helps webpack-dev-server serve assets
              {
                loader: 'file-loader',
                // Exclude `js` files to keep "css" loader working as it injects
                // its runtime that would otherwise be processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed by webpacks internal loaders.
                exclude: [/\.(mjs|[jt]sx?)$/, /\.html$/, /\.json$/],
                options: {
                  name: 'static/media/[name].[hash].[ext]',
                },
              },
            ],
          },
        ],
      },
      plugins: [
        // breaks a couple things, possible to ignore
        // isClient && isProduction && new ShakePlugin({}),

        isProduction && new LodashPlugin(),

        // extract static styles in production
        isStaticExtracted && new UIStaticWebpackPlugin(),

        new Webpack.DefinePlugin({
          // ...(target === 'web' || target === 'webworker'
          //   ? {
          //       process: JSON.stringify({}),
          //     }
          //   : {}),
          'process.env.TARGET': JSON.stringify(TARGET || null),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.EXPERIMENTAL_USE_CLENAUP_FOR_CM': JSON.stringify(false),
          'process.env.DEBUG': JSON.stringify(process.env.DEBUG || false),
          'process.env.DEBUG_ASSERT': JSON.stringify(
            process.env.DEBUG_ASSERT || false
          ),
        }),

        new HTMLWebpackPlugin({
          inject: true,
          template: path.join(__dirname, 'web/index.html'),
        }),

        // webpack 5
        // env.mode === 'development' &&
        //   TARGET !== 'worker' &&
        //   new ReactRefreshPlugin(),

        env.mode === 'development' &&
          TARGET !== 'worker' &&
          new ReactRefreshWebpack4Plugin({
            overlay: false,
          }),

        !!process.env.INSPECT &&
          new DuplicatesPlugin({
            emitErrors: false,
            emitHandler: undefined,
            ignoredPackages: undefined,
            verbose: false,
          }),
      ].filter(Boolean),

      // webpack 4
      // @ts-ignore
      devServer: {
        publicPath: '/',
        host: '0.0.0.0',
        compress: true,
        // watchContentBase: true,
        // It will still show compile warnings and errors with this setting.
        clientLogLevel: 'none',
        contentBase: path.join(__dirname, 'web'),
        hot: !isProduction,
        historyApiFallback: {
          disableDotRule: true,
        },
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers':
            'X-Requested-With, content-type, Authorization',
        },
      },
    }

    // PLUGINS

    if (process.env.ANALYZE_BUNDLE) {
      config.plugins.push(
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          analyzerMode: 'static',
        })
      )
    }

    if (TARGET === 'worker') {
      // exec patch
      const exec = require('child_process').exec
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            exec('node ./etc/worker-patch.js', (err, stdout, stderr) => {
              if (stdout) process.stdout.write(stdout)
              if (stderr) process.stderr.write(stderr)
            })
          })
        },
      })
    }

    if (TARGET === 'ssr') {
      config.output.path = path.join(__dirname, 'web-build-ssr')
      config.output.libraryTarget = 'commonjs'
      config.output.filename = `static/js/app.ssr.js`
      config.plugins.push(
        new Webpack.ProvidePlugin({
          mapkit: path.join(__dirname, 'web/mapkitExport.js'),
        })
      )
    }

    return config
  }

  function getAllConfigs() {
    if (TARGET === 'ssr' || TARGET === 'worker') {
      return getConfig()
    }

    if (process.env.LEGACY) {
      return getLegacyConfig()
    }

    function getLegacyConfig() {
      const config = getConfig()
      return {
        ...config,
        output: {
          ...config.output,
          filename: 'static/js/app.legacy.[hash].js',
          path: path.join(__dirname, 'web-build-legacy'),
        },
        entry: [
          // @ts-ignore
          ...config.entry,
          path.join(__dirname, 'web', 'polyfill.legacy.js'),
        ],
      }
    }

    function getModernConfig() {
      const config = getConfig()
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

    if (isProduction) {
      // lets generate a legacy and modern build
      return [getModernConfig(), getLegacyConfig()]
    } else {
      // just serve larger legacy bundle in development
      return getLegacyConfig()
    }
  }

  const finalConfig = getAllConfigs()

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

const excludedRootPaths = [
  '/node_modules',
  // Prevent transpiling webpack generated files.
  '(webpack)',
]

function babelInclude(inputPath) {
  if (inputPath.includes('@dish/')) {
    return true
  }
  if (
    excludedRootPaths.some((excluded) =>
      inputPath.includes(path.normalize(excluded))
    )
  ) {
    return false
  }
  return true
}

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
