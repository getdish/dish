import { query, schema } from '../graphql'
import { mutation } from '../graphql/mutation'
import { ModelName, ModelType, WithID } from '../types'
import { CollectOptions } from './collect'
import { isMutatableField } from './isMutatableField'
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
  constraint: string,
  objectsIn: T[]
): Promise<WithID<T>[]> {
  const objects = prepareData(table, objectsIn)
  // TODO: Is there a better way to get the updateable columns?
  const update_columns = Object.keys(objects[0])
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

function prepareData<T>(table: string, objects: T[]): T[] {
  objects = removeReadOnlyProperties<T>(table, objects)
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

function _traverse(o: any, fn: (obj: any, prop: string, value: any) => void) {
  for (const i in o) {
    if (o[i] !== null && typeof o[i] === 'object') {
      _traverse(o[i], fn)
    }
    fn.apply({}, [o, i, o[i]])
  }
}

function ensureJSONSyntax(json: {}) {
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
