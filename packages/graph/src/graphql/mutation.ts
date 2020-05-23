import { Client } from 'gqless'

import { createFetcher } from '../createFetcher'
import { query } from './client'
import { mutation_root, schema } from './generated'

const fetchMutation = createFetcher('mutation')
export const mutateClient = new Client(
  schema.mutation_root as any,
  fetchMutation
)

export const mutation: mutation_root = mutateClient.query
