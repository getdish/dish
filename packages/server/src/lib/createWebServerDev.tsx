import { Worker } from 'worker_threads'

import proxy from 'express-http-proxy'
import getPort from 'get-port'

import { ServerConfigNormal } from '../types'

export async function createWebServerDev(
  app: any,
  { rootDir, webpackConfig }: ServerConfigNormal
) {
  console.log(' [web] starting webpack...')
  const port = await getPort()
  const worker = new Worker(
    __filename.replace('src', '_').replace('.tsx', '.worker.js'),
    {
      workerData: {
        webpackConfig,
        port,
        rootDir,
      },
    }
  )
  worker.on('error', (err) => console.error(' [webpack]', err))
  worker.on('exit', (code) => {
    console.log(' [webpack] exited', code)
    if (code !== 0) throw new Error(`Worker stopped with exit code ${code}`)
  })

  app.use(ignoreApi(proxy(`localhost:${port}`)))
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
