import Webpack, { Configuration } from 'webpack'
// import WebpackPwaManifest from 'webpack-pwa-manifest'

export type ServerConfig = {
  rootDir: string
  watch: boolean
  env: 'production' | 'development'
  inspect?: boolean
  clean?: 'web' | 'legacy' | 'node' | 'all' | false | string
  port?: number
  host?: string
  apiDir?: string | null
  https?: boolean
  verbose?: boolean
  noOptimize?: boolean
  serial?: boolean
  resetCache?: boolean
}

export type ServerConfigNormal = Required<ServerConfig> & {
  url: string
  buildDir: string
  protocol: string
  createConfig: (opts: CreateWebpackConfig) => Configuration
  webpackConfig: Omit<CreateWebpackConfig, 'target'>
}

export type CreateWebpackConfig = {
  entry: string
  target: 'node' | 'web'
  // legacy?: boolean
  env: 'development' | 'production'
  cwd?: string
  babelInclude?: (path: string) => boolean
  snackOptions: {
    // user options
    themesFile?: string
    evaluateVars?: boolean
    evaluateImportsWhitelist?: string[]
    exclude?: RegExp
    mediaQueries?: any
  }
  resolve?: Webpack.ResolveOptions
  htmlOptions?: Object
  // pwaOptions?: WebpackPwaManifest.ManifestOptions
  defineOptions?: Object
  polyFillPath?: string
  disableHot?: boolean
  noMinify?: boolean
  verbose?: boolean
}

export type File = {
  name: string
  route: string
  file: string
  fileIn: string
}
