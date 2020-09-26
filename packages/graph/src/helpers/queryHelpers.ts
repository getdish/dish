import {
  photo_constraint,
  photo_xref_constraint,
  query,
  restaurant_constraint,
  review_constraint,
  review_tag_constraint,
  schema,
  setting_constraint,
  tag_constraint,
  tag_tag_constraint,
  user_constraint,
  uuid,
} from '../graphql'
import { mutation } from '../graphql/mutation'
import { ModelName, ModelType, WithID } from '../types'
import { CollectOptions } from './collect'
import { isMutatableField, isMutatableRelation } from './isMutatableField'
import {
  resolvedMutation,
  resolvedMutationWithFields,
  resolvedWithFields,
} from './queryResolvers'

export function objectToWhere(hash: { [key: string]: any }): any {
  // default if id exists just use id
  if ('id' in hash) {
    return { where: { id: { _eq: hash.id } } }
  }
  let where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })
  return {
    where: {
      _and: where,
    },
  }
}

const defaultConstraints = {
  tag: tag_constraint.tag_parentId_name_key,
  restaurant: restaurant_constraint.restaurant_name_address_key,
  review: review_constraint.review_native_data_unique_key_key,
  review_tag: review_tag_constraint.review_tag_tag_id_review_id_sentence_key,
  setting: setting_constraint.setting_pkey,
  tag_tag: tag_tag_constraint.tag_tag_pkey,
  user: user_constraint.user_username_key,
  photo: photo_constraint.photo_origin_key,
  photo_xref:
    photo_xref_constraint.photos_xref_photos_id_restaurant_id_tag_id_key,
}

export function createQueryHelpersFor<A>(
  modelName: ModelName,
  defaultUpsertConstraint?: string
) {
  return {
    async insert(items: A[]) {
      return await insert<A>(modelName, items)
    },
    async upsert(items: A[], constraint?: string) {
      return await upsert<A>(
        modelName,
        items,
        constraint ?? defaultUpsertConstraint
      )
    },
    async update(a: WithID<A>, o?: CollectOptions) {
      return await update<WithID<A>>(modelName, a, o)
    },
    async findOne(a: A, o?: CollectOptions) {
      return await findOne<WithID<A>>(modelName, a, o)
    },
    async findAll(a: A, o?: CollectOptions) {
      return await findAll<WithID<A>>(modelName, a, o)
    },
    async refresh(a: WithID<A>) {
      const next = await findOne(modelName, { id: a.id })
      if (!next) throw new Error('@dish/graph: object refresh failed')
      return next as WithID<A>
    },
    async delete(a: WithID<A>) {
      return await deleteAllBy(modelName, 'id', a.id)
    },
  }
}

export async function findOne<T extends ModelType>(
  table: ModelName,
  hash: Partial<T>,
  options?: CollectOptions
): Promise<T | null> {
  const [first] = await findAll(table, hash, options)
  return first ?? null
}

export async function findAll<T extends ModelType>(
  table: ModelName,
  hash: Partial<T>,
  options?: CollectOptions
): Promise<T[]> {
  const results = await resolvedWithFields(() => {
    const args = objectToWhere(hash)
    return query[table](args)
  }, options)
  return results ?? []
}

export async function insert<T extends ModelType>(
  table: ModelName,
  objects: T[]
): Promise<WithID<T>[]> {
  const action = `insert_${table}` as any
  // @ts-ignore
  return await resolvedMutationWithFields(() => {
    return mutation[action]({
      objects: prepareData(table, objects),
    })
  })
}

export async function upsert<T extends ModelType>(
  table: ModelName,
  objectsIn: T[],
  constraint?: string
): Promise<WithID<T>[]> {
  constraint = constraint ?? defaultConstraints[table]
  const objects = prepareData(table, objectsIn)
  const update_columns = updateableColumns(table, objects[0])
  const action = `insert_${table}` as any
  // @ts-ignore
  return await resolvedMutationWithFields(() => {
    return mutation[action]({
      objects,
      on_conflict: {
        constraint,
        update_columns,
      },
    })
  })
}

export async function update<T extends WithID<ModelType>>(
  table: ModelName,
  objectIn: T,
  options: CollectOptions = {}
): Promise<WithID<T>> {
  const action = `update_${table}` as any
  const [object] = prepareData(table, [objectIn])
  for (const key of Object.keys(object)) {
    if (object[key] == null) delete object[key]
  }
  const [resolved] = await resolvedMutationWithFields(() => {
    const res = mutation[action]({
      where: { id: { _eq: object.id } },
      _set: object,
    })
    return res as WithID<T>[]
  }, options)
  return resolved
}

export async function deleteAllFuzzyBy(
  table: ModelName,
  key: string,
  value: string
): Promise<void> {
  await resolvedMutation(() => {
    return mutation[`delete_${table}`]?.({
      where: { [key]: { _ilike: `%${value}%` } },
    })
  })
}

export async function deleteAllBy(
  table: string,
  key: string,
  value: string
): Promise<void> {
  await resolvedMutation(() => {
    return mutation[`delete_${table}`]?.({
      where: { [key]: { _eq: value } },
    })
  })
}

export async function deleteByIDs(table: string, ids: uuid[]): Promise<void> {
  await resolvedMutation(() => {
    return mutation[`delete_${table}`]?.({
      where: { id: { _in: ids } },
    })
  })
}

export function prepareData<T>(table: string, objects: T[]): T[] {
  objects = removeReadOnlyProperties<T>(table, objects)
  objects = formatRelationData<T>(table, objects)
  objects = objects.map((o) => ensureJSONSyntax(o) as T)
  return objects
}

function removeReadOnlyProperties<T>(table: string, objects: T[]): T[] {
  return objects.map((cur) => {
    return Object.keys(cur).reduce((acc, key) => {
      const field = schema[table].fields[key]
      if (isMutatableField(field)) {
        acc[key] = cur[key]
      }
      return acc
    }, {} as T)
  })
}

function formatRelationData<T>(table: string, objects: T[]) {
  return objects.map((cur) => {
    return Object.keys(cur).reduce((acc, key) => {
      const field_meta_data = schema[table].fields[key]
      if (isMutatableRelation(field_meta_data)) {
        let relation_table: string
        if (field_meta_data.ofNode.innerNode) {
          relation_table = field_meta_data.ofNode.innerNode.name
        } else {
          relation_table = key
        }
        const constraint = defaultConstraints[relation_table]
        const update_columns = updateableColumns(relation_table, cur[key])
        acc[key] = {
          data: cur[key],
          on_conflict: {
            constraint,
            update_columns,
          },
        }
      } else {
        acc[key] = cur[key]
      }
      return acc
    }, {} as T)
  })
}

function _traverse(o: any, fn: (obj: any, prop: string, value: any) => void) {
  for (const i in o) {
    if (o[i] !== null && typeof o[i] === 'object') {
      _traverse(o[i], fn)
    }
    fn.apply({}, [o, i, o[i]])
  }
}

export function ensureJSONSyntax(json: {}) {
  _traverse(json, (object, key, value) => {
    ensureJSONKeySyntax(object, key, value)
    deJSONStringify(object, key, value)
  })
  return json
}

function ensureJSONKeySyntax(object: {}, key: string, value: any) {
  let fixed_key = key
  if (key.includes('-')) {
    fixed_key = '__HYPHEN__' + key.replace(/-/g, '_')
    object[fixed_key] = value
    delete object[key]
  }
  if (key.includes('@')) {
    fixed_key = key.replace(/@/g, '')
    object[fixed_key] = value
    delete object[key]
  }
}

function deJSONStringify(object: {}, key: string, value: any) {
  if (typeof value != 'string') return
  if (!value.match(/[\{\}\[\]:]/g)) return
  try {
    object[key] = ensureJSONSyntax(JSON.parse(value))
  } catch {}
}

export function updateableColumns(table: string, object: any) {
  if (!object || object.length == 0) return []
  let columns: string[] = []
  let candidates: string[] = []
  if (!Array.isArray(object)) {
    candidates = Object.keys(object)
  } else {
    candidates = Object.keys(object[0])
  }
  for (const key of candidates) {
    const field = schema[table].fields[key]
    if (!isMutatableRelation(field)) columns.push(key)
  }
  return columns
}
