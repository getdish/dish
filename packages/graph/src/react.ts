import { createReactClient } from '@dish/gqless-react'

import { GeneratedSchema, client } from './graphql/generated'

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
