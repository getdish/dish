const LoadablePlugin = require('@loadable/webpack-plugin')
const { DuplicatesPlugin } = require('inspectpack/plugin')
const ReactRefreshWebpack4Plugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const Webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const LodashPlugin = require('lodash-webpack-plugin')
// const ClosurePlugin = require('closure-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh')
const { UIStaticWebpackPlugin } = require('snackui-static')
const CircularDependencyPlugin = require('circular-dependency-plugin')

// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const DedupeParentCssFromChunksWebpackPlugin = require('dedupe-parent-css-from-chunks-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const isSSRClient = !!process.env.SSR_CLIENT

// 'ssr' | 'worker' | 'preact' | 'client'
const TARGET = process.env.TARGET || 'client'
const target =
  TARGET === 'ssr' ? 'node' : TARGET === 'worker' ? 'webworker' : 'web'
const appEntry = path.resolve(path.join(__dirname, 'web', 'index.web.tsx'))

const isProduction = process.env.NODE_ENV === 'production'
// const isClient = TARGET === 'client'
const isSSR = TARGET === 'ssr'
const isHot =
  !isProduction &&
  !isSSR &&
  !isSSRClient &&
  TARGET !== 'worker' &&
  target !== 'node'
const isStaticExtracted = !process.env.NO_EXTRACT

const hashFileNamePart = isProduction ? '[contenthash]' : '[hash]'

console.log('webpack.config', { isProduction, TARGET })

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
      externals: isSSR
        ? {
            react: 'react',
            'react-dom': 'react-dom',
          }
        : [],
      stats: 'normal',
      devtool:
        env.mode === 'production' ? 'source-map' : 'cheap-module-source-map',
      entry: {
        main: process.env.LEGACY ? ['babel-polyfill', appEntry] : appEntry,
      },
      output: {
        path: path.resolve(__dirname),
        filename: `static/js/app.${hashFileNamePart}.js`,
        publicPath: '/',
        // globalObject: 'this',
      },
      // webpack 4
      node: {
        global: true,
        process: 'mock',
        Buffer: false,
        util: false,
        console: false,
        setImmediate: false,
        __filename: false,
        __dirname: false,
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.web.js', '.js'],
        mainFields: ['tsmain', 'browser', 'module', 'main'],
        alias: {
          react: path.join(require.resolve('react'), '..'),
          'react-dom': path.join(require.resolve('react-dom'), '..'),
          'react-native': 'react-native-web',
          '@dish/react-feather': 'react-feather',
          '@o/gqless': path.join(require.resolve('@o/gqless'), '..'),
          recyclerlistview: 'recyclerlistview/web',
          // bugfix until merged
          'react-native-web/src/modules/normalizeColor':
            'react-native-web/dist/modules/normalizeColor',
        },
      },
      resolveLoader: {
        modules: ['node_modules'],
      },
      optimization: {
        minimize: !process.env.NO_MINIFY && isProduction && TARGET !== 'ssr',
        concatenateModules: isProduction && !process.env.ANALYZE_BUNDLE,
        usedExports: isProduction,
        removeEmptyChunks: true,
        // mergeDuplicateChunks: true,
        splitChunks:
          isProduction && TARGET != 'ssr' && !process.env.NO_MINIFY
            ? {
                cacheGroups: {
                  styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                  },
                },
              }
            : false,
        runtimeChunk: false,
        minimizer:
          TARGET === 'ssr' || !isProduction
            ? []
            : [
                // new ClosurePlugin(),
                new TerserPlugin({
                  parallel: true,
                  sourceMap: true,
                }),
                new OptimizeCSSAssetsPlugin({}),
              ],
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
                  },
                  isStaticExtracted && {
                    loader: require.resolve('snackui-static/loader'),
                    options: {
                      evaluateImportsWhitelist: ['constants.js', 'colors.js'],
                    },
                  },
                ].filter(Boolean),
              },
              {
                test: /\.css$/i,
                use:
                  isProduction && TARGET !== 'ssr'
                    ? [ExtractCssChunks.loader, 'css-loader']
                    : ['style-loader', 'css-loader'],
              },
              {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 1000,
                      name: `static/media/[name].${hashFileNamePart}.[ext]`,
                    },
                  },
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      mozjpeg: {
                        progressive: true,
                        quality: 98,
                      },
                      optipng: {
                        enabled: true,
                      },
                      pngquant: {
                        quality: [0.8, 0.9],
                        speed: 4,
                      },
                      gifsicle: {
                        interlaced: false,
                      },
                    },
                  },
                ],
              },
              {
                test: /\.mdx?$/,
                use: [
                  {
                    loader: 'babel-loader',
                  },
                  {
                    loader: '@mdx-js/loader',
                  },
                ],
              },
              // fallback loader helps webpack-dev-server serve assets
              {
                loader: 'file-loader',
                // Exclude `js` files to keep "css" loader working as it injects
                // its runtime that would otherwise be processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed by webpacks internal loaders.
                exclude: [/\.(mjs|[jt]sx?)$/, /\.html$/, /\.json$/],
                options: {
                  name: `static/media/[name].${hashFileNamePart}.[ext]`,
                },
              },
            ],
          },
        ],
      },
      plugins: [
        isSSR && new LoadablePlugin(),

        // breaks a couple things, possible to ignore
        // isClient && isProduction && new ShakePlugin({}),

        ...((isProduction &&
          TARGET != 'ssr' && [
            new LodashPlugin({
              // fixes issue i had https://github.com/lodash/lodash/issues/3101
              shorthands: true,
            }),
            new ExtractCssChunks(),
            new DedupeParentCssFromChunksWebpackPlugin({
              assetNameRegExp: /\.optimize\.css$/g, // the default is /\.css$/g
              canPrint: true, // the default is true
            }),
          ]) ||
          []),

        // extract static styles in production
        isStaticExtracted && new UIStaticWebpackPlugin(),

        new Webpack.DefinePlugin({
          'process.env.IS_STATIC': false,
          'process.env.TARGET': JSON.stringify(TARGET || null),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.DEBUG': JSON.stringify(process.env.DEBUG || false),
          'process.env.DEBUG_ASSERT': JSON.stringify(
            process.env.DEBUG_ASSERT || false
          ),
        }),

        new HTMLWebpackPlugin({
          inject: true,
          favicon: 'web/favicon.png',
          template: path.join(__dirname, 'web/index.html'),
        }),

        !!process.env.INSPECT &&
          new DuplicatesPlugin({
            emitErrors: false,
            emitHandler: undefined,
            ignoredPackages: undefined,
            verbose: false,
          }),

        new CircularDependencyPlugin({
          // exclude detection of files based on a RegExp
          exclude: /a\.js|node_modules/,
          // include specific files based on a RegExp
          // include: /src/,
          // add errors to webpack instead of warnings
          // failOnError: true,
          // allow import cycles that include an asyncronous import,
          // e.g. via import(/* webpackMode: "weak" */ './file.js')
          allowAsyncCycles: false,
          // set the current working directory for displaying module paths
          cwd: process.cwd(),
        }),

        isHot &&
          new ReactRefreshWebpack4Plugin({
            overlay: false,
            exclude: /gqless|bootstrap|react-refresh/,
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
        hot: isHot,
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
      config.output.filename = `static/js/app.ssr.${process.env.NODE_ENV}.js`
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
          filename: `static/js/app.legacy.${hashFileNamePart}.js`,
          path: path.join(__dirname, 'web-build-legacy'),
        },
        entry: [path.join(__dirname, 'web', 'polyfill.legacy.js'), appEntry],

        // {
        //   // before main
        //   ,
        //   main: appEntry,
        // },
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

    if (isProduction || isSSRClient) {
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
  if (inputPath.includes('react-native-animatable')) {
    return true
  }
  if (inputPath.includes('expo-linear-gradient')) {
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
