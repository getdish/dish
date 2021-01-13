import { Command, flags } from '@oclif/command'

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
    clean: flags.boolean({
      description: 'Start from a fresh cache.',
    }),
  }

  async run() {
    const { flags } = this.parse(Start)

    const config: ServerConfig = {
      rootFolder: process.cwd(),
      port: flags.port,
      hostname: flags.hostname ?? 'localhost',
      inspect: flags.inspect ?? false,
      clean: flags.clean,
      env: flags.prod ? 'production' : 'development',
      watch: flags.ssr ? false : true,
    }

    if (config.env === 'development') {
      process.env.NODE_ENV = 'development'
    } else {
      process.env.NODE_ENV = 'production'
    }

    try {
      const { createServer } = require('../createServer')
      await createServer(config)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}
