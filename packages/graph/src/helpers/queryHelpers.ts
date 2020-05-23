import { resolved } from 'gqless'

import { query } from '../graphql'
import { mutation } from '../graphql/mutation'
import { ModelName, ModelType, WithID } from '../types'
import {
  resolveFields,
  resolvedMutation,
  resolvedMutationWithFields,
} from './queryResolvers'

export function objectToWhere(hash: Object) {
  const where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })
  return {
    where: {
      _and: where,
    },
  }
}

export async function findOne<T extends ModelType>(
  table: ModelName,
  hash: Partial<T>,
  selectFields?: string[]
): Promise<T | null> {
  const [first] = await resolved(() => {
    return resolveFields(query[table](objectToWhere(hash)), selectFields) as T[]
  })
  return first ?? null
}

export async function insert<T extends ModelType>(
  table: ModelName,
  objects: T[]
): Promise<WithID<T>[]> {
  const action = `insert_${table}` as any
  return await resolvedMutationWithFields(() =>
    mutation[action]({
      objects,
    })
  )
}

export async function upsert<T extends ModelType>(
  table: ModelName,
  constraint: string,
  objects: T[]
): Promise<WithID<T>[]> {
  // TODO: Is there a better way to get the updateable columns?
  const update_columns = Object.keys(objects[0])
  const action = `insert_${table}` as any
  return await resolvedMutationWithFields(() =>
    mutation[action]({
      objects,
      on_conflict: {
        constraint,
        update_columns,
      },
    })
  )
}

export async function update<T extends WithID<ModelType>>(
  table: ModelName,
  object: T
): Promise<WithID<T>> {
  const action = `update_${table}` as any
  const [resolved] = await resolvedMutationWithFields(() =>
    mutation[action]({
      where: { id: { _eq: object.id } },
      _set: object,
    })
  )
  return resolved
}

export async function deleteAllFuzzyBy(
  table: ModelName,
  key: string,
  value: string
): Promise<number> {
  return await resolvedMutation(() => {
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
  return await resolvedMutation(() => {
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
  const res: any = await resolved(() => {
    const result = query[table]?.({
      limit: size,
      // @ts-ignore
      order_by: { id: 'asc' },
      where: {
        id: { _gt: previous_id },
        ...extra_where,
      },
    })
    return resolveFields(result, ['id', ...extraFields])
  })
  return res
}
