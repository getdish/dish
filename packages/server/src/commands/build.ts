import { join } from 'path'

import { Command, flags } from '@oclif/command'

import { buildApp } from '../lib/buildApp'
import { getWebpackConfigBuilder } from '../lib/getWebpackConfigBuilder'

if (!process.env.NODE_ENV) {
  throw new Error(`No NODE_ENV set`)
}

export class Build extends Command {
  static description = 'Build app to filesystem'
  static aliases = ['s']

  static flags = {
    help: flags.help({ char: 'h' }),
    clean: flags.string({
      description: 'Rebuild either "node", "web", "all"',
      // no default all for fast rebuild
    }),
    serial: flags.boolean({
      description: 'Build one at a time for memory saving',
    }),
    ['no-optimize']: flags.boolean({
      description: `Don't optimize (minify, etc) for faster production debugging`,
    }),
  }

  async run() {
    const { flags } = this.parse(Build)

    try {
      const rootDir = process.cwd()
      await buildApp({
        serial: flags.serial,
        clean: flags.clean,
        createConfig: getWebpackConfigBuilder({ rootDir }),
        webpackConfig: {
          noMinify: flags['no-optimize'] ?? false,
          entry: join(rootDir, 'src', 'index.ts'),
          env: 'production',
          snackOptions: {
            evaluateImportsWhitelist: ['constants.js', 'colors.js'],
          },
        },
      })
    } catch (err) {
      console.error('Caught error', err)
      process.exit(1)
    }
  }
}
