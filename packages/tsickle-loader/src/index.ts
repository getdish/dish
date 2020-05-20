import { EOL } from 'os'
import * as path from 'path'

import fs from 'fs-extra'
// @ts-ignore
import { OptionObject, getOptions } from 'loader-utils'
import validateOptions from 'schema-utils'
import { JSONSchema7 } from 'schema-utils/declarations/validate'
import { RawSourceMap } from 'source-map'
import ts from 'typescript'

import { fixCode, fixExtern } from './fix-output'

import tsickle = require('tsickle')
// @ts-ignore
import webpack = require('webpack')

const LOADER_NAME = 'tsickle-loader'
const DEFAULT_EXTERN_DIR = 'dist/externs'
const EXTERNS_FILE_NAME = 'externs.js'
const DEFAULT_CONFIG_FILE = 'tsconfig.json'

const optionsSchema: JSONSchema7 = {
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

const setup = (
  loaderCTX: any /* webpack.loader.LoaderContext */
): RealOptions => {
  const options = getOptions(loaderCTX)
  validateOptions(optionsSchema, options, { name: LOADER_NAME })

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
    path.dirname(tsconfig || ''),
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

type LoaderCTX = any

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

const tsickleLoader: any /* webpack.WebpackPluginFunction */ = function (
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
  const program = ts.createProgram([sourceFileName], options, compilerHost)
  const diagnostics = ts.getPreEmitDiagnostics(program)

  const diagnosticsHost: ts.FormatDiagnosticsHost = {
    getNewLine: () => EOL,
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => path.dirname(sourceFileName),
  }

  if (diagnostics.length > 0) {
    console.log(
      'errors---',
      options,
      diagnostics.map((x) => `${x.file?.fileName}: ${x.messageText}`)
    )
    handleDiagnostics(this, diagnostics, diagnosticsHost, 'error')
    return ''
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
    logWarning: (warning) => {
      handleDiagnostics(this, [warning], diagnosticsHost, 'warning')
    },
  }

  let transpiledSources: string[] = []
  let transpiledSourceMaps: string[] = []

  const output = tsickle.emit(
    program,
    tsickleHost,
    (
      jsFileName: string,
      contents: string,
      _writeByteOrderMark: boolean,
      _onError,
      tsSourceFiles
    ) => {
      for (const source of tsSourceFiles ?? []) {
        if (source.fileName === sourceFileName) {
          if (jsFileName.endsWith('.map')) {
            transpiledSourceMaps.push(contents)
          } else {
            transpiledSources.push(contents)
          }
        }
      }
    },
    program.getSourceFile(sourceFileName)
  )

  if (transpiledSources.length !== 1) {
    this.emitError(
      Error(`missing compiled result for source file: ${sourceFileName}`)
    )
    return
  }
  if (this.sourceMap && transpiledSourceMaps.length !== 1) {
    this.emitError(
      Error(
        `tsconfig must specify sourceMap: "true" when sourcemaps are enabled!`
      )
    )
    return
  }

  const extern = output.externs[sourceFileName]
  console.log('ouput is', output, extern)
  if (extern) {
    fs.appendFileSync(externFile, fixExtern(extern))
  }

  let sourceMap: RawSourceMap | undefined = undefined
  if (this.sourceMap) {
    sourceMap = JSON.parse(transpiledSourceMaps[0])
  }

  this.callback(null, fixCode(transpiledSources[0]), sourceMap)
}

export default tsickleLoader
