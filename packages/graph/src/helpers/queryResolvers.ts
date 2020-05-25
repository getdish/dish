import { ACCESSOR, Cache, resolved } from 'gqless'

import { schema } from '../graphql'
import { client } from '../graphql/client'
import { mutateClient } from '../graphql/mutation'
import { ModelName } from '../types'
import { collectAll } from './collect'
import { getReadableFields, getReturnableFields } from './queryHelpers'

const resetCache = () => {
  // @ts-ignore
  mutateClient.cache = new Cache(mutateClient.node)

  // TODO doesn't seem to work
  // @ts-ignore
  client.cache = new Cache(client.node)
}

// just a helper that clears our cache after mutations for now
export async function resolvedMutation<T>(
  resolver: T
): Promise<
  T extends () => infer U ? (U extends { returning: infer X } ? X : U) : any
> {
  resetCache()
  // @ts-ignore
  return await resolved(resolver)
}

export async function resolvedMutationWithFields<T>(
  table: ModelName,
  resolver: T,
  fields: string[] | null = null
): Promise<
  T extends () => infer U ? (U extends { returning: infer X } ? X : U) : any
> {
  const next = await resolvedMutation(() => {
    // @ts-ignore
    const res = resolver()
    const returningFields = fields ?? getReturnableFields(table)
    return collectAll(res.returning, returningFields)
  })
  // @ts-ignore
  return next
}

export async function resolvedWithFields(
  table: ModelName,
  resolver: any,
  fields: string[] | null = null
): Promise<any> {
  resetCache()
  const next = await resolved(() => {
    const res = resolver()
    const returningFields = fields ?? getReadableFields(table)
    return collectAll(res, returningFields)
  })
  return next
}
