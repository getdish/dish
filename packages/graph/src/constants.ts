function getWindow() {
  return typeof window !== 'undefined' ? window : null
}

export const isNode = process.env.TARGET !== 'web' || !getWindow() || false

const hostname = getWindow()?.location?.hostname ?? ''

export const isProd =
  process.env.IS_LIVE === '1' || hostname === 'dishapp' || hostname.includes('live') || false

export const isStaging =
  process.env.NODE_ENV === 'staging' || getWindow()?.location?.hostname.includes('staging') || false

export const isDev = (!isProd && !isStaging) || false
export const isNative = process.env.TARGET === 'native'

export const JWT_SECRET = process.env.JWT_SECRET || '12345678901234567890123456789012'

export const HASURA_SECRET =
  process.env.HASURA_GRAPHQL_ADMIN_SECRET || (process.env.TARGET === 'node' ? 'password' : '')

const PROD_ORIGIN = 'https://dishapp.com'
const ORIGIN = isProd
  ? PROD_ORIGIN
  : isStaging
  ? PROD_ORIGIN
  : getWindow()?.location?.origin ?? 'http://localhost:4444'

const ORIGIN_MINUS_PORT = ORIGIN.replace(/:[0-9]+/, '')

export const DISH_API_ENDPOINT = process.env.DISH_API_ENDPOINT ?? ORIGIN

export const SEARCH_DOMAIN = `${ORIGIN}/api/search`
export const SEARCH_DOMAIN_INTERNAL = (() => {
  const staging = 'https://search-staging.dishapp.com'
  const live = 'https://search.dishapp.com'
  const local = process.env.SEARCH_ENDPOINT ?? `${ORIGIN_MINUS_PORT}:10000`
  if (isProd) return live
  if (isStaging) return staging
  return local
})()

export const ZeroUUID = '00000000-0000-0000-0000-000000000000'
export const OneUUID = '00000000-0000-0000-0000-000000000001'
export const globalTagId = ZeroUUID
export const externalUserUUID = OneUUID

// Note that there is no unit or reference point for these values. All that
// matters is simply the relative differences between them. For example therefore
// there is no need to ensure that the maximum value is 1.0 or 100%.
export const RESTAURANT_WEIGHTS = {
  yelp: 0.6,
  tripadvisor: 0.6,
  michelin: 1.0,
  infatuated: 0.9,
  ubereats: 0.2,
  doordash: 0.2,
  grubhub: 0.2,
  google: 0.4,
}

export const MARTIN_TILES_HOST = (() => {
  const prod = 'https://martin-tiles.dishapp.com'
  const staging = 'https://martin-tiles-staging.dishapp.com'
  const dev = `${ORIGIN_MINUS_PORT}:3005`
  if (isProd) return prod
  if (isStaging) return staging
  return dev
})()

export const GRAPH_DOMAIN = process.env.HASURA_ENDPOINT || 'http://localhost:8080'
export const GRAPH_API_INTERNAL = `${GRAPH_DOMAIN}/v1/graphql`
export const GRAPH_API = `${DISH_API_ENDPOINT}/api/graph`
