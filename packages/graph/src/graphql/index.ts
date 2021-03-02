import { QueryFetcher, createClient } from '@dish/gqless'

import { Auth } from '../Auth'
import { GRAPH_API } from '../constants'
import { getAuthHeaders } from '../getAuth'
import {
  GeneratedSchema,
  generatedSchema,
  scalarsEnumsHash,
} from './schema.generated'

export * from './schema.generated'

export const queryFetcher: QueryFetcher = async function (query, variables) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(Auth.isAdmin),
  }
  const body = JSON.stringify({
    query,
    variables,
  })
  if (process.env.DEBUG || process.env.LOG_FETCH) {
    console.log(` [gqless]
      fetch('${GRAPH_API}', {
        method: 'POST',
        headers: ${JSON.stringify(headers)},
        body: \`${body}\`,
        mode: 'cors'
      }).then(x => x.json()).then(console.log.bind(console))
`)
  }
  const response = await fetch(GRAPH_API, {
    method: 'POST',
    headers,
    body,
    mode: 'cors',
  })
  if (!response.ok) {
    throw new Error(`Network error, received status code ${response.status}`)
  }
  const json = await response.json()
  if (process.env.DEBUG || process.env.LOG_FETCH) {
    console.log(` [gqless] =>`, JSON.stringify(json, null, 2))
  }
  if (json.errors) {
    console.error(` [gqless] errors ${JSON.stringify(json.errors, null, 2)}`)
  }
  return json
}

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalarsEnumsHash,
  queryFetcher,
  catchSelectionsTimeMS: 10,
  normalization: true,
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
