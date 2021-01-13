import { join } from 'path'

import { CreateWebpackConfig } from '../types'

export function getWebpackConfigBuilder({ rootDir }: { rootDir: string }) {
  return require(join(rootDir, 'webpack.config.js')) as (
    config: CreateWebpackConfig
  ) => any
}
