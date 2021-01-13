import connectHistoryApiFallback from 'connect-history-api-fallback'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'

import { ServerConfigNormal } from '../types'

export async function createWebServerDev(
  server: any,
  { createConfig, webpackConfig }: ServerConfigNormal
) {
  const config = createConfig({
    target: 'web',
    noMinify: true,
    ...webpackConfig,
  })
  const compiler = webpack(config)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':
      'X-Requested-With, content-type, Authorization',
  }
  server.all((_req, res, next) => {
    for (const name in headers) {
      res.setHeader(name, headers[name])
    }
    next()
  })
  const historyFb = connectHistoryApiFallback()
  server.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      next()
    } else {
      historyFb(req, res, next)
    }
  })
  server.use(
    middleware(compiler, {
      publicPath: config.output?.publicPath ?? '/',
    })
  )
  server.use(hotMiddleware(compiler))
}
