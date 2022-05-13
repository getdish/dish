function getWindow() {
  return typeof window !== 'undefined' ? window : null
}

const hostname = getWindow()?.location?.hostname ?? ''
const search = getWindow()?.location?.search ?? ''

export const isManualDebugMode = search.startsWith('?debug')

// why not NODE_ENV?
// Because its nice to be able to test production endpoints in dev mode
// ... hmm may want to default to this in production, but have a flag to force
export const isProd =
  process.env.IS_LIVE === '1' ||
  hostname === 'dishapp.com' ||
  hostname.includes('live') ||
  false

export const isNode = process.env.TARGET !== 'web' || !getWindow() || false
export const isStaging =
  process.env.NODE_ENV === 'staging' || hostname.includes('staging') || false
export const isDev = (!isProd && !isStaging) || false
export const isNative = process.env.TARGET === 'native'

export const LOCAL_HOST = process.env.LOCAL_HOST ?? (hostname || `localhost`)

// TODO split this ORIGIN into internal/external so we can use it more clearly everywhere
// so external: dishapp.com, internal app:4444

// const PROD_ORIGIN = 'https://dishapp.com'
const ORIGIN = isProd
  ? 'https://dishapp.com'
  : LOCAL_HOST !== 'localhost'
  ? `http://${LOCAL_HOST}`
  : process.env.TARGET === 'web'
  ? window.location.origin
  : process.env.APP_ENDPOINT ?? 'app:4444'

// console.log('process.env.TARGET', process.env.TARGET, ORIGIN)

// isProd
//   ? PROD_ORIGIN
//   : isStaging
//   ? PROD_ORIGIN
//   : LOCAL_HOST === 'localhost'
//   ? `http://${LOCAL_HOST}:4444`
//   : `http://${LOCAL_HOST}`

const ORIGIN_MINUS_PORT = ORIGIN.replace(/:[0-9]+/, '')
export const DISH_API_ENDPOINT = `${ORIGIN}/api`

export const SEARCH_DOMAIN = `${DISH_API_ENDPOINT}/search`

export const ZeroUUID = '00000000-0000-0000-0000-000000000000'
export const OneUUID = '00000000-0000-0000-0000-000000000001'
export const globalTagId = ZeroUUID
export const externalUserUUID = OneUUID

export const TILES_HOST = `${DISH_API_ENDPOINT}/tile`
export const TILES_HOST_INTERNAL =
  process.env.TILES_HOST_INTERNAL ?? process.env.TILES_HOST ?? `tileserver:3000`

export const GRAPH_DOMAIN =
  process.env.HASURA_ENDPOINT ||
  `http://${ORIGIN_MINUS_PORT}:${process.env.HASURA_PORT || 8080}`
export const GRAPH_API_INTERNAL = `${GRAPH_DOMAIN}/v1/graphql`
export const GRAPH_API = `${DISH_API_ENDPOINT}/graph`

export const SUMMARIZER_API = `${process.env.SUMMARIZER_ENDPOINT}/summarize_by_ratio`
// export const SUMMARIZER_API = `${process.env.SUMMARIZER_ENDPOINT}/summarize_by_sentence`

export const DISH_DEBUG = +(process.env.DISH_DEBUG || '0')

if (DISH_DEBUG >= 2) {
  console.log('@dish/graph constants', {
    SUMMARIZER_API,
    HASURA_ENDPOINT: process.env.HASURA_ENDPOINT,
    APP_ENDPOINT: process.env.APP_ENDPOINT,
    DISH_API_ENDPOINT,
    LOCAL_HOST,
    TILES_HOST,
    GRAPH_API,
    GRAPH_API_INTERNAL,
    SEARCH_DOMAIN,
    isNode,
    isProd,
    isNative,
  })
}
