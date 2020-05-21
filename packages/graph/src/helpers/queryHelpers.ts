import { resolved } from 'gqless'

import { mutation, query } from '../graphql'

type DishGeneric = {
  id: string
}

export async function findOne<T>(table: string, hash: Partial<T>) {
  const where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })
  return await resolved(() => {
    return query[table]({
      where: {
        _and: where,
      },
    }) as T
  })
}

export async function insert<T>(table: string, objects: T[]) {
  return await resolved(() => {
    return mutation['insert_' + table]({
      objects: objects,
    }) as T[]
  })
}

export async function upsert<T>(
  table: string,
  constraint: string,
  objects: T[]
) {
  // TODO: Is there a better way to get the updateable columns?
  const update_columns = Object.keys(objects[0])
  return await resolved(() => {
    return mutation['insert_' + table]({
      objects: objects,
      on_conflict: {
        constraint: constraint,
        update_columns: update_columns,
      },
    }) as T[]
  })
}

export async function update<T extends DishGeneric>(table: string, object: T) {
  return await resolved(() => {
    return mutation['update_' + table]({
      where: { id: { _eq: object.id } },
      _set: object,
    }) as T
  })
}
