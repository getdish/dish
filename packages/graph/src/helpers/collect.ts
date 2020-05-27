import {
  ArrayNode,
  FieldNode,
  ObjectNode,
  ScalarNode,
  UFieldsNode,
  getAccessor,
} from 'gqless'
import { isObject } from 'lodash'

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
  object: A,
  options: CollectOptions = { maxDepth: DEFAULT_MAX_DEPTH }
): A => {
  if (options.maxDepth === 0) {
    return object
  }
  let fields = options.fields
  if (!fields) {
    fields = getFieldsForCollect(object, options)
  }
  if (options.include) {
    fields = [
      ...fields,
      ...options.include.filter((x) => x.indexOf('.') === -1),
    ]
  }
  return (fields ?? []).reduce((acc, key) => {
    let val = object[key]
    if (typeof val === 'function') {
      val = val()
    }
    acc[key] = val

    // recurse!
    if (isObject(val) || Array.isArray(val)) {
      let subFields: string[] = []
      const subIncludes = options.include?.includes(key)
        ? findSubIncludes(key, options.include)
        : []
      if (subIncludes?.length) {
        subFields = findSubIncludes(key, subIncludes)
      }
      // collect subfields from object
      if (isObject(val)) {
        try {
          subFields = [...subFields, ...getFieldsForCollect(val, options)]
        } catch (err) {
          // fine, its just some normal object
        }
      }
      if (subFields.length) {
        const opts: CollectOptions = {
          maxDepth: (options.maxDepth ?? DEFAULT_MAX_DEPTH) - 1,
          include: subIncludes,
        }
        acc[key] = Array.isArray(val)
          ? collectAll(val, opts)
          : collect(val, opts)
      }
    }

    return acc
  }, {}) as A
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

export const collectAll = <A extends any>(
  objects: A[],
  options: CollectOptions = { maxDepth: DEFAULT_MAX_DEPTH }
): A[] => {
  return objects.map((x) => collect(x, options))
}

function getFieldsForCollect(object: any, options: CollectOptions) {
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
      .filter(filterAccessibleField)
      .map((x) => x.name)
      .filter((x) => filterFieldsByName(x, options))

    return finalFields
  }

  return []
}

function filterAccessibleField(field: FieldNode) {
  const ofNode = field.ofNode
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

function filterFieldsByName(name: string, options: CollectOptions) {
  if (options.type === 'mutation' && !isMutableReturningField(name)) {
    return false
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
