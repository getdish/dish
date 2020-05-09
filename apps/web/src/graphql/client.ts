import DishAuth from '@dish/auth'
import { getGraphEndpoint } from '@dish/common-web'
import { Client, QueryFetcher } from 'gqless'
import { createUseMutation, createUseQuery } from 'gqless-hooks'

import { query_root, schema, t_mutation_root } from './generated'

const endpoint = getGraphEndpoint()

const createFetcher = (type: 'query' | 'mutation') => {
  const fetcher: QueryFetcher = async (query, variables) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...DishAuth.getHeaders(),
      },
      body: JSON.stringify({
        query: type !== 'query' ? type + query : query,
        variables,
      }),
      mode: 'cors',
    })
    if (!response.ok) {
      throw new Error(`Network error, received status code ${response.status}`)
    }
    return await response.json()
  }
  return fetcher
}

const fetchQuery = createFetcher('query')
export const client = new Client<query_root>(schema.query_root, fetchQuery)

export const query = client.query

/// gqless-hooks

const fetchMutation = createFetcher('mutation')
console.log('schema', schema)
const mutateClient = new Client<t_mutation_root>(
  schema.mutation_root,
  fetchMutation
)
export const mutation = mutateClient.query

export const useMutation = createUseMutation<t_mutation_root>({
  endpoint,
  schema,
})

export const { useQuery, prepareQuery } = createUseQuery<query_root>({
  endpoint,
  schema,
})
