import { createReactClient } from '@dish/gqless-react'

import { GeneratedSchema, client } from './graphql/new-generated'

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
} = createReactClient<GeneratedSchema>(client, {
  defaultSuspense: true,
})
