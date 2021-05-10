import path, { join } from 'path'

import { isPresent } from '@dish/helpers'
import { CreateWebpackConfig } from '@dish/server'
import LoadablePlugin from '@loadable/webpack-plugin'
import ReactRefreshWebpack4Plugin from '@pmmmwh/react-refresh-webpack-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import esbuild from 'esbuild'
import { ESBuildMinifyPlugin } from 'esbuild-loader'
import { ensureDirSync } from 'fs-extra'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import { DuplicatesPlugin } from 'inspectpack/plugin'
// import PnpWebpackPlugin from 'pnp-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// import nodeExternals from 'webpack-node-externals'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import Webpack from 'webpack'

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// import WebpackPwaManifest from 'webpack-pwa-manifest'

let GIT_SHA = ''
try {
  GIT_SHA = `${require('child_process').execSync('git rev-parse HEAD')}`.trim()
} catch {
  // ok
}

// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!
// ⚠️ DONT USE process.env.NODE_ENV it differs from env!!!!!!!!!!!

export function createWebpackConfig({
  entry,
  env,
  target,
  cwd = process.cwd(),
  babelInclude,
  snackOptions,
  disableHot,
  resolve,
  polyFillPath,
  htmlOptions,
  resetCache,
  defineOptions,
  // pwaOptions,
  noMinify,
}: CreateWebpackConfig): Webpack.Configuration {
  const isProduction = env === 'production'
  const isDevelopment = env === 'development'
  const isSSR = target === 'node'
  const isHot = !isProduction && !isSSR && !disableHot && target !== 'node'
  const isStaticExtracted = !process.env.NO_EXTRACT
  const isVerbose = process.env.ANALYZE_BUNDLE || process.env.INSPECT
  const minimize = !isSSR && !noMinify
  const hashFileNamePart = '[contenthash]'
  const hotEntry = isHot ? 'webpack-hot-middleware/client' : null
  const smp = new SpeedMeasurePlugin()
  // prettier-ignore
  const cacheName = simpleHash(`${process.env.TARGET}${env}${GIT_SHA}${noMinify}${isHot}${isSSR}${resetCache ? Math.random() : ''}`)

  console.log(' [webpack] cacheName', cacheName)

  function getConfig() {
    const defines = {
      process: '({})',
      'process.env': '({})',
      'process.env.IS_SSR_RENDERING': isSSR,
      'process.env.SNACKUI_COMPILE_PROCESS': false,
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(target || null),
      'process.env.IS_STATIC': false,
      'process.env.DISABLE_CACHE': false,
      'process.env.IS_LIVE': JSON.stringify(process.env.IS_LIVE ?? (isProduction ? '1' : '0')),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG || false),
      'process.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL || 0),
      'process.env.DEBUG_ASSERT': JSON.stringify(process.env.DEBUG_ASSERT || false),
      ...defineOptions,
    }

    // i had to manually create the webpack cache folder or else it didnt work!
    const rootNodeModules = join(require.resolve('webpack'), '..', '..', '..')
    const cacheDir = join(rootNodeModules, '.cache', 'webpack')
    ensureDirSync(cacheDir)

    const config: Webpack.Configuration = {
      infrastructureLogging: {
        debug: process.env.DEBUG_CACHE ? /webpack\.cache/ : false,
      },
      experiments: {
        // works but home doesnt load by default
        // lazyCompilation: true,
      },
      cache: {
        name: cacheName,
        type: 'filesystem',
        buildDependencies: {
          defaultConfig: [__filename],
        },
      },
      mode: env,
      context: cwd,
      target,
      stats: {
        assets: false,
        colors: true,
      },
      externals: isSSR
        ? [
            'react',
            'react-dom',
            '@loadable/component',
            // nodeExternals({
            //   allowlist: [
            //     // react-native-web necessary, uses es imports
            //     'react-native-web',
            //     'react-native',
            //   ],
            // }),
          ]
        : [],
      devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
      entry: {
        main:
          polyFillPath || isSSR
            ? [hotEntry, polyFillPath, entry].filter(isPresent)
            : [hotEntry, entry].filter(isPresent),
      },
      output: {
        path: path.join(cwd, 'build', 'web'),
        filename: `static/js/app.${hashFileNamePart}.js`,
        publicPath: '/',
        pathinfo: !!(isDevelopment || process.env.DEBUG_PATHS),
        ...(isSSR && {
          libraryTarget: 'commonjs',
          filename: `static/js/app.ssr.${env}.js`,
          path: path.join(cwd, 'build', 'ssr'),
        }),
        // ...(legacy && {
        //   filename: `static/js/app.legacy.${hashFileNamePart}.js`,
        //   path: path.join(cwd, 'build', 'legacy'),
        // }),
      },
      node: {
        global: true,
        __filename: false,
        __dirname: false,
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.web.js', '.js'],
        mainFields: ['browser', 'tsmain', 'module', 'main'],
        ...resolve,
      },
      resolveLoader: {
        modules: ['node_modules'],
      },
      optimization: {
        moduleIds: isProduction ? 'deterministic' : 'natural',
        minimize,
        concatenateModules: isProduction,
        usedExports: isProduction,
        removeEmptyChunks: isProduction,
        innerGraph: isProduction,
        sideEffects: isProduction,
        mangleExports: isProduction,
        removeAvailableModules: isProduction,
        splitChunks:
          isProduction && !noMinify
            ? {
                maxAsyncRequests: 20,
                maxInitialRequests: 10,
                automaticNameDelimiter: '~',
                cacheGroups: {
                  default: false,
                  defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                  },
                  styles: {
                    name: `styles`,
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                  },
                },
              }
            : {
                cacheGroups: {
                  styles: {
                    name: `styles`,
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                  },
                },
              },
        runtimeChunk: false,
        minimizer: !isProduction
          ? [
              new CssMinimizerPlugin({
                minimizerOptions: {
                  preset: [
                    'lite',
                    {
                      discardDuplicates: true,
                    },
                  ],
                },
              }),
            ]
          : [
              new CssMinimizerPlugin(),
              new ESBuildMinifyPlugin({
                target: 'es2019',
                treeShaking: true,
                css: false,
              }),
            ],
      },
      module: {
        rules: [
          {
            oneOf: [
              {
                test: /\.[jt]sx?$/,
                include: babelInclude ?? defaultBabelInclude,
                // @ts-ignore
                use: [
                  'thread-loader',
                  // // fast refresh seems to work??
                  // {
                  {
                    loader: 'babel-loader',
                  },
                  isStaticExtracted
                    ? {
                        loader: require.resolve('snackui-loader'),
                        options: snackOptions,
                      }
                    : null,
                ].filter(isPresent),
              },
              {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
              },
              {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                  {
                    loader: require.resolve('url-loader'),
                    options: {
                      limit: 1000,
                      name: `static/media/[name].[hash].[ext]`,
                    },
                  },
                  // {
                  //   loader: require.resolve('image-webpack-loader'),
                  //   options: {
                  //     disable: isDevelopment,
                  //     mozjpeg: {
                  //       progressive: true,
                  //       quality: 98,
                  //     },
                  //     optipng: {
                  //       enabled: true,
                  //     },
                  //     pngquant: {
                  //       quality: [0.8, 0.9],
                  //       speed: 4,
                  //     },
                  //     gifsicle: {
                  //       interlaced: false,
                  //     },
                  //   },
                  // },
                ],
              },
              {
                test: /\.mdx?$/,
                use: [
                  {
                    loader: require.resolve('babel-loader'),
                  },
                  {
                    loader: require.resolve('@mdx-js/loader'),
                  },
                ],
              },
              // fallback loader helps webpack-dev-server serve assets
              {
                loader: require.resolve('file-loader'),
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
        new MiniCssExtractPlugin(
          isProduction
            ? {
                filename: '[name].[contenthash].css',
              }
            : undefined
        ),

        isSSR && new LoadablePlugin(),

        // slim down unused react-native-web modules
        new Webpack.NormalModuleReplacementPlugin(
          /react-native-web.*Virtualized(Section)?List.*/,
          require.resolve('@dish/proxy-worm')
        ),

        new Webpack.DefinePlugin(defines),

        !!htmlOptions && new HTMLWebpackPlugin(htmlOptions),

        // !!pwaOptions && new WebpackPwaManifest(pwaOptions),

        !!isVerbose &&
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

        isHot && new Webpack.HotModuleReplacementPlugin({}),

        isVerbose &&
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
    console.log('Config:\n', cacheName, conf)
    if (!Array.isArray(conf)) {
      console.log('rules', JSON.stringify(conf.module.rules, null, 2))
    }
  }

  return conf
}

const excludedRootPaths = [
  '/node_modules',
  // Prevent transpiling webpack generated files.
  '(webpack)',
]

function defaultBabelInclude(inputPath) {
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

  if (excludedRootPaths.some((excluded) => inputPath.includes(path.normalize(excluded)))) {
    return false
  }
  return true
}

const simpleHash = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36)
}
