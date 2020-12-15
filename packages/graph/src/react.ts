import { createReactClient } from '@dish/gqless-react'

import { client } from './graphql'
import { GeneratedSchema } from './graphql'

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
