import { ACCESSOR, Cache, FieldNode, ScalarNode, resolved } from 'gqless'

import { query, schema } from '../graphql'
import { mutation } from '../graphql/mutation'
import { ModelName, ModelType, WithID } from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import {
  resolvedMutation,
  resolvedMutationWithFields,
  resolvedWithFields,
} from './queryResolvers'

export const filterFields = {
  __typename: true,
}

const computedFields = {
  is_open_now: true,
}

export const readOnlyFields = {
  ...computedFields,
  password: true,
  created_at: true,
  updated_at: true,
}

export const isMutatableField = (field: FieldNode) => {
  return (
    !filterFields[field.name] &&
    !readOnlyFields[field.name] &&
    isSimpleField(field)
  )
}

export const isReadableField = (field: FieldNode) => {
  return !filterFields[field.name] && isSimpleField(field)
}

export const isReturnableField = (field: FieldNode) => {
  return !computedFields[field.name] && isReadableField(field)
}

const isSimpleField = (field: FieldNode) => {
  return field.ofNode instanceof ScalarNode && !field.args?.required
}

export function objectToWhere(hash: Object) {
  let where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })
  return {
    where: {
      _and: where,
    },
  }
}

export function createQueryHelpersFor<A>(
  modelName: ModelName,
  defaultUpsertConstraint: any
) {
  return {
    async insert(items: A[]) {
      return await insert<A>(modelName, items)
    },
    async upsert(items: A[], constraint = defaultUpsertConstraint) {
      return await upsert<A>(modelName, constraint, items)
    },
    async update(a: WithID<A>) {
      return await update<WithID<A>>(modelName, a)
    },
    async findOne(a: A) {
      return await findOne<A>(modelName, a)
    },
    async refresh(a: WithID<A>) {
      const next = await findOne(modelName, { id: a.id })
      if (!next) throw new Error('@dish/graph: object refresh failed')
      return next as WithID<A>
    },
  }
}

export async function findOne<T extends ModelType>(
  table: ModelName,
  hash: Partial<T>,
  selectFields?: string[]
): Promise<T | null> {
  const [first] = await resolvedWithFields(
    table,
    () => {
      const args = objectToWhere(hash)
      return query[table](args) as T[]
    },
    selectFields
  )
  return first ?? null
}

export async function insert<T extends ModelType>(
  table: ModelName,
  objects: T[]
): Promise<WithID<T>[]> {
  const action = `insert_${table}` as any
  removeReadOnlyProperties(table, objects)
  return await resolvedMutationWithFields(table, () =>
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
  removeReadOnlyProperties(table, objects)
  // TODO: Is there a better way to get the updateable columns?
  const update_columns = Object.keys(objects[0])
  const action = `insert_${table}` as any
  return await resolvedMutationWithFields(table, () =>
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
  removeReadOnlyProperties(table, [object])
  const [resolved] = await resolvedMutationWithFields(table, () =>
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
    })
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
    })
  })
}

// a bit hacky at the moment. is it still hacky?
export function getReturnableFields(table: string) {
  let field_names: string[] = []
  const field_nodes = schema[table].fields
  for (const key in field_nodes) {
    const field_node = field_nodes[key]
    if (isReturnableField(field_node)) field_names.push(field_node.name)
  }
  return field_names
}

// TODO: Refactor with getReturnableFields()
export function getReadableFields(table: string) {
  let field_names: string[] = []
  const field_nodes = schema[table].fields
  for (const key in field_nodes) {
    const field_node = field_nodes[key]
    if (isReadableField(field_node)) field_names.push(field_node.name)
  }
  return field_names
}

function removeReadOnlyProperties<T>(table: string, objects: T[]) {
  for (const key in schema[table].fields) {
    const field = schema[table].fields[key]
    if (!isMutatableField(field)) {
      objects.forEach((o) => delete o[key])
    }
  }
}
