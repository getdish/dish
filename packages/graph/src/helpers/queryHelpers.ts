import { resolved } from 'gqless'

import { query } from '../graphql'
import { mutation } from '../graphql/mutation'
import { IDRequired, ModelType } from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import { resolveFields } from './resolveFields'

export const upsertConstraints = {
  tag_tag_pkey: 'tag_tag_pkey',
  tag_parentId_name_key: 'tag_parentId_name_key',
  restaurant_name_address_key: 'restaurant_name_address_key',
  dish_restaurant_id_name_key: 'dish_restaurant_id_name_key',
}

export async function findOne<T extends ModelType>(
  table: string,
  hash: Partial<T>
): Promise<T> {
  const where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })
  return await resolveFields(allFieldsForTable(table), () => {
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
      console.log('affected_rows', affected_rows, returning)
      return returning.map((x) => x.id)
    }
  })
}

export async function insert<T extends ModelType>(
  table: string,
  objects: T[]
): Promise<T[]> {
  const ids = await resolveMutationWithIds(`insert_${table}` as any, {
    objects,
  })
  return objects.map((o, i) => ({ ...(o as any), id: ids[i] }))
}

export async function upsert<T extends ModelType>(
  table: string,
  constraint: typeof upsertConstraints[keyof typeof upsertConstraints],
  objects: T[]
): Promise<IDRequired<T>[]> {
  // TODO: Is there a better way to get the updateable columns?
  const update_columns = Object.keys(objects[0])
  const ids = await resolveMutationWithIds(`insert_${table}` as any, {
    objects,
    on_conflict: {
      constraint,
      update_columns,
    },
  })
  return objects.map((o, i) => ({ ...(o as any), id: ids[i] }))
}

export async function update<T extends IDRequired<ModelType>>(
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

export async function deleteAllFuzzyBy(
  table: string,
  key: string,
  value: string
) {
  return await resolved(() => {
    mutation[`delete_${table}`]?.({
      where: { [key]: { _ilike: `%${value}%` } },
    }).affected_rows
  })
}

export async function deleteAllBy(table: string, key: string, value: string) {
  return await resolved(() => {
    mutation[`delete_${table}`]?.({
      where: { [key]: { _eq: value } },
    }).affected_rows
  })
}

export async function fetchBatch(
  table: string,
  size: number,
  previous_id: string,
  extraFields: string[] = [],
  extra_where: {} = {}
) {
  return await resolveFields(['id', ...extraFields], () => {
    return query[table]?.({
      limit: size,
      order_by: { id: 'asc' },
      where: {
        id: { _gt: previous_id },
        ...extra_where,
      },
    })
  })
}

export async function findOneByHash(
  table: string,
  hash: { [key: string]: string },
  extra_returning: string[] = []
) {
  const where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })

  const response = await resolveFields(
    [...allFieldsForTable(table), ...extra_returning],
    () => {
      return query[table]?.({
        where: {
          _and: where,
        },
      })
    }
  )

  if (response.length === 1) {
    return response[0]
  } else {
    const message =
      `${response.length} ${table}s found by findOne(). ` +
      `Using: ${JSON.stringify(hash)}`
    throw new Error(message)
  }
}
