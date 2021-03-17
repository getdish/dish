import express from 'express'

import { ensurePage, fetchBrowser } from './browser'

const queue = new Set<Function>()
const app = express()

function runInQueue(fn: Function) {
  return new Promise((res) => {
    queue.add(async () => {
      res(await fn())
    })
  })
}

async function main() {
  startServer()
  ensurePage()
  while (true) {
    if (queue.size) {
      const first = [...queue][0]
      queue.delete(first)
      await first()
    } else {
      await new Promise((res) => setTimeout(res, 100))
    }
  }
}

const types = {
  html: 'html',
  json: 'json',
  hyperscript: 'hyperscript',
} as const

function startServer() {
  app.use(async (req, res, next) => {
    const headers = req.headers
    if (!req.headers['url']) {
      res.status(500).send('no url')
      return
    }
    const url = `${req.headers['url']}`
    const type = types[`${headers['parse'] ?? 'html'}`]
    const selector = `${headers['selector']}`
    console.log(`Processing ${type} ${selector}: ${url}`)
    return res.json(await runInQueue(() => fetchBrowser(url, type, selector)))
  })
  console.log('Listening on', 3535)
  app.listen(3535)
}

main()
