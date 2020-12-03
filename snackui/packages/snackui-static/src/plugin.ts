import * as fs from 'fs'

import { fs as memfs } from 'memfs'
import { ufs } from 'unionfs'
import webpack from 'webpack'
import NodeWatchFileSystem from 'webpack/lib/node/NodeWatchFileSystem'

import { PluginContext } from './types'

export * from './types'

declare module 'webpack' {
  interface Compiler {
    watchFileSystem: import('webpack/lib/node/NodeWatchFileSystem')
  }
}

export class UIStaticWebpackPlugin implements webpack.WebpackPluginInstance {
  public static loader = require.resolve('./loader')
  private pluginName = 'GlossPlugin'

  public apply(compiler: webpack.Compiler) {}
}
