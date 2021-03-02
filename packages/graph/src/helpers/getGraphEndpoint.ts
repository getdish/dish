import { DISH_API_ENDPOINT, isProd, isStaging } from '../constants'

export function getGraphEndpointDomain() {
  const local = 'http://localhost:8080'
  const live = 'https://hasura.dishapp.com'
  const staging = 'https://hasura-staging.dishapp.com'
  if (isProd) return live
  if (isStaging) return staging
  return process.env.HASURA_ENDPOINT || local
}

export function getGraphEndpointInternal() {
  return `${getGraphEndpointDomain()}/v1/graphql`
}

export function getGraphEndpoint() {
  return `${DISH_API_ENDPOINT}/api/graph`
}
