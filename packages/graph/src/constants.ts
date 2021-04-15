function getWindow() {
  return typeof window !== 'undefined' ? window : null
}

const hostname = getWindow()?.location?.hostname ?? ''

// why not NODE_ENV?
// Because its nice to be able to test production endpoints in dev mode
export const isProd =
  process.env.IS_LIVE === '1' || hostname === 'dishapp' || hostname.includes('live') || false

export const isNode = process.env.TARGET !== 'web' || !getWindow() || false
export const isStaging =
  process.env.NODE_ENV === 'staging' || getWindow()?.location?.hostname.includes('staging') || false
export const isDev = (!isProd && !isStaging) || false
export const isNative = process.env.TARGET === 'native'

export const JWT_SECRET = process.env.JWT_SECRET || '12345678901234567890123456789012'
export const HASURA_SECRET =
  process.env.HASURA_GRAPHQL_ADMIN_SECRET || (process.env.TARGET === 'node' ? 'password' : '')
const LOCAL_HOST = process.env.LOCAL_HOST ?? getWindow()?.location?.hostname ?? `localhost`
const PROD_ORIGIN = 'https://dishapp.com'
const ORIGIN = isProd ? PROD_ORIGIN : isStaging ? PROD_ORIGIN : `http://${LOCAL_HOST}:4444`
const ORIGIN_MINUS_PORT = ORIGIN.replace(/:[0-9]+/, '')
export const DISH_API_ENDPOINT = `${ORIGIN}/api`
export const SEARCH_DOMAIN = `${DISH_API_ENDPOINT}/search`
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

export const TILES_HOST = `${DISH_API_ENDPOINT}/tile`
export const TILES_HOST_INTERNAL = (() => {
  const prod = 'https://martin-tiles.dishapp.com'
  const staging = 'https://martin-tiles-staging.dishapp.com'
  const dev = `${ORIGIN_MINUS_PORT}:3005`
  if (isProd) return prod
  if (isStaging) return staging
  return dev
})()

export const GRAPH_DOMAIN = process.env.HASURA_ENDPOINT || `http://${ORIGIN_MINUS_PORT}:8080`
export const GRAPH_API_INTERNAL = `${GRAPH_DOMAIN}/v1/graphql`
export const GRAPH_API = `${DISH_API_ENDPOINT}/graph`

console.log('graph.const', {
  DISH_API_ENDPOINT,
  LOCAL_HOST,
  TILES_HOST,
  GRAPH_API,
  SEARCH_DOMAIN,
  isNode,
  isProd,
  isNative,
})
