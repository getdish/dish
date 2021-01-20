export const LOGIN_KEY = 'auth'
export const HAS_LOGGED_IN_BEFORE = 'HAS_LOGGED_IN_BEFORE'
// TODO put this away! in localstorage i think
const HASURA_SECRET =
  process.env.HASURA_SECRET || process.env.REACT_APP_HASURA_SECRET || 'password'

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
  if (isAdmin && !HASURA_SECRET) {
    throw new Error(`Didn't provide hasura secret`)
  }
  return {
    ...(isAdmin && {
      'X-Hasura-Admin-Secret': HASURA_SECRET,
    }),
    ...(auth && {
      Authorization: `Bearer ${auth.token}`,
    }),
  }
}
