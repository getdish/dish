import { selectFields } from '@dish/gqless'
import { merge } from 'lodash'

import { Mutation, Query, mutate, resolved } from '../graphql'

export type MutationOpts = {
  select?: (v: any) => unknown
  keys?: '*' | string[]
  query?: any
}

// just a helper that clears our cache after mutations for now
export const resolvedMutation = mutate

export async function resolvedMutationWithFields<T>(
  resolver: (
    mutation: Mutation,
    opts: { setCache: Function; query: Query; assignSelections: Function }
  ) => T,
  { keys, select }: MutationOpts = {}
): Promise<T> {
  return await resolvedMutation((mutation, opts) => {
    const res = resolver(mutation, opts)
    const returning = (res as any).returning
    const obj = selectFields(returning, keys as any) as any
    if (select) {
      merge(obj, select(returning))
    }
    return obj
  })
}

// WARNING TYPESCRIPT SLOW CLIFF
// if you infer the return it destroys performance... :(
export async function resolvedWithFields<T extends () => unknown>(
  resolver: T,
  fn?: (v: any) => unknown
): Promise<any> {
  const next = await resolvedWithoutCache(() => {
    const res = resolver()
    const obj = selectFields(res as object, '*', 2)
    if (fn) {
      merge(obj, fn(res))
    }
    return obj
  })
  return next
}

export async function resolvedWithoutCache<T>(resolver: () => T): Promise<T> {
  const next = await resolved(resolver, {
    noCache: true,
  })
  return next
}
