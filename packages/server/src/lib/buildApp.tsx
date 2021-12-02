import { CreateWebpackConfig, ServerConfig } from '../types'
import { pathExists, remove } from 'fs-extra'
import { writeFile } from 'fs/promises'
import { Configuration, Stats } from 'webpack'

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
  process.env.TARGET = 'web'
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
    console.log(` [web] building ${config.output?.path ?? ''} with NODE_ENV ${env}...`)

    const webpack = require('webpack')

    webpack(config, async (err, stats) => {
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

    if (process.env.ANALYZE_BUNDLE) {
      console.log('writing stats to /tmp/webpack-stats.json')
      await writeFile('/tmp/webpack-stats.json', JSON.stringify(stats.toJson(), null, 2))
    }
  }
}

function isPresent<T extends Object>(input: null | undefined | T): input is T {
  return input != null
}
