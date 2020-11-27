import { createReactClient } from '@dish/gqless-react'

import { client } from './graphql/new-generated'

const {
  graphql,
  useQuery,
  useMutation,
  useLazyQuery,
  usePolling,
  useTransactionQuery,
} = createReactClient(client, {
  defaultSuspense: true,
})

export {
  graphql,
  useQuery,
  useMutation,
  useLazyQuery,
  usePolling,
  useTransactionQuery,
}
