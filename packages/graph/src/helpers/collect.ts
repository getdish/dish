import {
  ArrayNode,
  FieldNode,
  ObjectNode,
  ScalarNode,
  UFieldsNode,
  getAccessor,
} from 'gqless'
import { isObject } from 'lodash'
import { clone } from 'lodash'

import { isMutableReturningField } from './isMutatableField'

const DEFAULT_MAX_DEPTH = 2

// a smart collection function for gqless
// grabs fields using the getAccessor and resolves "most" for ease of use

export type CollectOptions = {
  // replace fields to select
  fields?: string[]
  // add fields to select (collect runs on each)
  include?: string[]
  maxDepth?: number
  type?: 'query' | 'mutation'
}

export const collect = <A extends any>(
  untouched_object: A,
  options: CollectOptions = { maxDepth: DEFAULT_MAX_DEPTH },
  ancestry: string[] = []
): A => {
  if (options.maxDepth === 0) {
    return untouched_object
  }
  let collectable_fields = options.fields
  if (!collectable_fields) {
    collectable_fields = getFieldsForCollect(
      untouched_object,
      options,
      ancestry
    )
  }
  if (options.include) {
    collectable_fields = [
      ...collectable_fields,
      ...options.include.filter((x) => x.indexOf('.') === -1),
    ]
  }
  const collected_object: A = (collectable_fields ?? []).reduce(
    (acc: A, field_name: string) => {
      const descdendant = clone(ancestry)
      descdendant.push(field_name)
      return recurseIntoAllFields<A>(
        acc,
        field_name,
        untouched_object,
        options,
        descdendant
      )
    },
    {} as A
  )
  return collected_object
}

export const collectAll = <A extends any>(
  objects: A[],
  options: CollectOptions = { maxDepth: DEFAULT_MAX_DEPTH },
  ancestry: string[] = []
): A[] => {
  return objects.map((x) => collect(x, options, ancestry))
}

function recurseIntoAllFields<A>(
  acc: A,
  field_name: string,
  object: any,
  options: CollectOptions,
  ancestry: string[] = []
) {
  let value = object[field_name]
  if (typeof value === 'function') {
    value = value()
  }
  acc[field_name] = value
  if (isObject(value) || Array.isArray(value)) {
    acc[field_name] = recurseIntoSubField(field_name, value, options, ancestry)
  }
  return acc
}

function recurseIntoSubField(
  field_name: string,
  object: any,
  options: CollectOptions,
  ancestry: string[] = []
) {
  let subFields: string[] = []
  const subIncludes = options.include?.includes(field_name)
    ? findSubIncludes(field_name, options.include)
    : []
  if (subIncludes?.length) {
    subFields = findSubIncludes(field_name, subIncludes)
  }
  // collect subfields from object
  if (isObject(object)) {
    try {
      subFields = [
        ...subFields,
        ...getFieldsForCollect(object, options, ancestry),
      ]
    } catch (err) {
      // fine, its just some normal object
    }
  }
  //console.log(ancestry.join('.'), subFields)
  if (subFields.length) {
    const updated_options: CollectOptions = {
      maxDepth: (options.maxDepth ?? DEFAULT_MAX_DEPTH) - 1,
      include: [...(options.include ?? []), ...subIncludes],
    }
    return Array.isArray(object)
      ? collectAll(object, updated_options, ancestry)
      : collect(object, updated_options, ancestry)
  } else {
    return object
  }
}

function findSubIncludes(prefix: string, includes: string[]) {
  return includes
    .map((x) => {
      if (x === prefix) {
        return false
      }
      if (x.indexOf(prefix) === 0) {
        return x.replace(`${prefix}.`, '')
      }
      return false
    })
    .filter(Boolean) as string[]
}

function getFieldsForCollect(
  object: any,
  options: CollectOptions,
  ancestry: string[] = []
) {
  const accessor = getAccessor(object)
  if (!accessor) return []
  const parentNode = accessor.node
  let fieldsObject: Record<string, FieldNode<UFieldsNode>> | null = null

  if (parentNode instanceof ObjectNode) {
    fieldsObject = parentNode.fields
  } else if (parentNode instanceof ArrayNode) {
    // @ts-ignore
    fieldsObject = parentNode.innerNode.fields
  }

  if (fieldsObject) {
    const allFields: FieldNode[] = Object.keys(fieldsObject!).map(
      (key) => fieldsObject![key]
    )
    const finalFields = allFields
      .filter((x) => filterAccessibleField(x, options, ancestry))
      .map((x) => x.name)
      .filter((x) => filterFieldsByName(x, options, ancestry))

    return finalFields
  }

  return []
}

function filterAccessibleField(
  field: FieldNode,
  options: CollectOptions,
  ancestry: string[]
) {
  const ofNode = field.ofNode
  const ancestry_path = [...ancestry, field.name].join('.')
  if (options.include?.includes(ancestry_path)) {
    return true
  }
  if (field.name === '__typename') {
    return false
  }
  if (ofNode instanceof ScalarNode) {
    if (ofNode.name === 'jsonb') {
      return true
    }
    // dont return relations by default! we could add an option to
    if (field.args) {
      return false
    }
    return true
  }
  if (ofNode instanceof ObjectNode) {
    return true
  }
  return false
}

function filterFieldsByName(
  name: string,
  options: CollectOptions,
  ancestry: string[]
) {
  if (options.type === 'mutation' && !isMutableReturningField(name)) {
    return false
  }
  const ancestry_path = [...ancestry, name].join('.')
  if (options.include?.includes(ancestry_path)) {
    return true
  }

  // warning include is bugged, wont support `.` use case
  // do nothin for aggregates by default
  if (
    name.endsWith('_aggregate') &&
    !options.fields?.includes(name) &&
    !options.include?.includes(name)
  ) {
    return false
  }
  return true
}
