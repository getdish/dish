import { parentPort, workerData } from 'worker_threads'

import * as ts from 'typescript'

import { WorkerData } from '../types'
import { typescriptOptions } from './typescriptOptions'

let dispose = runTypescript(workerData as WorkerData)

function refreshApi() {
  parentPort?.postMessage({ type: 'refresh' })
}

parentPort?.addListener('message', ({ type, ...rest }) => {
  if (type === 'restart') {
    dispose?.()
    dispose = runTypescript(rest)
  }
})

function runTypescript(args: WorkerData) {
  const { watch, outDir, files } = args
  const options = {
    ...typescriptOptions,
    module: ts.ModuleKind.CommonJS,
    outDir,
  }
  if (watch) {
    const host = ts.createWatchCompilerHost(
      files.map((x) => x.fileIn),
      options,
      ts.sys,
      ts.createSemanticDiagnosticsBuilderProgram,
      (err) => {
        console.error(
          ' [api] tsc error:',
          err.file?.fileName,
          '\n',
          err.messageText,
          err.start
        )
      },
      ({ messageText, code }) => {
        console.log(' [api] tsc:', messageText)
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
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      )
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      )
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      )
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })

  return () => {
    // no dispose
  }
}
