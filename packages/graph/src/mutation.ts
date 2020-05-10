import { getGraphEndpoint } from '@dish/common-web'
import { Client } from 'gqless'
import { createUseMutation } from 'gqless-hooks'

import { createFetcher } from './createFetcher'
import { schema, t_mutation_root } from './graphql/generated'

// / gqless-hooks

const fetchMutation = createFetcher('mutation')
const mutateClient = new Client(schema.mutation_root as any, fetchMutation)
export const mutation: t_mutation_root = mutateClient.query

const endpoint = getGraphEndpoint()

export const useMutation = createUseMutation<any>({
  endpoint,
  schema,
} as any)

// // @ts-ignore
// export const { useQuery, prepareQuery } = createUseQuery<query_root>({
//   endpoint,
//   schema,
// })
