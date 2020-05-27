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
  // @ts-ignore
  return await resolved(resolver)
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
  // @ts-ignore
  return await resolvedMutation(() => {
    const res = resolver()
    return collectAll(res.returning, { ...options, type: 'mutation' }) as any
  })
}

// WARNING TYPESCRIPT SLOW CLIFF
// if you infer the return it destroys performance... :(
export async function resolvedWithFields<T extends Function>(
  resolver: T,
  options?: CollectOptions
): Promise<any> {
  resetQueryCache()
  return await resolvedWithoutCache(() => {
    const res = resolver()
    return collectAll(res, options) as any
  })
}

export async function resolvedWithoutCache<T extends Function>(
  resolver: T
): Promise<T extends () => infer U ? U : any> {
  resetQueryCache()
  // @ts-ignore
  return await resolved(resolver)
}
