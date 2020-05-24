import { ACCESSOR, Cache, ScalarNode, resolved } from 'gqless'

import { mutateClient } from '../graphql/mutation'

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

const touchAllFields = <A extends any>(object: A[], fields: string[]): A[] => {
  return object.map((x) => {
    return fields.reduce((acc, cur) => {
      const val = x[cur]
      if (typeof val !== 'function') {
        acc[cur] = val
      }
      return acc
    }, {}) as A
  })
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
    const returningFields = fields ?? getMutationReturningFields(res)
    return touchAllFields(res.returning, returningFields)
  })
  // @ts-ignore
  return next
}

const filterFields = {
  __typename: true,
  // for user - password isnt valid, can we detect?
  password: true,
}
const filterMutationFields = {
  ...filterFields,
  // for restaurant - we cant return computed values from mutations!
  is_open_now: true,
}

const isSimpleField = (field: any) => {
  return field.ofNode instanceof ScalarNode && !field.args?.required
}

// a bit hacky at the moment
function getMutationReturningFields(mutation: any) {
  const accessor = mutation[ACCESSOR]
  if (!accessor) {
    throw new Error(`Invalid mutation`)
  }
  const accessorFields = accessor.node.fields.returning.ofNode.ofNode.fields
  return Object.keys(accessorFields).filter((x) => {
    return !filterMutationFields[x] && isSimpleField(accessorFields[x])
  })
}

export async function resolvedWithFields(
  resolver: any,
  fields: string[] | null = null
): Promise<any> {
  const next = await resolved(() => {
    const res = resolver()
    const returningFields = fields ?? getQueryFields(res)
    return touchAllFields(res, returningFields)
  })
  return next
}

// a bit hacky at the moment
function getQueryFields(query: any) {
  const accessor = query[ACCESSOR]
  if (!accessor) {
    throw new Error(`Invalid mutation`)
  }
  const accessorFields = accessor.node.ofNode.fields
  return Object.keys(accessorFields).filter((x) => {
    return !filterFields[x] && isSimpleField(accessorFields[x])
  })
}

export function resolveFields<A extends any[]>(
  result: A,
  fields?: string[]
): A {
  if (result.length === 1) {
    touchAllFieldsOnRecord<A>(result[0], fields ?? [])
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
