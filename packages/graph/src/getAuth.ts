import { HASURA_SECRET } from './constants'

export const LOGIN_KEY = 'auth'
export const HAS_LOGGED_IN_BEFORE = 'HAS_LOGGED_IN_BEFORE'

export function getAuth(): null | {
  user: Object
  token: string
  admin?: boolean
} {
  const json = localStorage.getItem(LOGIN_KEY)
  if (json != null) {
    return JSON.parse(json)
  }
  return null
}

export function getAuthHeaders(isAdmin?: boolean) {
  const auth = getAuth()
  return {
    ...(isAdmin && {
      'X-Hasura-Admin-Secret': HASURA_SECRET,
    }),
    ...(auth && {
      Authorization: `Bearer ${auth.token}`,
    }),
  }
}
