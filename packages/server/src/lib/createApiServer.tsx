import { join, relative, resolve } from 'path'

import chokidar from 'chokidar'
import { pathExists, readdir } from 'fs-extra'
import { debounce } from 'lodash'
import * as ts from 'typescript'

import { ServerConfigNormal } from '../types'

export async function createApiServer(
  server: any,
  { apiDir, rootDir, watch, hostname, port }: ServerConfigNormal
) {
  if (!apiDir) return

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
    const files = (await getFiles(apiDir))
      .filter((x) => {
        return x.endsWith('.ts') || x.endsWith('.tsx')
      })
      .map((fullPath) => {
        return relative(apiDir, fullPath)
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

    console.log('Creating', files.length, 'API endpoints')
    for (const { route } of files) {
      console.log(`  => ${url}${route}`)
    }

    const disposes = new Set<Function>()

    function refreshApi() {
      disposes.forEach((x) => x())
      disposes.clear()
      for (const { route, name, file, fileOut } of files) {
        try {
          delete require.cache[fileOut]
          const endpoint = require(fileOut).default
          if (typeof endpoint !== 'function') {
            throw new Error(`isn't of type function: ${typeof endpoint}`)
          }
          handlers[name] = endpoint
          if (!registered[name]) {
            registered[name] = true
            server.use(route, (req, res, next) => {
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

    const options = {
      esModuleInterop: true,
      allowJs: true,
      skipLibCheck: true,
      outDir,
      module: ts.ModuleKind.CommonJS,
    }

    if (watch) {
      const host = ts.createWatchCompilerHost(
        files.map((x) => x.fileIn),
        options,
        ts.sys,
        ts.createSemanticDiagnosticsBuilderProgram,
        (err) => {
          console.error(err.messageText)
        },
        ({ messageText, code }) => {
          console.log('  [api] tsc:', messageText)
          if (code === 6194) {
            // no errors
            refreshApi()
          }
        }
      )
      const program = ts.createWatchProgram(host)

      return () => {
        program.close()
      }
    }

    const program = ts.createProgram(
      files.map((x) => x.fileIn),
      options
    )
    const results = program.emit()
    const allDiagnostics = ts
      .getPreEmitDiagnostics(program)
      .concat(results.diagnostics)
    allDiagnostics.forEach((diagnostic) => {
      if (diagnostic.file) {
        const {
          line,
          character,
        } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!)
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n'
        )
        console.log(
          `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`
        )
      } else {
        console.log(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        )
      }
    })

    return () => {}
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
