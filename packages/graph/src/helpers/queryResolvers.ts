import { resolved } from 'gqless'

import { resetQueryCache } from '../graphql/client'
import { resetMutationCache } from '../graphql/mutation'
import { CollectOptions, collectAll } from './collect'

// just a helper that clears our cache after mutations for now
export async function resolvedMutation<T extends Function>(
  resolver: T
): Promise<
  T extends () => {
    returning: infer X
  }
    ? X
    : any
> {
  resetMutationCache()
  const next = await resolved(resolver)
  resetMutationCache()
  // @ts-ignore
  return next
}

export async function resolvedMutationWithFields<T extends Function>(
  resolver: T,
  options?: CollectOptions
): Promise<
  T extends () => {
    returning: infer X
  }
    ? X
    : any
> {
  return await resolvedMutation(() => {
    const res = resolver()
    return collectAll(res.returning, { ...options, type: 'mutation' })
  })
}

// WARNING TYPESCRIPT SLOW CLIFF
// if you infer the return it destroys performance... :(
export async function resolvedWithFields<T extends Function>(
  resolver: T,
  options?: CollectOptions
): Promise<any> {
  resetQueryCache()
  const next = await resolvedWithoutCache(() => {
    const res = resolver()
    return collectAll(res, options) as any
  })
  resetQueryCache()
  return next
}

export async function resolvedWithoutCache<T extends Function>(
  resolver: T
): Promise<T extends () => infer U ? U : any> {
  resetQueryCache()
  const next = await resolved(resolver)
  resetQueryCache()
  // @ts-ignore
  return next
}
