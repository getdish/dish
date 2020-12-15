import {
  isDevProd,
  isHasuraLive,
  isNative,
  isNode,
  isStaging,
  isWorker,
} from '../constants'

export function getGraphEndpointDomain() {
  const LOCAL_HASURA = 'http://localhost:8080'
  const LIVE_HASURA = 'https://hasura.dishapp.com'
  const STAGING_HASURA = 'https://hasura-staging.dishapp.com'

  // TODO can we simplify this
  if (isWorker || isNative || isHasuraLive || isDevProd || isStaging) {
    return STAGING_HASURA
  }

  if (isNode) {
    return (
      process.env.HASURA_ENDPOINT ||
      process.env.REACT_APP_HASURA_ENDPOINT ||
      LOCAL_HASURA
    )
  }

  return process.env.REACT_APP_HASURA_ENDPOINT || LOCAL_HASURA
}

export function getGraphEndpoint() {
  return `${getGraphEndpointDomain()}/v1/graphql`
}
