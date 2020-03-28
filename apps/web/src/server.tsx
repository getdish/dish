import bodyParser from 'body-parser'
import express from 'express'
import { readFileSync } from 'fs'
import { createOvermindSSR } from 'overmind'
import { renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'

import { config, startOm } from '../shared/state/om'

const server = express()
server.set('port', 3000)
server.use(cors())
// fixes bug with 304 errors sometimes
// see: https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
server.disable('etag')
server.use(bodyParser.json({ limit: '2048mb' }))
server.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }))
server.get('/hello', (_, res) => res.send('hello world'))
server.use('/assets', express.static(Path.join('..', 'shared', 'assets')))
// server.get('/config', (_, res) => {
//   log.verbose(`Send config ${JSON.stringify(config, null, 2)}`)
//   res.json(config)
// })

const template = readFileSync('../web/index.html', 'utf8')

server.get('*', async (req, res) => {
  const overmind = createOvermindSSR(config)
  await startOm(overmind)
  const appHtml = renderToString(<></>)
  const helmet = Helmet.renderStatic()
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
`
      )
  )
})

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
