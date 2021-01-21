import { join } from 'path'

import compression from 'compression'
import express from 'express'

import { ServerConfig, ServerConfigNormal } from '../types'
import { createApiServer } from './createApiServer'
import { createWebServer } from './createWebServer'
import { getWebpackConfigBuilder } from './getWebpackConfigBuilder'

export async function createServer(serverConf: ServerConfig) {
  const rootDir = serverConf.rootDir ?? process.cwd()
  const https = serverConf.https ?? false
  const host = serverConf.host ?? 'localhost'
  const protocol = serverConf.https ? 'https' : 'http'
  const defaultPort = https ? 443 : 80
  const port = process.env.PORT ? +process.env.PORT : serverConf.port ?? 4444
  const url = `${protocol}://${host}${port == defaultPort ? '' : `:${port}`}`
  const conf: ServerConfigNormal = {
    url,
    apiDir: serverConf.apiDir as any,
    clean: false,
    host,
    port,
    https,
    inspect: false,
    env: serverConf.env ?? 'development',
    verbose: serverConf.verbose ?? false,
    rootDir,
    watch: serverConf.watch ?? false,
    protocol,
    buildDir: join(rootDir, 'build'),
    createConfig: getWebpackConfigBuilder({ rootDir }),
    webpackConfig: {
      entry: join(rootDir, 'src', 'index.ts'),
      env: serverConf.env,
      snackOptions: {
        evaluateImportsWhitelist: ['constants.js', 'colors.js'],
      },
    },
  }

  const app = express()
  app.set('port', conf.port)
  app.use(cors())
  app.use(compression())
  // fixes bug with 304 errors sometimes
  // see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
  app.disable('etag')
  app.get('/healthz', (_, res) => res.send('healthy'))

  console.log(`listening on ${conf.url}`)
  if (conf.https) {
    const devcert = require('devcert')
    const https = require('https')
    const ssl = await devcert.certificateFor(conf.host)
    https.createServer(ssl, app).listen(conf.port)
  } else {
    if (!conf.host || !conf.port) throw new Error(`missing conf`)
    app.listen(conf.port, conf.host)
  }

  if (conf.env === 'development') {
    await Promise.all([
      //
      createWebServer(app, conf),
      createApiServer(app, conf),
    ])
  } else {
    // ts-node can fuck up require on server side so run api after
    await createWebServer(app, conf)
    await createApiServer(app, conf)
  }
}

function cors() {
  const HEADER_ALLOWED =
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Token, Access-Control-Allow-Headers'
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', HEADER_ALLOWED)
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,POST,PUT,DELETE,OPTIONS'
    )
    next()
  }
}