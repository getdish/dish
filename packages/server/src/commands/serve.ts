import { join } from 'path'

import { Command, flags } from '@oclif/command'

import { createServer } from '../lib/createServer'
import { ServerConfig } from '../types'

export class Start extends Command {
  static description = 'Serve built app with api'
  static aliases = ['s']

  static flags = {
    help: flags.help({ char: 'h' }),
    'no-api': flags.boolean({
      description: 'Run without api',
    }),
    port: flags.integer({
      char: 'p',
      description: 'Set port number',
    }),
    host: flags.string({
      char: 'H',
      description: 'Set server host',
    }),
    clean: flags.string({
      description: 'Rebuild on start.',
      default: 'all',
    }),
    https: flags.boolean({
      char: 'S',
      description: 'Set up an https domain',
    }),
    verbose: flags.boolean({
      char: 'S',
      description: 'logs',
    }),
  }

  async run() {
    const { flags } = this.parse(Start)
    const rootDir = process.cwd()
    const config: ServerConfig = {
      rootDir,
      port: flags.port ?? 4444,
      host: flags.host ?? '0.0.0.0',
      inspect: false,
      clean: flags.clean as any,
      env: 'production',
      watch: false,
      apiDir: flags['no-api'] ? null : join(rootDir, 'src', 'api'),
      https: flags.https,
      verbose: flags.verbose,
    }

    process.env.NODE_ENV = 'production'

    try {
      await createServer(config)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}
