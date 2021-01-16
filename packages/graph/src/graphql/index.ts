import { QueryFetcher, createClient } from '@dish/gqless'

import { getAuthHeaders } from '../getAuth'
import { getGraphEndpoint } from '../helpers/getGraphEndpoint'
import {
  GeneratedSchema,
  generatedSchema,
  scalarsEnumsHash,
} from './schema.generated'

export * from './schema.generated'

export const queryFetcher: QueryFetcher = async function (query, variables) {
  const url = getGraphEndpoint()
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  }
  const body = JSON.stringify({
    query,
    variables,
  })
  if (process.env.DEBUG || process.env.LOG_FETCH) {
    console.log(`fetch('${url}', {
      method: 'POST',
      headers: ${JSON.stringify(headers, null, 2)},
      body: \`${body}\`,
      mode: 'cors'
    }).then(x => x.json()).then(console.log.bind(console))`)
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
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
