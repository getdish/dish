import {
  ArrayNode,
  FieldNode,
  ObjectNode,
  ScalarNode,
  UFieldsNode,
  getAccessor,
} from 'gqless'

export type CollectOptions = {
  fields?: string[]
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
  return (fields ?? []).reduce((acc, key) => {
    const val = object[key]
    if (typeof val === 'function') {
      acc[key] = val()
    } else {
      acc[key] = val
    }
    return acc
  }, {}) as A
}

export const collectAll = <A extends any>(
  objects: A[],
  options: CollectOptions = { maxDepth: 3 }
): A[] => {
  return objects.map((x) => collect(x, options))
}

function getFieldsFromAccessor(object: any, childKey?: string) {
  const accessor = getAccessor(object)
  const parentNode = accessor?.parent?.node
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
      // @ts-ignore
      fieldsObject = fieldsObject[childKey]?.ofNode?.fields ?? {}
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
