import { basename, join, relative, resolve } from 'path'
import { Worker } from 'worker_threads'

import chokidar from 'chokidar'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import expressWinston from 'express-winston'
import { pathExists, readdir } from 'fs-extra'
import { debounce } from 'lodash'
import winston from 'winston'

import { File, ServerConfigNormal, WorkerData } from '../types'
import { typescriptOptions } from './typescriptOptions'

export async function createApiServer(server: any, config: ServerConfigNormal) {
  const { apiDir, rootDir, watch, hostname, port } = config
  if (!apiDir) return

  let lastRouteResponse: any

  process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err)
    const lastPromiseErr = lastRouteResponse?.['__tracedError']
    if (lastPromiseErr) {
      console.log('Maybe from this route:', lastPromiseErr)
    }
  })

  server.use(
    '/api',
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      meta: true,
      msg:
        '{{req.method}} {{req.url}} - {{res.statusCode}} {{res.responseTime}}ms',
      // expressFormat: true,
      colorize: false,
    })
  )

  const url = `http://${hostname}${port ? port : ''}`
  const outDir = join(rootDir, 'dist')
  const handlers = {}
  const registered = {}

  let dispose: any
  const run = debounce(async () => {
    dispose?.()
    dispose = await runFiles()
  }, 150)

  if (watch) {
    const watcher = chokidar.watch(apiDir, { ignored: /^\./, persistent: true })
    watcher.on('add', run).on('unlink', run)
  } else {
    run()
  }

  async function runFiles() {
    if (!apiDir) return
    if (!(await pathExists(apiDir))) {
      throw new Error(`Specificed API directory ${apiDir} doesn't exist`)
    }
    const files: File[] = (await getFiles(apiDir))
      .map((fullPath) => {
        return relative(apiDir, fullPath)
      })
      .filter((x) => {
        return (
          (basename(x)[0] !== '_' && x.endsWith('.ts')) || x.endsWith('.tsx')
        )
      })
      .map((file) => {
        const name = file.replace(/\.tsx?$/, '')
        return {
          name,
          route: `/api/${name}`,
          file,
          fileIn: join(apiDir, file),
          fileOut: join(outDir, file.replace(/\.tsx?$/, '.js')),
        }
      })

    console.log(' [api] creating', files.length, 'routes:')
    for (const { route } of files) {
      console.log(` [api]   · ${url}${route}`)
    }

    const disposes = new Set<Function>()

    require('ts-node').register({
      transpileOnly: true,
      compilerOptions: {
        ...typescriptOptions,
        lib: ['esnext'],
        module: 'commonjs',
        target: 'es2018',
      },
    })

    function refreshApi() {
      disposes.forEach((x) => x())
      disposes.clear()
      for (const { route, name, file, fileOut } of files) {
        try {
          delete require.cache[fileOut]
          const endpoint = require(fileOut).default
          if (!endpoint) {
            console.warn(` [api] ⚠️  no default export, ignoring ${file}`)
            continue
          }
          if (typeof endpoint !== 'function' && !Array.isArray(endpoint)) {
            console.warn(
              ` [api] ⚠️  no function/array export, ignoring ${file}`,
              endpoint
            )
            continue
          }
          handlers[name] = endpoint
          if (!registered[name]) {
            registered[name] = true
            server.use(route, (req, res, next) => {
              const cur = handlers[name]
              if (!cur) {
                return res.send(404)
              }
              // allow for arrays of multiple
              if (Array.isArray(cur)) {
                let curIndex = -1
                function handleNextRoute() {
                  curIndex++
                  const curRoute = cur[curIndex]
                  if (curRoute) {
                    console.log('curRoute', curRoute)
                    handleRoute(curRoute, req, res, handleNextRoute)
                  } else {
                    next()
                  }
                }
                handleNextRoute()
              } else {
                handleRoute(cur, req, res, next)
              }
            })
          }
          disposes.add(() => {
            delete handlers[name]
          })
        } catch (err) {
          console.log('Error requiring API endpoints', file, err)
        }
      }
      console.log(` [api] ready`)
    }

    function handleRoute(
      handler: RequestHandler,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      if (typeof handler !== 'function') {
        console.warn(' [api] ⚠️  invalid handler', handler)
        return res.status(500)
      }
      const result = handler(req, res, next)
      // @ts-expect-error
      if (result instanceof Promise) {
        lastRouteResponse = result
        setTimeout(() => {
          // clear after a bit if no error
          if (lastRouteResponse === result) {
            lastRouteResponse = null
          }
        }, 50)
      }
    }

    const workerData: WorkerData = { watch, outDir, files }
    const worker = new Worker(join(__dirname, '/runTypescript.js'), {
      workerData,
    })
    worker.on('message', () => {
      refreshApi()
    })
    worker.on('error', (err) => {
      console.log('Typescript error', err)
      process.exit(1)
    })
    worker.on('exit', (code) => {
      console.log(`Worker stopped with exit code ${code}`)
    })
  }
}

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all<any>(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name)
      return dirent.isDirectory() ? getFiles(res) : res
    })
  )
  return Array.prototype.concat(...files)
}
