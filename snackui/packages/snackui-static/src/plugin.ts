import { fstat, stat, utimesSync } from 'fs'

import VirtualModulesPlugin from '@o/webpack-virtual-modules'
import webpack from 'webpack'

import { SNACK_CSS_FILE } from './constants'
import { PluginContext } from './types'

type Compiler = webpack.Compiler
type Compilation = webpack.compilation.Compilation
type Plugin = webpack.Plugin

export * from './types'

declare module 'webpack' {
  interface Compiler {
    watchFileSystem: import('webpack/lib/node/NodeWatchFileSystem')
  }
}

export class UIStaticWebpackPlugin implements Plugin {
  public static loader = require.resolve('./loader')
  private pluginName = 'GlossPlugin'
  private virtualModule = new VirtualModulesPlugin()
  private ctx: PluginContext
  private css = ''

  constructor() {
    this.ctx = {
      writeCSS: this.write,
    }
  }

  private write = (css: string) => {
    this.css = css
    this.flushWrite()
  }

  private flushWrite = () => {
    this.virtualModule.writeModule(
      // hack alert
      // need to add logic to figure out where to put the file
      // snackui-static tests wants it to be 3 higher, dish needs 1 higher
      `../../../node_modules/${SNACK_CSS_FILE}`,
      this.css
    )
  }

  private nmlPlugin = (loaderContext: any): void => {
    loaderContext['snackui-static'] = this.ctx
  }

  private compilationPlugin = (compilation: Compilation): void => {
    compilation.hooks.normalModuleLoader.tap(this.pluginName, this.nmlPlugin)
  }

  public apply(compiler: Compiler) {
    this.virtualModule.apply(compiler)
    compiler.hooks.compilation.tap(this.pluginName, this.compilationPlugin)

    let hasTappedOnce = false
    compiler.hooks.compilation.tap(this.pluginName, (comp) => {
      comp.hooks.seal.tap(this.pluginName, () => {
        for (const module of comp.modules) {
          console.log('we got a module', module._source)
        }
      })
    })

    // if (!hasTappedOnce) {
    //   const now = new Date()
    //   utimesSync(
    //     '/Users/nw/dish/dish-app/shared/AppSearchBar.tsx',
    //     now,
    //     now
    //   )
    //   hasTappedOnce = true
    // }

    // compiler.hooks.emit.tap(this.pluginName, (comp) => {
    //   console.log('comp.entrypoints', comp.entrypoints)
    // })
  }
}
