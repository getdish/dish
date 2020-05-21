import { QueryResponse } from 'gqless'

import { isBrowserProd } from './constants'
import { Auth, getGraphEndpoint } from './helpers'

type QueryFetcherWithOptions = (
  query: string,
  variables?: Record<string, any>,
  options?: {
    silenceNotFound?: boolean
  }
) => Promise<QueryResponse> | QueryResponse

const endpoint = getGraphEndpoint()

export const createFetcher = (type: 'query' | 'mutation') => {
  const fetcher: QueryFetcherWithOptions = async (
    query,
    variables,
    options
  ) => {
    const request: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...Auth.getHeaders(),
      },
      body: JSON.stringify({
        query: type !== 'query' ? type + query : query,
        variables,
      }),
      mode: 'cors',
    }
    const response = await fetch(endpoint, request)
    const data = await response.json()
    if (data.errors || !response.ok) {
      if (options?.silenceNotFound && response.status == 404) {
        return data
      } else {
        throw new HasuraError(query, data.errors)
      }
    }
    return data
  }
  return fetcher
}

class HasuraError extends Error {
  errors: {}
  constructor(query: string, errors: {} = {}) {
    super()
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HasuraError)
    }
    this.errors = errors
    this.message =
      errors[0]?.extensions?.internal?.error?.message || errors[0]?.message
    if (isBrowserProd) {
      this.name = 'Dish API Error'
    } else {
      console.error(errors)
      console.debug('For query: ', query)
      this.name = 'HasuraError'
    }
  }
}
