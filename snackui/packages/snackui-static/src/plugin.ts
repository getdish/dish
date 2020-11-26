import { dirname } from 'path'

import { mkdirpSync, writeFileSync } from 'fs-extra'
import webpack from 'webpack'

import { SNACK_CSS_FILE } from './constants'
import { PluginContext } from './types'

export * from './types'

declare module 'webpack' {
  interface Compiler {
    watchFileSystem: import('webpack/lib/node/NodeWatchFileSystem')
  }
}

export class UIStaticWebpackPlugin implements webpack.Plugin {
  public static loader = require.resolve('./loader')
  private pluginName = 'GlossPlugin'
  private ctx: PluginContext

  constructor() {
    this.ctx = {
      writeCSS: this.write,
    }
  }

  private write = (css: string) => {
    mkdirpSync(dirname(SNACK_CSS_FILE))
    writeFileSync(SNACK_CSS_FILE, css)
  }

  public apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(
        this.pluginName,
        (loaderContext) => {
          loaderContext['snackui-static'] = this.ctx
        }
      )
    })
  }
}
