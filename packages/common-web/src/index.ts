export const isNode = typeof window == 'undefined'
export const isBrowserProd =
  !isNode && window.location.hostname.includes('dish')

const rootEl = document.getElementById('root')
const isWorker = !rootEl

export function getGraphEndpoint() {
  const LOCAL_HASURA = 'http://localhost:8080'
  const LIVE_HASURA = 'https://hasura.rio.dishapp.com'

  if (isWorker) {
    return LIVE_HASURA
  }

  let domain: string

  if (isNode) {
    domain =
      process.env.HASURA_ENDPOINT ||
      process.env.REACT_APP_HASURA_ENDPOINT ||
      LOCAL_HASURA
  } else {
    if (isBrowserProd) {
      domain = LIVE_HASURA
    } else {
      if (window.location.hostname.includes('hasura_live')) {
        domain = LIVE_HASURA
      } else {
        domain = process.env.REACT_APP_HASURA_ENDPOINT || LOCAL_HASURA
      }
    }
  }

  return domain
}
