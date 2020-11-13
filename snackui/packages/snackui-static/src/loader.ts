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

  const pluginContext: PluginContext = this['snackui-static']
  invariant(
    pluginContext,
    'snackui-static must be added to the plugins array in your webpack config'
  )

  const options: LoaderOptions = loaderUtils.getOptions(this) || {}

  if (content.startsWith('// static-ui-ignore')) {
    return content
  }

  const rv = extractStyles(content, this.resourcePath, options, pluginContext)

  if (!rv) {
    return content
  }

  this.callback(null, rv.js, rv.map)
}
