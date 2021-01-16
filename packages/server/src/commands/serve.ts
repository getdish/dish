import { join } from 'path'

import { Command, flags } from '@oclif/command'

import { createServer } from '../lib/createServer'
import { ServerConfig } from '../types'

export class Start extends Command {
  static description = 'Serve built app with api'
  static aliases = ['s']

  static flags = {
    help: flags.help({ char: 'h' }),
    'no-api': flags.integer({
      description: 'Run without api',
    }),
    port: flags.integer({
      char: 'p',
      description: 'Set port number',
    }),
    hostname: flags.string({
      char: 'H',
      description: 'Set server hostname',
    }),
    clean: flags.boolean({
      description: 'Rebuild on start.',
    }),
    https: flags.boolean({
      char: 'S',
      description: 'Set up an https domain',
    }),
  }

  async run() {
    const { flags } = this.parse(Start)
    const rootFolder = process.cwd()
    const config: ServerConfig = {
      rootFolder,
      port: flags.port,
      hostname: flags.hostname,
      inspect: false,
      clean: flags.clean,
      env: 'production',
      watch: false,
      apiDir: flags['no-api'] ? null : join(rootFolder, 'src', 'api'),
      https: flags.https,
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
