import { Cache, Query, resolved } from 'gqless'
import _ from 'lodash'

import { schema } from '../graphql'
import { client } from '../graphql/client'
import { mutateClient } from '../graphql/mutation'
import { ModelName } from '../types'
import { collectAll } from './collect'
import { getReadableFields, getReturnableFields } from './queryHelpers'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

const resetMutationCache = () => {
  // @ts-ignore
  mutateClient.cache = new Cache(mutateClient.node)
}

const randomQueryName = () => {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var charactersLength = characters.length
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const resetQueryCache = async () => {
  client.accessor.children.forEach((c) => {
    c.scheduler.commit.stage(c, new Query(randomQueryName()))
  })
  await sleep(250)
}

// just a helper that clears our cache after mutations for now
export async function resolvedMutation<T>(
  resolver: T
): Promise<
  T extends () => infer U ? (U extends { returning: infer X } ? X : U) : any
> {
  resetMutationCache()
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
  await resetQueryCache()
  const next = await resolved(() => {
    const res = resolver()
    const returningFields = fields ?? getReadableFields(table)
    return collectAll(res, returningFields)
  })
  return next
}
