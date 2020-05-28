import { resolved } from 'gqless'

import { query } from '../graphql'
import { mutation } from '../graphql/mutation'
import { IDRequired, ModelName, ModelType } from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import { resolveFields, touchToResolveInGQLess } from './resolveFields'

export const upsertConstraints = {
  tag_tag_pkey: 'tag_tag_pkey',
  tag_parentId_name_key: 'tag_parentId_name_key',
  restaurant_name_address_key: 'restaurant_name_address_key',
  dish_restaurant_id_name_key: 'dish_restaurant_id_name_key',
}

export async function findOne<T extends ModelType>(
  table: ModelName,
  hash: Partial<T>
): Promise<T> {
  const where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })
  const all_fields = allFieldsForTable(table)
  const response = await resolveFields<T>(all_fields, () => {
    return (query[table]({
      where: {
        _and: where,
      },
    }) as any) as T[]
  })
  if (response.length != 1) {
    throw new Error(
      `QUERY ERROR: findOne('${table}', ${hash}) found ${response.length}`
    )
  }
  return touchToResolveInGQLess(response[0], all_fields)
}

async function resolveMutationWithIds<A extends keyof typeof mutation>(
  name: A,
  arg: typeof mutation[A]
): Promise<string[]> {
  const next = await resolved(() => {
    const mutationFn = mutation[name] as any
    if (typeof mutationFn === 'function') {
      const { affected_rows, returning } = mutationFn(arg)
      return returning.map((x) => x.id)
    }
  })
  if (process.env.DEBUG) {
    console.log('resolving mutation ids:', next)
  }
  return next
}

export async function insert<T extends ModelType>(
  table: ModelName,
  objects: T[]
): Promise<T[]> {
  const ids = await resolveMutationWithIds(`insert_${table}` as any, {
    objects,
  })
  return objects.map((o, i) => ({ ...(o as any), id: ids[i] }))
}

export async function upsert<T extends ModelType>(
  table: ModelName,
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
  table: ModelName,
  object: T
): Promise<T> {
  const ids = await resolveMutationWithIds(`update_${table}` as any, {
    where: { id: { _eq: object.id } },
    _set: object,
  })
  return { ...object, id: ids[0] }
}

export async function deleteAllFuzzyBy(
  table: ModelName,
  key: string,
  value: string
): Promise<number> {
  return await resolved(() => {
    return mutation[`delete_${table}`]?.({
      where: { [key]: { _ilike: `%${value}%` } },
    }).affected_rows
  })
}

export async function deleteAllBy(
  table: string,
  key: string,
  value: string
): Promise<number> {
  return await resolved(() => {
    return mutation[`delete_${table}`]?.({
      where: { [key]: { _eq: value } },
      // @ts-ignore
    }).affected_rows
  })
}

export async function fetchBatch<T extends ModelType>(
  table: ModelName,
  size: number,
  previous_id: string,
  extraFields: string[] = [],
  extra_where: {} = {}
): Promise<T[]> {
  return await resolveFields(['id', ...extraFields], () => {
    return (query[table]?.({
      limit: size,
      // @ts-ignore
      order_by: { id: 'asc' },
      where: {
        id: { _gt: previous_id },
        ...extra_where,
      },
    }) as any) as T[]
  })
}

export async function findOneByHash<T extends ModelType>(
  table: ModelName,
  hash: { [key: string]: string },
  extra_returning: string[] = []
): Promise<T> {
  const where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })

  const response = await resolveFields(
    [...allFieldsForTable(table), ...extra_returning],
    () => {
      return (query[table]?.({
        where: {
          _and: where,
        },
      }) as any) as T[]
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
