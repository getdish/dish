#!/usr/bin/env node

const Postgrator = require('postgrator')
const { join } = require('path')

const config = {
  migrationDirectory: join(__dirname, '..', 'migrations'),
  driver: 'pg',
  host: process.env.PG_HOST || 'localhost',
  port: +(process.env.PG_PORT || '5433'),
  database: process.env.PG_DATABASE || 'scrape_data',
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASS || 'postgres',
  ssl: process.env.USE_SSL === 'true' ? true : false,
}

// console.log(config)

const postgrator = new Postgrator(config)

postgrator
  .migrate()
  .then((appliedMigrations) => console.log('up to date', appliedMigrations.length))
  .catch((error) => console.error('Error migrating', error))
