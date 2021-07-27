import express from 'express'

import { fetchBrowser } from './browser'

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
  'script-data': 'script-data',
} as const

function startServer() {
  app.use(async (req, res) => {
    try {
      const headers = req.headers ?? {}
      console.log('got headers', headers)
      if (!headers['url']) {
        res.status(500).send('no url')
        return
      }
      const url = `${headers['url']}`
      const type = types[`${headers['parse'] ?? 'html'}`]
      const options = {
        selectors: JSON.parse(`${headers['selectors'] || ''}` || 'null'),
        headers: JSON.parse(`${headers['headers'] || ''}` || 'null'),
      }
      console.log(`worker processing ${JSON.stringify({ url, type, options })}`)
      return res.json(await runInQueue(() => fetchBrowser(url, type, options)))
    } catch (err) {
      console.log('error handling request', err.message, err.stack)
      return res.status(500).json(null)
    }
  })
  console.log('Listening on', 3535)
  app.listen(3535)
}

main()
