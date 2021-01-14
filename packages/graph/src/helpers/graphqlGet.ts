import { Auth } from '../Auth'
import { getAuthHeaders } from '../getAuth'
import { getGraphEndpoint } from './getGraphEndpoint'

export async function graphqlGet(query: string = '', variables: Object = {}) {
  const res = await fetch(getGraphEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    mode: 'cors',
  })
  return await res.json()
}
