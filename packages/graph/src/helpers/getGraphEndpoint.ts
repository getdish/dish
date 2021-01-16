import { isProd, isStaging } from '../constants'

export function getGraphEndpointDomain() {
  const local = 'http://localhost:8080'
  const live = 'https://hasura.dishapp.com'
  const staging = 'https://hasura-staging.dishapp.com'
  if (isProd || isStaging) {
    return staging
  }
  return process.env.HASURA_ENDPOINT || local
}

export function getGraphEndpoint() {
  return `${getGraphEndpointDomain()}/v1/graphql`
}
