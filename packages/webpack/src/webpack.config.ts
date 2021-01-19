import path, { join } from 'path'

import { isPresent } from '@dish/helpers'
import { CreateWebpackConfig } from '@dish/server'
import LoadablePlugin from '@loadable/webpack-plugin'
import ReactRefreshWebpack4Plugin from '@pmmmwh/react-refresh-webpack-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import DedupeParentCssFromChunksWebpackPlugin from 'dedupe-parent-css-from-chunks-webpack-plugin'
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import { ensureDirSync } from 'fs-extra'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import { DuplicatesPlugin } from 'inspectpack/plugin'
// import LodashPlugin from 'lodash-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import TimeFixPlugin from 'time-fix-plugin'
import Webpack from 'webpack'
import WebpackPwaManifest from 'webpack-pwa-manifest'

export default function createWebpackConfig({
  entry,
  env,
  target,
  cwd = process.cwd(),
  babelInclude,
  snackOptions,
  legacy,
  disableHot,
  resolve,
  polyFillPath,
  htmlOptions,
  defineOptions,
  pwaOptions,
  noMinify,
}: CreateWebpackConfig): Webpack.Configuration {
  const isProduction = env === 'production'
  const isDevelopment = env === 'development'
  const isSSR = target === 'node'
  const isHot = !isProduction && !isSSR && !disableHot && target !== 'node'
  const isStaticExtracted = !process.env.NO_EXTRACT
  const minimize = noMinify || isSSR ? false : isProduction && !isSSR
  const hashFileNamePart = isProduction ? '[contenthash]' : '[fullhash]'
  const hotEntry = isHot ? 'webpack-hot-middleware/client' : null
  const smp = new SpeedMeasurePlugin()

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
      'process.env.IS_LIVE': JSON.stringify(process.env.IS_LIVE ?? false),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG || false),
      'process.env.DEBUG_ASSERT': JSON.stringify(
        process.env.DEBUG_ASSERT || false
      ),
      ...defineOptions,
    }

    if (process.env.DEBUG) {
      console.log('defines', defines)
    }

    // i had to manually create the webpack cache folder or else it didnt work!
    const rootNodeModules = join(require.resolve('webpack'), '..', '..', '..')
    const cacheDir = join(rootNodeModules, '.cache', 'webpack')
    ensureDirSync(cacheDir)

    const config: Webpack.Configuration = {
      infrastructureLogging: {
        debug: process.env.DEBUG_CACHE ? /webpack\.cache/ : false,
      },
      cache: {
        name: `${process.env.TARGET}${process.env.NODE_ENV}`,
        type: 'filesystem',
        buildDependencies: {
          defaultConfig: [__filename],
        },
      },
      mode: process.env.NODE_ENV as any,
      context: cwd,
      target,
      stats: {
        assets: false,
        colors: true,
      },
      externals: isSSR
        ? {
            react: 'react',
            'react-dom': 'react-dom',
          }
        : [],
      devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
      entry: {
        main:
          legacy || isSSR
            ? [hotEntry, polyFillPath, entry].filter(isPresent)
            : [hotEntry, entry].filter(isPresent),
      },
      output: {
        path: path.join(cwd, 'build', 'modern'),
        filename: `static/js/app.${hashFileNamePart}.js`,
        publicPath: '/',
        pathinfo: !!(isDevelopment || process.env.DEBUG_PATHS),
        ...(isSSR && {
          libraryTarget: 'commonjs',
          filename: `static/js/app.ssr.${process.env.NODE_ENV}.js`,
          path: path.join(cwd, 'build', 'ssr'),
        }),
        ...(legacy && {
          filename: `static/js/app.legacy.${hashFileNamePart}.js`,
          path: path.join(cwd, 'build', 'legacy'),
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
        ...resolve,
      },
      resolveLoader: {
        modules: ['node_modules'],
      },
      optimization: {
        moduleIds: 'deterministic',
        minimize,
        concatenateModules: isProduction && !process.env.ANALYZE_BUNDLE,
        usedExports: isProduction,
        removeEmptyChunks: isProduction,
        splitChunks:
          isProduction && !isSSR && !noMinify
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
                  isStaticExtracted
                    ? {
                        loader: 'snackui-loader',
                        options: snackOptions,
                      }
                    : null,
                ].filter(isPresent),
              },
              {
                test: /\.css$/i,
                use:
                  isProduction && !isSSR
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
          !isSSR && [
            // new LodashPlugin({
            //   // fixes issue i had https://github.com/lodash/lodash/issues/3101
            //   shorthands: true,
            // }),
            new ExtractCssChunks({
              // @ts-expect-error
              esModule: true,
              ignoreOrder: false,
            }),
            new DedupeParentCssFromChunksWebpackPlugin({
              assetNameRegExp: /\.optimize\.css$/g, // the default is /\.css$/g
              canPrint: true, // the default is true
            }),
          ]) ||
          []),

        new Webpack.DefinePlugin(defines),

        !!htmlOptions && new HTMLWebpackPlugin(htmlOptions),

        !!pwaOptions && new WebpackPwaManifest(pwaOptions),

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

        isHot && new Webpack.HotModuleReplacementPlugin({}),

        new TimeFixPlugin(),

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
  }

  return conf
}
