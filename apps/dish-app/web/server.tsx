import 'isomorphic-unfetch'

import './serverEnv'

import { existsSync, readFileSync, renameSync } from 'fs'
import Path from 'path'

import { ChunkExtractor } from '@loadable/server'
import bodyParser from 'body-parser'
import { matchesUA } from 'browserslist-useragent'
import express from 'express'
import { JSDOM } from 'jsdom'
import { createOvermindSSR } from 'overmind'
import React from 'react'
import { Helmet } from 'react-helmet'
import ssrPrepass from 'react-ssr-prepass'

const rootDir = Path.join(__dirname, '..', '..')

global['React'] = React
global['__DEV__'] = false

// fake a browser!
const jsdom = new JSDOM(``, {
  pretendToBeVisual: true,
  url: 'http://d1sh_hasura_live.com:19006/',
  referrer: 'http://d1sh_hasura_live.com:19006/',
  contentType: 'text/html',
})
// @ts-ignore
global['window'] = jsdom.window
global['window']['IS_SSR_RENDERING'] = true
// @ts-ignore
global['MouseEvent'] = class MouseEvent {}
Object.keys(jsdom.window).forEach((key) => {
  if (typeof global[key] === 'undefined') {
    global[key] = jsdom.window[key]
  }
})

const statsFile = Path.resolve(
  Path.join(rootDir, 'web-build-ssr/loadable-stats.json')
)
const extractor = new ChunkExtractor({ statsFile })

// import all app below ^^^
const app = require(Path.join(rootDir, 'web-build-ssr/static/js/app.ssr.js'))
const { App, config, ReactDOMServer } = app

if (!App || !config || !ReactDOMServer) {
  console.log(`Bad exported bundle`, { App, config, ReactDOMServer })
  process.exit()
}

const server = express()
server.set('port', 3000)
server.use(cors())
// fixes bug with 304 errors sometimes
// see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
server.disable('etag')
server.use(bodyParser.json({ limit: '2048mb' }))
server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
server.get('/hello', (_, res) => res.send('hello world'))

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

// TODO amp
// setHeaders: res => res.setHeader('AMP-Access-Control-Allow-Source-Origin', `http://localhost:${PORT}`),

server.get('*', async (req, res) => {
  console.log('req', req.hostname, req.path)
  const htmlPath = Path.join(rootDir, 'web', 'index.html')
  const template = readFileSync(htmlPath, 'utf8')
  const overmind = createOvermindSSR(config)
  await overmind.initialized
  global['window']['om'] = overmind

  const app = <App overmind={overmind} />
  const jsx = extractor.collectChunks(app)

  console.log('scripts are', extractor.getScriptTags())

  // async suspense rendering
  await ssrPrepass(app)

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
        window.__OVERMIND_MUTATIONS = ${JSON.stringify(overmind.hydrate())}
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

const port = 19006
const host = '0.0.0.0'
// server.listen(port)
server.listen(port, host)
console.log(`Listening on ${host}:${19006}`)

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
