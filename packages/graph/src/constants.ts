export const constants = 0
export const isNode = typeof window == 'undefined'

export const isHasuraLive =
  !isNode && window.location?.hostname.includes('hasura_live')
export const isBrowserProd =
  !isNode && window.location?.hostname.includes('dish')

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

const isNative = typeof document === 'undefined'

export let SEARCH_DOMAIN: string

const LIVE_SEARCH_DOMAIN = 'https://search.dishapp.com'
const LOCAL_SEARCH_DOMAIN = 'http://localhost:10000'

if (isWorker || isNative) {
  SEARCH_DOMAIN = LIVE_SEARCH_DOMAIN
} else if (isNode) {
  SEARCH_DOMAIN = LOCAL_SEARCH_DOMAIN
} else {
  if (isBrowserProd || isHasuraLive) {
    SEARCH_DOMAIN = LIVE_SEARCH_DOMAIN
  } else {
    SEARCH_DOMAIN = LOCAL_SEARCH_DOMAIN
  }
}
