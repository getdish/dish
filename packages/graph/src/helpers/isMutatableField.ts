import { ArrayNode, FieldNode, ObjectNode, ScalarNode } from '@o/gqless'

const isSimpleField = (field: FieldNode) => {
  return field.ofNode instanceof ScalarNode && !field.args?.required
}

const isRelation = (field: FieldNode) => {
  return field.ofNode instanceof ObjectNode || field.ofNode instanceof ArrayNode
}

const FILTER_FIELDS = {
  __typename: true,
}

const COMPUTED_FIELDS = {
  is_open_now: true,
}

const READ_ONLY_FIELDS = {
  ...COMPUTED_FIELDS,
  created_at: true,
  updated_at: true,
}

const MUTATION_NON_RETURNING_FIELDS = {
  password: true,
  ...COMPUTED_FIELDS,
}

export const isMutatableField = (field: FieldNode) => {
  return (
    !FILTER_FIELDS[field.name] &&
    !READ_ONLY_FIELDS[field.name] &&
    (isSimpleField(field) || isRelation(field))
  )
}

export const isMutatableRelation = (field: FieldNode) => {
  return isMutatableField(field) && isRelation(field)
}

export const isMutableReturningField = (name: string) => {
  return !MUTATION_NON_RETURNING_FIELDS[name] && !FILTER_FIELDS[name]
}
