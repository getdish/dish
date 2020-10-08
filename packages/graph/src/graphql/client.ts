import { Client } from '@o/gqless'

import { createFetcher } from '../createFetcher'
import { query_root, schema } from './generated'

export const fetchQuery = createFetcher('query')

function createQueryClient() {
  return new Client(schema.query_root, fetchQuery)
}

// warning: using type here causes Infinity slowdown
export let client = createQueryClient()

// main query interface
export const query: query_root = new Proxy(client.query, {
  get(_, key) {
    return client.query[key]
  },
})

export function resetQueryCache(options?: { ifAbove?: number }) {
  if (options?.ifAbove && client.cache.entries.size < options.ifAbove) {
    return
  }
  console.debug('reset gqless cache')
  client.cache.entries.clear()
  client = createQueryClient()
}
