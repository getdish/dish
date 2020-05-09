import { graphql } from 'overmind-graphql'

import * as mutations from './mutations'

// import * as subscriptions from './subscriptions'

export const gql = graphql({
  // @ts-ignore
  mutations,
  // subscriptions,
})
