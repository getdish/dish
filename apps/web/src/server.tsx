import 'isomorphic-fetch'

import { readFileSync } from 'fs'
import Path from 'path'

import bodyParser from 'body-parser'
import express from 'express'
import { JSDOM } from 'jsdom'
import { createOvermindSSR } from 'overmind'
import React from 'React'
import { Helmet } from 'react-helmet'

Error.stackTraceLimit = Infinity
global['React'] = React
global['__DEV__'] = false

// fake a browser!
const jsdom = new JSDOM(``, {
  pretendToBeVisual: true,
  url: 'http://d1sh_hasura_live.com:19006/',
  referrer: 'http://d1sh_hasura_live.com:19006/',
  contentType: 'text/html',
})
global['window'] = jsdom.window
global['window']['IS_SSR_RENDERING'] = true
global['MouseEvent'] = class MouseEvent {}
Object.keys(jsdom.window).forEach((key) => {
  if (typeof global[key] === 'undefined') {
    global[key] = jsdom.window[key]
  }
})

// import all app below ^^^
const {
  App,
  config,
  ReactDOMServer,
} = require('../web-build-ssr/static/js/app.ssr.js')

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
const clientBuildPath = Path.join(__dirname, '..', 'web-build')
server.use('/static', express.static(Path.join(clientBuildPath, 'static')))

const htmlPath = Path.join(__dirname, '..', 'web', 'index.html')
const template = readFileSync(htmlPath, 'utf8')

server.get('*', async (req, res) => {
  const overmind = createOvermindSSR(config)
  const appHtml = ReactDOMServer.renderToString(<App overmind={overmind} />)
  // need to fool helmet back into thinking were in the node
  const helmet = Helmet.renderStatic()

  const clientHTML = readFileSync(
    Path.join(clientBuildPath, 'index.html'),
    'utf8'
  )
  const clientScripts = clientHTML.match(
    /<script\b[^>]*>([\s\S]*?)<\/script>/gm
  )

  res.send(
    template
      .replace('<!-- app -->', appHtml)
      .replace(
        '<!-- head -->',
        `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
`
      )
      .replace(
        '<!-- scripts -->',
        `
        <script>
          window.__OVERMIND_MUTATIONS = ${JSON.stringify(overmind.hydrate())}
        </script>
        ${clientScripts.join('\n')}
`
      )
  )
})

server.listen(19006)

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
