import connectHistoryApiFallback from 'connect-history-api-fallback'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'

import { ServerConfigNormal } from '../types'
import { getWebpackConfigBuilder } from './getWebpackConfigBuilder'

export function createWebServerDev(
  app: any,
  { webpackConfig, rootDir }: ServerConfigNormal
) {
  const createConfig = getWebpackConfigBuilder({ rootDir })
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
  // @ts-ignore
  app.all((_req, res, next) => {
    for (const name in headers) {
      res.setHeader(name, headers[name])
    }
    next()
  })
  const historyFb = connectHistoryApiFallback()
  app.use(historyFb)
  app.use(
    middleware(compiler, {
      publicPath: config.output?.publicPath ?? '/',
    })
  )
  app.use(hotMiddleware(compiler))
  return compiler
}
