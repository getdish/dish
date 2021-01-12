import 'isomorphic-unfetch'

import { existsSync, readFileSync, renameSync } from 'fs'
import * as Path from 'path'

import { client } from '@dish/graph'
import { ChunkExtractor } from '@loadable/server'
import bodyParser from 'body-parser'
import { matchesUA } from 'browserslist-useragent'
import connectHistoryApi from 'connect-history-api-fallback'
import express from 'express'
import React from 'react'
import { Helmet } from 'react-helmet'

import { shimBrowser } from './shimBrowser'
import { ServerConfig } from './types'

process.env.TARGET = process.env.TARGET || 'SSR'
global['React'] = React
global['__DEV__'] = false
global['requestIdleCallback'] = global['requestIdleCallback'] || setTimeout

type ServerConfigNormal = ServerConfig & {
  rootDir: string
}

const jsdom = shimBrowser()

export async function createServer(opts: ServerConfig) {
  const port = process.env.PORT ? +process.env.PORT : opts.port ?? 4040
  const rootDir = process.cwd()
  const normalized = {
    ...opts,
    rootDir,
  }

  const server = express()
  server.set('port', port)
  server.use(cors())
  // fixes bug with 304 errors sometimes
  // see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
  server.disable('etag')
  server.use(bodyParser.json({ limit: '2048mb' }))
  server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
  server.get('/__test', (_, res) => res.send('hello world'))

  let res: Promise<any>

  if (opts.env === 'dev') {
    res = createServerDev(server, normalized)
  } else {
    res = createServerProd(server, normalized)
  }

  const host = opts.hostname ?? 'localhost'
  server.listen(port, host)
  console.log(`started on http://${host}:${port}`)

  await res
}

async function createServerDev(server: any, { rootDir }: ServerConfigNormal) {
  const webpack = require('webpack')
  const middleware = require('webpack-dev-middleware')
  const hotMiddleware = require('webpack-hot-middleware')
  const createConfig = require(Path.join(rootDir, 'webpack.config.js'))
  const config = createConfig()
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
  server.use(
    connectHistoryApi({
      disableDotRule: true,
    })
  )
  server.use(middleware(compiler))
  server.use(hotMiddleware(compiler))
}

async function createServerProd(server: any, { rootDir }: ServerConfigNormal) {
  const statsFile = Path.resolve(
    Path.join(rootDir, 'web-build-ssr/loadable-stats.json')
  )
  const extractor = new ChunkExtractor({ statsFile })

  // import all app below ^^^
  const app = require(Path.join(
    rootDir,
    `web-build-ssr/static/js/app.ssr.${process.env.NODE_ENV ?? 'production'}.js`
  ))
  const { App, ReactDOMServer } = app

  if (!App || !ReactDOMServer) {
    console.log(`Bad exported bundle`, { App, ReactDOMServer })
    process.exit()
  }

  // static assets
  const clientBuildPath = Path.join(rootDir, 'web-build')
  const clientBuildLegacyPath = Path.join(rootDir, 'web-build-legacy')

  // move index.html to backup location so we dont serve via express.static
  const [clientHTMLModern, clientHTMLLegacy] = [
    Path.join(clientBuildPath, 'index.html'),
    Path.join(clientBuildLegacyPath, 'index.html'),
  ].map((path) => {
    const outPath = Path.join(Path.dirname(path), 'index-original.html')
    if (existsSync(path)) {
      renameSync(path, outPath)
    }
    return readFileSync(outPath, 'utf8')
  })

  server.use('/', express.static(clientBuildPath))
  server.use('/', express.static(clientBuildLegacyPath))

  server.get('*', async (req, res) => {
    console.log('req', req.hostname, req.path)
    const htmlPath = Path.join(rootDir, 'src', 'index.html')
    const template = readFileSync(htmlPath, 'utf8')
    jsdom.reconfigure({
      url: 'http://dishapp.com' + req.path,
    })
    const app = <App />

    delete client.cache.query

    try {
      ReactDOMServer.renderToString(app)
    } catch (err) {
      console.warn('error', err)
    }

    await client.scheduler.resolving?.promise
    const cacheSnapshot = JSON.stringify(client.cache)

    // const { cacheSnapshot } = await prepareReactRender(app)
    // async suspense rendering
    // await ssrPrepass(app)

    const jsx = extractor.collectChunks(<App cacheSnapshot={cacheSnapshot} />)

    console.log('scripts are', extractor.getScriptTags())

    const appHtml = ReactDOMServer.renderToString(jsx)

    // need to fool helmet back into thinking were in the node
    // @ts-ignore
    const helmet = Helmet.renderStatic()

    const useragent = req.get('User-Agent')
    const isModernUser = matchesUA(useragent, {
      // safari doesnt have requestidlecallback
      browsers: ['Chrome >= 61', 'Firefox >= 73'],
      env: 'modern',
      allowHigherVersions: true,
    })

    const clientHTML = isModernUser ? clientHTMLModern : clientHTMLLegacy
    const clientScripts =
      clientHTML.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gm) ?? []
    const clientLinks = clientHTML.match(/<link\b[^>]*>/gm) ?? []

    let out = ''
    for (const line of template.split('\n')) {
      if (line.includes('<!-- app -->')) {
        out += appHtml
        continue
      }
      if (line.includes('<!-- head -->')) {
        out += `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
`
        continue
      }
      if (line.indexOf('<!-- scripts -->') >= 0) {
        out += `
      <script>
        window.__CACHE_SNAPSHOT = "${cacheSnapshot}"
      </script>
      ${clientScripts.join('\n')}\n`
        continue
      }
      if (line.indexOf('<!-- links -->') >= 0) {
        out += `
      ${clientLinks.join('\n')}\n`
        continue
      }
      out += line
    }

    if (process.env.DEBUG) {
      console.log('debug', { isModernUser, helmet, appHtml, out })
    }

    console.log('resolve', req.hostname, req.path, out.length)
    res.send(out)
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
