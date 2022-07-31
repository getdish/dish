import { ServerConfigNormal } from '../types'
import { getWebpackConfigBuilder } from './getWebpackConfigBuilder'
import connectHistoryApiFallback from 'connect-history-api-fallback'
import express from 'express'
import { join } from 'path'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'

export function createWebServerDev(
  app: express.Application,
  { webpackConfig, rootDir, resetCache, env }: ServerConfigNormal
) {
  process.env.TARGET = 'web'
  const createConfig = getWebpackConfigBuilder({ rootDir })
  const config = createConfig({
    target: 'web',
    noMinify: true,
    resetCache,
    ...webpackConfig,
  })
  const compiler = webpack(config)

  // allow for easier memory usage debugging
  if (process.env.DEBUG_WEBPACK) {
    console.log('debug webpack', compiler)
  }

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS')
    next()
  })

  const historyFb = connectHistoryApiFallback()
  app.use(historyFb)

  const assetsDir = join(rootDir, 'assets')
  console.log('assetsDir', assetsDir)
  app.use('/assets', express.static(assetsDir))

  app.use(
    middleware(compiler, {
      publicPath: config.output?.publicPath ?? '/',
    })
  )

  if (env === 'development') {
    app.use(hotMiddleware(compiler))
  }

  return compiler
}
