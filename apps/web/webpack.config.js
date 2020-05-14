const { DuplicatesPlugin } = require('inspectpack/plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const _ = require('lodash')
const Webpack = require('webpack')
const ClosurePlugin = require('closure-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const LodashPlugin = require('lodash-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = process.env.NODE_ENV === 'production'

// 'ssr' | 'worker' | 'preact' | 'client'
const TARGET = process.env.TARGET || 'client'
console.log('TARGET', TARGET)
const appEntry = path.resolve(path.join(__dirname, 'web', 'index.web.tsx'))

module.exports = async function (env = { mode: process.env.NODE_ENV }, argv) {
  const config = {
    mode: env.mode,
    context: __dirname,
    stats: 'normal',
    devtool:
      env.mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
    entry: {
      app: [appEntry].filter(Boolean),
    },
    output: {
      path: path.resolve(__dirname),
      filename: 'static/js/app.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['tsmain', 'browser', 'module', 'main'],
    },
    resolveLoader: {
      modules: ['node_modules'],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        // new ClosurePlugin(),
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            ecma: 7,
            warnings: false,
            parse: {},
            compress: {},
            mangle: true,
            module: false,
            output: null,
            toplevel: false,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: false,
            safari10: false,
          },
        }),
      ],
      usedExports: isProduction,
      splitChunks: false,
      runtimeChunk: false,
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
              use: {
                loader: 'babel-loader',
              },
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
                  name: 'static/media/[name].[hash:8].[ext]',
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
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // !isProduction && new Webpack.HotModuleReplacementPlugin(),
      new LodashPlugin(),
      new Webpack.DefinePlugin({
        'process.env.TARGET': JSON.stringify(TARGET || null),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new HTMLWebpackPlugin({
        inject: true,
        template: path.join(__dirname, 'web/index.html'),
      }),
    ].filter(Boolean),
    devServer: {
      host: '0.0.0.0',
      compress: true,
      watchContentBase: true,
      // It will still show compile warnings and errors with this setting.
      clientLogLevel: 'none',
      contentBase: path.join(__dirname, 'web'),
      publicPath: '/',
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

  // PLUGINS

  if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
        analyzerMode: 'static',
      })
    )
  }

  if (isProduction) {
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
