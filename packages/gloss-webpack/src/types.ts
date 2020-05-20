export interface CacheObject {
  [key: string]: any
}

export interface ExtractStylesOptions {
  internalViewsPaths?: string[]
  deoptKeys?: string[]
  ignore?: RegExp
  babelOptions?: { presets: Object; plugins: Object }
  whitelistStaticModules?: string[]
}

export interface LoaderOptions extends ExtractStylesOptions {
  cacheFile?: string
}

export interface PluginContext {
  cacheFile: string | null
  cacheObject: CacheObject
  memoryFS: any
  fileList: Set<string>
}
