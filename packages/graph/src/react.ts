import { createReactClient } from '@gqty/react'

import { client } from './graphql'
import { GeneratedSchema } from './graphql'

export const {
  graphql,
  useQuery,
  useMutation,
  useLazyQuery,
  prepareQuery,
  useMetaState,
  useSubscription,
  useTransactionQuery,
  useRefetch,
  prepareReactRender,
  useHydrateCache,
  usePaginatedQuery,
  state,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    suspense: true,
    staleWhileRevalidate: false,
    retry: false,
  },
})
