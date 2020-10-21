import { Client } from '@o/gqless'

import { isNode } from '../constants'
import { createFetcher } from '../createFetcher'
import { mutation_root, schema } from './generated'

const fetchMutation = createFetcher('mutation')

function createMutationClient() {
  return new Client(schema.mutation_root, fetchMutation)
}

let mutateClientInternal = createMutationClient()

export function resetMutationCache() {
  mutateClientInternal = createMutationClient()
  if (isNode && global.gc) {
    global.gc()
  }
}

export const mutation: mutation_root = new Proxy(mutateClientInternal.query, {
  get(_, key) {
    return mutateClientInternal.query[key]
  },
})
