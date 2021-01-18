import { pathExists, remove } from 'fs-extra'
import { Configuration, Stats } from 'webpack'

import { CreateWebpackConfig, ServerConfig } from '../types'

export async function buildApp({
  webpackConfig,
  createConfig,
  watch,
  clean,
  serial,
}: {
  webpackConfig: Omit<CreateWebpackConfig, 'target'>
  createConfig: (config: CreateWebpackConfig) => Configuration
  watch?: boolean
  clean?: ServerConfig['clean']
  serial?: boolean
}) {
  const web = createConfig({
    ...webpackConfig,
    disableHot: true,
    target: 'web',
  })
  const configs = watch
    ? { web }
    : {
        web,
        legacy: createConfig({
          ...webpackConfig,
          disableHot: true,
          legacy: true,
          target: 'web',
        }),
        node: createConfig({
          ...webpackConfig,
          target: 'node',
        }),
      }

  const excludes = clean ? clean.trim().split(' ') : []

  await Promise.all(
    (
      await async(
        serial ? 'serial' : 'parallel',
        Object.entries(configs).map(async ([name, config]) => {
          if (!config) return
          const path = config.output?.path
          if (!path) {
            throw new Error(
              `No output path!: ${JSON.stringify(config, null, 2)}`
            )
          }
          for (const exclude of excludes) {
            if (exclude === name || exclude === 'all') {
              await remove(path)
            }
          }
          if (await pathExists(path)) {
            console.log(` [web] skip ${name} (rebuild with --clean ${name})`)
            return
          }
          return config
        })
      )
    )
      .filter(Boolean)
      .map(async (config) => {
        await buildWebpack(config!)
      })
  )
}

async function async<A extends any>(
  type: 'serial' | 'parallel',
  items: Promise<A>[]
): Promise<A[]> {
  if (type === 'serial') {
    let res: any[] = []
    for (const item of items) {
      res.push(await item)
    }
    return res
  }
  return await Promise.all(items)
}

async function buildWebpack(config: Configuration) {
  const stats = await new Promise<Stats | null>((res, rej) => {
    console.log(` [web] building ${config.output?.path ?? ''}...`)
    const webpack = require('webpack')
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
