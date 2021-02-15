import { join } from 'path'
import { Worker } from 'worker_threads'

import compression from 'compression'
import express from 'express'
import proxy from 'express-http-proxy'
import getPort from 'get-port'

import { ServerConfig, ServerConfigNormal } from '../types'
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
  const noOptimize = serverConf.noOptimize ?? false

  const conf: ServerConfigNormal = {
    url,
    apiDir: serverConf.apiDir as any,
    clean: false,
    noOptimize,
    host,
    port,
    https,
    inspect: false,
    resetCache: serverConf.resetCache ?? false,
    env: serverConf.env ?? 'development',
    verbose: serverConf.verbose ?? false,
    rootDir,
    watch: serverConf.watch ?? false,
    protocol,
    serial: serverConf.serial ?? false,
    buildDir: join(rootDir, 'build'),
    createConfig: getWebpackConfigBuilder({ rootDir }),
    webpackConfig: {
      noMinify: noOptimize,
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

async function createApiServer(
  app: any,
  { createConfig, ...config }: ServerConfigNormal
) {
  const port = await getPort()
  app.use('/api', proxy(`localhost:${port}`))
  const file = require.resolve('./createApiServer.worker')
  const worker = new Worker(file, {
    workerData: {
      ...config,
      port,
    },
  })
  await new Promise<void>((res, rej) => {
    worker.on('error', (err) => {
      console.error(' [webpack]', err)
      rej(err)
    })
    worker.on('exit', async (code) => {
      console.log(' [api] exited', code)
      if (code !== 0) {
        rej(`Worker stopped with exit code ${code}`)
      }
    })
    worker.on('message', (msg: string) => {
      if (msg === 'done') {
        res()
      } else {
        rej(msg)
      }
    })
  })
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
