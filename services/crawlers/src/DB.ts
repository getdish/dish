import { sleep } from '@dish/async'
import { sentryException } from '@dish/common'
import { Pool, PoolConfig, QueryResult } from 'pg'

export class DB {
  pool: Pool | null = null

  static main_db = new DB({
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

  constructor(public config: PoolConfig) {}

  static async one_query_on_main(query: string) {
    return await DB.main_db.query(query)
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
