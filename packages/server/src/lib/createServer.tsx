import { join } from 'path'

import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'

import { ServerConfig, ServerConfigNormal } from '../types'
import { createApiServer } from './createApiServer'
import { createWebServerDev } from './createWebServerDev'
import { getWebpackConfigBuilder } from './getWebpackConfigBuilder'

export async function createServer(serverConf: ServerConfig) {
  const rootDir = process.cwd()
  const https = serverConf.https ?? false
  const hostname = serverConf.hostname ?? 'localhost'
  const protocol = serverConf.https ? 'https' : 'http'
  const defaultPort = https ? 443 : 80
  const port = process.env.PORT ? +process.env.PORT : serverConf.port ?? 4040
  const url = `${protocol}://${hostname}${
    port == defaultPort ? '' : `:${port}`
  }`
  const conf: ServerConfigNormal = {
    url,
    apiDir: null,
    clean: false,
    hostname,
    port,
    https,
    inspect: false,
    ...serverConf,
    protocol,
    buildDir: join(rootDir, 'build'),
    createConfig: (opts) => {
      return getWebpackConfigBuilder({ rootDir })(opts)
    },
    rootDir,
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
  app.use(bodyParser.json({ limit: '2048mb' }))
  app.use(bodyParser.urlencoded({ limit: '2048mb', extended: false }))
  app.get('/__test', (_, res) => res.send('hello world'))

  console.log(`listening on ${conf.url}`)
  if (conf.https) {
    const devcert = require('devcert')
    const https = require('https')
    const ssl = await devcert.certificateFor(conf.hostname)
    https.createServer(ssl, app).listen(conf.port)
  } else {
    app.listen(conf.port, conf.hostname)
  }

  let res: Promise<any>

  await createApiServer(app, conf)

  console.log(' [web] starting webpack...')
  if (conf.env === 'development') {
    res = createWebServerDev(app, conf)
  } else {
    const { createWebServerProd } = require('./createWebServerProd')
    res = createWebServerProd(app, conf)
  }

  await res
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
