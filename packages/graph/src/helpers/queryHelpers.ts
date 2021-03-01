import { parseSchemaType, selectFields } from '@dish/gqless'
import { omit } from 'lodash'

import {
  Scalars,
  generatedSchema,
  list_constraint,
  mutation,
  photo_constraint,
  photo_xref_constraint,
  query,
  restaurant_constraint,
  review_constraint,
  review_tag_sentence_constraint,
  setting_constraint,
  tag_constraint,
  tag_tag_constraint,
  user_constraint,
} from '../graphql'
import {
  SelectionOptions,
  resolvedMutation,
  resolvedMutationWithFields,
  resolvedWithFields,
} from '../helpers/queryResolvers'
import { ModelName, ModelType, WithID } from '../types'
import { isMutatableField, isMutatableRelation } from './isMutatableField'

type uuid = Scalars['uuid']

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
  list: list_constraint.list_slug_user_id_region_key,
  review: review_constraint.review_native_data_unique_key_key,
  review_tag_sentence:
    review_tag_sentence_constraint.review_tag_tag_id_review_id_sentence_key,
  setting: setting_constraint.setting_pkey,
  tag_tag: tag_tag_constraint.tag_tag_pkey,
  user: user_constraint.user_username_key,
  photo: photo_constraint.photo_origin_key,
  photo_xref:
    photo_xref_constraint.photos_xref_photos_id_restaurant_id_tag_id_key,
}

export function createQueryHelpersFor<A extends ModelType>(
  modelName: ModelName,
  defaultUpsertConstraint?: string
) {
  return {
    async insert(items: Partial<A>[], opts?: SelectionOptions) {
      return await insert<A>(modelName, items, opts)
    },
    async upsert(
      items: Partial<A>[],
      constraint?: string,
      opts?: SelectionOptions
    ) {
      return await upsert<A>(
        modelName,
        items,
        constraint ?? defaultUpsertConstraint,
        opts
      )
    },
    async update(a: WithID<Partial<A>>, opts?: SelectionOptions) {
      //@ts-expect-error
      return await update<WithID<A>>(modelName, a, opts)
    },
    async findOne(a: Partial<A>, opts?: SelectionOptions) {
      return await findOne<WithID<A>>(modelName, a as any, opts)
    },
    async findAll(a: Partial<A>, opts?: SelectionOptions) {
      return await findAll<WithID<A>>(modelName, a as any, opts)
    },
    async refresh(a: WithID<A>) {
      const next = await findOne(modelName, { id: a.id })
      if (!next) throw new Error('@dish/graph: object refresh failed')
      return next as WithID<A>
    },
    async delete(a: WithID<Partial<A>>) {
      return await deleteAllBy(modelName, 'id', a.id)
    },
  }
}

export async function findOne<T extends ModelType>(
  table: ModelName,
  hash: Partial<T>,
  opts?: SelectionOptions
): Promise<T | null> {
  const [first] = await findAll(table, hash, opts)
  return first ?? null
}

export async function findAll<T extends ModelType>(
  table: ModelName,
  hash: Partial<T>,
  opts?: SelectionOptions
): Promise<T[]> {
  const results = await resolvedWithFields(() => {
    const args = objectToWhere(hash)
    return query[table](args)
  }, opts)
  return results ?? []
}

export async function insert<T extends ModelType>(
  table: ModelName,
  insertObjects: Partial<T>[],
  opts?: SelectionOptions
): Promise<WithID<T>[]> {
  // @ts-ignore
  return await resolvedMutationWithFields(
    () => {
      const objects = prepareData(table, insertObjects, '_insert_input')
      return mutation[`insert_${table}` as any]({
        objects,
      })
    },
    { keys: Object.keys(generatedSchema[table + '_set_input']), ...opts }
  )
}

export async function upsert<T extends ModelType>(
  table: ModelName,
  objectsIn: Partial<T>[],
  constraint?: string,
  opts?: SelectionOptions
): Promise<WithID<T>[]> {
  constraint = constraint ?? defaultConstraints[table]
  const objects = prepareData(table, objectsIn, '_insert_input')
  const update_columns = updateableColumns(table, objects[0])
  // @ts-ignore
  return await resolvedMutationWithFields(
    () => {
      return mutation[`insert_${table}` as any]({
        objects,
        on_conflict: {
          constraint,
          update_columns,
        },
      })
    },
    {
      // input type fields are the direct name of object types
      // 1 to 1
      keys: Object.keys(generatedSchema[table + '_set_input']),
      ...opts,
    }
  )
}

export async function update<T extends WithID<ModelType>>(
  table: ModelName,
  objectIn: T,
  opts: SelectionOptions = {}
): Promise<WithID<T>> {
  const action = `update_${table}` as any
  const [object] = prepareData(table, [objectIn], '_set_input')
  if (!object.id) {
    throw new Error(`Must have ID to update`)
  }
  for (const key of Object.keys(object)) {
    if (object[key] == null) delete object[key]
  }
  opts.keys = opts.keys || Object.keys(generatedSchema[table + '_set_input'])
  const [resolved] = await resolvedMutationWithFields(() => {
    const res = mutation[action]({
      where: { id: { _eq: object.id } },
      _set: omit(object, 'id'),
    })
    // if (opts.query && res) {
    //   assignSelections(opts.query, res)
    // }
    return res as WithID<T>[]
  }, opts)
  // if (opts.query && resolved) {
  //   setCache(opts.query, resolved)
  // }
  return resolved
}

export async function deleteAllFuzzyBy(
  table: ModelName,
  key: string,
  value: string
): Promise<void> {
  await resolvedMutation(() => {
    const m = mutation[`delete_${table}`]?.({
      where: { [key]: { _ilike: `%${value}%` } },
    })
    return selectFields(m, '*', 3)
  })
}

export async function deleteAllBy(
  table: string,
  key: string,
  value: string
): Promise<void> {
  await resolvedMutation(() => {
    const m = mutation[`delete_${table}`]?.({
      where: { [key]: { _eq: value } },
    })
    return selectFields(m, '*', 3)
  })
}

export async function deleteByIDs(table: string, ids: uuid[]): Promise<void> {
  await resolvedMutation(() => {
    return mutation[`delete_${table}`]?.({
      where: { id: { _in: ids } },
    })
  })
}

function removeReadOnlyProperties<T>(table: string, objects: T[]): T[] {
  return objects.map((cur) => {
    return Object.keys(cur).reduce((acc, key) => {
      const fieldName = key
      const schemaType = generatedSchema[table][key]['__type']
      const { pureType: typeName } = parseSchemaType(schemaType)
      // const field = schema[table].fields[key]
      if (isMutatableField(fieldName, typeName)) {
        acc[key] = cur[key]
      }
      return acc
    }, {} as T)
  })
}

export function prepareData<T>(
  table: string,
  objects: T[],
  inputType: '_set_input' | '_insert_input'
): T[] {
  objects = removeReadOnlyProperties<T>(table, objects)
  objects = formatRelationData<T>(table, objects, inputType)
  objects = objects.map((o) => ensureJSONSyntax(o) as T)
  return objects
}

function formatRelationData<T>(
  table: string,
  objects: T[],
  inputType: '_set_input' | '_insert_input'
) {
  return objects.map((cur) => {
    return Object.keys(cur).reduce((acc, key) => {
      const hasArgs = !!generatedSchema[table][key]['__args']
      const schemaType = generatedSchema[table][key]['__type']
      const {
        pureType: typeName,
        isArray,
        isNullable,
        nullableItems,
      } = parseSchemaType(schemaType)
      const inputKeys = Object.keys(generatedSchema[table + inputType])

      const fieldName = key

      if (!inputKeys.includes(fieldName)) return acc

      if (isMutatableRelation(fieldName, typeName)) {
        let relation_table: string

        if (isArray) {
          relation_table = typeName
        } else {
          relation_table = fieldName
        }

        const constraint = defaultConstraints[relation_table]
        const update_columns = updateableColumns(relation_table, cur[key])
        const d = {
          data: cur[key],
          on_conflict: {
            constraint,
            update_columns,
          },
        }
        acc[key] = d
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
    try {
      const schemaType = generatedSchema[table][key]['__type']
      const { pureType: typeName } = parseSchemaType(schemaType)
      const fieldName = key
      if (!isMutatableRelation(fieldName, typeName)) columns.push(key)
    } catch (err) {
      console.error(err)
    }
  }
  return columns
}
