import { Worker } from 'worker_threads'

import proxy from 'express-http-proxy'
import findCacheDir from 'find-cache-dir'
import { pathExists, remove } from 'fs-extra'
import getPort from 'get-port'

import { ServerConfigNormal } from '../types'

export async function createWebServer(
  app: any,
  serverConfig: ServerConfigNormal
) {
  if (serverConfig.serial) {
    console.log(' [web] running in same process')
    const { createWebServerDev } = require('./createWebServerDev')
    await createWebServerDev(app, serverConfig)
    return
  }

  const { createConfig, ...config } = serverConfig

  const port = await getPort()
  app.use(ignoreApi(proxy(`localhost:${port}`)))
  await start()

  async function start() {
    console.log(
      ` [web] starting web in ${config.env} mode ${
        config.watch ? '(watch)' : ''
      }...`
    )
    const args = {
      ...config,
      port,
    }
    const filePath = __filename.replace(
      '.js',
      `${config.env === 'development' ? 'Dev' : 'Prod'}.worker.js`
    )
    const worker = new Worker(filePath, {
      workerData: args,
    })
    let completedInitialBuild = false

    await new Promise<void>((res, rej) => {
      worker.on('error', (err) => {
        console.error(' [webpack]', err)
        rej(err)
      })
      worker.on('exit', async (code) => {
        console.log(' [webpack] exited', code)
        if (completedInitialBuild) {
          // clear cache
          await clearWebpackCache()

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

async function clearWebpackCache() {
  console.log(` [webpack] clearing cache`)
  const dir = findCacheDir({ name: 'webpack' })
  if (await pathExists(dir)) {
    await remove(dir)
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
