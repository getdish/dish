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

function startServer() {
  app.use(async (req, res, next) => {
    const headers = req.headers
    const url = `${req.headers['url']}`
    if (!url) {
      res.status(500).send('no url')
      return
    }
    const type =
      headers['content-type'] === 'application/json' ? 'json' : 'html'
    console.log(`Processing ${type}: ${url}`)
    return res.json(await runInQueue(() => fetchBrowser(url, type)))
  })
  console.log('Listening on', 3535)
  app.listen(3535)
}

main()
