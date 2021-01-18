import { join } from 'path'

import { Command, flags } from '@oclif/command'

import { buildApp } from '../lib/buildApp'
import { getWebpackConfigBuilder } from '../lib/getWebpackConfigBuilder'

export class Build extends Command {
  static description = 'Build app to filesystem'
  static aliases = ['s']

  static flags = {
    help: flags.help({ char: 'h' }),
    clean: flags.string({
      description: 'Rebuild either "node", "web", "legacy", "all"',
      default: 'all',
    }),
    serial: flags.boolean({
      description: 'Build one at a time for memory saving',
    }),
  }

  async run() {
    const { flags } = this.parse(Build)

    try {
      const rootDir = process.cwd()
      await buildApp({
        serial: flags.serial,
        clean: flags.clean,
        createConfig: (opts) => {
          return getWebpackConfigBuilder({ rootDir })(opts)
        },
        webpackConfig: {
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
