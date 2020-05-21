import { resolved } from 'gqless'

import { query, schema } from '../graphql'
import { mutation } from '../graphql/mutation'

type DishGeneric = {
  id: string
}

const allFieldsForTable = (table: string): string[] => {
  return Object.keys(schema[table]?.fields ?? {})
}

async function resolveAllFields<A>(table: string, cb: () => A): Promise<A> {
  return await resolved(() => {
    const res = cb()
    for (const key of allFieldsForTable(table)) {
      // touch each key to resolve it in gqless
      res[key]
    }
    return res
  })
}

export async function findOne<T>(table: string, hash: Partial<T>): Promise<T> {
  const where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })
  return await resolveAllFields(table, () => {
    return query[table]({
      where: {
        _and: where,
      },
    })
  })
}

async function resolveMutationWithIds<A extends keyof typeof mutation>(
  name: A,
  arg: typeof mutation[A]
) {
  return await resolved(() => {
    const mutationFn = mutation[name] as any
    if (typeof mutationFn === 'function') {
      const { affected_rows, returning } = mutationFn(arg)
      console.log('affected_rows', affected_rows)
      return returning.map((x) => x.id)
    }
  })
}

export async function insert<T>(table: string, objects: T[]): Promise<T[]> {
  const ids = await resolveMutationWithIds(`insert_${table}` as any, {
    objects,
  })
  return objects.map((o, i) => ({ ...o, id: ids[i] }))
}

export async function upsert<T>(
  table: string,
  constraint: string,
  objects: T[]
): Promise<T[]> {
  // TODO: Is there a better way to get the updateable columns?
  const update_columns = Object.keys(objects[0])
  const ids = await resolveMutationWithIds(`insert_${table}` as any, {
    objects,
    on_conflict: {
      constraint,
      update_columns,
    },
  })
  return objects.map((o, i) => ({ ...o, id: ids[i] }))
}

export async function update<T extends DishGeneric>(
  table: string,
  object: T
): Promise<T> {
  const ids = await resolveMutationWithIds(`update_${table}` as any, {
    where: { id: { _eq: object.id } },
    _set: object,
  })
  console.log('update got ids', ids)
  return { ...object, id: ids[0] }
}
