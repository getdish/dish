import * as fs from 'fs'

import { fs as memfs } from 'memfs'
import { ufs } from 'unionfs'
import webpack from 'webpack'
import NodeWatchFileSystem from 'webpack/lib/node/NodeWatchFileSystem'

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
    memfs.writeFileSync(SNACK_CSS_FILE, css)
  }

  public apply(compiler: webpack.Compiler) {
    compiler.hooks.environment.tap(this.pluginName, () => {
      // @ts-expect-error
      const virtualFs = ufs.use(memfs).use(fs)
      compiler.inputFileSystem = virtualFs
      compiler.watchFileSystem = new NodeWatchFileSystem(virtualFs)
    })
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
