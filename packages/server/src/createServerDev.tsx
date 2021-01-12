import connectHistoryApiFallback from 'connect-history-api-fallback'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'

import { ServerConfigNormal } from './types'

export async function createServerDev(
  server: any,
  { webpackConfig }: ServerConfigNormal
) {
  const compiler = webpack(webpackConfig)
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
  server.use(connectHistoryApiFallback())
  server.use(
    middleware(compiler, {
      publicPath: webpackConfig.output?.publicPath ?? '/',
    })
  )
  server.use(hotMiddleware(compiler))
}
