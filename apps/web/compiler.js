const path = require('path')
const webpack = require('webpack')
const Memoryfs = require('memory-fs')

module.exports = (fixture, options = {}) => {
  const entry = `${fixture}`
  const tsconfig = path.resolve(
    __dirname,
    options.tsconfig != null ? options.tsconfig : 'tsconfig.json'
  )
  console.log('entry', entry, 'tsconfig', tsconfig)
  const compiler = webpack({
    stats: {
      // Examine all modules
      maxModules: Infinity,
      // Display bailout reasons
      // optimizationBailout: true
    },
    mode: options.mode || 'development',
    context: __dirname,
    entry,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        ...(options.prerules || []),
        {
          test: /\.tsx?$/,
          use: {
            loader: '@dish/tsickle-loader',
            options: {
              tsconfig,
              externDir: options.externDir,
            },
          },
        },
        ...(options.rules || []),
      ],
    },
    plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
    optimization: {
      minimize: true,
      minimizer: options.minimizer,
      usedExports: true,
      splitChunks: {
        minSize: 0,
      },
      concatenateModules: true,
    },
  })

  const mfs = new Memoryfs()

  compiler.outputFileSystem = mfs

  const getCode = (stats) => stats.toJson().modules[0].source

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err != null ? err : stats.compilation.errors)
        return
      }

      const result = mfs
        .readFileSync(path.resolve(__dirname, 'bundle.js'))
        .toString()

      resolve([result, stats, getCode(stats)])
    })
  })
}
