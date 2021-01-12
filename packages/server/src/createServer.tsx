import 'isomorphic-unfetch'

import { join } from 'path'

import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import React from 'react'

import { ServerConfig, ServerConfigNormal } from './types'

process.env.TARGET = process.env.TARGET || 'SSR'
global['React'] = React
global['__DEV__'] = process.env.NODE_ENV === 'development'
global['requestIdleCallback'] = global['requestIdleCallback'] || setTimeout

export async function createServer(opts: ServerConfig) {
  const port = process.env.PORT ? +process.env.PORT : opts.port ?? 4040
  const rootDir = process.cwd()
  const createConfig = require(join(rootDir, 'webpack.config.js'))
  const webpackConfig = createConfig()
  const normalized: ServerConfigNormal = {
    ...opts,
    buildDir: join(rootDir, 'build'),
    webpackConfig,
    rootDir,
  }

  const server = express()
  server.set('port', port)
  server.use(cors())
  server.use(compression())
  // fixes bug with 304 errors sometimes
  // see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
  server.disable('etag')
  server.use(bodyParser.json({ limit: '2048mb' }))
  server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
  server.get('/__test', (_, res) => res.send('hello world'))

  let res: Promise<any>

  if (opts.env === 'dev') {
    const { createServerDev } = require('./createServerDev')
    res = createServerDev(server, normalized)
  } else {
    const { createServerProd } = require('./createServerProd')
    res = createServerProd(server, normalized)
  }

  const host = opts.hostname ?? 'localhost'
  server.listen(port, host)
  console.log(`started on http://${host}:${port}`)

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
