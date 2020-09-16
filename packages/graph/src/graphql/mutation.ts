import { Client } from '@o/gqless'

import { createFetcher } from '../createFetcher'
import { mutation_root, schema } from './generated'

const fetchMutation = createFetcher('mutation')

function createMutationClient() {
  return new Client(schema.mutation_root, fetchMutation)
}

let mutateClientInternal = createMutationClient()

export function resetMutationCache() {
  mutateClientInternal = createMutationClient()
}

export const mutation: mutation_root = new Proxy(mutateClientInternal.query, {
  get(_, key) {
    return mutateClientInternal.query[key]
  },
})
