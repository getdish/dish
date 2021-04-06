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

  console.warn('⚠️ disabling node build for now since we arent using it')

  const configs = watch
    ? { web }
    : {
        web,
        // node: createConfig({
        //   ...webpackConfig,
        //   target: 'node',
        //   noMinify: true,
        // }),
      }

  const cleans = clean ? clean.trim().split(' ') : []

  const buildTasks = (
    await Promise.all(
      Object.entries(configs).map(async ([name, config]) => {
        if (!config) return
        const path = config.output?.path
        if (!path) {
          throw new Error(`No output path!: ${JSON.stringify(config, null, 2)}`)
        }
        for (const cleanName of cleans) {
          if (cleanName === name || cleanName === 'all') {
            await remove(path)
          }
        }
        if (await pathExists(path)) {
          console.log(` [web] build skipping ${name} (rebuild with --clean ${name})`)
          return
        }
        console.log(`No ${path}`)
        return [name, config] as const
      })
    )
  )
    .filter(isPresent)
    .map(([name, config]) => {
      console.log(` [web] build ${name}...`)
      return () => buildWebpack(config!)
    })

  await async(serial ? 'serial' : 'parallel', buildTasks)
}

async function async<A extends any>(
  type: 'serial' | 'parallel',
  items: (() => Promise<A>)[]
): Promise<A[]> {
  if (type === 'serial') {
    let res: any[] = []
    for (const item of items) {
      res.push(await item())
    }
    return res
  }
  return await Promise.all(items.map((x) => x()))
}

async function buildWebpack(config: Configuration) {
  const env = process.env.NODE_ENV
  const stats = await new Promise<Stats | null>((res, rej) => {
    console.log(` [web] building ${config.output?.path ?? ''} in ${env}...`)
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

function isPresent<T extends Object>(input: null | undefined | T): input is T {
  return input != null
}
