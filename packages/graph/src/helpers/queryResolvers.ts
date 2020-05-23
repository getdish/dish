import { Cache, resolved } from 'gqless'

import { mutateClient, mutation } from '../graphql/mutation'
import { FlatResolvedModel, ModelType, Mutation } from '../types'
import { allFieldsForTable } from './allFieldsForTable'

const resetCache = () => {
  // @ts-ignore
  mutateClient.cache = new Cache(mutateClient.node)
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
  resolver: T,
  fields: string[] | null = null
): Promise<
  T extends () => infer U ? (U extends { returning: infer X } ? X : U) : any
> {
  const next = await resolvedMutation(() => {
    // @ts-ignore
    const res = resolver()
    console.log(
      'TODO i think we can get the fields off schema here',
      res,
      res['ofNode']
    )
    return res

    // if (typeof mutationFn === 'function') {
    //   const { returning } = mutationFn(arg)

    //   const finalFields = fields ?? allFieldsForTable(name.split('_')[1] as any)

    //   return resolveFields(returning, finalFields)
    // }
  })
  if (process.env.DEBUG) {
    console.log('mutation returned:', next)
  }
  return next
}

export async function resolvedWithFields(
  resolver: any,
  fields: string[] | null = null
): Promise<any> {
  const next = await resolved(() => {
    const res = resolver()
    console.log(
      'TODO i think we can get the fields off schema here',
      res,
      res['ofNode']
    )
    return res

    // if (typeof mutationFn === 'function') {
    //   const { returning } = mutationFn(arg)

    //   const finalFields = fields ?? allFieldsForTable(name.split('_')[1] as any)

    //   return resolveFields(returning, finalFields)
    // }
  })
  if (process.env.DEBUG) {
    console.log('mutation returned:', next)
  }
  return next
}

export function resolveFields<A extends any[]>(result: A, fields: string[]): A {
  if (result.length === 1) {
    touchAllFieldsOnRecord<A>(result[0], fields)
  }
  return result
}

export function touchAllFieldsOnRecord<A>(record: A, fields: string[]): A {
  // @ts-ignore
  let one: A = {}
  for (const key of fields) {
    if (typeof record[key] == 'function') {
      if (key == 'tags') {
        one[key] = record[key]().map((x) => ({
          name: x.name,
        }))
      } else {
        one[key] = record[key]()
      }
    } else {
      one[key] = record[key]
    }
  }
  return one
}
