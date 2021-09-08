import { sleep } from '@dish/async'
import { sentryException } from '@dish/common'
import { DISH_DEBUG } from '@dish/graph'
import { Pool, PoolConfig, QueryResult } from 'pg'

export class Database {
  pool: Pool | null = null

  static get main_db() {
    return main_db
  }

  constructor(public config: PoolConfig) {}

  static async one_query_on_main(query: string) {
    return await main_db.query(query)
  }

  async connect() {
    if (this.pool) {
      return await this.pool.connect()
    }
    this.pool = new Pool({
      idleTimeoutMillis: 500000,
      connectionTimeoutMillis: 300000,
      max: 10,
      ...this.config,
    })
    if (DISH_DEBUG > 2) {
      this.pool.on('connect', () => {
        console.log('connected to', this.config)
      })
    }
    this.pool.on('error', (e) => {
      console.log(`Error: pool (${this.config.host}:${this.config.port})`, e.message, e.stack)
      sentryException(e, {
        data: {
          more: 'Error likely from long-lived pool connection in node-pg',
        },
      })
      this.pool = null
    })
    return await this.pool.connect()
  }

  async query(query: string, values?: any) {
    if (process.env.DEBUG) {
      console.log('DB.query', this.config['host'], this.config['port'], query)
    }
    let result: QueryResult
    const client = await this.connect()
    if (!client) {
      throw new Error('no client')
    }
    try {
      const timeout = sleep(process.env.NODE_ENV === 'test' ? 15000 : 80000)
      const res = await Promise.race([
        client.query(query, values),
        timeout.then(() => {
          console.error(`Timed out on query`, query)
          return 'timed_out'
        }),
      ] as const)
      if (res === 'timed_out') {
        throw new Error(`Timed out`)
      }
      timeout.cancel()
      result = res as any
    } catch (e: any) {
      console.error('Errored query: ' + query)
      console.error(e.message)
      if (query.includes('BEGIN;') || query.includes('TRANSACTION;')) {
        await client.query('ROLLBACK')
      }
      throw e
    } finally {
      client.release()
    }
    if (process.env.DEBUG) {
      console.log(' DB.query response', result.rowCount, result.rows)
    }
    return result
  }
}

const extPort = process.env.TIMESCALE_PORT || 5433
const intPort = process.env.TIMESCALE_PORT_INTERNAL || 5432
const port = +(process.env.IS_LOCAL ? extPort : intPort)

const scrape_db_config: PoolConfig = {
  host: process.env.TIMESCALE_HOST || 'localhost',
  port,
  user: process.env.TIMESCALE_USER || 'postgres',
  password: process.env.TIMESCALE_PASSWORD || 'postgres',
  database: 'postgres',
  ssl: process.env.TIMESCALE_SSH ? true : false,
  connectionTimeoutMillis: 300_000,
  idleTimeoutMillis: 500_000,
}

const main_db_config: PoolConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  ssl: process.env.USE_SSL ? true : false,
  user: process.env.PGUSER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'dish',
  idleTimeoutMillis: 500000,
  connectionTimeoutMillis: 300000,
  max: 10,
}

export const main_db = new Database(main_db_config)
export const scrape_db = new Database(scrape_db_config)

if (process.env.DEBUG) {
  // prettier-ignore
  console.log('db configs', JSON.stringify({ scrape_db_config, main_db_config }, null, 2))
}
