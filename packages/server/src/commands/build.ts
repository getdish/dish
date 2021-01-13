import { join } from 'path'

import { Command, flags } from '@oclif/command'

import { build } from '../build'
import { getWebpackConfigBuilder } from '../getWebpackConfigBuilder'

export class Build extends Command {
  static description = 'Build app to filesystem'
  static aliases = ['s']

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  async run() {
    // const { flags } = this.parse(Build)

    try {
      const rootDir = process.cwd()
      await build({
        clean: true,
        createConfig: (opts) => {
          return getWebpackConfigBuilder({
            rootDir,
            env: 'production',
            target: opts.target,
          })(opts)
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
