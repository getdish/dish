import { QueryFetcher, createClient } from '@dish/gqless'

import { Auth } from '../Auth'
import { getGraphEndpoint } from '../helpers'
import {
  GeneratedSchema,
  generatedSchema,
  scalarsEnumsHash,
} from './schema.generated'

export * from './schema.generated'

export const queryFetcher: QueryFetcher = async function (query, variables) {
  const response = await fetch(getGraphEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...Auth.getHeaders(),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    mode: 'cors',
  })

  if (!response.ok) {
    throw new Error(`Network error, received status code ${response.status}`)
  }

  const json = await response.json()

  return json
}

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalarsEnumsHash,
  queryFetcher,
})

export const {
  query,
  mutation,
  subscription,
  resolved,
  refetch,
  setCache,
  mutate,
} = client
