import DishAuth from '@dish/auth'
import { getGraphEndpoint } from '@dish/common-web'
import { QueryFetcher } from 'gqless'

const endpoint = getGraphEndpoint()

export const createFetcher = (type: 'query' | 'mutation') => {
  const fetcher: QueryFetcher = async (query, variables) => {
    const request: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...DishAuth.getHeaders(),
      },
      body: JSON.stringify({
        query: type !== 'query' ? type + query : query,
        variables,
      }),
      mode: 'cors',
    }
    if (process.env.DISH_ENV != 'test') {
      console.log('request', request)
    }
    const response = await fetch(endpoint, request)
    if (!response.ok) {
      throw new Error(`Network error, received status code ${response.status}`)
    }
    return await response.json()
  }
  return fetcher
}
