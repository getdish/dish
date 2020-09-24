import { QueryResponse } from '@o/gqless'

import { isDevProd } from './constants'
import { Auth } from './helpers/auth-helpers'
import { getGraphEndpoint } from './helpers/getGraphEndpoint'

type QueryFetcherWithOptions = (
  query: string,
  variables?: Record<string, any>,
  options?: QueryFetcherOptions
) => Promise<QueryResponse>

type QueryFetcherOptions = {
  silenceNotFound?: boolean
}

const endpoint = getGraphEndpoint()

export const createFetcher = (
  type: 'query' | 'mutation'
): QueryFetcherWithOptions => {
  return async (queryIn, variables, options) => {
    const query = type !== 'query' ? type + queryIn : queryIn
    const request = buildRequest(query, variables)
    const response = await fetchResponse(request)
    const data = await parseResponse(response)
    debug(query, request, data)
    checkForHasuraError(data, response, query, request, options)
    return data
  }
}

const buildRequest = (
  query: string,
  variables: Record<string, any> | undefined
) => {
  const body = JSON.stringify({
    query,
    variables,
  })
  const request: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...Auth.getHeaders(),
    },
    body,
    mode: 'cors',
  }
  return request
}

const fetchResponse = async (request: RequestInit) => {
  let response: Response
  try {
    response = await fetch(endpoint, request)
  } catch (e) {
    const error = {
      message: 'Failed HTTP request to Hasura: ' + JSON.stringify(request),
    }
    console.error(error)
    if (graphErrorListeners.size) {
      graphErrorListeners.forEach((cb) => cb([error]))
    }
    throw e
  }
  return response
}

const parseResponse = async (response: Response) => {
  let data: QueryResponse
  const response_text = await response.text()
  try {
    data = JSON.parse(response_text)
  } catch (e) {
    const error = {
      message: 'Failed parsing Hasura response: ' + response_text,
    }
    console.error(error)
    if (graphErrorListeners.size) {
      graphErrorListeners.forEach((cb) => cb([error]))
    }
    throw e
  }
  return data
}

const debug = (query: string, request: RequestInit, data: QueryResponse) => {
  if (!process.env.DEBUG) return
  const simpleOut = process.env.DEBUG === '1'
  const outObj = simpleOut ? { query, data } : { query, request, data }
  const out = JSON.stringify(outObj, null, 2)
    .replace(/(\\n)/g, '\n')
    .replace(/(\\")/g, '"')
  const lim = 8000
  const delimeter = '\n\n   ...\n\n'
  const print =
    out.length > lim && simpleOut ? out.slice(0, lim) + delimeter : out
  console.log('createFetcher', print)
}

const checkForHasuraError = (
  data: QueryResponse,
  response: Response,
  query: string,
  request: RequestInit,
  options?: QueryFetcherOptions
) => {
  if (data.errors || !response.ok) {
    if (options?.silenceNotFound && response.status == 404) {
      return data
    } else {
      if (graphErrorListeners.size) {
        graphErrorListeners.forEach((cb) => cb(data.errors))
      }

      // helpful for debugging
      console.error(`Failed query:
fetch('${endpoint}', ${JSON.stringify(
        request,
        null,
        2
      )}).then(x => x.json()).then(x => console.log(x))`)

      throw new HasuraError(query, data.errors)
    }
  }
}

export type GraphError = { message: string }

type ErrorListener = (errors: GraphError[]) => void

const graphErrorListeners = new Set<ErrorListener>()

export function onGraphError(cb: ErrorListener) {
  graphErrorListeners.add(cb)
}

class HasuraError extends Error {
  errors: Error[] | null = null

  constructor(query: string, errors: any[] | null = null) {
    super()
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HasuraError)
    }
    this.errors = errors
    this.message =
      errors?.[0]?.extensions?.internal?.error?.message || errors?.[0]?.message
    if (isDevProd) {
      this.name = 'Dish API Error'
    } else {
      console.error('fetch errors', errors, 'for query', query)
      this.name = 'HasuraError'
    }
  }
}
