import {
  ArrayNode,
  DataTrait,
  FieldNode,
  ObjectNode,
  ScalarNode,
  UFieldsNode,
  getAccessor,
} from '@o/gqless'
import { isObject } from 'lodash'

import { isMutableReturningField } from './isMutatableField'

// a smart collection function for gqless
// grabs fields using the getAccessor and resolves "most" for ease of use

export type CollectOptions = {
  _ancestry?: string
  relations?: string[]
  type?: 'query' | 'mutation'
}

export const collect = <A extends any>(
  object: A,
  options: CollectOptions = {}
): A => {
  options._ancestry = options._ancestry ?? ''
  options.relations = options.relations ?? []
  const collectable_fields = getFieldsForCollect(object, options)
  return touchAllFields<A>(object, collectable_fields, options)
}

function touchAllFields<A>(
  object: A,
  fields_to_touch: string[] = [],
  options: CollectOptions
) {
  return fields_to_touch.reduce((obj: A, fieldName: string) => {
    let value = object[fieldName]
    if (typeof value === 'function') {
      value = value()
    }
    if (isRecursableField(options, fieldName)) {
      obj[fieldName] = recurseAndCollect(value, fieldName, options)
    } else {
      obj[fieldName] = value
    }
    return obj
  }, {} as A)
}

export const collectAll = <A extends any>(
  objects: A[],
  options: CollectOptions = {}
): A[] => {
  return objects.map((x) => collect(x, options))
}

function isRecursableField(options: CollectOptions, field_name: string) {
  const potential_ancestry = extendAncestry(options._ancestry, field_name)
  return options.relations?.some((path) => {
    return path.startsWith(potential_ancestry)
  })
}

function extendAncestry(existing: string | undefined, field_name: string) {
  let ancestry: string
  if (existing == '' || typeof existing === 'undefined') {
    ancestry = field_name
  } else {
    ancestry = existing + '.' + field_name
  }
  return ancestry
}

function recurseAndCollect(
  object: any,
  fieldName: string,
  options: CollectOptions
) {
  const fields_to_collect: string[] = isObject(object)
    ? getFieldsForCollect(object, options)
    : []

  if (fields_to_collect.length) {
    const updated_options = trackAncestry(options, fieldName)
    return Array.isArray(object)
      ? collectAll(object, updated_options)
      : collect(object, updated_options)
  }
  return object
}

function trackAncestry(options: CollectOptions, field_name: string) {
  const new_ancestry = extendAncestry(options._ancestry, field_name)
  return {
    ...options,
    _ancestry: new_ancestry,
  }
}

function getFieldsForCollect(object: any, options: CollectOptions) {
  const fieldsObject = getFieldsObject(object)
  let accessibleFields: string[] = []
  if (fieldsObject) {
    accessibleFields = Object.keys(fieldsObject)
      .map((key) => fieldsObject![key])
      .filter((field) => autoIncludeFields(field, options))
      .map((field) => field.name)
  }
  return accessibleFields
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

function autoIncludeFields(field: FieldNode, options: CollectOptions) {
  const { name, ofNode } = field
  if (isTechnicallyRecursableFieldNode(ofNode)) {
    if (isRecursableField(options, name)) {
      return true
    }
  }
  if (options.type === 'mutation' && !isMutableReturningField(name)) {
    return false
  }
  if (name.endsWith('_aggregate')) {
    return false
  }
  if (name === '__typename') {
    return false
  }
  if (ofNode instanceof ScalarNode) {
    return true
  }
  return false
}

function isTechnicallyRecursableFieldNode(fieldNode: DataTrait) {
  return fieldNode instanceof ObjectNode || fieldNode instanceof ArrayNode
}
