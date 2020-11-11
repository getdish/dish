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
  fields: string[]
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
    return selectFields((res as any).returning as any, fields) as any
    // return collectAll(res.returning, { ...options, type: 'mutation' })
  })
}

// WARNING TYPESCRIPT SLOW CLIFF
// if you infer the return it destroys performance... :(
export async function resolvedWithFields<T extends () => unknown>(
  resolver: T,
  options?: CollectOptions
): Promise<any> {
  // resetQueryCache()
  const next = await resolvedWithoutCache(() => {
    const res = resolver()
    return selectFields(res as object, '*', 3)
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
