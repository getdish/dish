import { basename, join, relative, resolve } from 'path'

import chokidar from 'chokidar'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import expressWinston from 'express-winston'
import { pathExists, readdir } from 'fs-extra'
import { debounce } from 'lodash'
import winston from 'winston'

import { File, ServerConfigNormal } from '../types'
import { typescriptOptions } from './typescriptOptions'

export async function createApiServer(app: any, config: ServerConfigNormal) {
  const { apiDir, url, watch } = config
  if (!apiDir) {
    console.log(` [api] no api dir, not serving`)
    return
  }

  let lastRouteResponse: any

  process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err)
    const lastPromiseErr = lastRouteResponse?.['__tracedError']
    if (lastPromiseErr) {
      console.log('Maybe from this route:', lastPromiseErr)
    }
  })

  const secret = {
    authorization: true,
    'x-hasura-admin-secret': true,
  }
  const filtered = {
    host: true,
    accept: true,
    'user-agent': true,
    'accept-language': true,
    'accept-encoding': true,
    'content-type': true,
    origin: true,
    connection: true,
    referer: true,
    'content-length': true,
  }
  app.use(
    '/api',
    expressWinston.logger({
      colorize: true,
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'label'],
        }),
        winston.format.printf((info) => {
          const { req, res, responseTime } = info.metadata.meta
          let out = ` [api] ${info.message.replace(
            /^https?\s+/i,
            ''
          )} ${responseTime}ms`
          if (info.metadata.error) {
            out = out + ' ' + info.metadata.error
            if (info.metadata.error.stack) {
              out = out + ' ' + info.metadata.error.stack
            }
          }
          const reqstr = Object.keys(req.headers)
            .map((k) => {
              const val = secret[k]
                ? `${k}:🔒`
                : filtered[k]
                ? ''
                : `${k}:${req.headers[k]}`
              return `${val}`
            })
            .filter(Boolean)
            .join(', ')
          if (reqstr.trim()) {
            out += `\n  <= ${reqstr}`
          }
          out += `\n  => ${res.statusCode}`
          return out
        })
      ),
    })
  )

  const handlers = {}
  const handlerStatus: { [key: string]: undefined | 'loading' | 'ready' } = {}

  let dispose: any
  const restart = debounce(async (files: File[]) => {
    dispose = await runFiles(files)
  }, 30)

  const run = async (path?: string) => {
    dispose?.()
    dispose = null
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
        }
      })
    if (path) {
      const relativePath = files.find((x) => path === x.fileIn)?.fileIn
      // if direct hit, fast delete, if not delete all
      if (relativePath) {
        delete require.cache[relativePath]
      } else {
        for (const key in require.cache) {
          delete require.cache[key]
        }
      }
    }
    await restart(files)
  }

  if (watch) {
    const watcher = chokidar.watch(apiDir, { ignored: /^\./, persistent: true })
    watcher.on('add', run).on('unlink', run).on('change', run)
  } else {
    run()
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

  async function runFiles(files: File[]) {
    if (!apiDir) return
    if (!(await pathExists(apiDir))) {
      throw new Error(`Specificed API directory ${apiDir} doesn't exist`)
    }

    console.log(' [api] loading', files.length, 'routes')

    // first, register the route so we can pause responses until ready
    for (const { route, name } of files) {
      if (!handlerStatus[name]) {
        console.log(` [api]   · ${url}${route}`)
        handlerStatus[name] = 'loading'
        app.use(route, async (req, res, next) => {
          let tries = 0
          while (handlerStatus[name] === 'loading') {
            tries++
            if (tries > 100) {
              console.log('timed out loading route', route)
              return res.send(408)
            }
            await new Promise((res) => setTimeout(res, 300))
          }
          const cur = handlers[name]
          if (!cur) {
            return res.status(404).text(`Route handler not found`)
          }
          // allow for arrays of multiple
          if (Array.isArray(cur)) {
            let curIndex = -1
            const handleNextRoute = () => {
              curIndex++
              const curRoute = cur[curIndex]
              if (curRoute) {
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

    disposes.forEach((x) => x())
    disposes.clear()

    // then, load the routes
    for (const { name, file, fileIn } of files) {
      try {
        const endpoint = require(fileIn).default
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
        handlerStatus[name] = 'ready'
        disposes.add(() => {
          handlerStatus[name] = 'loading'
          delete handlers[name]
        })
      } catch (err) {
        console.log('Error requiring API endpoints', file, err)
        delete handlers[name]
      }
    }
    console.log(` [api] ready`)
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
