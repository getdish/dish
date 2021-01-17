import { join } from 'path'

import { Command, flags } from '@oclif/command'

import { createServer } from '../lib/createServer'
import { ServerConfig } from '../types'

export class Start extends Command {
  static description = 'Start development server'
  static aliases = ['s']

  static flags = {
    help: flags.help({ char: 'h' }),
    prod: flags.boolean({
      description: 'Start production server',
    }),
    ssr: flags.boolean({
      description: 'Build and serve statically.',
    }),
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
    inspect: flags.boolean({
      description: 'Enable the Node.js inspector',
    }),
    clean: flags.string({
      description: 'Start from a fresh cache.',
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
      inspect: flags.inspect,
      clean: flags.clean,
      env: flags.prod ? 'production' : 'development',
      watch: flags.ssr ? false : true,
      apiDir: flags['no-api'] ? null : join(rootFolder, 'src', 'api'),
      https: flags.https,
    }

    if (config.env === 'development') {
      process.env.NODE_ENV = 'development'
    } else {
      process.env.NODE_ENV = 'production'
    }

    try {
      await createServer(config)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}
