import { QueryResponse } from 'gqless'

import { isBrowserProd } from './constants'
import { Auth } from './helpers/auth-helpers'
import { getGraphEndpoint } from './helpers/getGraphEndpoint'

type QueryFetcherWithOptions = (
  query: string,
  variables?: Record<string, any>,
  options?: {
    silenceNotFound?: boolean
  }
) => Promise<QueryResponse>

const endpoint = getGraphEndpoint()

export const createFetcher = (
  type: 'query' | 'mutation'
): QueryFetcherWithOptions => {
  return async (query, variables, options) => {
    const body = JSON.stringify({
      query: type !== 'query' ? type + query : query,
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
    const response = await fetch(endpoint, request)
    const data = await response.json()
    if (process.env.DEBUG) {
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
    if (data.errors || !response.ok) {
      if (options?.silenceNotFound && response.status == 404) {
        return data
      } else {
        if (graphErrorListeners.size) {
          graphErrorListeners.forEach((cb) => cb(data.errors))
        }
        throw new HasuraError(query, data.errors)
      }
    }
    return data
  }
}

type ErrorListener = (errors: { message: string }[]) => void

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
    if (isBrowserProd) {
      this.name = 'Dish API Error'
    } else {
      console.error('fetch errors', errors, 'for query', query)
      this.name = 'HasuraError'
    }
  }
}
