import { Worker } from 'worker_threads'

import proxy from 'express-http-proxy'
import getPort from 'get-port'

import { ServerConfigNormal } from '../types'

export async function createWebServer(
  app: any,
  { createConfig, ...config }: ServerConfigNormal
) {
  const port = await getPort()
  app.use(ignoreApi(proxy(`localhost:${port}`)))
  await start()

  async function start() {
    console.log(
      ` [web] starting web in ${config.env} mode ${
        config.watch ? '(watch)' : ''
      }...`
    )
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
    let completedInitialBuild = false

    await new Promise<void>((res, rej) => {
      worker.on('error', (err) => {
        console.error(' [webpack]', err)
        rej(err)
      })
      worker.on('exit', (code) => {
        console.log(' [webpack] exited', code)
        if (completedInitialBuild) {
          // attempt restart, probably memory failure
          start()
          return
        }
        if (code !== 0) {
          rej(`Worker stopped with exit code ${code}`)
        }
      })
      worker.on('message', (msg: string) => {
        if (msg === 'done') {
          completedInitialBuild = true
          res()
        } else {
          rej(msg)
        }
      })
    })
  }
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
