import { isPresent } from '@dish/helpers'
import { CreateWebpackConfig } from '@dish/server'
import LoadablePlugin from '@loadable/webpack-plugin'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'
// import esbuild from 'esbuild'
import { ESBuildMinifyPlugin } from 'esbuild-loader'
import { ensureDirSync, readFileSync } from 'fs-extra'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import { DuplicatesPlugin } from 'inspectpack/plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
// import PnpWebpackPlugin from 'pnp-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path, { join } from 'path'
// import nodeExternals from 'webpack-node-externals'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import Webpack from 'webpack'
import { WebpackDeduplicationPlugin } from 'webpack-deduplication-plugin'

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')

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

export function createWebpackConfig(config: CreateWebpackConfig): Webpack.Configuration {
  const {
    entry,
    env,
    target,
    cwd = process.cwd(),
    tamaguiInclude,
    tamaguiOptions,
    disableHot,
    resolve,
    polyFillPath,
    htmlOptions,
    resetCache,
    defineOptions,
    // pwaOptions,
    noMinify,
  } = config
  const isProduction = env === 'production'
  const isDevelopment = env === 'development'
  const isSSR = target === 'node'
  const isHot = !isProduction && !isSSR && !disableHot
  const isStaticExtracted = !process.env.NO_EXTRACT
  const isVerbose = process.env.ANALYZE_BUNDLE || process.env.INSPECT
  const minimize = !isSSR && !noMinify
  const hashFileNamePart = '[contenthash]'
  const hotEntry = isHot ? 'webpack-hot-middleware/client' : null
  const smp = new SpeedMeasurePlugin()
  const defines = {
    __DEV__: JSON.stringify(isDevelopment),
    process: '({})',
    'process.env': '({})',
    'process.env.IS_SSR_RENDERING': isSSR,
    // 'process.env.TAMAGUI_COMPILE_PROCESS': false,
    'process.env.NODE_ENV': JSON.stringify(env),
    'process.env.TARGET': JSON.stringify(target || null),
    'process.env.IS_STATIC': false,
    'process.env.DISABLE_CACHE': false,
    'process.env.IS_LIVE': JSON.stringify(process.env.IS_LIVE ?? (isProduction ? '1' : '0')),
    'process.env.DEBUG': JSON.stringify(process.env.DEBUG || ''),
    'process.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL || 0),
    'process.env.DEBUG_ASSERT': JSON.stringify(process.env.DEBUG_ASSERT || false),
    'process.env.TAMAGUI_TARGET': '"web"',
    ...Object.fromEntries(
      Object.entries(defineOptions || {}).map(([key, value]) => [key, JSON.stringify(value)])
    ),
  }

  const cacheName = simpleHash(`
    ${readFileSync(join(__dirname, '..', '..', 'src', 'webpack.config.ts'), 'utf-8')}
    ${JSON.stringify(config)}
    ${JSON.stringify(defines)}
    ${GIT_SHA}
    ${resetCache ? Math.random() : ''}
  `)

  console.log(' [webpack]', { cacheName, minimize, isStaticExtracted })

  function getConfig() {
    // i had to manually create the webpack cache folder or else it didnt work!
    const rootNodeModules = join(require.resolve('webpack'), '..', '..', '..')
    const cacheDir = join(rootNodeModules, '.cache', 'webpack')
    ensureDirSync(cacheDir)

    function defaultTamaguiInclude(inputPath: string) {
      if (inputPath.startsWith(cwd)) {
        return true
      }
      if (inputPath.includes('@dish/')) {
        return true
      }
      if (inputPath.includes('tamagui')) {
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

    let config: Webpack.Configuration = {
      infrastructureLogging: {
        debug: process.env.DEBUG_CACHE ? /webpack\.cache/ : false,
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
        // logging: 'verbose',
        // moduleAssets: true,
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
      // eval-cheap-module-source-map (original lines)
      // eval-cheap-source-map (transformed lines)
      // eval-nosources-cheap-source-map (transformed lines)
      devtool: isProduction ? 'source-map' : 'eval',
      entry: {
        main:
          polyFillPath || isSSR
            ? [hotEntry, polyFillPath, entry].filter(isPresent)
            : [hotEntry, entry].filter(isPresent),
      },
      experiments: {
        topLevelAwait: true,
      },
      output: {
        path: path.join(cwd, 'build', 'web'),
        filename: `static/js/app.${hashFileNamePart}.js`,
        publicPath: '/',
        pathinfo: !!(isDevelopment || process.env.DEBUG_PATHS),
        assetModuleFilename: 'images/[hash][ext][query]',
        ...(isSSR && {
          libraryTarget: 'commonjs',
          filename: `static/js/app.ssr.${env}.js`,
          path: path.join(cwd, 'build', 'ssr'),
        }),
      },
      node: {
        global: true,
        __filename: false,
        __dirname: false,
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.web.js', '.js'],
        mainFields: ['module:jsx', 'browser', 'module', 'main'],
        ...resolve,
        alias: {
          'nanoid/non-secure': require.resolve('nanoid/non-secure').replace('.cjs', '.js'),
          ...resolve?.alias,
        },
      },
      resolveLoader: {
        modules: ['node_modules'],
      },
      optimization: {
        moduleIds: isProduction ? 'deterministic' : 'natural',
        minimize,
        concatenateModules: process.env.ANALYZE_BUNDLE ? false : isProduction,
        usedExports: isProduction,
        removeEmptyChunks: isProduction,
        // innerGraph: isProduction,
        // sideEffects: isProduction,
        // mergeDuplicateChunks: isProduction,
        // realContentHash: isProduction,
        // providedExports: isProduction,
        mangleExports: isProduction,
        removeAvailableModules: isProduction,
        splitChunks:
          isProduction && !noMinify
            ? // TODO pull vendors out into own bundle
              // It's best practice to isolate a bundle that can load React at fast as possible without any code
              // https://github.com/reactwg/react-18/discussions/37#discussioncomment-841427
              {
                chunks: 'async',
                maxAsyncRequests: 20,
                maxInitialRequests: 5,
                automaticNameDelimiter: '~',
                cacheGroups: {
                  default: {
                    priority: -20,
                    reuseExistingChunk: true,
                  },
                  defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
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
                chunks: 'async',
                cacheGroups: {
                  defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                  },
                  styles: {
                    name: `styles`,
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                  },
                },
              },
        runtimeChunk: !isProduction,
        minimizer: !isProduction
          ? []
          : [
              new CssMinimizerPlugin(),
              new ESBuildMinifyPlugin({
                target: 'es2020',
                treeShaking: true,
                css: false,
                // implementation: esbuild,
              }),
            ],
      },
      module: {
        rules: [
          {
            oneOf: [
              {
                test: /(bottom-sheet).*\.[tj]sx?$/,
                use: [
                  {
                    loader: 'babel-loader',
                    options: {
                      plugins: [
                        'react-native-reanimated/plugin',
                        '@babel/plugin-transform-react-jsx',
                      ],
                    },
                  },
                ],
              },

              {
                test: /\.m?[jt]sx?$/,
                resolve: {
                  fullySpecified: false,
                },
                include: (file) => {
                  const res = (tamaguiInclude ?? defaultTamaguiInclude)(file)
                  // console.log('including', res, file)
                  return res
                },

                use: [
                  // 'thread-loader',

                  // {
                  //   loader: 'babel-loader',
                  //   options: {
                  //     plugins: ['react-native-reanimated/plugin'],
                  //   },
                  // },

                  {
                    loader: require.resolve('esbuild-loader'),
                    options: {
                      loader: 'tsx',
                      target: 'es2022',
                      keepNames: true,
                      implementation: require('esbuild'),
                      jsx: 'automatic',
                      tsconfigRaw: {
                        compilerOptions: {
                          jsx: 'react-jsx',
                        },
                      },
                    },
                  },

                  isStaticExtracted
                    ? {
                        loader: require.resolve('tamagui-loader'),
                        options: tamaguiOptions,
                      }
                    : null,
                ].filter(isPresent),
              },

              {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
                sideEffects: true,
              },

              {
                test: /\.(png|svg|jpe?g|gif)$/,
                type: 'javascript/auto',
                use: [
                  {
                    loader: require.resolve('file-loader'),
                    options: {
                      limit: 8192,
                      name: `[name].[ext]`,
                      // react-native-web compat
                      // https://github.com/necolas/react-native-web/commit/17d8b12299baf353968c1fed434336715a0e7bcc
                      esModule: false,
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
                    loader: require.resolve('esbuild-loader'),
                    options: {
                      loader: 'tsx',
                      target: 'esnext',
                    },
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
        new WebpackDeduplicationPlugin({
          cacheDir,
          rootPath: path.join(rootNodeModules, '..'),
        }),

        new LodashModuleReplacementPlugin(),

        isSSR && new LoadablePlugin(),

        // slim down unused react-native-web modules
        (() => {
          // can add this back once we move off Animated.View s 'Animated' , 'AnimatedFlatList'
          const excludeExports = ['Switch', 'ProgressBar', 'Picker']
          const regexStr = `\/react-native-web\/.*(${excludeExports.join('|')}).*\/`
          const regex = new RegExp(regexStr)
          return new Webpack.NormalModuleReplacementPlugin(
            regex,
            require.resolve('@tamagui/proxy-worm')
          )
        })(),

        new Webpack.DefinePlugin(defines),

        !!htmlOptions && new HTMLWebpackPlugin(htmlOptions),

        !!htmlOptions &&
          isProduction &&
          new PreloadWebpackPlugin({
            rel: 'preload',
            include: 'initial',
            as(entry) {
              if (/\.css$/.test(entry)) return 'style'
              if (/\.(jpg|png)$/.test(entry)) return 'image'
              if (/\.(woff|woff2|otf|ttf)$/.test(entry)) return 'font'
              return 'script'
            },
          }),

        // isProduction && new HTMLInlineCSSWebpackPlugin(),

        // !!pwaOptions && new WebpackPwaManifest(pwaOptions),

        (isVerbose || isProduction) &&
          new DuplicatesPlugin({
            emitErrors: false,
            emitHandler: undefined,
            ignoredPackages: undefined,
            verbose: false,
          }),

        // somewhat slow for rebuilds
        !!(process.env.CIRCULAR_DEPS || isProduction) &&
          new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            allowAsyncCycles: false,
            cwd: process.cwd(),
          }),

        isHot &&
          new ReactRefreshPlugin({
            overlay: false,
            exclude: /gqty|react-refresh|node_modules\/(?!tamagui)/,
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
      config = smp.wrap(config)
    }

    // https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
    config.plugins!.push(
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      })
    )

    return config
    // }

    // return config
  }

  const conf = getConfig()

  if (process.env.VERBOSE) {
    console.log('Config:\n', cacheName, conf)
    if (!Array.isArray(conf)) {
      console.log('rules', JSON.stringify(conf.module!.rules, null, 2))
    }
  }

  return conf
}

const excludedRootPaths = [
  '/node_modules',
  // Prevent transpiling webpack generated files.
  '(webpack)',
]

const simpleHash = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36)
}
