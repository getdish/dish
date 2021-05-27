const Postgrator = require('postgrator')
const { join } = require('path')

const config = {
  migrationDirectory: join(__dirname, '..', 'migrations'),
  driver: 'pg',
  host: process.env.TIMESCALE_HOST || 'localhost',
  port: +(process.env.TIMESCALE_PORT_INTERNAL || process.env.TIMESCALE_PORT || '5433'),
  database: process.env.TIMESCALE_DATABASE || 'scrape_data',
  username: process.env.TIMESCALE_USER || 'postgres',
  password: process.env.TIMESCALE_PASS || 'postgres',
  ssl: process.env.USE_SSL === 'true' ? true : false,
  validateChecksums: false,
}

const { password, ...rest } = config
console.log('config minus password', rest, 'password starts with', password[0])
const postgrator = new Postgrator(config)

console.log('migrating timescale...', process.env.NODE_ENV, process.env.TIMESCALE_HOST)

async function main() {
  try {
    const applied = await postgrator.migrate()
    console.log('up to date', applied.length)
  } catch (err) {
    console.error('Error migrating', err)
    process.exit(1)
  }
  process.exit(0)
}

main()
