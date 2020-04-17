import { EOL } from 'os'
import * as path from 'path'

import fs from 'fs-extra'
// @ts-ignore
import { OptionObject, getOptions } from 'loader-utils'
import ts from 'typescript'

// @ts-ignore
import validateOptions = require('schema-utils')
// @ts-ignore
import tsickle = require('tsickle')
// @ts-ignore
import webpack = require('webpack')

const LOADER_NAME = 'tsickle-loader'
const DEFAULT_EXTERN_DIR = 'dist/externs'
const EXTERNS_FILE_NAME = 'externs.js'
const DEFAULT_CONFIG_FILE = 'tsconfig.json'

const optionsSchema = {
  type: 'object',
  properties: {
    tsconfig: {
      anyOf: [
        {
          type: 'string',
        },
        {
          type: 'boolean',
        },
      ],
    },
    externDir: {
      type: 'string',
    },
  },
}

interface RealOptions extends OptionObject {
  externDir: string
  tsconfig: string
  externFile: string
  compilerConfig: ReturnType<typeof ts.parseJsonConfigFileContent>
}

const setup = (loaderCTX: webpack.loader.LoaderContext): RealOptions => {
  const options = getOptions(loaderCTX)
  validateOptions(optionsSchema, options, LOADER_NAME as any)

  const externDir =
    options.externDir != null ? options.externDir : DEFAULT_EXTERN_DIR
  const externFile = path.resolve(externDir, EXTERNS_FILE_NAME)

  fs.ensureDirSync(externDir)
  const tsconfig =
    typeof options.tsconfig === 'string'
      ? options.tsconfig
      : DEFAULT_CONFIG_FILE

  const compilerConfigFile = ts.readConfigFile(
    tsconfig,
    (configPath: string) => {
      return fs.readFileSync(configPath, 'utf-8')
    }
  )

  const compilerConfig = ts.parseJsonConfigFileContent(
    compilerConfigFile.config,
    ts.sys,
    '.',
    {},
    tsconfig
  )

  return {
    tsconfig,
    externDir,
    externFile,
    compilerConfig,
  }
}

type LoaderCTX = webpack.loader.LoaderContext

const handleDiagnostics = (
  ctx: LoaderCTX,
  diagnostics: ReadonlyArray<ts.Diagnostic>,
  diagnosticHost: ts.FormatDiagnosticsHost,
  type: 'error' | 'warning'
): void => {
  const formatted = ts.formatDiagnosticsWithColorAndContext(
    diagnostics,
    diagnosticHost
  )

  if (type === 'error') {
    ctx.emitError(Error(formatted))
  } else {
    ctx.emitWarning(formatted)
  }
}

const tsickleLoader: webpack.loader.Loader = function (
  this: LoaderCTX,
  _source: string | Buffer
) {
  const {
    compilerConfig: { options },
    externFile,
  } = setup(this)

  // normalize the path to unix-style
  const sourceFileName = this.resourcePath.replace(/\\/g, '/')
  const compilerHost = ts.createCompilerHost(options)
  console.log('what is', options)
  const program = ts.createProgram([sourceFileName], options, compilerHost)
  const diagnostics = ts.getPreEmitDiagnostics(program)

  const diagnosticsHost: ts.FormatDiagnosticsHost = {
    getNewLine: () => EOL,
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => path.dirname(sourceFileName),
  }

  if (diagnostics.length > 0) {
    handleDiagnostics(this, diagnostics, diagnosticsHost, 'error')
    return
  }

  const tsickleHost: tsickle.TsickleHost = {
    shouldSkipTsickleProcessing: (filename) => sourceFileName !== filename,
    shouldIgnoreWarningsForPath: () => false,
    pathToModuleName: (name) => name,
    fileNameToModuleId: (name) => name,
    options: {}, // TODO: set possible options here
    es5Mode: true,
    moduleResolutionHost: compilerHost,
    googmodule: false,
    transformDecorators: true,
    transformTypesToClosure: true,
    typeBlackListPaths: new Set(),
    untyped: false,
    logWarning: (warning) =>
      handleDiagnostics(this, [warning], diagnosticsHost, 'warning'),
  }

  const jsFiles = new Map<string, string>()

  console.log('emit now', program, tsickleHost, options)
  const output = tsickle.emitWithTsickle(
    program,
    tsickleHost,
    compilerHost,
    options,
    undefined,
    (path: string, contents: string) => jsFiles.set(path, contents)
  )

  const sourceFileAsJs = tsToJS(sourceFileName)
  for (const [path, source] of jsFiles) {
    if (sourceFileAsJs.indexOf(path) === -1) {
      continue
    }

    const tsPathName = jsToTS(path)
    const extern = output.externs[tsPathName]
    if (extern != null) {
      fs.appendFileSync(externFile, fixExtern(extern))
    }

    return fixCode(source)
  }

  this.emitError(
    Error(`missing compiled result for source file: ${sourceFileName}`)
  )
}

export default tsickleLoader

/**
 * Fix some common issues with the tsickle output
 * @param code {string} the transformed typescript code
 * @return {string} transformed code
 */
const fixCode = (code: string): string => {
  return code
    .replace(
      /(?:const|var)\s*.*tsickle_forward_declare_.*\s*=\s*goog\.forwardDeclare.*/g,
      ''
    )
    .replace(/goog\.require.*/g, '')
    .replace(/tsickle_forward_declare_\d\./g, '')
}

/**
 * Fix some issues with the tsickle extern file definition specific
 * to typescript-in-webpack
 * @param extern {string} the extern definition file content
 * @return {string} transformed code
 */
const fixExtern = (extern: string | null): string => {
  if (extern == null) {
    return ''
  }

  const fixed = extern
    .replace(/var\s*=\s*{};\s*$/gm, '')
    .replace(/^\.(\w+\s+=\s+function.+$)/gm, 'var $1')
    .replace(/^\./gm, '')

  return fixed.replace(/([<{])!\.(\w)/gm, '$1!$2')
}

const JS_RXP = /\.js$/
const TS_RXP = /\.ts$/

const jsToTS = (path: string | null) =>
  path != null ? path.replace(JS_RXP, '.ts') : ''

const tsToJS = (path: string | null) =>
  path != null ? path.replace(TS_RXP, '.js') : ''

// declare module 'schema-utils' {
//   import { OptionObject } from 'loader-utils'

//   // this just throws
//   function validateOptions(
//     schema: Record<string, any>,
//     options: OptionObject,
//     moduleName: string
//   ): void

//   export = validateOptions
// }
