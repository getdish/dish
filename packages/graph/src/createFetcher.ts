import { QueryResponse } from 'gqless'

import { Auth } from './Auth'
import { isDevProd } from './constants'
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

if (process.env.NODE_ENV === 'development') {
  console.log('graph endpoint', endpoint)
}

export const createFetcher = (
  type: 'query' | 'mutation'
): QueryFetcherWithOptions => {
  return async (queryIn, variables, options) => {
    const query = type !== 'query' ? type + queryIn : queryIn
    const request = buildRequest(query, variables)
    const response = await fetchResponse(request)
    if (!response) return
    const data = await parseResponse(response, request)
    debug(query, request, data)
    checkForHasuraResponseError(data, response, request, options)
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
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      ...Auth.getHeaders(),
    },
    body,
    mode: 'cors',
  }
  return request
}

const fetchResponse = async (request: RequestInit) => {
  try {
    return await fetch(endpoint, request)
  } catch (e) {
    const error = new HasuraError(
      [
        {
          message: 'Failed HTTP request to Hasura: ' + e.message,
        },
      ],
      request
    )
    handleError(error)
  }
}

const parseResponse = async (response: Response, request: RequestInit) => {
  const response_text = await response.text()
  try {
    return JSON.parse(response_text)
  } catch (e) {
    const error = new HasuraError(
      [
        {
          message: 'Failed parsing Hasura response: ' + response_text,
        },
      ],
      request
    )
    handleError(error)
  }
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

const checkForHasuraResponseError = (
  data: QueryResponse,
  response: Response,
  request: RequestInit,
  options?: QueryFetcherOptions
) => {
  const is_error = data.errors || !response.ok
  if (!is_error) return data
  if (options?.silenceNotFound && response.status == 404) return data
  const error = new HasuraError(data.errors, request)
  handleError(error)
}

type ErrorListener = (error: HasuraError) => void
type SuccessListener = () => void

const graphErrorListeners = new Set<ErrorListener>()

export function onGraphError(cb: ErrorListener) {
  graphErrorListeners.add(cb)
}

const graphSucessListeners = new Set<ErrorListener>()

export function requestListener(cb: SuccessListener) {
  graphSucessListeners.add(cb)
  return Math.random().toString(36).substr(2, 9)
}

const handleError = (error: HasuraError) => {
  if (!graphErrorListeners.size) throw error
  graphErrorListeners.forEach((cb) => cb(error))
}

export class HasuraError extends Error {
  errors: Error[] | null = null

  constructor(errors: any[] | null = null, request: RequestInit) {
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
      this.logErrors(request)
      this.name = 'HasuraError'
    }
  }

  logErrors(request: RequestInit) {
    const request_string = JSON.stringify(request, null, 2)
    if (process.env.NODE_ENV == 'test') return
    if (process.env.DISH_ENV != 'production') {
      console.error(
        `fetch('${endpoint}', ${request_string})
        .then(x => x.json())
        .then(x => console.log(x))`
      )
    }
  }
}
