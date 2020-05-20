import path from 'path'
import util from 'util'

import invariant from 'invariant'
import loaderUtils from 'loader-utils'

import { extractStyles } from './ast/extractStyles'
import { LoaderOptions, PluginContext } from './types'

Error.stackTraceLimit = Infinity

export default function GlossWebpackLoader(this: any, content) {
  if (this.cacheable) {
    this.cacheable()
  }

  const pluginContext: PluginContext = this[
    Symbol.for('@dish/react-native-ui-webpack')
  ]
  invariant(
    pluginContext,
    '@dish/react-native-ui-webpack must be added to the plugins array in your webpack config'
  )

  const options: LoaderOptions = loaderUtils.getOptions(this) || {}
  const { memoryFS, cacheObject } = pluginContext
  const outDir = '.out'
  const outPath = path.join(__dirname, 'tmp')
  const outRelPath = `tmp/${outDir}`

  const rv = extractStyles(
    content,
    this.resourcePath,
    { outPath, outRelPath },
    {
      cacheObject,
      errorCallback: (str: string, ...args: any[]) =>
        this.emitError(new Error(util.format(str, ...args))),
      warnCallback: (str: string, ...args: any[]) =>
        this.emitWarning(new Error(util.format(str, ...args))),
    },
    options
  )

  if (rv.css.length === 0) {
    return content
  }

  for (const { filename, content } of rv.css) {
    memoryFS.mkdirpSync(path.dirname(filename))
    memoryFS.writeFileSync(filename, content)
    // fs.mkdirpSync(path.dirname(filename))
    // fs.writeFileSync(filename, content)
  }

  this.callback(null, rv.js, rv.map)
}
