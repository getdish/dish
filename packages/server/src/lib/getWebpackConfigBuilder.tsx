import { join } from 'path'

import { CreateWebpackConfig } from '../types'

export function getWebpackConfigBuilder({ rootDir }: { rootDir: string }) {
  try {
    return require(join(rootDir, 'webpack.config.js')) as (
      config: CreateWebpackConfig
    ) => any
  } catch (err) {
    console.error('No webpack.config.js')
    process.exit(1)
  }
}
