import fs from 'fs-extra'
// @ts-ignore
import MemoryFileSystem from 'memory-fs'
import webpack from 'webpack'
import NodeWatchFileSystem from 'webpack/lib/node/NodeWatchFileSystem'

import { CacheObject, PluginContext } from './types'
import { wrapFileSystem } from './wrapFileSystem'

type Compiler = webpack.Compiler
type Compilation = webpack.Compilation
type Plugin = webpack.WebpackPluginInstance

export * from './types'

const counterKey = Symbol.for('counter')

declare module 'webpack' {
  interface Compiler {
    watchFileSystem: import('webpack/lib/node/NodeWatchFileSystem')
  }
}

export class GlossWebpackPlugin implements Plugin {
  constructor() {
    this.memoryFS = new MemoryFileSystem()

    // the default cache object. can be overridden on a per-loader instance basis with the `cacheFile` option.
    this.cacheObject = {
      [counterKey]: 0,
    }

    // context object that gets passed to each loader.
    this.ctx = {
      cacheFile: null,
      cacheObject: this.cacheObject,
      fileList: new Set(),
      memoryFS: this.memoryFS,
    }
  }

  public static loader = require.resolve('./loader')

  private pluginName = 'GlossPlugin'
  private memoryFS: MemoryFileSystem
  private cacheObject: CacheObject
  private ctx: PluginContext

  private nmlPlugin = (loaderContext: any): void => {
    loaderContext[Symbol.for('@dish/ui-static')] = this.ctx
  }

  private compilationPlugin = (compilation: Compilation): void => {
    compilation.hooks.normalModuleLoader.tap(this.pluginName, this.nmlPlugin)
  }

  private donePlugin = (): void => {
    if (this.ctx.cacheFile) {
      // write contents of cache object as a newline-separated list of CSS strings
      console.log('this.ctx.cacheObject', this.ctx.cacheObject)
      const cacheString = Object.keys(this.ctx.cacheObject).join('\n') + '\n'
      fs.writeFileSync(this.ctx.cacheFile, cacheString, 'utf8')
    }
  }

  public apply(compiler: Compiler) {
    const environmentPlugin = (): void => {
      const wrappedFS = wrapFileSystem(compiler.inputFileSystem, this.memoryFS)
      compiler.inputFileSystem = wrappedFS
      // TODO submit PR to DefinitelyTyped
      ;(compiler as any).watchFileSystem = new NodeWatchFileSystem(wrappedFS)
    }

    compiler.hooks.environment.tap(this.pluginName, environmentPlugin)
    compiler.hooks.compilation.tap(this.pluginName, this.compilationPlugin)
    compiler.hooks.done.tap(this.pluginName, this.donePlugin)
  }
}
