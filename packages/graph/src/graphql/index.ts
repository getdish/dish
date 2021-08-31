import { isSafari } from '@dish/helpers'
import { QueryFetcher, createClient } from 'gqty'

import { Auth } from '../Auth'
import { GRAPH_API, isManualDebugMode } from '../constants'
import { getAuthHeaders } from '../getAuth'
import { GeneratedSchema, generatedSchema, scalarsEnumsHash } from './schema.generated'

export * from './schema.generated'

export const fetchLog = (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
  if (isManualDebugMode || process.env.DEBUG || process.env.LOG_FETCH) {
    console.log(` [gqty]
      fetch('${input}', ${
      init ? JSON.stringify(init, null, 2) : undefined
    }).then(x => x.json()).then(console.log.bind(console))
`)
  }
  return fetch(input, init)
}

// prevent loops
let requests = 0
let last
function clear() {
  clearTimeout(last)
  last = setTimeout(
    () => {
      requests = 0
    },
    process.env.NODE_ENV === 'development' ? 1000 : 3000
  )
}
clear()

export const queryFetcher: QueryFetcher = async function (query, variables) {
  if (process.env.NODE_ENV !== 'test' && process.env.TARGET === 'web') {
    requests++
    if (requests > 30) {
      console.warn(
        'too many! this is caused oftentimes by the data coming from graph not matching the expected data from the query'
      )
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
    console.groupCollapsed(` [gqty] (${Date.now() - startTime}ms)`)
    console.log(json)
    console.groupEnd()
  }
  if (process.env.DEBUG || process.env.LOG_FETCH) {
    console.log(` [gqty] =>`, JSON.stringify(json, null, 2))
  }
  if (json.errors) {
    let message = ` [gqty] error ${GRAPH_API}\n${JSON.stringify(json.errors, null, 2)}`

    if (process.env.NODE_ENV !== 'production') {
      // prettier-ignore
      message += `\nvia query: ${JSON.stringify({ query, variables }, null, 2)}`
    }

    // in test mode bail on first error
    if (process.env.NODE_ENV === 'test') {
      throw new Error(message)
    } else {
      console.error(message)
    }
  }
  return json
}

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalarsEnumsHash,
  queryFetcher,
  catchSelectionsTimeMS: 80,
  normalization: false,
  retry: false,
})

export const { query, mutation, subscription, resolved, refetch, setCache, mutate } = client
