import { createReactClient } from '@dish/gqless-react'

import { client } from './graphql/new-generated'

export const {
  graphql,
  useQuery,
  useMutation,
  useLazyQuery,
  usePolling,
  useTransactionQuery,
  useRefetch,
  prepareReactRender,
  useHydrateCache,
} = createReactClient(client, {
  defaultSuspense: true,
})
