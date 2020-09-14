import {
  isBrowserProd,
  isHasuraLive,
  isNative,
  isNode,
  isWorker,
} from '../constants'

export function getGraphEndpointDomain() {
  const LOCAL_HASURA = 'http://localhost:8080'
  const LIVE_HASURA = 'https://hasura.dishapp.com'

  if (isWorker || isNative) {
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
      if (isHasuraLive) {
        domain = LIVE_HASURA
      } else {
        domain = process.env.REACT_APP_HASURA_ENDPOINT || LOCAL_HASURA
      }
    }
  }

  return domain
}

export function getGraphEndpoint() {
  return `${getGraphEndpointDomain()}/v1/graphql`
}
