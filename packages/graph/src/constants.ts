export const constants = 0
export const isNode = typeof window == 'undefined'

export const isHasuraLive =
  !isNode && window.location?.hostname.includes('hasura_live')
export const isDevProd =
  process.env.TARGET === 'native' ||
  (!isNode && window.location?.hostname.includes('dish'))

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

const LOCAL_HOSTNAME =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost'

export let SEARCH_DOMAIN = (() => {
  const LIVE_SEARCH_DOMAIN = 'https://search.dishapp.com'
  const LOCAL_SEARCH_DOMAIN = `http://${LOCAL_HOSTNAME}:10000`
  if (isWorker || isNative) {
    return LIVE_SEARCH_DOMAIN
  } else if (isNode) {
    return LOCAL_SEARCH_DOMAIN
  } else {
    if (isDevProd || isHasuraLive) {
      return LIVE_SEARCH_DOMAIN
    } else {
      return LOCAL_SEARCH_DOMAIN
    }
  }
})()

export const AUTH_DOMAIN = (() => {
  const LOCAL_AUTH_SERVER = `http://${LOCAL_HOSTNAME}:3000`
  const PROD_JWT_SERVER = 'https://auth.dishapp.com'
  if (isNode) {
    return process.env.AUTH_ENDPOINT || LOCAL_AUTH_SERVER
  } else {
    if (isDevProd) {
      return PROD_JWT_SERVER
    } else {
      if (isHasuraLive) {
        return PROD_JWT_SERVER
      } else {
        return process.env.REACT_APP_AUTH_ENDPOINT || LOCAL_AUTH_SERVER
      }
    }
  }
})()

export const AUTH_IMAGE_UPLOAD_ENDPOINT = `${AUTH_DOMAIN}/user/image_upload`
