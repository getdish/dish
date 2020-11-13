import { parseSchemaType } from '@dish/gqless'

import { scalarsEnumsHash } from '../graphql/new-generated'

const isSimpleField = (typeName: string) => {
  const { pureType } = parseSchemaType(typeName)
  return scalarsEnumsHash[pureType] || false
}

const isRelation = (typeName: string) => {
  const { pureType, isArray } = parseSchemaType(typeName)

  return !scalarsEnumsHash[pureType] || isArray
  // return field.ofNode instanceof ObjectNode || field.ofNode instanceof ArrayNode
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

export const isMutatableField = (fieldName: string, typeName: string) => {
  return (
    !FILTER_FIELDS[fieldName] &&
    !READ_ONLY_FIELDS[fieldName] &&
    (isSimpleField(typeName) || isRelation(typeName))
  )
}

export const isMutatableRelation = (fieldName: string, typeName: string) => {
  return isMutatableField(fieldName, typeName) && isRelation(typeName)
}

export const isMutableReturningField = (name: string) => {
  return !MUTATION_NON_RETURNING_FIELDS[name] && !FILTER_FIELDS[name]
}
