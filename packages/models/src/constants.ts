import { isBrowserProd } from './ModelBase'

export let SEARCH_DOMAIN: string
const isNode = typeof window == 'undefined'
const isWorker = !isNode && !!window['isWorker']

const LIVE_SEARCH_DOMAIN = 'https://search.rio.dishapp.com'
const LOCAL_SEARCH_DOMAIN = 'http://localhost:10000'

if (isWorker) {
  SEARCH_DOMAIN = LIVE_SEARCH_DOMAIN
} else if (isNode) {
  SEARCH_DOMAIN = LOCAL_SEARCH_DOMAIN
} else {
  if (isBrowserProd || window.location.hostname.includes('hasura_live')) {
    SEARCH_DOMAIN = LIVE_SEARCH_DOMAIN
  } else {
    SEARCH_DOMAIN = LOCAL_SEARCH_DOMAIN
  }
}
