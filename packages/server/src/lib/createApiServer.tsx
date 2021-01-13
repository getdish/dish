import { join } from 'path'

import { pathExists, readFileSync, readdir } from 'fs-extra'
import * as ts from 'typescript'

import { ServerConfigNormal } from '../types'

const disposes = new Set<Function>()
const handlers = {}
const registered = {}

export async function createApiServer(
  server: any,
  { apiDir, rootDir }: ServerConfigNormal
) {
  if (!apiDir) return
  if (!(await pathExists(apiDir))) {
    throw new Error(`Specificed API directory ${apiDir} doesn't exist`)
  }
  const outDir = join(rootDir, 'dist')
  const files = (await readdir(apiDir))
    .filter((x) => {
      return x.endsWith('.ts') || x.endsWith('.tsx')
    })
    .map((file) => {
      return {
        name: file.replace(/\.tsx?$/, ''),
        file,
        fileIn: join(apiDir, file),
        fileOut: join(outDir, file.replace(/\.tsx?$/, '.js')),
      }
    })

  console.log('Creating', files.length, 'API endpoints')

  function refreshApi() {
    disposes.forEach((x) => x())
    disposes.clear()
    for (const { name, file, fileOut } of files) {
      try {
        delete require.cache[fileOut]
        const endpoint = require(fileOut).default
        if (typeof endpoint !== 'function') {
          throw new Error(`isn't of type function: ${typeof endpoint}`)
        }
        handlers[name] = endpoint
        if (!registered[name]) {
          registered[name] = true
          server.use(`/api/${name}`, (req, res, next) => {
            if (!handlers[name]) {
              return res.status(404)
            }
            handlers[name](req, res, next)
          })
        }
        disposes.add(() => {
          delete handlers[name]
        })
      } catch (err) {
        console.log('Error requiring API endpoints', file, err)
      }
    }
    console.log(`Refreshed ${files.length} api endpoints...`)
  }

  // watch then refresh
  const host = ts.createWatchCompilerHost(
    files.map((x) => x.fileIn),
    {
      esModuleInterop: true,
      allowJs: true,
      skipLibCheck: true,
      outDir,
      module: ts.ModuleKind.CommonJS,
    },
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    (x) => {
      console.log('x', x)
    },
    ({ messageText, code }) => {
      console.log('API > tsc:', messageText)
      if (code === 6194) {
        // no errors
        refreshApi()
      }
    }
  )
  ts.createWatchProgram(host)
}
