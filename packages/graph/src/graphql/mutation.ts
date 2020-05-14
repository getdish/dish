import { getGraphEndpoint } from '@dish/common-web'
import { Client } from 'gqless'

import { createFetcher } from '../createFetcher'
import { mutation_root, schema, t_mutation_root } from './generated'

// import { createUseMutation } from 'gqless-hooks'

// / gqless-hooks

const fetchMutation = createFetcher('mutation')
const mutateClient = new Client(schema.mutation_root as any, fetchMutation)
export const mutation: mutation_root = mutateClient.query

// const endpoint = getGraphEndpoint()
// export const useMutation = createUseMutation<any>({
//   endpoint,
//   schema,
// } as any)
// // @ts-ignore
// export const { useQuery, prepareQuery } = createUseQuery<query_root>({
//   endpoint,
//   schema,
// })
