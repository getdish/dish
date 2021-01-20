import { selectFields } from '@dish/gqless'
import { merge } from 'lodash'

import { Mutation, Query, mutate, resolved } from '../graphql'

export type MutationOpts = {
  select?: (v: any) => unknown
  keys?: '*' | string[]
  query?: any
}

// just a helper that clears our cache after mutations for now
export async function resolvedMutation<T extends () => unknown>(
  resolver: T
): Promise<
  T extends () => {
    returning: infer X
  }
    ? X
    : any
> {
  const next = await resolved(resolver, {
    noCache: true,
  })
  //@ts-expect-error
  return next
}

export async function resolvedMutationWithFields<T>(
  resolver: () => T,
  // (
  //   mutation: Mutation,
  //   opts: { setCache: Function; query: Query; assignSelections: Function }
  // ) => T,
  { keys, select }: MutationOpts = {}
): Promise<T> {
  // @ts-expect-error
  return await resolvedMutation(() => {
    const res = resolver()
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
