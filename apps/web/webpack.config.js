const { DuplicatesPlugin } = require('inspectpack/plugin')
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const _ = require('lodash')
const Webpack = require('webpack')
// const ClosurePlugin = require('closure-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const LodashPlugin = require('lodash-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh')
// const ReactNativeUIPlugin = require('@dish/ui-static')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = process.env.NODE_ENV === 'production'

// 'ssr' | 'worker' | 'preact' | 'client'
const TARGET = process.env.TARGET || 'client'
console.log('TARGET', TARGET)
const appEntry = path.resolve(path.join(__dirname, 'web', 'index.web.tsx'))
const graphRoot = path.join(require.resolve('@dish/graph'), '..', '..', '..')
console.log('graphRoot', graphRoot)

module.exports = function getWebpackConfig(
  env = {
    /** @type {any} */
    mode: process.env.NODE_ENV,
  },
  argv
) {
  const isHot = !isProduction

  /** @type {Webpack.Configuration} */
  const config = {
    mode: env.mode || process.env.NODE_ENV,
    context: __dirname,
    target:
      TARGET === 'ssr' ? 'node' : TARGET === 'worker' ? 'webworker' : 'web',
    stats: 'normal',
    devtool:
      env.mode === 'production' ? 'source-map' : 'cheap-module-source-map',
    // @ts-ignore
    entry: [
      isHot && '@webhotelier/webpack-fast-refresh/runtime.js',
      appEntry,
    ].filter(Boolean),
    output: {
      path: path.resolve(__dirname),
      filename: `static/js/app.[contenthash].js`,
      publicPath: '/',
      globalObject: 'this',
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
            }
          : {
              react: path.join(require.resolve('react'), '..'),
              'react-dom': path.join(require.resolve('react-dom'), '..'),
              '@dish/graph': require.resolve('@dish/graph'),
              gqless: path.join(graphRoot, 'node_modules', 'gqless'),
            },
    },
    resolveLoader: {
      modules: ['node_modules'],
    },
    optimization: {
      minimize: !process.env.NO_MINIFY && isProduction && TARGET !== 'ssr',
      concatenateModules: isProduction && !process.env.ANALYZE_BUNDLE,
      usedExports: isProduction,
      splitChunks:
        isProduction && TARGET !== 'ssr'
          ? {
              // http2
              chunks: 'all',
              maxInitialRequests: 30,
              maxAsyncRequests: 30,
              maxSize: 100000,
            }
          : false,
      runtimeChunk: false,
      minimizer: [
        // new ClosurePlugin(),
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            ecma: 6,
            warnings: false,
            parse: {},
            compress: {},
            mangle: true,
            module: false,
            toplevel: false,
            ie8: false,
            // output: null,
            // keep_classnames: undefined,
            keep_fnames: false,
            safari10: false,
          },
        }),
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
                isHot && {
                  loader: '@webhotelier/webpack-fast-refresh/loader.js',
                },
              ].filter(Boolean),
            },
            {
              test: /\.css$/i,
              use: ['style-loader', 'css-loader'],
            },
            {
              test: /\.(png|svg|jpe?g|gif)$/,
              use: {
                loader: 'url-loader',
                options: {
                  limit: 1000,
                  name: 'static/media/[name].[contenthash].[ext]',
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
                name: 'static/media/[name].[contenthash].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // new ReactNativeUIPlugin(),
      // new LodashPlugin(),
      new Webpack.DefinePlugin({
        process: JSON.stringify({}),
        'process.env.TARGET': JSON.stringify(TARGET || null),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.EXPERIMENTAL_USE_CLENAUP_FOR_CM': JSON.stringify(false),
        'process.env.DEBUG': JSON.stringify(false),
      }),
      new HTMLWebpackPlugin({
        inject: true,
        template: path.join(__dirname, 'web/index.html'),
      }),
      env.mode === 'development' &&
        TARGET !== 'worker' &&
        new ReactRefreshPlugin(),
      // new ReactRefreshWebpackPlugin({
      //   overlay: false,
      // }),
      !!process.env.INSPECT &&
        new DuplicatesPlugin({
          emitErrors: false,
          emitHandler: undefined,
          ignoredPackages: undefined,
          verbose: false,
        }),
    ].filter(Boolean),
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
          exec('node ./worker-patch.js', (err, stdout, stderr) => {
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

  function getConfig() {
    if (TARGET === 'ssr' || TARGET === 'worker' || TARGET === 'preact') {
      return config
    }

    function getLegacyConfig() {
      return {
        ...config,
        output: {
          ...config.output,
          filename: 'static/js/app.legacy.[contenthash].js',
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

const getModule = (name) => path.join('node_modules', name)

const excludedRootPaths = [
  '/node_modules',
  '/bower_components',
  '/.expo/',
  // Prevent transpiling webpack generated files.
  '(webpack)',
]

// Only compile files from the react ecosystem.
const modules = [
  getModule('react-native'),
  getModule('expo'),
  getModule('unimodules'),
  getModule('@react'),
  getModule('@unimodules'),
  getModule('native-base'),
  // include our packages
  path.join(__dirname, '..', '..', 'packages'),
  getModule('create-react-class'),
]

function babelInclude(inputPath) {
  for (const possibleModule of modules) {
    if (inputPath.includes(path.normalize(possibleModule))) {
      return true
    }
  }
  // Is inside the project and is not one of designated modules
  if (inputPath.includes(__dirname)) {
    for (const excluded of excludedRootPaths) {
      if (inputPath.includes(path.normalize(excluded))) {
        return false
      }
    }
    return true
  }
  return false
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
