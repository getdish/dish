import './env'

import { pathExists, remove } from 'fs-extra'
import webpack, { Configuration } from 'webpack'

import { CreateWebpackConfig } from '../types'

export async function build({
  webpackConfig,
  createConfig,
  watch,
  clean,
}: {
  webpackConfig: Omit<CreateWebpackConfig, 'target'>
  createConfig: (config: CreateWebpackConfig) => Configuration
  watch?: boolean
  clean?: boolean
}) {
  const webConfig = createConfig({
    ...webpackConfig,
    disableHot: true,
    target: 'web',
  })
  const webpackConfigs = watch
    ? [webConfig]
    : [
        webConfig,
        createConfig({
          ...webpackConfig,
          disableHot: true,
          legacy: true,
          target: 'web',
        }),
        createConfig({
          ...webpackConfig,
          target: 'node',
        }),
      ]
  // eventually, snackui needs in-memory cache so we can (or split in processes):
  // await Promise.all(webpackConfigs.map(buildWebpack))
  for (const config of webpackConfigs) {
    const path = config.output?.path
    if (!path) {
      throw new Error(`No output path!: ${JSON.stringify(config, null, 2)}`)
    }
    if (clean) {
      await remove(path)
    }
    if (!(await pathExists(path))) {
      await buildWebpack(config)
    } else {
      console.log('Exists already, not re-building without --clean')
    }
  }
}

async function buildWebpack(config: webpack.Configuration) {
  const stats = await new Promise<webpack.Stats | null>((res, rej) => {
    console.log(`building ${config.output?.path ?? ''}...`)
    webpack(config, (err, stats) => {
      if (err || stats?.hasErrors()) {
        return rej(err ?? `has errors, ${stats?.toString({ colors: true })}`)
      }
      res(stats ?? null)
    })
  })
  if (stats) {
    console.log(
      stats.toString({
        colors: true,
      })
    )
  }
}
