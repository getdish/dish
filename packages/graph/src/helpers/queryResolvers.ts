import { ACCESSOR, Cache, ScalarNode, resolved } from 'gqless'

import { mutateClient } from '../graphql/mutation'
import { collectAll } from './collect'

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
    const returningFields = fields ?? getMutationReturningFields(res)
    return collectAll(res.returning, returningFields)
  })
  // @ts-ignore
  return next
}

const filterFields = {
  __typename: true,
  // for user - password isnt valid, can we detect?
  password: true,
}
export const filterMutationFields = {
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
    return collectAll(res, returningFields)
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
