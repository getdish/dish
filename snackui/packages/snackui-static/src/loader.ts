import invariant from 'invariant'
import loaderUtils from 'loader-utils'

import { extractStyles } from './ast/extractStyles'
import { SNACK_CSS_FILE } from './constants'
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

  if (content[0] === '/' && content.startsWith('// static-ui-ignore')) {
    return content
  }

  const rv = extractStyles(
    content,
    this.resourcePath,
    options,
    pluginContext.writeCSS,
    this.addDependency.bind(this)
  )

  if (!rv) {
    return content
  }

  this.callback(null, rv.js, rv.map)
}
