import {
  ArrayNode,
  FieldNode,
  ObjectNode,
  ScalarNode,
  UFieldsNode,
  getAccessor,
} from 'gqless'
import { isObject, update } from 'lodash'

import { isMutableReturningField } from './isMutatableField'

const DEFAULT_MAX_DEPTH = 2

let shouldDebug = false

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
  if (options.include?.includes('tags.tag.categories.category')) {
    shouldDebug = true
  }
  if (options.maxDepth === 0) {
    return object
  }
  let collectable_fields = options.fields
  if (!collectable_fields) {
    collectable_fields = getFieldsForCollect(object, options)
  }
  return (collectable_fields ?? []).reduce((obj: A, fieldName: string) => {
    let value = object[fieldName]
    if (typeof value === 'function') {
      value = value()
    }
    obj[fieldName] = value
    if (isObject(value) || Array.isArray(value)) {
      obj[fieldName] = recurseAndCollect(value, fieldName, options)
    }
    return obj
  }, {} as A)
}

function recurseAndCollect(
  object: any,
  fieldName: string,
  options: CollectOptions
) {
  const isIncluded = options.include?.some((include) =>
    include.startsWith(fieldName)
  )
  const subIncludes = isIncluded
    ? findSubIncludes(fieldName, options.include!)
    : []
  const subFields: string[] = isObject(object)
    ? getFieldsForCollect(object, options)
    : []

  // if (shouldDebug) console.log({ fieldName, object, subIncludes, subFields })

  if (subFields.length || subIncludes.length) {
    const updatedOptions: CollectOptions = {
      maxDepth: (options.maxDepth ?? DEFAULT_MAX_DEPTH) - 1,
      include: subIncludes,
    }
    return Array.isArray(object)
      ? collectAll(object, updatedOptions)
      : collect(object, updatedOptions)
  }

  return object
}

export const collectAll = <A extends any>(
  objects: A[],
  options: CollectOptions = { maxDepth: DEFAULT_MAX_DEPTH }
): A[] => {
  return objects.map((x) => collect(x, options))
}

function findSubIncludes(prefix: string, includes: string[]) {
  return includes
    .map((x) => {
      if (x === prefix) {
        return false
      }
      if (x.startsWith(prefix)) {
        return x.replace(`${prefix}.`, '')
      }
      return false
    })
    .filter(Boolean) as string[]
}

function getFieldsForCollect(object: any, options: CollectOptions) {
  let validFields: string[] = []
  if (options.include) {
    validFields = [
      ...new Set([
        ...validFields,
        ...options.include.filter((x) => !x.includes('.')),
      ]),
    ]
  }
  const fieldsObject = getFieldsObject(object)
  if (fieldsObject) {
    const accessibleFields = Object.keys(fieldsObject)
      .map((key) => fieldsObject![key])
      .filter((x) => keepAccessibleField(x, options))
      .map((x) => x.name)
    validFields = [...new Set([...validFields, ...accessibleFields])]
    // if (shouldDebug)
    //   console.log('getting fields for collect', {
    //     fieldNames: Object.keys(fieldsObject),
    //     options,
    //     validFields,
    //   })
  }
  return validFields
}

function getFieldsObject(object: any) {
  try {
    const accessor = getAccessor(object)
    if (!accessor) {
      return null
    }
    const parentNode = accessor.node
    let fieldsObject: Record<string, FieldNode<UFieldsNode>> | null = null
    if (parentNode instanceof ObjectNode) {
      fieldsObject = parentNode.fields
    } else if (parentNode instanceof ArrayNode) {
      // @ts-ignore
      fieldsObject = parentNode.innerNode.fields
    }
    return fieldsObject
  } catch (err) {
    if (err.message.includes('[gqless] Indeterminate accessor')) {
      return null
    }
    throw err
  }
}

function keepAccessibleField(field: FieldNode, options: CollectOptions) {
  const { name, ofNode } = field
  if (options.type === 'mutation' && !isMutableReturningField(name)) {
    return false
  }
  if (options.include?.some((include) => include.startsWith(name))) {
    return true
  }
  // warning include is bugged, wont support `.` use case
  // do nothin for aggregates by default
  if (name.endsWith('_aggregate') && !options.fields?.includes(name)) {
    return false
  }
  if (name === '__typename') {
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
  // if (ofNode instanceof ArrayNode) {
  //   if (shouldDebug) console.log('wtf', name, options)
  // }
  if (ofNode instanceof ObjectNode) {
    return true
  }
  return false
}
