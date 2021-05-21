import { selectFields } from 'gqless'
import { merge } from 'lodash'

import { client, resolved } from '../graphql'

export type SelectionOptions = {
  select?: (v: any) => unknown
  keys?: '*' | string[]
  depth?: number
  query?: any
}

const DISABLE_CACHE = true

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
    noCache: DISABLE_CACHE,
    refetch: DISABLE_CACHE,
  })
  //@ts-expect-error
  return next
}

export async function resolvedMutationWithFields<T>(
  resolver: () => T,
  { keys, select, depth }: SelectionOptions = {}
): Promise<T> {
  if (DISABLE_CACHE) {
    client.cache = {}
  }
  // @ts-expect-error
  return await resolvedMutation(() => {
    const res = resolver()
    const returning = (res as any).returning
    const obj = selectFields(returning, keys, depth)
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
  { keys, select, depth }: SelectionOptions = {}
): Promise<any> {
  const next = await resolved(
    () => {
      const res = resolver()
      if (!res) return res
      const obj = selectFields(res as object, keys ?? '*', depth ?? 2)
      if (select) {
        merge(obj, select(res))
      }
      return obj
    },
    {
      noCache: DISABLE_CACHE,
      refetch: DISABLE_CACHE,
    }
  )
  return next
}
