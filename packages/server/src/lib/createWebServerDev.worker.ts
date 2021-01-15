import { workerData } from 'worker_threads'

import connectHistoryApiFallback from 'connect-history-api-fallback'
import express from 'express'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'

import { getWebpackConfigBuilder } from './getWebpackConfigBuilder'

const { rootDir, port, webpackConfig } = workerData

const app = express()
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
app.listen(port)
