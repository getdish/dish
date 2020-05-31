const path = require('path')
const _ = require('lodash')
const Webpack = require('webpack')
const ClosurePlugin = require('closure-webpack-plugin')

// tsickle
const externDir = path.resolve(
  __dirname,
  'tmp',
  `externs-${Math.floor(Math.random() * 10)}`
)

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: './web/index.web.tsx',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: '@dish/tsickle-loader',
          options: {
            // the tsconfig file to use during compilation
            tsconfig: 'tsconfig.tscc.json',
            // this is the directory where externs will be saved. You
            // will probably want to delete these between builds
            externDir,
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [new Webpack.optimize.ModuleConcatenationPlugin()],
  optimization: {
    minimize: true,
    minimizer: [
      new ClosurePlugin(
        {
          mode: 'STANDARD', // a little misleading -- the actual compilation level is below
          childCompilations: true,
        },
        {
          externs: [path.resolve(externDir, 'externs.js')],
          jscomp_off: 'es5Strict',
          jscompOff: 'es5Strict',
          languageOut: 'ECMASCRIPT5',
          compilation_level: 'ADVANCED',
        }
      ),
    ],
    usedExports: true,
    splitChunks: {
      minSize: 0,
    },
    concatenateModules: true,
  },
}
