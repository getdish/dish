import { merge } from 'lodash'

// import { resolved } from '@o/gqless'
import { resolved, selectFields } from '../graphql/new-generated'
// import { resetQueryCache } from '../graphql/client'
// import { resetMutationCache } from '../graphql/mutation'
import { CollectOptions } from './collect'

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
    // refetch: true, noCache: false | undefined => cache-and-network
    // refetch: false, noCache: false => cache-first
    // noCache: true => no-cache
    noCache: true, // it will modify global cache
  })
  // @ts-ignore
  return next
}

export async function resolvedMutationWithFields<T extends () => unknown>(
  resolver: T,
  fields: (string | number)[] | '*',
  fn?: (v: any) => unknown
): Promise<
  T extends () => {
    returning: infer X
  }
    ? X
    : any
> {
  //@ts-expect-error
  return await resolvedMutation(() => {
    const res = resolver()

    const returning = (res as any).returning
    const obj = selectFields(returning, fields as any) as any

    if (fn) {
      merge(obj, fn(returning))
    }
    return obj
    // return collectAll(res.returning, { ...options, type: 'mutation' })
  })
}

// WARNING TYPESCRIPT SLOW CLIFF
// if you infer the return it destroys performance... :(
export async function resolvedWithFields<T extends () => unknown>(
  resolver: T,
  fn?: (v: any) => unknown
): Promise<any> {
  // resetQueryCache()
  const next = await resolvedWithoutCache(() => {
    const res = resolver()
    const obj = selectFields(res as object, '*', 3)
    if (fn) {
      merge(obj, fn(res))
    }
    return obj
    // return collectAll(res, options) as any
  })
  // resetQueryCache()
  return next
}

export async function resolvedWithoutCache<T extends () => unknown>(
  resolver: T
): Promise<T extends () => infer U ? U : any> {
  // resetQueryCache()
  const next = await resolved(resolver, {
    noCache: true,
  })
  // resetQueryCache()
  // @ts-ignore
  return next
}
