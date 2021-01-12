export const constants = 0
export const isNode = typeof window == 'undefined'

export const isLive = process.env.IS_LIVE === '1'

export const isHasuraLive =
  (!isNode && window.location?.hostname.includes('live')) || isLive
export const isDevProd =
  process.env.TARGET === 'native' ||
  (!isNode && window.location?.hostname.includes('dish'))
export const isStaging =
  process.env.NODE_ENV === 'staging' ||
  (!isNode && window.location?.hostname.includes('staging'))

export const isDev = !isHasuraLive && !isDevProd && !isStaging

export const isNative = process.env.TARGET === 'native'
export const isWorker =
  typeof document !== 'undefined' && !document.getElementById('root')

export const ZeroUUID = '00000000-0000-0000-0000-000000000000'
export const globalTagId = ZeroUUID
export const externalUserUUID = '00000000-0000-0000-0000-000000000001'

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

const IS_LIVE =
  typeof window !== 'undefined' && window.location?.origin.includes('live')
const STAGING_ORIGIN = 'https://staging.dishapp.com'
//const PROD_ORIGIN = 'https://dishapp.com'
const PROD_ORIGIN = STAGING_ORIGIN
const LOCAL_ORIGIN =
  typeof window !== 'undefined'
    ? IS_LIVE
      ? PROD_ORIGIN
      : window.location?.origin ?? 'http://localhost'
    : 'http://localhost'

export const ORIGIN = (() => {
  if (isNode) {
    return LOCAL_ORIGIN
  }
  if (isDevProd) {
    return PROD_ORIGIN
  }
  if (isHasuraLive) {
    return PROD_ORIGIN
  }
  if (isStaging) {
    return STAGING_ORIGIN
  }
  return LOCAL_ORIGIN
})()

export let SEARCH_DOMAIN = (() => {
  const STAGING_SEARCH_DOMAIN = 'https://search-staging.dishapp.com'
  //const LIVE_SEARCH_DOMAIN = 'https://search.dishapp.com'
  const LIVE_SEARCH_DOMAIN = STAGING_SEARCH_DOMAIN
  const LOCAL_SEARCH_DOMAIN = `${LOCAL_ORIGIN}:10000`
  if (isWorker || isNative || IS_LIVE) {
    return LIVE_SEARCH_DOMAIN
  }
  if (isNode) {
    return LOCAL_SEARCH_DOMAIN
  }
  if (isStaging) {
    return STAGING_SEARCH_DOMAIN
  }
  if (isDevProd || isHasuraLive) {
    return LIVE_SEARCH_DOMAIN
  }
  return LOCAL_SEARCH_DOMAIN
})()

export const AUTH_DOMAIN = (() => {
  const AUTH_STAGING = 'https://user-server-staging.dishapp.com'
  //const AUTH_PROD = PROD_ORIGIN
  const AUTH_PROD = AUTH_STAGING
  const LOCAL_AUTH_SERVER = `${
    LOCAL_ORIGIN === AUTH_PROD ? AUTH_PROD : LOCAL_ORIGIN + ':3000'
  }`
  if (isNode) {
    return process.env.AUTH_ENDPOINT || LOCAL_AUTH_SERVER
  }
  if (isStaging) {
    return AUTH_STAGING
  }
  if (isDevProd) {
    return AUTH_PROD
  }
  if (isHasuraLive) {
    return AUTH_PROD
  }
  return LOCAL_AUTH_SERVER
})()
