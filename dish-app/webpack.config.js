const WebpackPwaManifest = require('webpack-pwa-manifest')
const LodashPlugin = require('lodash-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const { DuplicatesPlugin } = require('inspectpack/plugin')
const ReactRefreshWebpack4Plugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const Webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const DedupeParentCssFromChunksWebpackPlugin = require('dedupe-parent-css-from-chunks-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin()

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const isSSRClient = !!process.env.SSR_CLIENT

// 'ssr' | 'worker' | 'preact' | 'client'
const TARGET = process.env.TARGET || 'client'
const target =
  TARGET === 'ssr' ? 'node' : TARGET === 'worker' ? 'webworker' : 'web'
const appEntry = path.resolve(path.join(__dirname, 'src', 'index.web.tsx'))

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const isSSR = TARGET === 'ssr'
const isHot =
  !isProduction &&
  !isSSR &&
  !isSSRClient &&
  TARGET !== 'worker' &&
  target !== 'node'
const isStaticExtracted = !process.env.NO_EXTRACT

const minimize =
  process.env.NO_MINIFY || TARGET === 'ssr'
    ? false
    : isProduction && TARGET !== 'ssr'

const hashFileNamePart = isProduction ? '[contenthash]' : '[fullhash]'

console.log('webpack.config', { isProduction, target })

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
      stats: {
        assets: false,
        colors: true,
      },
      devServer: {
        hot: isHot,
        static: false,
        firewall: false,
        injectHot: true,
        host: '0.0.0.0',
        historyApiFallback: {
          disableDotRule: true,
        },
        overlay: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers':
            'X-Requested-With, content-type, Authorization',
        },
      },
      externals: isSSR
        ? {
            react: 'react',
            'react-dom': 'react-dom',
            overmind: 'overmind',
            'overmind-react': 'overmind-react',
          }
        : [],
      devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
      entry: {
        main:
          process.env.LEGACY || isSSR
            ? [
                path.join(__dirname, 'src', 'web', 'polyfill.legacy.js'),
                appEntry,
              ]
            : appEntry,
      },
      output: {
        path: path.join(__dirname, 'web-build'),
        filename: `static/js/app.${hashFileNamePart}.js`,
        publicPath: '/',
        pathinfo: !!(isDevelopment || process.env.DEBUG_PATHS),
        ...(isSSR && {
          libraryTarget: 'commonjs',
          filename: `static/js/app.ssr.${process.env.NODE_ENV}.js`,
          path: path.join(__dirname, 'web-build-ssr'),
        }),
        ...(process.env.LEGACY && {
          filename: `static/js/app.legacy.${hashFileNamePart}.js`,
          path: path.join(__dirname, 'web-build-legacy'),
        }),
      },
      node: {
        global: true,
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
          '@dish/gqless': path.join(require.resolve('@dish/gqless'), '..'),
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
        minimize,
        concatenateModules: isProduction && !process.env.ANALYZE_BUNDLE,
        usedExports: isProduction,
        removeEmptyChunks: isProduction,
        splitChunks:
          isProduction && TARGET != 'ssr' && !process.env.NO_MINIFY
            ? {
                chunks: 'async',
                minSize: 20000,
                minChunks: 1,
                maxAsyncRequests: 20,
                maxInitialRequests: 10,
                automaticNameDelimiter: '~',
                cacheGroups: {
                  default: {
                    minChunks: 1,
                    priority: -20,
                    reuseExistingChunk: true,
                  },
                  defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                  },
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
          minimize == false
            ? []
            : [
                new TerserPlugin({
                  parallel: true,
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
                    loader: require.resolve('@snackui/static/loader'),
                    options: {
                      evaluateImportsWhitelist: ['constants.js', 'colors.js'],
                      themesFile: require.resolve('./src/constants/themes.ts'),
                    },
                  },
                ].filter(Boolean),
              },
              {
                test: /\.css$/i,
                use:
                  isProduction && TARGET !== 'ssr'
                    ? [
                        {
                          loader: ExtractCssChunks.loader,
                          options: {
                            hmr: isHot,
                          },
                        },
                        'css-loader',
                      ]
                    : ['style-loader', 'css-loader'],
              },
              {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 1000,
                      name: `static/media/[name].[hash].[ext]`,
                    },
                  },
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      disable: isDevelopment,
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

        // slim down unused react-native-web modules
        new Webpack.NormalModuleReplacementPlugin(
          /react-native-web.*Virtualized(Section)?List.*/,
          require.resolve('@dish/proxy-worm')
        ),

        // breaks a couple things, possible to ignore them to fix
        // isClient && isProduction && new ShakePlugin({}),

        ...((isProduction &&
          TARGET != 'ssr' && [
            // new LodashPlugin({
            //   // fixes issue i had https://github.com/lodash/lodash/issues/3101
            //   shorthands: true,
            // }),
            new ExtractCssChunks({
              esModule: true,
              ignoreOrder: false,
            }),
            new DedupeParentCssFromChunksWebpackPlugin({
              assetNameRegExp: /\.optimize\.css$/g, // the default is /\.css$/g
              canPrint: true, // the default is true
            }),
          ]) ||
          []),

        new Webpack.DefinePlugin({
          ...(isProduction && {
            process: '({})',
            'process.env': '({})',
          }),
          'process.env.DISABLE_CACHE': false,
          'process.env.IS_STATIC': false,
          'process.env.TARGET': JSON.stringify(TARGET || null),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.IS_LIVE': JSON.stringify(process.env.IS_LIVE),
          'process.env.DEBUG': JSON.stringify(process.env.DEBUG || false),
          'process.env.DEBUG_ASSERT': JSON.stringify(
            process.env.DEBUG_ASSERT || false
          ),
        }),

        new HTMLWebpackPlugin({
          inject: true,
          favicon: 'src/web/favicon.png',
          template: path.join(__dirname, 'src/index.html'),
        }),

        new WebpackPwaManifest({
          name: 'Dish',
          short_name: 'Dish',
          description: 'The Food Pokedex',
          background_color: '#000',
          crossorigin: 'use-credentials',
          icons: [
            {
              src: path.resolve('src/assets/icon.png'),
              sizes: [96, 128, 192, 512, 1024],
            },
          ],
        }),

        !!process.env.INSPECT &&
          new DuplicatesPlugin({
            emitErrors: false,
            emitHandler: undefined,
            ignoredPackages: undefined,
            verbose: false,
          }),

        // somewhat slow for rebuilds
        !!(process.env.CIRCULAR_DEPS || isProduction) &&
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
            exclude: /gqless|react-refresh|node_modules/,
            // include: /snackui/,
          }),

        process.env.ANALYZE_BUNDLE &&
          new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
            analyzerMode: 'static',
          }),
      ].filter(Boolean),
    }

    // for profiling plugin speed
    // ⚠️ this breaks HMR! Only use it for debugging
    if (process.env.PROFILE_WEBPACK) {
      return smp.wrap(config)
    }

    return config
  }

  const conf = getConfig()

  if (process.env.VERBOSE) {
    console.log('Config:\n', conf)
    if (!Array.isArray(conf)) {
      console.log('rules', JSON.stringify(conf.module.rules, null, 2))
    }
  } else {
    console.log(`Start building ${TARGET}...`)
  }

  return conf
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
  if (inputPath.includes('match-media')) {
    return true
  }
  if (inputPath.includes('react-native-reanimated')) {
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
