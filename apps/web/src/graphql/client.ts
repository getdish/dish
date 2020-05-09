import DishAuth from '@dish/auth'
import { getGraphEndpoint } from '@dish/common-web'
import { Client, QueryFetcher } from 'gqless'

import { query_root, schema } from './generated'

const endpoint = getGraphEndpoint()

const fetchQuery: QueryFetcher = async (query, variables) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...DishAuth.getHeaders(),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    mode: 'cors',
  })

  if (!response.ok) {
    throw new Error(`Network error, received status code ${response.status}`)
  }

  const json = await response.json()

  return json
}

export const client = new Client<query_root>(schema.query_root, fetchQuery)

export const query = client.query
