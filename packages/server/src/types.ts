import { SnackOptions } from '@snackui/static'
import Webpack from 'webpack'
import { Configuration } from 'webpack'
import WebpackPwaManifest from 'webpack-pwa-manifest'

export type ServerConfig = {
  rootFolder: string
  watch: boolean
  env: 'production' | 'development'
  inspect?: boolean
  clean?: boolean
  port?: number
  hostname?: string
  apiDir?: string | null
  https?: boolean
}

export type ServerConfigNormal = Required<ServerConfig> & {
  url: string
  rootDir: string
  buildDir: string
  protocol: string
  createConfig: (opts: CreateWebpackConfig) => Configuration
  webpackConfig: Omit<CreateWebpackConfig, 'target'>
}

export type CreateWebpackConfig = {
  entry: string
  target: 'node' | 'web'
  legacy?: boolean
  env: 'development' | 'production'
  cwd?: string
  babelInclude?: (path: string) => boolean
  snackOptions: SnackOptions
  resolve?: Webpack.ResolveOptions
  htmlOptions?: Object
  pwaOptions?: WebpackPwaManifest.ManifestOptions
  defineOptions?: Object
  polyFillPath?: string
  disableHot?: boolean
  noMinify?: boolean
}

export type File = {
  name: string
  route: string
  file: string
  fileIn: string
}
