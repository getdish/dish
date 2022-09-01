import { Auth, getAuthHeaders } from '../Auth'
import { GRAPH_API } from '../constants'
import { fetchLog } from './fetchLog'
import { isSafari } from '@dish/helpers'
import { QueryFetcher } from 'gqty'

export const queryFetcher: QueryFetcher = async function (query, variables) {
  if (process.env.NODE_ENV !== 'test') {
    requests++
    if (requests > 50) {
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
    ...(await getAuthHeaders(Auth.isAdmin)),
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
    console.log(query)
    console.log(variables)
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
      message += `\nvia query: ${JSON.stringify({ query, variables }, null, 2)}`;
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
