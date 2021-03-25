import { createReactClient } from '@gqless/react'

import { client } from './graphql'
import { GeneratedSchema } from './graphql'

export const {
  graphql,
  useQuery,
  useMutation,
  useLazyQuery,
  useTransactionQuery,
  useRefetch,
  prepareReactRender,
  useHydrateCache,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    suspense: true,
    staleWhileRevalidate: false,
    retry: false,
  },
})
