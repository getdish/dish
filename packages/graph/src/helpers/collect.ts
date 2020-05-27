import {
  ArrayNode,
  FieldNode,
  ObjectNode,
  ScalarNode,
  UFieldsNode,
  getAccessor,
} from 'gqless'
import { isObject } from 'lodash'

// a smart collection function for gqless
// grabs fields using the getAccessor and resolves "most" for ease of use

export type CollectOptions = {
  // replace fields to select
  fields?: string[]
  // add fields to select (collect runs on each)
  include?: string[]
  maxDepth?: number
}

export const collect = <A extends any>(
  object: A,
  options: CollectOptions = { maxDepth: 3 }
): A => {
  if (options.maxDepth === 0) {
    return object
  }
  let fields = options.fields
  if (!fields) {
    fields = getFieldsFromAccessor(object)
  }
  if (options.include) {
    fields = [
      ...fields,
      ...options.include.filter((x) => x.indexOf('.') === -1),
    ]
  }
  return (fields ?? []).reduce((acc, key) => {
    const val = object[key]

    if (typeof val === 'function') {
      acc[key] = val()
    } else {
      acc[key] = val
    }

    // recurse!
    const res = acc[key]
    if (isObject(res) || Array.isArray(res)) {
      let subFields: string[] = []
      const subIncludes = options.include?.includes(key)
        ? findSubIncludes(key, options.include)
        : []
      if (subIncludes?.length) {
        subFields = findSubIncludes(key, subIncludes)
      }
      if (isObject(res)) {
        try {
          subFields = [...subFields, ...getFieldsFromAccessor(res)]
        } catch (err) {
          // fine, its just some normal object
        }
      }
      if (subFields.length) {
        const opts: CollectOptions = {
          maxDepth: (options.maxDepth ?? 3) - 1,
          include: subIncludes,
        }
        acc[key] = Array.isArray(res)
          ? collectAll(res, opts)
          : collect(res, opts)
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
  options: CollectOptions = { maxDepth: 3 }
): A[] => {
  return objects.map((x) => collect(x, options))
}

function getFieldsFromAccessor(object: any, childKey?: string) {
  const accessor = getAccessor(object)
  const parentNode = accessor?.node
  let fieldsObject: Record<string, FieldNode<UFieldsNode>> | null = null

  if (parentNode instanceof ObjectNode) {
    fieldsObject = parentNode.fields
  } else if (parentNode instanceof ArrayNode) {
    // @ts-ignore
    fieldsObject = parentNode.innerNode.fields
  }

  if (fieldsObject) {
    // this handles recursion
    if (childKey) {
      const node = fieldsObject[childKey]?.ofNode
      // @ts-ignore
      fieldsObject = node?.fields ?? {}
    }

    const allFields: FieldNode[] = Object.keys(fieldsObject!).map(
      (key) => fieldsObject![key]
    )
    const finalFields = allFields
      .filter(filterAccessibleField)
      .map((x) => x.name)
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
