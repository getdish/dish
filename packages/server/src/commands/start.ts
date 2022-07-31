import { createServer } from '../lib/createServer'
import { ServerConfig } from '../types'
import { Command, flags } from '@oclif/command'
import { join } from 'path'

if (!process.env.NODE_ENV) {
  console.warn('No node env set, setting to development')
  process.env.NODE_ENV = 'development'
}

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
    host: flags.string({
      char: 'H',
      description: 'Set server host',
    }),
    inspect: flags.boolean({
      description: 'Enable the Node.js inspector',
    }),
    clean: flags.string({
      description: 'Start from a fresh cache.',
      default: 'all',
    }),
    https: flags.boolean({
      char: 'S',
      description: 'Set up an https domain',
    }),
    serial: flags.boolean({
      description: 'Disable multi-process (helpful for internal debugging)',
    }),
    ['no-optimize']: flags.boolean({
      description: `Don't optimize (minify, etc) for faster production debugging`,
    }),
    ['reset-cache']: flags.boolean({
      description: 'Clear cache on start',
    }),
    ['local-proxy']: flags.boolean({
      description: 'Proxy localhost to your ip for external use',
    }),
  }

  async run() {
    const { flags } = this.parse(Start)
    const rootDir = process.cwd()

    const config: ServerConfig = {
      rootDir,
      port: flags.port,
      host: flags.host,
      inspect: flags.inspect,
      clean: flags.clean,
      env: flags.prod ? 'production' : 'development',
      watch: flags.ssr ? false : true,
      apiDir: flags['no-api'] ? null : join(rootDir, 'api'),
      noOptimize: flags['no-optimize'] ?? false,
      https: flags.https,
      serial: flags.serial,
      resetCache: flags['reset-cache'],
    }

    try {
      await createServer(config)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}
