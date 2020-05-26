import { Query, resolved } from 'gqless'

import { client, resetQueryCache } from '../graphql/client'
import { resetMutationCache } from '../graphql/mutation'
import { ModelName } from '../types'
import { CollectOptions, collectAll } from './collect'
import { getReadableFieldsFor, getReadableMutationFields } from './queryHelpers'

// just a helper that clears our cache after mutations for now
export async function resolvedMutation<T extends Function>(
  resolver: T
): Promise<
  T extends () => infer U ? (U extends { returning: infer X } ? X : U) : any
> {
  resetMutationCache()
  // @ts-ignore
  return await resolved(resolver)
}

export async function resolvedMutationWithFields<T extends Function>(
  table: ModelName,
  resolver: T,
  options?: CollectOptions
): Promise<
  T extends () => infer U ? (U extends { returning: infer X } ? X : U) : any
> {
  const next = await resolvedMutation(() => {
    const res = resolver()
    return collectAll(res.returning, {
      ...options,
      fields: getReadableMutationFields(table),
    })
  })
  // @ts-ignore
  return next
}

export async function resolvedWithFields(
  table: ModelName,
  resolver: any,
  options?: CollectOptions
): Promise<any> {
  await resetQueryCache()
  const next = await resolvedQueryNoCache(() => {
    const res = resolver()
    return collectAll(res, options)
  })
  return next
}

export async function resolvedQueryNoCache<T extends Function>(
  resolver: T
): Promise<
  T extends () => infer U ? (U extends { returning: infer X } ? X : U) : any
> {
  resetQueryCache()
  // @ts-ignore
  return await resolved(resolver)
}
