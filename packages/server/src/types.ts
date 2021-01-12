import { Configuration } from 'webpack'

export type ServerConfig = {
  rootFolder: string
  env: 'prod' | 'dev'
  inspect?: boolean
  clean?: boolean
  port?: number
  hostname?: string
}

export type ServerConfigNormal = ServerConfig & {
  rootDir: string
  buildDir: string
  webpackConfig: Configuration
}
