import { graphql } from 'overmind-graphql'
import * as queries from './queries'
import * as mutations from './mutations'
import * as subscriptions from './subscriptions'

export const gql = graphql({
  queries,
  // mutations,
  // subscriptions,
})
