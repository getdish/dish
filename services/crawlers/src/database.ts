import { sleep } from '@dish/async'
import { sentryException } from '@dish/common'
import { omit } from 'lodash'
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
    console.log('conf', omit(this.config, 'password'))
    this.pool = new Pool({
      idleTimeoutMillis: 500000,
      connectionTimeoutMillis: 300000,
      max: 10,
      ...this.config,
    })
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

  async query(query: string) {
    if (process.env.DEBUG) {
      console.log('DB.query', this.config['port'], query)
    }
    let result: QueryResult
    const client = await this.connect()
    if (!client) {
      throw new Error('no client')
    }
    try {
      const timeout = sleep(process.env.NODE_ENV === 'test' ? 15000 : 80000)
      const res = await Promise.race([
        client.query(query),
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
    } catch (e) {
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
const port = +(process.env.EXTERNAL ? extPort : intPort)

const db_config: PoolConfig = {
  host: process.env.TIMESCALE_HOST || 'localhost',
  port,
  user: process.env.TIMESCALE_USER || 'postgres',
  password: process.env.TIMESCALE_PASSWORD || 'postgres',
  database: 'postgres',
  ssl: process.env.TIMESCALE_SSH ? true : false,
  connectionTimeoutMillis: 300_000,
  idleTimeoutMillis: 500_000,
}

export const main_db = new Database({
  host: process.env.PGHOST || 'localhost',
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  ssl: process.env.USE_SSL ? true : false,
  user: process.env.PGUSER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'dish',
  idleTimeoutMillis: 500000,
  connectionTimeoutMillis: 300000,
  max: 10,
})

export const db = new Database(db_config)
