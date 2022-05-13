import { ServerConfig, ServerConfigNormal } from '../types'
import { createWebServer } from './createWebServer'
import { getWebpackConfigBuilder } from './getWebpackConfigBuilder'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import proxy from 'express-http-proxy'
import getPort from 'get-port'
import { join } from 'path'
import { Worker } from 'worker_threads'

export async function createServer(serverConf: ServerConfig) {
  const rootDir = serverConf.rootDir ?? process.cwd()
  const https = serverConf.https ?? false
  const host = serverConf.host ?? '0.0.0.0'
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
      tamaguiOptions: {
        evaluateImportsWhitelist: ['constants.js', 'colors.js'],
      },
    },
  }

  const app = express()
  app.set('port', conf.port)

  const allowedOrigins = new Set([
    'http://localhost:4444',
    'http://dish.localhost',
    'http://live.dish.localhost',
    'http://staging.dish.localhost',
    'https://dishapp.com',
  ])

  app.use(
    cors({
      origin: (origin, callback) => {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) {
          return callback(null, true)
        }
        if (!allowedOrigins.has(origin)) {
          return callback(
            new Error(
              `The CORS policy for this site does not allow access from the specified Origin.`
            ),
            false
          )
        }
        return callback(null, true)
      },
    })
  )
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
    await createWebServer(app, conf)
    await createApiServer(app, conf)
  }
}

let restarts = 0

async function createApiServer(app: any, conf: ServerConfigNormal) {
  const { createConfig, ...config } = conf
  const port = await getPort()
  const pa = `localhost:${port}`
  app.use(
    '/api',
    proxy(pa, {
      limit: '100mb',
    })
  )
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
      if (restarts < 5) {
        console.log('  [api] restarting...')
        restarts++
        createApiServer(app, conf)
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

// function cors() {
//   const HEADER_ALLOWED = '*'
//   return (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
//     res.header('Access-Control-Allow-Credentials', 'true')
//     res.header('Access-Control-Allow-Headers', HEADER_ALLOWED)
//     res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS')
//     next()
//   }
// }
