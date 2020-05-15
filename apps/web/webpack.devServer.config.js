const { join } = require('path')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: '/',
  host: '0.0.0.0',
  compress: true,
  // watchContentBase: true,
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'none',
  contentBase: join(__dirname, 'web'),
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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':
      'X-Requested-With, content-type, Authorization',
  },
}
