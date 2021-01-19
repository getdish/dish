import { Worker } from 'worker_threads'

import proxy from 'express-http-proxy'
import getPort from 'get-port'

import { ServerConfigNormal } from '../types'

export async function createWebServer(
  app: any,
  { createConfig, ...config }: ServerConfigNormal
) {
  console.log(
    ` [web] starting webpack in ${config.env} mode ${
      config.watch ? '(watch)' : ''
    }...`
  )
  const port = await getPort()
  const workerData = {
    ...config,
    port,
  }
  const worker = new Worker(
    __filename
      .replace('src', '_')
      .replace(
        '.tsx',
        `${config.env === 'development' ? 'Dev' : 'Prod'}.worker.js`
      ),
    {
      workerData,
    }
  )
  app.use(ignoreApi(proxy(`localhost:${port}`)))
  await new Promise<void>((res, rej) => {
    worker.on('error', (err) => {
      console.error(' [webpack]', err)
      rej(err)
    })
    worker.on('exit', (code) => {
      console.log(' [webpack] exited', code)
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

function ignoreApi(fn) {
  return (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next()
    } else {
      fn(req, res, next)
    }
  }
}
