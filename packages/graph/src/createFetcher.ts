import DishAuth from '@dish/auth'
import { getGraphEndpoint } from '@dish/common-web'
import { QueryFetcher } from 'gqless'

const endpoint = getGraphEndpoint()

export const createFetcher = (type: 'query' | 'mutation') => {
  const fetcher: QueryFetcher = async (query, variables) => {
    const response = await fetch(endpoint, {
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
    })
    if (!response.ok) {
      throw new Error(`Network error, received status code ${response.status}`)
    }
    return await response.json()
  }
  return fetcher
}
