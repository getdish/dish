import { join } from 'path'

import { CreateWebpackConfig } from '../types'

export function getWebpackConfigBuilder({
  rootDir,
  env,
  target,
}: {
  rootDir: string
  env: 'development' | 'production'
  target: 'node' | 'web'
}) {
  process.env.TARGET = target
  process.env.NODE_ENV = env
  return require(join(rootDir, 'webpack.config.js')) as (
    config: CreateWebpackConfig
  ) => any
}
