import { isSafari } from '@dish/helpers'
import { QueryFetcher, createClient } from 'gqless'

import { Auth } from '../Auth'
import { GRAPH_API, isManualDebugMode } from '../constants'
import { getAuthHeaders } from '../getAuth'
import { GeneratedSchema, generatedSchema, scalarsEnumsHash } from './schema.generated'

export * from './schema.generated'

export const fetchLog = (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
  if (isManualDebugMode || process.env.DEBUG || process.env.LOG_FETCH) {
    console.log(` [gqless]
      fetch('${input}', ${
      init ? JSON.stringify(init, null, 2) : undefined
    }).then(x => x.json()).then(console.log.bind(console))
`)
  }
  return fetch(input, init)
}

let requests = 0
let last
function clear() {
  clearTimeout(last)
  last = setTimeout(() => {
    requests = 0
  }, 50)
}
clear()

export const queryFetcher: QueryFetcher = async function (query, variables) {
  if (process.env.NODE_ENV !== 'test' && process.env.TARGET === 'web') {
    requests++
    if (requests > 10) {
      console.log('too many!')
      throw new Error(`Break out GQ`)
    }
  }
  clear()
  const headers = {
    'content-type': 'application/json',
    'x-user-is-logged-in': `${Auth.isLoggedIn}`,
    ...getAuthHeaders(Auth.isAdmin),
  }
  const body = JSON.stringify({
    query,
    variables,
  })
  const startTime = Date.now()
  const response = await fetchLog(GRAPH_API, {
    method: 'POST',
    headers,
    body,
    mode: 'cors',
  })
  const json = await response.json()
  if (process.env.NODE_ENV === 'development' && isSafari) {
    console.groupCollapsed(` [gqless] (${Date.now() - startTime}ms)`)
    console.log(json)
    console.groupEnd()
  }
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
  catchSelectionsTimeMS: 30,
  normalization: false,
  retry: false,
})

export const { query, mutation, subscription, resolved, refetch, setCache, mutate } = client
