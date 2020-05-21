import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_String } from './String'

/**
 * @name __Directive
 * @type OBJECT
 */
export type t___Directive = FieldsType<
  {
    __typename: t_String<'__Directive'>
    args: t___InputValue[]
    description?: t_String | null
    locations: t___DirectiveLocation[]
    name: t_String
  },
  Extension<'__Directive'>
>

/**
 * @name __DirectiveLocation
 * @type ENUM
 */
export type t___DirectiveLocation = EnumType<
  | 'ARGUMENT_DEFINITION'
  | 'ENUM'
  | 'ENUM_VALUE'
  | 'FIELD'
  | 'FIELD_DEFINITION'
  | 'FRAGMENT_DEFINITION'
  | 'FRAGMENT_SPREAD'
  | 'INLINE_FRAGMENT'
  | 'INPUT_FIELD_DEFINITION'
  | 'INPUT_OBJECT'
  | 'INTERFACE'
  | 'MUTATION'
  | 'OBJECT'
  | 'QUERY'
  | 'SCALAR'
  | 'SCHEMA'
  | 'SUBSCRIPTION'
  | 'UNION'
>

/**
 * @name __EnumValue
 * @type OBJECT
 */
export type t___EnumValue = FieldsType<
  {
    __typename: t_String<'__EnumValue'>
    deprecationReason?: t_String | null
    description?: t_String | null
    isDeprecated: t_Boolean
    name: t_String
  },
  Extension<'__EnumValue'>
>

/**
 * @name __Field
 * @type OBJECT
 */
export type t___Field = FieldsType<
  {
    __typename: t_String<'__Field'>
    args: t___InputValue[]
    deprecationReason?: t_String | null
    description?: t_String | null
    isDeprecated: t_Boolean
    name: t_String
    type: t___Type
  },
  Extension<'__Field'>
>

/**
 * @name __InputValue
 * @type OBJECT
 */
export type t___InputValue = FieldsType<
  {
    __typename: t_String<'__InputValue'>
    defaultValue?: t_String | null
    description?: t_String | null
    name: t_String
    type: t___Type
  },
  Extension<'__InputValue'>
>

/**
 * @name __Schema
 * @type OBJECT
 */
export type t___Schema = FieldsType<
  {
    __typename: t_String<'__Schema'>
    directives: t___Directive[]
    mutationType?: t___Type | null
    queryType: t___Type
    subscriptionType?: t___Type | null
    types: t___Type[]
  },
  Extension<'__Schema'>
>

/**
 * @name __Type
 * @type OBJECT
 */
export type t___Type = FieldsType<
  {
    __typename: t_String<'__Type'>
    description?: t_String | null
    enumValues?: FieldsTypeArg<
      { includeDeprecated?: boolean | null },
      t___EnumValue[] | null
    >
    fields?: FieldsTypeArg<
      { includeDeprecated?: boolean | null },
      t___Field[] | null
    >
    inputFields?: t___InputValue[] | null
    interfaces?: t___Type[] | null
    kind: t___TypeKind
    name?: t_String | null
    ofType?: t___Type | null
    possibleTypes?: t___Type[] | null
  },
  Extension<'__Type'>
>

/**
 * @name __TypeKind
 * @type ENUM
 */
export type t___TypeKind = EnumType<
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'INTERFACE'
  | 'LIST'
  | 'NON_NULL'
  | 'OBJECT'
  | 'SCALAR'
  | 'UNION'
>

/**
 * @name __Directive
 * @type OBJECT
 */
export type __Directive = TypeData<t___Directive>

/**
 * @name __DirectiveLocation
 * @type ENUM
 */
export enum __DirectiveLocation {
  ARGUMENT_DEFINITION = 'ARGUMENT_DEFINITION',
  ENUM = 'ENUM',
  ENUM_VALUE = 'ENUM_VALUE',
  FIELD = 'FIELD',
  FIELD_DEFINITION = 'FIELD_DEFINITION',
  FRAGMENT_DEFINITION = 'FRAGMENT_DEFINITION',
  FRAGMENT_SPREAD = 'FRAGMENT_SPREAD',
  INLINE_FRAGMENT = 'INLINE_FRAGMENT',
  INPUT_FIELD_DEFINITION = 'INPUT_FIELD_DEFINITION',
  INPUT_OBJECT = 'INPUT_OBJECT',
  INTERFACE = 'INTERFACE',
  MUTATION = 'MUTATION',
  OBJECT = 'OBJECT',
  QUERY = 'QUERY',
  SCALAR = 'SCALAR',
  SCHEMA = 'SCHEMA',
  SUBSCRIPTION = 'SUBSCRIPTION',
  UNION = 'UNION',
}

/**
 * @name __EnumValue
 * @type OBJECT
 */
export type __EnumValue = TypeData<t___EnumValue>

/**
 * @name __Field
 * @type OBJECT
 */
export type __Field = TypeData<t___Field>

/**
 * @name __InputValue
 * @type OBJECT
 */
export type __InputValue = TypeData<t___InputValue>

/**
 * @name __Schema
 * @type OBJECT
 */
export type __Schema = TypeData<t___Schema>

/**
 * @name __Type
 * @type OBJECT
 */
export type __Type = TypeData<t___Type>

/**
 * @name __TypeKind
 * @type ENUM
 */
export enum __TypeKind {
  ENUM = 'ENUM',
  INPUT_OBJECT = 'INPUT_OBJECT',
  INTERFACE = 'INTERFACE',
  LIST = 'LIST',
  NON_NULL = 'NON_NULL',
  OBJECT = 'OBJECT',
  SCALAR = 'SCALAR',
  UNION = 'UNION',
}
