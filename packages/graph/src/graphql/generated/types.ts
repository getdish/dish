import {
  EnumType,
  FieldsType,
  FieldsTypeArg,
  ScalarType,
  TypeData,
} from '@o/gqless'

import * as extensions from '../extensions'

type Extension<TName extends string> = TName extends keyof typeof extensions
  ? typeof extensions[TName]
  : any

/**
 * @name Boolean
 * @type SCALAR
 */
type t_Boolean<T extends boolean = boolean> = ScalarType<
  T,
  Extension<'Boolean'>
>

/**
 * @name Boolean_comparison_exp
 * @type INPUT_OBJECT
 */
export type Boolean_comparison_exp = {
  _eq?: boolean | null
  _gt?: boolean | null
  _gte?: boolean | null
  _in?: boolean[] | null
  _is_null?: boolean | null
  _lt?: boolean | null
  _lte?: boolean | null
  _neq?: boolean | null
  _nin?: boolean[] | null
}

/**
 * @name Float
 * @type SCALAR
 */
type t_Float<T extends number = number> = ScalarType<T, Extension<'Float'>>

/**
 * @name ID
 * @type SCALAR
 */
type t_ID<T extends string = string> = ScalarType<T, Extension<'ID'>>

/**
 * @name Int
 * @type SCALAR
 */
type t_Int<T extends number = number> = ScalarType<T, Extension<'Int'>>

/**
 * @name Int_comparison_exp
 * @type INPUT_OBJECT
 */
export type Int_comparison_exp = {
  _eq?: number | null
  _gt?: number | null
  _gte?: number | null
  _in?: number[] | null
  _is_null?: boolean | null
  _lt?: number | null
  _lte?: number | null
  _neq?: number | null
  _nin?: number[] | null
}

/**
 * @name String
 * @type SCALAR
 */
type t_String<T extends string = string> = ScalarType<T, Extension<'String'>>

/**
 * @name String_comparison_exp
 * @type INPUT_OBJECT
 */
export type String_comparison_exp = {
  _eq?: string | null
  _gt?: string | null
  _gte?: string | null
  _ilike?: string | null
  _in?: string[] | null
  _is_null?: boolean | null
  _like?: string | null
  _lt?: string | null
  _lte?: string | null
  _neq?: string | null
  _nilike?: string | null
  _nin?: string[] | null
  _nlike?: string | null
  _nsimilar?: string | null
  _similar?: string | null
}

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
type t___DirectiveLocation = EnumType<
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
    enumValues: FieldsTypeArg<
      { includeDeprecated?: boolean | null },
      t___EnumValue[] | null
    >
    fields: FieldsTypeArg<
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
type t___TypeKind = EnumType<
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
 * @name geography
 * @type SCALAR
 */
type t_geography<T extends any = any> = ScalarType<T, Extension<'geography'>>

/**
 * @name geography_cast_exp
 * @type INPUT_OBJECT
 */
export type geography_cast_exp = { geometry?: geometry_comparison_exp | null }

/**
 * @name geography_comparison_exp
 * @type INPUT_OBJECT
 */
export type geography_comparison_exp = {
  _cast?: geography_cast_exp | null
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
  _st_d_within?: st_d_within_geography_input | null
  _st_intersects?: any | null
}

/**
 * @name geometry
 * @type SCALAR
 */
type t_geometry<T extends any = any> = ScalarType<T, Extension<'geometry'>>

/**
 * @name geometry_cast_exp
 * @type INPUT_OBJECT
 */
export type geometry_cast_exp = { geography?: geography_comparison_exp | null }

/**
 * @name geometry_comparison_exp
 * @type INPUT_OBJECT
 */
export type geometry_comparison_exp = {
  _cast?: geometry_cast_exp | null
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
  _st_contains?: any | null
  _st_crosses?: any | null
  _st_d_within?: st_d_within_input | null
  _st_equals?: any | null
  _st_intersects?: any | null
  _st_overlaps?: any | null
  _st_touches?: any | null
  _st_within?: any | null
}

/**
 * @name jsonb
 * @type SCALAR
 */
type t_jsonb<T extends any = any> = ScalarType<T, Extension<'jsonb'>>

/**
 * @name jsonb_comparison_exp
 * @type INPUT_OBJECT
 */
export type jsonb_comparison_exp = {
  _contained_in?: any | null
  _contains?: any | null
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _has_key?: string | null
  _has_keys_all?: string[] | null
  _has_keys_any?: string[] | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * @name menu_item
 * @type OBJECT
 */
export type t_menu_item = FieldsType<
  {
    __typename: t_String<'menu_item'>
    created_at: t_timestamptz
    description?: t_String | null
    id: t_uuid
    image?: t_String | null
    location?: t_geometry | null
    name: t_String
    price?: t_Int | null
    restaurant: t_restaurant
    restaurant_id: t_uuid
    updated_at: t_timestamptz
  },
  Extension<'menu_item'>
>

/**
 * @name menu_item_aggregate
 * @type OBJECT
 */
export type t_menu_item_aggregate = FieldsType<
  {
    __typename: t_String<'menu_item_aggregate'>
    aggregate?: t_menu_item_aggregate_fields | null
    nodes: t_menu_item[]
  },
  Extension<'menu_item_aggregate'>
>

/**
 * @name menu_item_aggregate_fields
 * @type OBJECT
 */
export type t_menu_item_aggregate_fields = FieldsType<
  {
    __typename: t_String<'menu_item_aggregate_fields'>
    avg?: t_menu_item_avg_fields | null
    count: FieldsTypeArg<
      { columns?: menu_item_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_menu_item_max_fields | null
    min?: t_menu_item_min_fields | null
    stddev?: t_menu_item_stddev_fields | null
    stddev_pop?: t_menu_item_stddev_pop_fields | null
    stddev_samp?: t_menu_item_stddev_samp_fields | null
    sum?: t_menu_item_sum_fields | null
    var_pop?: t_menu_item_var_pop_fields | null
    var_samp?: t_menu_item_var_samp_fields | null
    variance?: t_menu_item_variance_fields | null
  },
  Extension<'menu_item_aggregate_fields'>
>

/**
 * @name menu_item_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_aggregate_order_by = {
  avg?: menu_item_avg_order_by | null
  count?: order_by | null
  max?: menu_item_max_order_by | null
  min?: menu_item_min_order_by | null
  stddev?: menu_item_stddev_order_by | null
  stddev_pop?: menu_item_stddev_pop_order_by | null
  stddev_samp?: menu_item_stddev_samp_order_by | null
  sum?: menu_item_sum_order_by | null
  var_pop?: menu_item_var_pop_order_by | null
  var_samp?: menu_item_var_samp_order_by | null
  variance?: menu_item_variance_order_by | null
}

/**
 * @name menu_item_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type menu_item_arr_rel_insert_input = {
  data: menu_item_insert_input[]
  on_conflict?: menu_item_on_conflict | null
}

/**
 * @name menu_item_avg_fields
 * @type OBJECT
 */
export type t_menu_item_avg_fields = FieldsType<
  {
    __typename: t_String<'menu_item_avg_fields'>
    price?: t_Float | null
  },
  Extension<'menu_item_avg_fields'>
>

/**
 * @name menu_item_avg_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_avg_order_by = { price?: order_by | null }

/**
 * @name menu_item_bool_exp
 * @type INPUT_OBJECT
 */
export type menu_item_bool_exp = {
  _and?: (menu_item_bool_exp | null)[] | null
  _not?: menu_item_bool_exp | null
  _or?: (menu_item_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  image?: String_comparison_exp | null
  location?: geometry_comparison_exp | null
  name?: String_comparison_exp | null
  price?: Int_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * @name menu_item_constraint
 * @type ENUM
 */
type t_menu_item_constraint = EnumType<
  'menu_item_pkey' | 'menu_item_restaurant_id_name_key'
>

/**
 * @name menu_item_inc_input
 * @type INPUT_OBJECT
 */
export type menu_item_inc_input = { price?: number | null }

/**
 * @name menu_item_insert_input
 * @type INPUT_OBJECT
 */
export type menu_item_insert_input = {
  created_at?: any | null
  description?: string | null
  id?: any | null
  image?: string | null
  location?: any | null
  name?: string | null
  price?: number | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  updated_at?: any | null
}

/**
 * @name menu_item_max_fields
 * @type OBJECT
 */
export type t_menu_item_max_fields = FieldsType<
  {
    __typename: t_String<'menu_item_max_fields'>
    created_at?: t_timestamptz | null
    description?: t_String | null
    id?: t_uuid | null
    image?: t_String | null
    name?: t_String | null
    price?: t_Int | null
    restaurant_id?: t_uuid | null
    updated_at?: t_timestamptz | null
  },
  Extension<'menu_item_max_fields'>
>

/**
 * @name menu_item_max_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_max_order_by = {
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  image?: order_by | null
  name?: order_by | null
  price?: order_by | null
  restaurant_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name menu_item_min_fields
 * @type OBJECT
 */
export type t_menu_item_min_fields = FieldsType<
  {
    __typename: t_String<'menu_item_min_fields'>
    created_at?: t_timestamptz | null
    description?: t_String | null
    id?: t_uuid | null
    image?: t_String | null
    name?: t_String | null
    price?: t_Int | null
    restaurant_id?: t_uuid | null
    updated_at?: t_timestamptz | null
  },
  Extension<'menu_item_min_fields'>
>

/**
 * @name menu_item_min_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_min_order_by = {
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  image?: order_by | null
  name?: order_by | null
  price?: order_by | null
  restaurant_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name menu_item_mutation_response
 * @type OBJECT
 */
export type t_menu_item_mutation_response = FieldsType<
  {
    __typename: t_String<'menu_item_mutation_response'>
    affected_rows: t_Int
    returning: t_menu_item[]
  },
  Extension<'menu_item_mutation_response'>
>

/**
 * @name menu_item_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type menu_item_obj_rel_insert_input = {
  data: menu_item_insert_input
  on_conflict?: menu_item_on_conflict | null
}

/**
 * @name menu_item_on_conflict
 * @type INPUT_OBJECT
 */
export type menu_item_on_conflict = {
  constraint: menu_item_constraint
  update_columns: menu_item_update_column[]
  where?: menu_item_bool_exp | null
}

/**
 * @name menu_item_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_order_by = {
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  image?: order_by | null
  location?: order_by | null
  name?: order_by | null
  price?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name menu_item_pk_columns_input
 * @type INPUT_OBJECT
 */
export type menu_item_pk_columns_input = { id: any }

/**
 * @name menu_item_select_column
 * @type ENUM
 */
type t_menu_item_select_column = EnumType<
  | 'created_at'
  | 'description'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'price'
  | 'restaurant_id'
  | 'updated_at'
>

/**
 * @name menu_item_set_input
 * @type INPUT_OBJECT
 */
export type menu_item_set_input = {
  created_at?: any | null
  description?: string | null
  id?: any | null
  image?: string | null
  location?: any | null
  name?: string | null
  price?: number | null
  restaurant_id?: any | null
  updated_at?: any | null
}

/**
 * @name menu_item_stddev_fields
 * @type OBJECT
 */
export type t_menu_item_stddev_fields = FieldsType<
  {
    __typename: t_String<'menu_item_stddev_fields'>
    price?: t_Float | null
  },
  Extension<'menu_item_stddev_fields'>
>

/**
 * @name menu_item_stddev_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_stddev_order_by = { price?: order_by | null }

/**
 * @name menu_item_stddev_pop_fields
 * @type OBJECT
 */
export type t_menu_item_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'menu_item_stddev_pop_fields'>
    price?: t_Float | null
  },
  Extension<'menu_item_stddev_pop_fields'>
>

/**
 * @name menu_item_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_stddev_pop_order_by = { price?: order_by | null }

/**
 * @name menu_item_stddev_samp_fields
 * @type OBJECT
 */
export type t_menu_item_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'menu_item_stddev_samp_fields'>
    price?: t_Float | null
  },
  Extension<'menu_item_stddev_samp_fields'>
>

/**
 * @name menu_item_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_stddev_samp_order_by = { price?: order_by | null }

/**
 * @name menu_item_sum_fields
 * @type OBJECT
 */
export type t_menu_item_sum_fields = FieldsType<
  {
    __typename: t_String<'menu_item_sum_fields'>
    price?: t_Int | null
  },
  Extension<'menu_item_sum_fields'>
>

/**
 * @name menu_item_sum_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_sum_order_by = { price?: order_by | null }

/**
 * @name menu_item_update_column
 * @type ENUM
 */
type t_menu_item_update_column = EnumType<
  | 'created_at'
  | 'description'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'price'
  | 'restaurant_id'
  | 'updated_at'
>

/**
 * @name menu_item_var_pop_fields
 * @type OBJECT
 */
export type t_menu_item_var_pop_fields = FieldsType<
  {
    __typename: t_String<'menu_item_var_pop_fields'>
    price?: t_Float | null
  },
  Extension<'menu_item_var_pop_fields'>
>

/**
 * @name menu_item_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_var_pop_order_by = { price?: order_by | null }

/**
 * @name menu_item_var_samp_fields
 * @type OBJECT
 */
export type t_menu_item_var_samp_fields = FieldsType<
  {
    __typename: t_String<'menu_item_var_samp_fields'>
    price?: t_Float | null
  },
  Extension<'menu_item_var_samp_fields'>
>

/**
 * @name menu_item_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_var_samp_order_by = { price?: order_by | null }

/**
 * @name menu_item_variance_fields
 * @type OBJECT
 */
export type t_menu_item_variance_fields = FieldsType<
  {
    __typename: t_String<'menu_item_variance_fields'>
    price?: t_Float | null
  },
  Extension<'menu_item_variance_fields'>
>

/**
 * @name menu_item_variance_order_by
 * @type INPUT_OBJECT
 */
export type menu_item_variance_order_by = { price?: order_by | null }

/**
 * @name mutation_root
 * @type OBJECT
 */
export type t_mutation_root = FieldsType<
  {
    __typename: t_String<'mutation_root'>
    delete_menu_item: FieldsTypeArg<
      { where: menu_item_bool_exp },
      t_menu_item_mutation_response | null
    >
    delete_menu_item_by_pk: FieldsTypeArg<{ id: any }, t_menu_item | null>
    delete_opening_hours: FieldsTypeArg<
      { where: opening_hours_bool_exp },
      t_opening_hours_mutation_response | null
    >
    delete_opening_hours_by_pk: FieldsTypeArg<
      { id: any },
      t_opening_hours | null
    >
    delete_photo: FieldsTypeArg<
      { where: photo_bool_exp },
      t_photo_mutation_response | null
    >
    delete_photo_by_pk: FieldsTypeArg<{ id: any }, t_photo | null>
    delete_photo_xref: FieldsTypeArg<
      { where: photo_xref_bool_exp },
      t_photo_xref_mutation_response | null
    >
    delete_photo_xref_by_pk: FieldsTypeArg<{ id: any }, t_photo_xref | null>
    delete_restaurant: FieldsTypeArg<
      { where: restaurant_bool_exp },
      t_restaurant_mutation_response | null
    >
    delete_restaurant_by_pk: FieldsTypeArg<{ id: any }, t_restaurant | null>
    delete_restaurant_tag: FieldsTypeArg<
      { where: restaurant_tag_bool_exp },
      t_restaurant_tag_mutation_response | null
    >
    delete_restaurant_tag_by_pk: FieldsTypeArg<
      { restaurant_id: any; tag_id: any },
      t_restaurant_tag | null
    >
    delete_review: FieldsTypeArg<
      { where: review_bool_exp },
      t_review_mutation_response | null
    >
    delete_review_by_pk: FieldsTypeArg<{ id: any }, t_review | null>
    delete_review_tag_sentence: FieldsTypeArg<
      { where: review_tag_sentence_bool_exp },
      t_review_tag_sentence_mutation_response | null
    >
    delete_review_tag_sentence_by_pk: FieldsTypeArg<
      { id: any },
      t_review_tag_sentence | null
    >
    delete_setting: FieldsTypeArg<
      { where: setting_bool_exp },
      t_setting_mutation_response | null
    >
    delete_setting_by_pk: FieldsTypeArg<{ key: string }, t_setting | null>
    delete_tag: FieldsTypeArg<
      { where: tag_bool_exp },
      t_tag_mutation_response | null
    >
    delete_tag_by_pk: FieldsTypeArg<{ id: any }, t_tag | null>
    delete_tag_tag: FieldsTypeArg<
      { where: tag_tag_bool_exp },
      t_tag_tag_mutation_response | null
    >
    delete_tag_tag_by_pk: FieldsTypeArg<
      { category_tag_id: any; tag_id: any },
      t_tag_tag | null
    >
    delete_user: FieldsTypeArg<
      { where: user_bool_exp },
      t_user_mutation_response | null
    >
    delete_user_by_pk: FieldsTypeArg<{ id: any }, t_user | null>
    insert_menu_item: FieldsTypeArg<
      {
        objects: menu_item_insert_input[]
        on_conflict?: menu_item_on_conflict | null
      },
      t_menu_item_mutation_response | null
    >
    insert_menu_item_one: FieldsTypeArg<
      {
        object: menu_item_insert_input
        on_conflict?: menu_item_on_conflict | null
      },
      t_menu_item | null
    >
    insert_opening_hours: FieldsTypeArg<
      {
        objects: opening_hours_insert_input[]
        on_conflict?: opening_hours_on_conflict | null
      },
      t_opening_hours_mutation_response | null
    >
    insert_opening_hours_one: FieldsTypeArg<
      {
        object: opening_hours_insert_input
        on_conflict?: opening_hours_on_conflict | null
      },
      t_opening_hours | null
    >
    insert_photo: FieldsTypeArg<
      { objects: photo_insert_input[]; on_conflict?: photo_on_conflict | null },
      t_photo_mutation_response | null
    >
    insert_photo_one: FieldsTypeArg<
      { object: photo_insert_input; on_conflict?: photo_on_conflict | null },
      t_photo | null
    >
    insert_photo_xref: FieldsTypeArg<
      {
        objects: photo_xref_insert_input[]
        on_conflict?: photo_xref_on_conflict | null
      },
      t_photo_xref_mutation_response | null
    >
    insert_photo_xref_one: FieldsTypeArg<
      {
        object: photo_xref_insert_input
        on_conflict?: photo_xref_on_conflict | null
      },
      t_photo_xref | null
    >
    insert_restaurant: FieldsTypeArg<
      {
        objects: restaurant_insert_input[]
        on_conflict?: restaurant_on_conflict | null
      },
      t_restaurant_mutation_response | null
    >
    insert_restaurant_one: FieldsTypeArg<
      {
        object: restaurant_insert_input
        on_conflict?: restaurant_on_conflict | null
      },
      t_restaurant | null
    >
    insert_restaurant_tag: FieldsTypeArg<
      {
        objects: restaurant_tag_insert_input[]
        on_conflict?: restaurant_tag_on_conflict | null
      },
      t_restaurant_tag_mutation_response | null
    >
    insert_restaurant_tag_one: FieldsTypeArg<
      {
        object: restaurant_tag_insert_input
        on_conflict?: restaurant_tag_on_conflict | null
      },
      t_restaurant_tag | null
    >
    insert_review: FieldsTypeArg<
      {
        objects: review_insert_input[]
        on_conflict?: review_on_conflict | null
      },
      t_review_mutation_response | null
    >
    insert_review_one: FieldsTypeArg<
      { object: review_insert_input; on_conflict?: review_on_conflict | null },
      t_review | null
    >
    insert_review_tag_sentence: FieldsTypeArg<
      {
        objects: review_tag_sentence_insert_input[]
        on_conflict?: review_tag_sentence_on_conflict | null
      },
      t_review_tag_sentence_mutation_response | null
    >
    insert_review_tag_sentence_one: FieldsTypeArg<
      {
        object: review_tag_sentence_insert_input
        on_conflict?: review_tag_sentence_on_conflict | null
      },
      t_review_tag_sentence | null
    >
    insert_setting: FieldsTypeArg<
      {
        objects: setting_insert_input[]
        on_conflict?: setting_on_conflict | null
      },
      t_setting_mutation_response | null
    >
    insert_setting_one: FieldsTypeArg<
      {
        object: setting_insert_input
        on_conflict?: setting_on_conflict | null
      },
      t_setting | null
    >
    insert_tag: FieldsTypeArg<
      { objects: tag_insert_input[]; on_conflict?: tag_on_conflict | null },
      t_tag_mutation_response | null
    >
    insert_tag_one: FieldsTypeArg<
      { object: tag_insert_input; on_conflict?: tag_on_conflict | null },
      t_tag | null
    >
    insert_tag_tag: FieldsTypeArg<
      {
        objects: tag_tag_insert_input[]
        on_conflict?: tag_tag_on_conflict | null
      },
      t_tag_tag_mutation_response | null
    >
    insert_tag_tag_one: FieldsTypeArg<
      {
        object: tag_tag_insert_input
        on_conflict?: tag_tag_on_conflict | null
      },
      t_tag_tag | null
    >
    insert_user: FieldsTypeArg<
      { objects: user_insert_input[]; on_conflict?: user_on_conflict | null },
      t_user_mutation_response | null
    >
    insert_user_one: FieldsTypeArg<
      { object: user_insert_input; on_conflict?: user_on_conflict | null },
      t_user | null
    >
    update_menu_item: FieldsTypeArg<
      {
        _inc?: menu_item_inc_input | null
        _set?: menu_item_set_input | null
        where: menu_item_bool_exp
      },
      t_menu_item_mutation_response | null
    >
    update_menu_item_by_pk: FieldsTypeArg<
      {
        _inc?: menu_item_inc_input | null
        _set?: menu_item_set_input | null
        pk_columns: menu_item_pk_columns_input
      },
      t_menu_item | null
    >
    update_opening_hours: FieldsTypeArg<
      { _set?: opening_hours_set_input | null; where: opening_hours_bool_exp },
      t_opening_hours_mutation_response | null
    >
    update_opening_hours_by_pk: FieldsTypeArg<
      {
        _set?: opening_hours_set_input | null
        pk_columns: opening_hours_pk_columns_input
      },
      t_opening_hours | null
    >
    update_photo: FieldsTypeArg<
      {
        _inc?: photo_inc_input | null
        _set?: photo_set_input | null
        where: photo_bool_exp
      },
      t_photo_mutation_response | null
    >
    update_photo_by_pk: FieldsTypeArg<
      {
        _inc?: photo_inc_input | null
        _set?: photo_set_input | null
        pk_columns: photo_pk_columns_input
      },
      t_photo | null
    >
    update_photo_xref: FieldsTypeArg<
      { _set?: photo_xref_set_input | null; where: photo_xref_bool_exp },
      t_photo_xref_mutation_response | null
    >
    update_photo_xref_by_pk: FieldsTypeArg<
      {
        _set?: photo_xref_set_input | null
        pk_columns: photo_xref_pk_columns_input
      },
      t_photo_xref | null
    >
    update_restaurant: FieldsTypeArg<
      {
        _append?: restaurant_append_input | null
        _delete_at_path?: restaurant_delete_at_path_input | null
        _delete_elem?: restaurant_delete_elem_input | null
        _delete_key?: restaurant_delete_key_input | null
        _inc?: restaurant_inc_input | null
        _prepend?: restaurant_prepend_input | null
        _set?: restaurant_set_input | null
        where: restaurant_bool_exp
      },
      t_restaurant_mutation_response | null
    >
    update_restaurant_by_pk: FieldsTypeArg<
      {
        _append?: restaurant_append_input | null
        _delete_at_path?: restaurant_delete_at_path_input | null
        _delete_elem?: restaurant_delete_elem_input | null
        _delete_key?: restaurant_delete_key_input | null
        _inc?: restaurant_inc_input | null
        _prepend?: restaurant_prepend_input | null
        _set?: restaurant_set_input | null
        pk_columns: restaurant_pk_columns_input
      },
      t_restaurant | null
    >
    update_restaurant_tag: FieldsTypeArg<
      {
        _append?: restaurant_tag_append_input | null
        _delete_at_path?: restaurant_tag_delete_at_path_input | null
        _delete_elem?: restaurant_tag_delete_elem_input | null
        _delete_key?: restaurant_tag_delete_key_input | null
        _inc?: restaurant_tag_inc_input | null
        _prepend?: restaurant_tag_prepend_input | null
        _set?: restaurant_tag_set_input | null
        where: restaurant_tag_bool_exp
      },
      t_restaurant_tag_mutation_response | null
    >
    update_restaurant_tag_by_pk: FieldsTypeArg<
      {
        _append?: restaurant_tag_append_input | null
        _delete_at_path?: restaurant_tag_delete_at_path_input | null
        _delete_elem?: restaurant_tag_delete_elem_input | null
        _delete_key?: restaurant_tag_delete_key_input | null
        _inc?: restaurant_tag_inc_input | null
        _prepend?: restaurant_tag_prepend_input | null
        _set?: restaurant_tag_set_input | null
        pk_columns: restaurant_tag_pk_columns_input
      },
      t_restaurant_tag | null
    >
    update_review: FieldsTypeArg<
      {
        _append?: review_append_input | null
        _delete_at_path?: review_delete_at_path_input | null
        _delete_elem?: review_delete_elem_input | null
        _delete_key?: review_delete_key_input | null
        _inc?: review_inc_input | null
        _prepend?: review_prepend_input | null
        _set?: review_set_input | null
        where: review_bool_exp
      },
      t_review_mutation_response | null
    >
    update_review_by_pk: FieldsTypeArg<
      {
        _append?: review_append_input | null
        _delete_at_path?: review_delete_at_path_input | null
        _delete_elem?: review_delete_elem_input | null
        _delete_key?: review_delete_key_input | null
        _inc?: review_inc_input | null
        _prepend?: review_prepend_input | null
        _set?: review_set_input | null
        pk_columns: review_pk_columns_input
      },
      t_review | null
    >
    update_review_tag_sentence: FieldsTypeArg<
      {
        _inc?: review_tag_sentence_inc_input | null
        _set?: review_tag_sentence_set_input | null
        where: review_tag_sentence_bool_exp
      },
      t_review_tag_sentence_mutation_response | null
    >
    update_review_tag_sentence_by_pk: FieldsTypeArg<
      {
        _inc?: review_tag_sentence_inc_input | null
        _set?: review_tag_sentence_set_input | null
        pk_columns: review_tag_sentence_pk_columns_input
      },
      t_review_tag_sentence | null
    >
    update_setting: FieldsTypeArg<
      {
        _append?: setting_append_input | null
        _delete_at_path?: setting_delete_at_path_input | null
        _delete_elem?: setting_delete_elem_input | null
        _delete_key?: setting_delete_key_input | null
        _prepend?: setting_prepend_input | null
        _set?: setting_set_input | null
        where: setting_bool_exp
      },
      t_setting_mutation_response | null
    >
    update_setting_by_pk: FieldsTypeArg<
      {
        _append?: setting_append_input | null
        _delete_at_path?: setting_delete_at_path_input | null
        _delete_elem?: setting_delete_elem_input | null
        _delete_key?: setting_delete_key_input | null
        _prepend?: setting_prepend_input | null
        _set?: setting_set_input | null
        pk_columns: setting_pk_columns_input
      },
      t_setting | null
    >
    update_tag: FieldsTypeArg<
      {
        _append?: tag_append_input | null
        _delete_at_path?: tag_delete_at_path_input | null
        _delete_elem?: tag_delete_elem_input | null
        _delete_key?: tag_delete_key_input | null
        _inc?: tag_inc_input | null
        _prepend?: tag_prepend_input | null
        _set?: tag_set_input | null
        where: tag_bool_exp
      },
      t_tag_mutation_response | null
    >
    update_tag_by_pk: FieldsTypeArg<
      {
        _append?: tag_append_input | null
        _delete_at_path?: tag_delete_at_path_input | null
        _delete_elem?: tag_delete_elem_input | null
        _delete_key?: tag_delete_key_input | null
        _inc?: tag_inc_input | null
        _prepend?: tag_prepend_input | null
        _set?: tag_set_input | null
        pk_columns: tag_pk_columns_input
      },
      t_tag | null
    >
    update_tag_tag: FieldsTypeArg<
      { _set?: tag_tag_set_input | null; where: tag_tag_bool_exp },
      t_tag_tag_mutation_response | null
    >
    update_tag_tag_by_pk: FieldsTypeArg<
      { _set?: tag_tag_set_input | null; pk_columns: tag_tag_pk_columns_input },
      t_tag_tag | null
    >
    update_user: FieldsTypeArg<
      {
        _inc?: user_inc_input | null
        _set?: user_set_input | null
        where: user_bool_exp
      },
      t_user_mutation_response | null
    >
    update_user_by_pk: FieldsTypeArg<
      {
        _inc?: user_inc_input | null
        _set?: user_set_input | null
        pk_columns: user_pk_columns_input
      },
      t_user | null
    >
  },
  Extension<'mutation_root'>
>

/**
 * @name numeric
 * @type SCALAR
 */
type t_numeric<T extends any = any> = ScalarType<T, Extension<'numeric'>>

/**
 * @name numeric_comparison_exp
 * @type INPUT_OBJECT
 */
export type numeric_comparison_exp = {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * @name opening_hours
 * @type OBJECT
 */
export type t_opening_hours = FieldsType<
  {
    __typename: t_String<'opening_hours'>
    hours: t_tsrange
    id: t_uuid
    restaurant: t_restaurant
    restaurant_id: t_uuid
  },
  Extension<'opening_hours'>
>

/**
 * @name opening_hours_aggregate
 * @type OBJECT
 */
export type t_opening_hours_aggregate = FieldsType<
  {
    __typename: t_String<'opening_hours_aggregate'>
    aggregate?: t_opening_hours_aggregate_fields | null
    nodes: t_opening_hours[]
  },
  Extension<'opening_hours_aggregate'>
>

/**
 * @name opening_hours_aggregate_fields
 * @type OBJECT
 */
export type t_opening_hours_aggregate_fields = FieldsType<
  {
    __typename: t_String<'opening_hours_aggregate_fields'>
    count: FieldsTypeArg<
      {
        columns?: opening_hours_select_column[] | null
        distinct?: boolean | null
      },
      t_Int | null
    >
    max?: t_opening_hours_max_fields | null
    min?: t_opening_hours_min_fields | null
  },
  Extension<'opening_hours_aggregate_fields'>
>

/**
 * @name opening_hours_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type opening_hours_aggregate_order_by = {
  count?: order_by | null
  max?: opening_hours_max_order_by | null
  min?: opening_hours_min_order_by | null
}

/**
 * @name opening_hours_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type opening_hours_arr_rel_insert_input = {
  data: opening_hours_insert_input[]
  on_conflict?: opening_hours_on_conflict | null
}

/**
 * @name opening_hours_bool_exp
 * @type INPUT_OBJECT
 */
export type opening_hours_bool_exp = {
  _and?: (opening_hours_bool_exp | null)[] | null
  _not?: opening_hours_bool_exp | null
  _or?: (opening_hours_bool_exp | null)[] | null
  hours?: tsrange_comparison_exp | null
  id?: uuid_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
}

/**
 * @name opening_hours_constraint
 * @type ENUM
 */
type t_opening_hours_constraint = EnumType<'opening_hours_pkey'>

/**
 * @name opening_hours_insert_input
 * @type INPUT_OBJECT
 */
export type opening_hours_insert_input = {
  hours?: any | null
  id?: any | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
}

/**
 * @name opening_hours_max_fields
 * @type OBJECT
 */
export type t_opening_hours_max_fields = FieldsType<
  {
    __typename: t_String<'opening_hours_max_fields'>
    id?: t_uuid | null
    restaurant_id?: t_uuid | null
  },
  Extension<'opening_hours_max_fields'>
>

/**
 * @name opening_hours_max_order_by
 * @type INPUT_OBJECT
 */
export type opening_hours_max_order_by = {
  id?: order_by | null
  restaurant_id?: order_by | null
}

/**
 * @name opening_hours_min_fields
 * @type OBJECT
 */
export type t_opening_hours_min_fields = FieldsType<
  {
    __typename: t_String<'opening_hours_min_fields'>
    id?: t_uuid | null
    restaurant_id?: t_uuid | null
  },
  Extension<'opening_hours_min_fields'>
>

/**
 * @name opening_hours_min_order_by
 * @type INPUT_OBJECT
 */
export type opening_hours_min_order_by = {
  id?: order_by | null
  restaurant_id?: order_by | null
}

/**
 * @name opening_hours_mutation_response
 * @type OBJECT
 */
export type t_opening_hours_mutation_response = FieldsType<
  {
    __typename: t_String<'opening_hours_mutation_response'>
    affected_rows: t_Int
    returning: t_opening_hours[]
  },
  Extension<'opening_hours_mutation_response'>
>

/**
 * @name opening_hours_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type opening_hours_obj_rel_insert_input = {
  data: opening_hours_insert_input
  on_conflict?: opening_hours_on_conflict | null
}

/**
 * @name opening_hours_on_conflict
 * @type INPUT_OBJECT
 */
export type opening_hours_on_conflict = {
  constraint: opening_hours_constraint
  update_columns: opening_hours_update_column[]
  where?: opening_hours_bool_exp | null
}

/**
 * @name opening_hours_order_by
 * @type INPUT_OBJECT
 */
export type opening_hours_order_by = {
  hours?: order_by | null
  id?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
}

/**
 * @name opening_hours_pk_columns_input
 * @type INPUT_OBJECT
 */
export type opening_hours_pk_columns_input = { id: any }

/**
 * @name opening_hours_select_column
 * @type ENUM
 */
type t_opening_hours_select_column = EnumType<'hours' | 'id' | 'restaurant_id'>

/**
 * @name opening_hours_set_input
 * @type INPUT_OBJECT
 */
export type opening_hours_set_input = {
  hours?: any | null
  id?: any | null
  restaurant_id?: any | null
}

/**
 * @name opening_hours_update_column
 * @type ENUM
 */
type t_opening_hours_update_column = EnumType<'hours' | 'id' | 'restaurant_id'>

/**
 * @name order_by
 * @type ENUM
 */
type t_order_by = EnumType<
  | 'asc'
  | 'asc_nulls_first'
  | 'asc_nulls_last'
  | 'desc'
  | 'desc_nulls_first'
  | 'desc_nulls_last'
>

/**
 * @name photo
 * @type OBJECT
 */
export type t_photo = FieldsType<
  {
    __typename: t_String<'photo'>
    created_at: t_timestamptz
    id: t_uuid
    origin?: t_String | null
    quality?: t_numeric | null
    updated_at: t_timestamptz
    url?: t_String | null
  },
  Extension<'photo'>
>

/**
 * @name photo_aggregate
 * @type OBJECT
 */
export type t_photo_aggregate = FieldsType<
  {
    __typename: t_String<'photo_aggregate'>
    aggregate?: t_photo_aggregate_fields | null
    nodes: t_photo[]
  },
  Extension<'photo_aggregate'>
>

/**
 * @name photo_aggregate_fields
 * @type OBJECT
 */
export type t_photo_aggregate_fields = FieldsType<
  {
    __typename: t_String<'photo_aggregate_fields'>
    avg?: t_photo_avg_fields | null
    count: FieldsTypeArg<
      { columns?: photo_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_photo_max_fields | null
    min?: t_photo_min_fields | null
    stddev?: t_photo_stddev_fields | null
    stddev_pop?: t_photo_stddev_pop_fields | null
    stddev_samp?: t_photo_stddev_samp_fields | null
    sum?: t_photo_sum_fields | null
    var_pop?: t_photo_var_pop_fields | null
    var_samp?: t_photo_var_samp_fields | null
    variance?: t_photo_variance_fields | null
  },
  Extension<'photo_aggregate_fields'>
>

/**
 * @name photo_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type photo_aggregate_order_by = {
  avg?: photo_avg_order_by | null
  count?: order_by | null
  max?: photo_max_order_by | null
  min?: photo_min_order_by | null
  stddev?: photo_stddev_order_by | null
  stddev_pop?: photo_stddev_pop_order_by | null
  stddev_samp?: photo_stddev_samp_order_by | null
  sum?: photo_sum_order_by | null
  var_pop?: photo_var_pop_order_by | null
  var_samp?: photo_var_samp_order_by | null
  variance?: photo_variance_order_by | null
}

/**
 * @name photo_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type photo_arr_rel_insert_input = {
  data: photo_insert_input[]
  on_conflict?: photo_on_conflict | null
}

/**
 * @name photo_avg_fields
 * @type OBJECT
 */
export type t_photo_avg_fields = FieldsType<
  {
    __typename: t_String<'photo_avg_fields'>
    quality?: t_Float | null
  },
  Extension<'photo_avg_fields'>
>

/**
 * @name photo_avg_order_by
 * @type INPUT_OBJECT
 */
export type photo_avg_order_by = { quality?: order_by | null }

/**
 * @name photo_bool_exp
 * @type INPUT_OBJECT
 */
export type photo_bool_exp = {
  _and?: (photo_bool_exp | null)[] | null
  _not?: photo_bool_exp | null
  _or?: (photo_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  origin?: String_comparison_exp | null
  quality?: numeric_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  url?: String_comparison_exp | null
}

/**
 * @name photo_constraint
 * @type ENUM
 */
type t_photo_constraint = EnumType<
  'photo_origin_key' | 'photo_url_key' | 'photos_pkey'
>

/**
 * @name photo_inc_input
 * @type INPUT_OBJECT
 */
export type photo_inc_input = { quality?: any | null }

/**
 * @name photo_insert_input
 * @type INPUT_OBJECT
 */
export type photo_insert_input = {
  created_at?: any | null
  id?: any | null
  origin?: string | null
  quality?: any | null
  updated_at?: any | null
  url?: string | null
}

/**
 * @name photo_max_fields
 * @type OBJECT
 */
export type t_photo_max_fields = FieldsType<
  {
    __typename: t_String<'photo_max_fields'>
    created_at?: t_timestamptz | null
    id?: t_uuid | null
    origin?: t_String | null
    quality?: t_numeric | null
    updated_at?: t_timestamptz | null
    url?: t_String | null
  },
  Extension<'photo_max_fields'>
>

/**
 * @name photo_max_order_by
 * @type INPUT_OBJECT
 */
export type photo_max_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  origin?: order_by | null
  quality?: order_by | null
  updated_at?: order_by | null
  url?: order_by | null
}

/**
 * @name photo_min_fields
 * @type OBJECT
 */
export type t_photo_min_fields = FieldsType<
  {
    __typename: t_String<'photo_min_fields'>
    created_at?: t_timestamptz | null
    id?: t_uuid | null
    origin?: t_String | null
    quality?: t_numeric | null
    updated_at?: t_timestamptz | null
    url?: t_String | null
  },
  Extension<'photo_min_fields'>
>

/**
 * @name photo_min_order_by
 * @type INPUT_OBJECT
 */
export type photo_min_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  origin?: order_by | null
  quality?: order_by | null
  updated_at?: order_by | null
  url?: order_by | null
}

/**
 * @name photo_mutation_response
 * @type OBJECT
 */
export type t_photo_mutation_response = FieldsType<
  {
    __typename: t_String<'photo_mutation_response'>
    affected_rows: t_Int
    returning: t_photo[]
  },
  Extension<'photo_mutation_response'>
>

/**
 * @name photo_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type photo_obj_rel_insert_input = {
  data: photo_insert_input
  on_conflict?: photo_on_conflict | null
}

/**
 * @name photo_on_conflict
 * @type INPUT_OBJECT
 */
export type photo_on_conflict = {
  constraint: photo_constraint
  update_columns: photo_update_column[]
  where?: photo_bool_exp | null
}

/**
 * @name photo_order_by
 * @type INPUT_OBJECT
 */
export type photo_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  origin?: order_by | null
  quality?: order_by | null
  updated_at?: order_by | null
  url?: order_by | null
}

/**
 * @name photo_pk_columns_input
 * @type INPUT_OBJECT
 */
export type photo_pk_columns_input = { id: any }

/**
 * @name photo_select_column
 * @type ENUM
 */
type t_photo_select_column = EnumType<
  'created_at' | 'id' | 'origin' | 'quality' | 'updated_at' | 'url'
>

/**
 * @name photo_set_input
 * @type INPUT_OBJECT
 */
export type photo_set_input = {
  created_at?: any | null
  id?: any | null
  origin?: string | null
  quality?: any | null
  updated_at?: any | null
  url?: string | null
}

/**
 * @name photo_stddev_fields
 * @type OBJECT
 */
export type t_photo_stddev_fields = FieldsType<
  {
    __typename: t_String<'photo_stddev_fields'>
    quality?: t_Float | null
  },
  Extension<'photo_stddev_fields'>
>

/**
 * @name photo_stddev_order_by
 * @type INPUT_OBJECT
 */
export type photo_stddev_order_by = { quality?: order_by | null }

/**
 * @name photo_stddev_pop_fields
 * @type OBJECT
 */
export type t_photo_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'photo_stddev_pop_fields'>
    quality?: t_Float | null
  },
  Extension<'photo_stddev_pop_fields'>
>

/**
 * @name photo_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type photo_stddev_pop_order_by = { quality?: order_by | null }

/**
 * @name photo_stddev_samp_fields
 * @type OBJECT
 */
export type t_photo_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'photo_stddev_samp_fields'>
    quality?: t_Float | null
  },
  Extension<'photo_stddev_samp_fields'>
>

/**
 * @name photo_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type photo_stddev_samp_order_by = { quality?: order_by | null }

/**
 * @name photo_sum_fields
 * @type OBJECT
 */
export type t_photo_sum_fields = FieldsType<
  {
    __typename: t_String<'photo_sum_fields'>
    quality?: t_numeric | null
  },
  Extension<'photo_sum_fields'>
>

/**
 * @name photo_sum_order_by
 * @type INPUT_OBJECT
 */
export type photo_sum_order_by = { quality?: order_by | null }

/**
 * @name photo_update_column
 * @type ENUM
 */
type t_photo_update_column = EnumType<
  'created_at' | 'id' | 'origin' | 'quality' | 'updated_at' | 'url'
>

/**
 * @name photo_var_pop_fields
 * @type OBJECT
 */
export type t_photo_var_pop_fields = FieldsType<
  {
    __typename: t_String<'photo_var_pop_fields'>
    quality?: t_Float | null
  },
  Extension<'photo_var_pop_fields'>
>

/**
 * @name photo_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type photo_var_pop_order_by = { quality?: order_by | null }

/**
 * @name photo_var_samp_fields
 * @type OBJECT
 */
export type t_photo_var_samp_fields = FieldsType<
  {
    __typename: t_String<'photo_var_samp_fields'>
    quality?: t_Float | null
  },
  Extension<'photo_var_samp_fields'>
>

/**
 * @name photo_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type photo_var_samp_order_by = { quality?: order_by | null }

/**
 * @name photo_variance_fields
 * @type OBJECT
 */
export type t_photo_variance_fields = FieldsType<
  {
    __typename: t_String<'photo_variance_fields'>
    quality?: t_Float | null
  },
  Extension<'photo_variance_fields'>
>

/**
 * @name photo_variance_order_by
 * @type INPUT_OBJECT
 */
export type photo_variance_order_by = { quality?: order_by | null }

/**
 * @name photo_xref
 * @type OBJECT
 */
export type t_photo_xref = FieldsType<
  {
    __typename: t_String<'photo_xref'>
    id: t_uuid
    photo: t_photo
    photo_id: t_uuid
    restaurant_id: t_uuid
    tag_id: t_uuid
    type?: t_String | null
  },
  Extension<'photo_xref'>
>

/**
 * @name photo_xref_aggregate
 * @type OBJECT
 */
export type t_photo_xref_aggregate = FieldsType<
  {
    __typename: t_String<'photo_xref_aggregate'>
    aggregate?: t_photo_xref_aggregate_fields | null
    nodes: t_photo_xref[]
  },
  Extension<'photo_xref_aggregate'>
>

/**
 * @name photo_xref_aggregate_fields
 * @type OBJECT
 */
export type t_photo_xref_aggregate_fields = FieldsType<
  {
    __typename: t_String<'photo_xref_aggregate_fields'>
    count: FieldsTypeArg<
      {
        columns?: photo_xref_select_column[] | null
        distinct?: boolean | null
      },
      t_Int | null
    >
    max?: t_photo_xref_max_fields | null
    min?: t_photo_xref_min_fields | null
  },
  Extension<'photo_xref_aggregate_fields'>
>

/**
 * @name photo_xref_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type photo_xref_aggregate_order_by = {
  count?: order_by | null
  max?: photo_xref_max_order_by | null
  min?: photo_xref_min_order_by | null
}

/**
 * @name photo_xref_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type photo_xref_arr_rel_insert_input = {
  data: photo_xref_insert_input[]
  on_conflict?: photo_xref_on_conflict | null
}

/**
 * @name photo_xref_bool_exp
 * @type INPUT_OBJECT
 */
export type photo_xref_bool_exp = {
  _and?: (photo_xref_bool_exp | null)[] | null
  _not?: photo_xref_bool_exp | null
  _or?: (photo_xref_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  photo?: photo_bool_exp | null
  photo_id?: uuid_comparison_exp | null
  restaurant_id?: uuid_comparison_exp | null
  tag_id?: uuid_comparison_exp | null
  type?: String_comparison_exp | null
}

/**
 * @name photo_xref_constraint
 * @type ENUM
 */
type t_photo_xref_constraint = EnumType<
  'photos_xref_photos_id_restaurant_id_tag_id_key' | 'photos_xref_pkey'
>

/**
 * @name photo_xref_insert_input
 * @type INPUT_OBJECT
 */
export type photo_xref_insert_input = {
  id?: any | null
  photo?: photo_obj_rel_insert_input | null
  photo_id?: any | null
  restaurant_id?: any | null
  tag_id?: any | null
  type?: string | null
}

/**
 * @name photo_xref_max_fields
 * @type OBJECT
 */
export type t_photo_xref_max_fields = FieldsType<
  {
    __typename: t_String<'photo_xref_max_fields'>
    id?: t_uuid | null
    photo_id?: t_uuid | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
    type?: t_String | null
  },
  Extension<'photo_xref_max_fields'>
>

/**
 * @name photo_xref_max_order_by
 * @type INPUT_OBJECT
 */
export type photo_xref_max_order_by = {
  id?: order_by | null
  photo_id?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  type?: order_by | null
}

/**
 * @name photo_xref_min_fields
 * @type OBJECT
 */
export type t_photo_xref_min_fields = FieldsType<
  {
    __typename: t_String<'photo_xref_min_fields'>
    id?: t_uuid | null
    photo_id?: t_uuid | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
    type?: t_String | null
  },
  Extension<'photo_xref_min_fields'>
>

/**
 * @name photo_xref_min_order_by
 * @type INPUT_OBJECT
 */
export type photo_xref_min_order_by = {
  id?: order_by | null
  photo_id?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  type?: order_by | null
}

/**
 * @name photo_xref_mutation_response
 * @type OBJECT
 */
export type t_photo_xref_mutation_response = FieldsType<
  {
    __typename: t_String<'photo_xref_mutation_response'>
    affected_rows: t_Int
    returning: t_photo_xref[]
  },
  Extension<'photo_xref_mutation_response'>
>

/**
 * @name photo_xref_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type photo_xref_obj_rel_insert_input = {
  data: photo_xref_insert_input
  on_conflict?: photo_xref_on_conflict | null
}

/**
 * @name photo_xref_on_conflict
 * @type INPUT_OBJECT
 */
export type photo_xref_on_conflict = {
  constraint: photo_xref_constraint
  update_columns: photo_xref_update_column[]
  where?: photo_xref_bool_exp | null
}

/**
 * @name photo_xref_order_by
 * @type INPUT_OBJECT
 */
export type photo_xref_order_by = {
  id?: order_by | null
  photo?: photo_order_by | null
  photo_id?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  type?: order_by | null
}

/**
 * @name photo_xref_pk_columns_input
 * @type INPUT_OBJECT
 */
export type photo_xref_pk_columns_input = { id: any }

/**
 * @name photo_xref_select_column
 * @type ENUM
 */
type t_photo_xref_select_column = EnumType<
  'id' | 'photo_id' | 'restaurant_id' | 'tag_id' | 'type'
>

/**
 * @name photo_xref_set_input
 * @type INPUT_OBJECT
 */
export type photo_xref_set_input = {
  id?: any | null
  photo_id?: any | null
  restaurant_id?: any | null
  tag_id?: any | null
  type?: string | null
}

/**
 * @name photo_xref_update_column
 * @type ENUM
 */
type t_photo_xref_update_column = EnumType<
  'id' | 'photo_id' | 'restaurant_id' | 'tag_id' | 'type'
>

/**
 * @name query_root
 * @type OBJECT
 */
export type t_query_root = FieldsType<
  {
    __typename: t_String<'query_root'>
    menu_item: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item[]
    >
    menu_item_aggregate: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item_aggregate
    >
    menu_item_by_pk: FieldsTypeArg<{ id: any }, t_menu_item | null>
    opening_hours: FieldsTypeArg<
      {
        distinct_on?: opening_hours_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: opening_hours_order_by[] | null
        where?: opening_hours_bool_exp | null
      },
      t_opening_hours[]
    >
    opening_hours_aggregate: FieldsTypeArg<
      {
        distinct_on?: opening_hours_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: opening_hours_order_by[] | null
        where?: opening_hours_bool_exp | null
      },
      t_opening_hours_aggregate
    >
    opening_hours_by_pk: FieldsTypeArg<{ id: any }, t_opening_hours | null>
    photo: FieldsTypeArg<
      {
        distinct_on?: photo_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photo_order_by[] | null
        where?: photo_bool_exp | null
      },
      t_photo[]
    >
    photo_aggregate: FieldsTypeArg<
      {
        distinct_on?: photo_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photo_order_by[] | null
        where?: photo_bool_exp | null
      },
      t_photo_aggregate
    >
    photo_by_pk: FieldsTypeArg<{ id: any }, t_photo | null>
    photo_xref: FieldsTypeArg<
      {
        distinct_on?: photo_xref_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photo_xref_order_by[] | null
        where?: photo_xref_bool_exp | null
      },
      t_photo_xref[]
    >
    photo_xref_aggregate: FieldsTypeArg<
      {
        distinct_on?: photo_xref_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photo_xref_order_by[] | null
        where?: photo_xref_bool_exp | null
      },
      t_photo_xref_aggregate
    >
    photo_xref_by_pk: FieldsTypeArg<{ id: any }, t_photo_xref | null>
    restaurant: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant[]
    >
    restaurant_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant_aggregate
    >
    restaurant_by_pk: FieldsTypeArg<{ id: any }, t_restaurant | null>
    restaurant_tag: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag[]
    >
    restaurant_tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag_aggregate
    >
    restaurant_tag_by_pk: FieldsTypeArg<
      { restaurant_id: any; tag_id: any },
      t_restaurant_tag | null
    >
    review: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    review_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review_aggregate
    >
    review_by_pk: FieldsTypeArg<{ id: any }, t_review | null>
    review_tag_sentence: FieldsTypeArg<
      {
        distinct_on?: review_tag_sentence_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_sentence_order_by[] | null
        where?: review_tag_sentence_bool_exp | null
      },
      t_review_tag_sentence[]
    >
    review_tag_sentence_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_tag_sentence_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_sentence_order_by[] | null
        where?: review_tag_sentence_bool_exp | null
      },
      t_review_tag_sentence_aggregate
    >
    review_tag_sentence_by_pk: FieldsTypeArg<
      { id: any },
      t_review_tag_sentence | null
    >
    setting: FieldsTypeArg<
      {
        distinct_on?: setting_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: setting_order_by[] | null
        where?: setting_bool_exp | null
      },
      t_setting[]
    >
    setting_aggregate: FieldsTypeArg<
      {
        distinct_on?: setting_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: setting_order_by[] | null
        where?: setting_bool_exp | null
      },
      t_setting_aggregate
    >
    setting_by_pk: FieldsTypeArg<{ key: string }, t_setting | null>
    tag: FieldsTypeArg<
      {
        distinct_on?: tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_order_by[] | null
        where?: tag_bool_exp | null
      },
      t_tag[]
    >
    tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_order_by[] | null
        where?: tag_bool_exp | null
      },
      t_tag_aggregate
    >
    tag_by_pk: FieldsTypeArg<{ id: any }, t_tag | null>
    tag_tag: FieldsTypeArg<
      {
        distinct_on?: tag_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_tag_order_by[] | null
        where?: tag_tag_bool_exp | null
      },
      t_tag_tag[]
    >
    tag_tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: tag_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_tag_order_by[] | null
        where?: tag_tag_bool_exp | null
      },
      t_tag_tag_aggregate
    >
    tag_tag_by_pk: FieldsTypeArg<
      { category_tag_id: any; tag_id: any },
      t_tag_tag | null
    >
    user: FieldsTypeArg<
      {
        distinct_on?: user_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: user_order_by[] | null
        where?: user_bool_exp | null
      },
      t_user[]
    >
    user_aggregate: FieldsTypeArg<
      {
        distinct_on?: user_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: user_order_by[] | null
        where?: user_bool_exp | null
      },
      t_user_aggregate
    >
    user_by_pk: FieldsTypeArg<{ id: any }, t_user | null>
  },
  Extension<'query_root'>
>

/**
 * @name restaurant
 * @type OBJECT
 */
export type t_restaurant = FieldsType<
  {
    __typename: t_String<'restaurant'>
    address?: t_String | null
    city?: t_String | null
    created_at: t_timestamptz
    description?: t_String | null
    downvotes?: t_numeric | null
    geocoder_id?: t_String | null
    headlines: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    hours: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    id: t_uuid
    image?: t_String | null
    is_open_now?: t_Boolean | null
    location: t_geometry
    menu_items: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item[]
    >
    menu_items_aggregate: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item_aggregate
    >
    name: t_String
    oldest_review_date?: t_timestamptz | null
    photos: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    price_range?: t_String | null
    rating?: t_numeric | null
    rating_factors: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    reviews: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    reviews_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review_aggregate
    >
    score?: t_numeric | null
    score_breakdown: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    slug: t_String
    source_breakdown: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    sources: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    state?: t_String | null
    summary?: t_String | null
    tag_names: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    tags: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag[]
    >
    tags_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag_aggregate
    >
    telephone?: t_String | null
    top_tags: FieldsTypeArg<
      {
        args: restaurant_top_tags_args
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag[] | null
    >
    updated_at: t_timestamptz
    upvotes?: t_numeric | null
    votes_ratio?: t_numeric | null
    website?: t_String | null
    zip?: t_numeric | null
  },
  Extension<'restaurant'>
>

/**
 * @name restaurant_aggregate
 * @type OBJECT
 */
export type t_restaurant_aggregate = FieldsType<
  {
    __typename: t_String<'restaurant_aggregate'>
    aggregate?: t_restaurant_aggregate_fields | null
    nodes: t_restaurant[]
  },
  Extension<'restaurant_aggregate'>
>

/**
 * @name restaurant_aggregate_fields
 * @type OBJECT
 */
export type t_restaurant_aggregate_fields = FieldsType<
  {
    __typename: t_String<'restaurant_aggregate_fields'>
    avg?: t_restaurant_avg_fields | null
    count: FieldsTypeArg<
      {
        columns?: restaurant_select_column[] | null
        distinct?: boolean | null
      },
      t_Int | null
    >
    max?: t_restaurant_max_fields | null
    min?: t_restaurant_min_fields | null
    stddev?: t_restaurant_stddev_fields | null
    stddev_pop?: t_restaurant_stddev_pop_fields | null
    stddev_samp?: t_restaurant_stddev_samp_fields | null
    sum?: t_restaurant_sum_fields | null
    var_pop?: t_restaurant_var_pop_fields | null
    var_samp?: t_restaurant_var_samp_fields | null
    variance?: t_restaurant_variance_fields | null
  },
  Extension<'restaurant_aggregate_fields'>
>

/**
 * @name restaurant_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_aggregate_order_by = {
  avg?: restaurant_avg_order_by | null
  count?: order_by | null
  max?: restaurant_max_order_by | null
  min?: restaurant_min_order_by | null
  stddev?: restaurant_stddev_order_by | null
  stddev_pop?: restaurant_stddev_pop_order_by | null
  stddev_samp?: restaurant_stddev_samp_order_by | null
  sum?: restaurant_sum_order_by | null
  var_pop?: restaurant_var_pop_order_by | null
  var_samp?: restaurant_var_samp_order_by | null
  variance?: restaurant_variance_order_by | null
}

/**
 * @name restaurant_append_input
 * @type INPUT_OBJECT
 */
export type restaurant_append_input = {
  headlines?: any | null
  hours?: any | null
  photos?: any | null
  rating_factors?: any | null
  score_breakdown?: any | null
  source_breakdown?: any | null
  sources?: any | null
  tag_names?: any | null
}

/**
 * @name restaurant_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_arr_rel_insert_input = {
  data: restaurant_insert_input[]
  on_conflict?: restaurant_on_conflict | null
}

/**
 * @name restaurant_avg_fields
 * @type OBJECT
 */
export type t_restaurant_avg_fields = FieldsType<
  {
    __typename: t_String<'restaurant_avg_fields'>
    downvotes?: t_Float | null
    rating?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_avg_fields'>
>

/**
 * @name restaurant_avg_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_avg_order_by = {
  downvotes?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_bool_exp
 * @type INPUT_OBJECT
 */
export type restaurant_bool_exp = {
  _and?: (restaurant_bool_exp | null)[] | null
  _not?: restaurant_bool_exp | null
  _or?: (restaurant_bool_exp | null)[] | null
  address?: String_comparison_exp | null
  city?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  downvotes?: numeric_comparison_exp | null
  geocoder_id?: String_comparison_exp | null
  headlines?: jsonb_comparison_exp | null
  hours?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  image?: String_comparison_exp | null
  location?: geometry_comparison_exp | null
  menu_items?: menu_item_bool_exp | null
  name?: String_comparison_exp | null
  oldest_review_date?: timestamptz_comparison_exp | null
  photos?: jsonb_comparison_exp | null
  price_range?: String_comparison_exp | null
  rating?: numeric_comparison_exp | null
  rating_factors?: jsonb_comparison_exp | null
  reviews?: review_bool_exp | null
  score?: numeric_comparison_exp | null
  score_breakdown?: jsonb_comparison_exp | null
  slug?: String_comparison_exp | null
  source_breakdown?: jsonb_comparison_exp | null
  sources?: jsonb_comparison_exp | null
  state?: String_comparison_exp | null
  summary?: String_comparison_exp | null
  tag_names?: jsonb_comparison_exp | null
  tags?: restaurant_tag_bool_exp | null
  telephone?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  upvotes?: numeric_comparison_exp | null
  votes_ratio?: numeric_comparison_exp | null
  website?: String_comparison_exp | null
  zip?: numeric_comparison_exp | null
}

/**
 * @name restaurant_constraint
 * @type ENUM
 */
type t_restaurant_constraint = EnumType<
  | 'restaurant_geocoder_id_key'
  | 'restaurant_name_address_key'
  | 'restaurant_pkey'
  | 'restaurant_slug_key'
>

/**
 * @name restaurant_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_at_path_input = {
  headlines?: (string | null)[] | null
  hours?: (string | null)[] | null
  photos?: (string | null)[] | null
  rating_factors?: (string | null)[] | null
  score_breakdown?: (string | null)[] | null
  source_breakdown?: (string | null)[] | null
  sources?: (string | null)[] | null
  tag_names?: (string | null)[] | null
}

/**
 * @name restaurant_delete_elem_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_elem_input = {
  headlines?: number | null
  hours?: number | null
  photos?: number | null
  rating_factors?: number | null
  score_breakdown?: number | null
  source_breakdown?: number | null
  sources?: number | null
  tag_names?: number | null
}

/**
 * @name restaurant_delete_key_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_key_input = {
  headlines?: string | null
  hours?: string | null
  photos?: string | null
  rating_factors?: string | null
  score_breakdown?: string | null
  source_breakdown?: string | null
  sources?: string | null
  tag_names?: string | null
}

/**
 * @name restaurant_inc_input
 * @type INPUT_OBJECT
 */
export type restaurant_inc_input = {
  downvotes?: any | null
  rating?: any | null
  score?: any | null
  upvotes?: any | null
  votes_ratio?: any | null
  zip?: any | null
}

/**
 * @name restaurant_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_insert_input = {
  address?: string | null
  city?: string | null
  created_at?: any | null
  description?: string | null
  downvotes?: any | null
  geocoder_id?: string | null
  headlines?: any | null
  hours?: any | null
  id?: any | null
  image?: string | null
  location?: any | null
  menu_items?: menu_item_arr_rel_insert_input | null
  name?: string | null
  oldest_review_date?: any | null
  photos?: any | null
  price_range?: string | null
  rating?: any | null
  rating_factors?: any | null
  reviews?: review_arr_rel_insert_input | null
  score?: any | null
  score_breakdown?: any | null
  slug?: string | null
  source_breakdown?: any | null
  sources?: any | null
  state?: string | null
  summary?: string | null
  tag_names?: any | null
  tags?: restaurant_tag_arr_rel_insert_input | null
  telephone?: string | null
  updated_at?: any | null
  upvotes?: any | null
  votes_ratio?: any | null
  website?: string | null
  zip?: any | null
}

/**
 * @name restaurant_max_fields
 * @type OBJECT
 */
export type t_restaurant_max_fields = FieldsType<
  {
    __typename: t_String<'restaurant_max_fields'>
    address?: t_String | null
    city?: t_String | null
    created_at?: t_timestamptz | null
    description?: t_String | null
    downvotes?: t_numeric | null
    geocoder_id?: t_String | null
    id?: t_uuid | null
    image?: t_String | null
    name?: t_String | null
    oldest_review_date?: t_timestamptz | null
    price_range?: t_String | null
    rating?: t_numeric | null
    score?: t_numeric | null
    slug?: t_String | null
    state?: t_String | null
    summary?: t_String | null
    telephone?: t_String | null
    updated_at?: t_timestamptz | null
    upvotes?: t_numeric | null
    votes_ratio?: t_numeric | null
    website?: t_String | null
    zip?: t_numeric | null
  },
  Extension<'restaurant_max_fields'>
>

/**
 * @name restaurant_max_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_max_order_by = {
  address?: order_by | null
  city?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  downvotes?: order_by | null
  geocoder_id?: order_by | null
  id?: order_by | null
  image?: order_by | null
  name?: order_by | null
  oldest_review_date?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  slug?: order_by | null
  state?: order_by | null
  summary?: order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  website?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_min_fields
 * @type OBJECT
 */
export type t_restaurant_min_fields = FieldsType<
  {
    __typename: t_String<'restaurant_min_fields'>
    address?: t_String | null
    city?: t_String | null
    created_at?: t_timestamptz | null
    description?: t_String | null
    downvotes?: t_numeric | null
    geocoder_id?: t_String | null
    id?: t_uuid | null
    image?: t_String | null
    name?: t_String | null
    oldest_review_date?: t_timestamptz | null
    price_range?: t_String | null
    rating?: t_numeric | null
    score?: t_numeric | null
    slug?: t_String | null
    state?: t_String | null
    summary?: t_String | null
    telephone?: t_String | null
    updated_at?: t_timestamptz | null
    upvotes?: t_numeric | null
    votes_ratio?: t_numeric | null
    website?: t_String | null
    zip?: t_numeric | null
  },
  Extension<'restaurant_min_fields'>
>

/**
 * @name restaurant_min_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_min_order_by = {
  address?: order_by | null
  city?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  downvotes?: order_by | null
  geocoder_id?: order_by | null
  id?: order_by | null
  image?: order_by | null
  name?: order_by | null
  oldest_review_date?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  slug?: order_by | null
  state?: order_by | null
  summary?: order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  website?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_mutation_response
 * @type OBJECT
 */
export type t_restaurant_mutation_response = FieldsType<
  {
    __typename: t_String<'restaurant_mutation_response'>
    affected_rows: t_Int
    returning: t_restaurant[]
  },
  Extension<'restaurant_mutation_response'>
>

/**
 * @name restaurant_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_obj_rel_insert_input = {
  data: restaurant_insert_input
  on_conflict?: restaurant_on_conflict | null
}

/**
 * @name restaurant_on_conflict
 * @type INPUT_OBJECT
 */
export type restaurant_on_conflict = {
  constraint: restaurant_constraint
  update_columns: restaurant_update_column[]
  where?: restaurant_bool_exp | null
}

/**
 * @name restaurant_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_order_by = {
  address?: order_by | null
  city?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  downvotes?: order_by | null
  geocoder_id?: order_by | null
  headlines?: order_by | null
  hours?: order_by | null
  id?: order_by | null
  image?: order_by | null
  location?: order_by | null
  menu_items_aggregate?: menu_item_aggregate_order_by | null
  name?: order_by | null
  oldest_review_date?: order_by | null
  photos?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  rating_factors?: order_by | null
  reviews_aggregate?: review_aggregate_order_by | null
  score?: order_by | null
  score_breakdown?: order_by | null
  slug?: order_by | null
  source_breakdown?: order_by | null
  sources?: order_by | null
  state?: order_by | null
  summary?: order_by | null
  tag_names?: order_by | null
  tags_aggregate?: restaurant_tag_aggregate_order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  website?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_pk_columns_input
 * @type INPUT_OBJECT
 */
export type restaurant_pk_columns_input = { id: any }

/**
 * @name restaurant_prepend_input
 * @type INPUT_OBJECT
 */
export type restaurant_prepend_input = {
  headlines?: any | null
  hours?: any | null
  photos?: any | null
  rating_factors?: any | null
  score_breakdown?: any | null
  source_breakdown?: any | null
  sources?: any | null
  tag_names?: any | null
}

/**
 * @name restaurant_select_column
 * @type ENUM
 */
type t_restaurant_select_column = EnumType<
  | 'address'
  | 'city'
  | 'created_at'
  | 'description'
  | 'downvotes'
  | 'geocoder_id'
  | 'headlines'
  | 'hours'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'oldest_review_date'
  | 'photos'
  | 'price_range'
  | 'rating'
  | 'rating_factors'
  | 'score'
  | 'score_breakdown'
  | 'slug'
  | 'source_breakdown'
  | 'sources'
  | 'state'
  | 'summary'
  | 'tag_names'
  | 'telephone'
  | 'updated_at'
  | 'upvotes'
  | 'votes_ratio'
  | 'website'
  | 'zip'
>

/**
 * @name restaurant_set_input
 * @type INPUT_OBJECT
 */
export type restaurant_set_input = {
  address?: string | null
  city?: string | null
  created_at?: any | null
  description?: string | null
  downvotes?: any | null
  geocoder_id?: string | null
  headlines?: any | null
  hours?: any | null
  id?: any | null
  image?: string | null
  location?: any | null
  name?: string | null
  oldest_review_date?: any | null
  photos?: any | null
  price_range?: string | null
  rating?: any | null
  rating_factors?: any | null
  score?: any | null
  score_breakdown?: any | null
  slug?: string | null
  source_breakdown?: any | null
  sources?: any | null
  state?: string | null
  summary?: string | null
  tag_names?: any | null
  telephone?: string | null
  updated_at?: any | null
  upvotes?: any | null
  votes_ratio?: any | null
  website?: string | null
  zip?: any | null
}

/**
 * @name restaurant_stddev_fields
 * @type OBJECT
 */
export type t_restaurant_stddev_fields = FieldsType<
  {
    __typename: t_String<'restaurant_stddev_fields'>
    downvotes?: t_Float | null
    rating?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_fields'>
>

/**
 * @name restaurant_stddev_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_order_by = {
  downvotes?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_stddev_pop_fields
 * @type OBJECT
 */
export type t_restaurant_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_stddev_pop_fields'>
    downvotes?: t_Float | null
    rating?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_pop_fields'>
>

/**
 * @name restaurant_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_pop_order_by = {
  downvotes?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_stddev_samp_fields
 * @type OBJECT
 */
export type t_restaurant_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_stddev_samp_fields'>
    downvotes?: t_Float | null
    rating?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_samp_fields'>
>

/**
 * @name restaurant_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_samp_order_by = {
  downvotes?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_sum_fields
 * @type OBJECT
 */
export type t_restaurant_sum_fields = FieldsType<
  {
    __typename: t_String<'restaurant_sum_fields'>
    downvotes?: t_numeric | null
    rating?: t_numeric | null
    score?: t_numeric | null
    upvotes?: t_numeric | null
    votes_ratio?: t_numeric | null
    zip?: t_numeric | null
  },
  Extension<'restaurant_sum_fields'>
>

/**
 * @name restaurant_sum_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_sum_order_by = {
  downvotes?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_tag
 * @type OBJECT
 */
export type t_restaurant_tag = FieldsType<
  {
    __typename: t_String<'restaurant_tag'>
    downvotes?: t_numeric | null
    id: t_uuid
    photos: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    rank?: t_Int | null
    rating?: t_numeric | null
    restaurant: t_restaurant
    restaurant_id: t_uuid
    review_mentions_count?: t_numeric | null
    reviews: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    reviews_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review_aggregate
    >
    score?: t_numeric | null
    score_breakdown: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    sentences: FieldsTypeArg<
      {
        distinct_on?: review_tag_sentence_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_sentence_order_by[] | null
        where?: review_tag_sentence_bool_exp | null
      },
      t_review_tag_sentence[]
    >
    sentences_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_tag_sentence_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_sentence_order_by[] | null
        where?: review_tag_sentence_bool_exp | null
      },
      t_review_tag_sentence_aggregate
    >
    source_breakdown: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    tag: t_tag
    tag_id: t_uuid
    upvotes?: t_numeric | null
    votes_ratio?: t_numeric | null
  },
  Extension<'restaurant_tag'>
>

/**
 * @name restaurant_tag_aggregate
 * @type OBJECT
 */
export type t_restaurant_tag_aggregate = FieldsType<
  {
    __typename: t_String<'restaurant_tag_aggregate'>
    aggregate?: t_restaurant_tag_aggregate_fields | null
    nodes: t_restaurant_tag[]
  },
  Extension<'restaurant_tag_aggregate'>
>

/**
 * @name restaurant_tag_aggregate_fields
 * @type OBJECT
 */
export type t_restaurant_tag_aggregate_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_aggregate_fields'>
    avg?: t_restaurant_tag_avg_fields | null
    count: FieldsTypeArg<
      {
        columns?: restaurant_tag_select_column[] | null
        distinct?: boolean | null
      },
      t_Int | null
    >
    max?: t_restaurant_tag_max_fields | null
    min?: t_restaurant_tag_min_fields | null
    stddev?: t_restaurant_tag_stddev_fields | null
    stddev_pop?: t_restaurant_tag_stddev_pop_fields | null
    stddev_samp?: t_restaurant_tag_stddev_samp_fields | null
    sum?: t_restaurant_tag_sum_fields | null
    var_pop?: t_restaurant_tag_var_pop_fields | null
    var_samp?: t_restaurant_tag_var_samp_fields | null
    variance?: t_restaurant_tag_variance_fields | null
  },
  Extension<'restaurant_tag_aggregate_fields'>
>

/**
 * @name restaurant_tag_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_aggregate_order_by = {
  avg?: restaurant_tag_avg_order_by | null
  count?: order_by | null
  max?: restaurant_tag_max_order_by | null
  min?: restaurant_tag_min_order_by | null
  stddev?: restaurant_tag_stddev_order_by | null
  stddev_pop?: restaurant_tag_stddev_pop_order_by | null
  stddev_samp?: restaurant_tag_stddev_samp_order_by | null
  sum?: restaurant_tag_sum_order_by | null
  var_pop?: restaurant_tag_var_pop_order_by | null
  var_samp?: restaurant_tag_var_samp_order_by | null
  variance?: restaurant_tag_variance_order_by | null
}

/**
 * @name restaurant_tag_append_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_append_input = {
  photos?: any | null
  score_breakdown?: any | null
  source_breakdown?: any | null
}

/**
 * @name restaurant_tag_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_arr_rel_insert_input = {
  data: restaurant_tag_insert_input[]
  on_conflict?: restaurant_tag_on_conflict | null
}

/**
 * @name restaurant_tag_avg_fields
 * @type OBJECT
 */
export type t_restaurant_tag_avg_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_avg_fields'>
    downvotes?: t_Float | null
    rank?: t_Float | null
    rating?: t_Float | null
    review_mentions_count?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
  },
  Extension<'restaurant_tag_avg_fields'>
>

/**
 * @name restaurant_tag_avg_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_avg_order_by = {
  downvotes?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_bool_exp
 * @type INPUT_OBJECT
 */
export type restaurant_tag_bool_exp = {
  _and?: (restaurant_tag_bool_exp | null)[] | null
  _not?: restaurant_tag_bool_exp | null
  _or?: (restaurant_tag_bool_exp | null)[] | null
  downvotes?: numeric_comparison_exp | null
  id?: uuid_comparison_exp | null
  photos?: jsonb_comparison_exp | null
  rank?: Int_comparison_exp | null
  rating?: numeric_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  review_mentions_count?: numeric_comparison_exp | null
  reviews?: review_bool_exp | null
  score?: numeric_comparison_exp | null
  score_breakdown?: jsonb_comparison_exp | null
  sentences?: review_tag_sentence_bool_exp | null
  source_breakdown?: jsonb_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_id?: uuid_comparison_exp | null
  upvotes?: numeric_comparison_exp | null
  votes_ratio?: numeric_comparison_exp | null
}

/**
 * @name restaurant_tag_constraint
 * @type ENUM
 */
type t_restaurant_tag_constraint = EnumType<
  'restaurant_tag_id_key' | 'restaurant_tag_pkey'
>

/**
 * @name restaurant_tag_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_at_path_input = {
  photos?: (string | null)[] | null
  score_breakdown?: (string | null)[] | null
  source_breakdown?: (string | null)[] | null
}

/**
 * @name restaurant_tag_delete_elem_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_elem_input = {
  photos?: number | null
  score_breakdown?: number | null
  source_breakdown?: number | null
}

/**
 * @name restaurant_tag_delete_key_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_key_input = {
  photos?: string | null
  score_breakdown?: string | null
  source_breakdown?: string | null
}

/**
 * @name restaurant_tag_inc_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_inc_input = {
  downvotes?: any | null
  rank?: number | null
  rating?: any | null
  review_mentions_count?: any | null
  score?: any | null
  upvotes?: any | null
  votes_ratio?: any | null
}

/**
 * @name restaurant_tag_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_insert_input = {
  downvotes?: any | null
  id?: any | null
  photos?: any | null
  rank?: number | null
  rating?: any | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  review_mentions_count?: any | null
  reviews?: review_arr_rel_insert_input | null
  score?: any | null
  score_breakdown?: any | null
  sentences?: review_tag_sentence_arr_rel_insert_input | null
  source_breakdown?: any | null
  tag?: tag_obj_rel_insert_input | null
  tag_id?: any | null
  upvotes?: any | null
  votes_ratio?: any | null
}

/**
 * @name restaurant_tag_max_fields
 * @type OBJECT
 */
export type t_restaurant_tag_max_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_max_fields'>
    downvotes?: t_numeric | null
    id?: t_uuid | null
    rank?: t_Int | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    review_mentions_count?: t_numeric | null
    score?: t_numeric | null
    tag_id?: t_uuid | null
    upvotes?: t_numeric | null
    votes_ratio?: t_numeric | null
  },
  Extension<'restaurant_tag_max_fields'>
>

/**
 * @name restaurant_tag_max_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_max_order_by = {
  downvotes?: order_by | null
  id?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  tag_id?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_min_fields
 * @type OBJECT
 */
export type t_restaurant_tag_min_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_min_fields'>
    downvotes?: t_numeric | null
    id?: t_uuid | null
    rank?: t_Int | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    review_mentions_count?: t_numeric | null
    score?: t_numeric | null
    tag_id?: t_uuid | null
    upvotes?: t_numeric | null
    votes_ratio?: t_numeric | null
  },
  Extension<'restaurant_tag_min_fields'>
>

/**
 * @name restaurant_tag_min_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_min_order_by = {
  downvotes?: order_by | null
  id?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  tag_id?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_mutation_response
 * @type OBJECT
 */
export type t_restaurant_tag_mutation_response = FieldsType<
  {
    __typename: t_String<'restaurant_tag_mutation_response'>
    affected_rows: t_Int
    returning: t_restaurant_tag[]
  },
  Extension<'restaurant_tag_mutation_response'>
>

/**
 * @name restaurant_tag_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_obj_rel_insert_input = {
  data: restaurant_tag_insert_input
  on_conflict?: restaurant_tag_on_conflict | null
}

/**
 * @name restaurant_tag_on_conflict
 * @type INPUT_OBJECT
 */
export type restaurant_tag_on_conflict = {
  constraint: restaurant_tag_constraint
  update_columns: restaurant_tag_update_column[]
  where?: restaurant_tag_bool_exp | null
}

/**
 * @name restaurant_tag_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_order_by = {
  downvotes?: order_by | null
  id?: order_by | null
  photos?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  review_mentions_count?: order_by | null
  reviews_aggregate?: review_aggregate_order_by | null
  score?: order_by | null
  score_breakdown?: order_by | null
  sentences_aggregate?: review_tag_sentence_aggregate_order_by | null
  source_breakdown?: order_by | null
  tag?: tag_order_by | null
  tag_id?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_pk_columns_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_pk_columns_input = {
  restaurant_id: any
  tag_id: any
}

/**
 * @name restaurant_tag_prepend_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_prepend_input = {
  photos?: any | null
  score_breakdown?: any | null
  source_breakdown?: any | null
}

/**
 * @name restaurant_tag_select_column
 * @type ENUM
 */
type t_restaurant_tag_select_column = EnumType<
  | 'downvotes'
  | 'id'
  | 'photos'
  | 'rank'
  | 'rating'
  | 'restaurant_id'
  | 'review_mentions_count'
  | 'score'
  | 'score_breakdown'
  | 'source_breakdown'
  | 'tag_id'
  | 'upvotes'
  | 'votes_ratio'
>

/**
 * @name restaurant_tag_set_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_set_input = {
  downvotes?: any | null
  id?: any | null
  photos?: any | null
  rank?: number | null
  rating?: any | null
  restaurant_id?: any | null
  review_mentions_count?: any | null
  score?: any | null
  score_breakdown?: any | null
  source_breakdown?: any | null
  tag_id?: any | null
  upvotes?: any | null
  votes_ratio?: any | null
}

/**
 * @name restaurant_tag_stddev_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_fields'>
    downvotes?: t_Float | null
    rank?: t_Float | null
    rating?: t_Float | null
    review_mentions_count?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_fields'>
>

/**
 * @name restaurant_tag_stddev_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_order_by = {
  downvotes?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_stddev_pop_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_pop_fields'>
    downvotes?: t_Float | null
    rank?: t_Float | null
    rating?: t_Float | null
    review_mentions_count?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_pop_fields'>
>

/**
 * @name restaurant_tag_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_pop_order_by = {
  downvotes?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_stddev_samp_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_samp_fields'>
    downvotes?: t_Float | null
    rank?: t_Float | null
    rating?: t_Float | null
    review_mentions_count?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_samp_fields'>
>

/**
 * @name restaurant_tag_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_samp_order_by = {
  downvotes?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_sum_fields
 * @type OBJECT
 */
export type t_restaurant_tag_sum_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_sum_fields'>
    downvotes?: t_numeric | null
    rank?: t_Int | null
    rating?: t_numeric | null
    review_mentions_count?: t_numeric | null
    score?: t_numeric | null
    upvotes?: t_numeric | null
    votes_ratio?: t_numeric | null
  },
  Extension<'restaurant_tag_sum_fields'>
>

/**
 * @name restaurant_tag_sum_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_sum_order_by = {
  downvotes?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_update_column
 * @type ENUM
 */
type t_restaurant_tag_update_column = EnumType<
  | 'downvotes'
  | 'id'
  | 'photos'
  | 'rank'
  | 'rating'
  | 'restaurant_id'
  | 'review_mentions_count'
  | 'score'
  | 'score_breakdown'
  | 'source_breakdown'
  | 'tag_id'
  | 'upvotes'
  | 'votes_ratio'
>

/**
 * @name restaurant_tag_var_pop_fields
 * @type OBJECT
 */
export type t_restaurant_tag_var_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_var_pop_fields'>
    downvotes?: t_Float | null
    rank?: t_Float | null
    rating?: t_Float | null
    review_mentions_count?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
  },
  Extension<'restaurant_tag_var_pop_fields'>
>

/**
 * @name restaurant_tag_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_var_pop_order_by = {
  downvotes?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_var_samp_fields
 * @type OBJECT
 */
export type t_restaurant_tag_var_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_var_samp_fields'>
    downvotes?: t_Float | null
    rank?: t_Float | null
    rating?: t_Float | null
    review_mentions_count?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
  },
  Extension<'restaurant_tag_var_samp_fields'>
>

/**
 * @name restaurant_tag_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_var_samp_order_by = {
  downvotes?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_tag_variance_fields
 * @type OBJECT
 */
export type t_restaurant_tag_variance_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_variance_fields'>
    downvotes?: t_Float | null
    rank?: t_Float | null
    rating?: t_Float | null
    review_mentions_count?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
  },
  Extension<'restaurant_tag_variance_fields'>
>

/**
 * @name restaurant_tag_variance_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_variance_order_by = {
  downvotes?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  review_mentions_count?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
}

/**
 * @name restaurant_top_tags_args
 * @type INPUT_OBJECT
 */
export type restaurant_top_tags_args = {
  _tag_types?: string | null
  tag_names?: string | null
}

/**
 * @name restaurant_update_column
 * @type ENUM
 */
type t_restaurant_update_column = EnumType<
  | 'address'
  | 'city'
  | 'created_at'
  | 'description'
  | 'downvotes'
  | 'geocoder_id'
  | 'headlines'
  | 'hours'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'oldest_review_date'
  | 'photos'
  | 'price_range'
  | 'rating'
  | 'rating_factors'
  | 'score'
  | 'score_breakdown'
  | 'slug'
  | 'source_breakdown'
  | 'sources'
  | 'state'
  | 'summary'
  | 'tag_names'
  | 'telephone'
  | 'updated_at'
  | 'upvotes'
  | 'votes_ratio'
  | 'website'
  | 'zip'
>

/**
 * @name restaurant_var_pop_fields
 * @type OBJECT
 */
export type t_restaurant_var_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_var_pop_fields'>
    downvotes?: t_Float | null
    rating?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_var_pop_fields'>
>

/**
 * @name restaurant_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_var_pop_order_by = {
  downvotes?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_var_samp_fields
 * @type OBJECT
 */
export type t_restaurant_var_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_var_samp_fields'>
    downvotes?: t_Float | null
    rating?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_var_samp_fields'>
>

/**
 * @name restaurant_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_var_samp_order_by = {
  downvotes?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_variance_fields
 * @type OBJECT
 */
export type t_restaurant_variance_fields = FieldsType<
  {
    __typename: t_String<'restaurant_variance_fields'>
    downvotes?: t_Float | null
    rating?: t_Float | null
    score?: t_Float | null
    upvotes?: t_Float | null
    votes_ratio?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_variance_fields'>
>

/**
 * @name restaurant_variance_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_variance_order_by = {
  downvotes?: order_by | null
  rating?: order_by | null
  score?: order_by | null
  upvotes?: order_by | null
  votes_ratio?: order_by | null
  zip?: order_by | null
}

/**
 * @name review
 * @type OBJECT
 */
export type t_review = FieldsType<
  {
    __typename: t_String<'review'>
    authored_at: t_timestamptz
    categories: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    favorited?: t_Boolean | null
    id: t_uuid
    location?: t_geometry | null
    native_data_unique_key?: t_String | null
    rating?: t_numeric | null
    restaurant: t_restaurant
    restaurant_id: t_uuid
    sentiments: FieldsTypeArg<
      {
        distinct_on?: review_tag_sentence_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_sentence_order_by[] | null
        where?: review_tag_sentence_bool_exp | null
      },
      t_review_tag_sentence[]
    >
    sentiments_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_tag_sentence_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_sentence_order_by[] | null
        where?: review_tag_sentence_bool_exp | null
      },
      t_review_tag_sentence_aggregate
    >
    source?: t_String | null
    tag?: t_tag | null
    tag_id?: t_uuid | null
    text?: t_String | null
    type?: t_String | null
    updated_at: t_timestamptz
    user: t_user
    user_id: t_uuid
    username?: t_String | null
    vote?: t_numeric | null
  },
  Extension<'review'>
>

/**
 * @name review_aggregate
 * @type OBJECT
 */
export type t_review_aggregate = FieldsType<
  {
    __typename: t_String<'review_aggregate'>
    aggregate?: t_review_aggregate_fields | null
    nodes: t_review[]
  },
  Extension<'review_aggregate'>
>

/**
 * @name review_aggregate_fields
 * @type OBJECT
 */
export type t_review_aggregate_fields = FieldsType<
  {
    __typename: t_String<'review_aggregate_fields'>
    avg?: t_review_avg_fields | null
    count: FieldsTypeArg<
      { columns?: review_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_review_max_fields | null
    min?: t_review_min_fields | null
    stddev?: t_review_stddev_fields | null
    stddev_pop?: t_review_stddev_pop_fields | null
    stddev_samp?: t_review_stddev_samp_fields | null
    sum?: t_review_sum_fields | null
    var_pop?: t_review_var_pop_fields | null
    var_samp?: t_review_var_samp_fields | null
    variance?: t_review_variance_fields | null
  },
  Extension<'review_aggregate_fields'>
>

/**
 * @name review_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type review_aggregate_order_by = {
  avg?: review_avg_order_by | null
  count?: order_by | null
  max?: review_max_order_by | null
  min?: review_min_order_by | null
  stddev?: review_stddev_order_by | null
  stddev_pop?: review_stddev_pop_order_by | null
  stddev_samp?: review_stddev_samp_order_by | null
  sum?: review_sum_order_by | null
  var_pop?: review_var_pop_order_by | null
  var_samp?: review_var_samp_order_by | null
  variance?: review_variance_order_by | null
}

/**
 * @name review_append_input
 * @type INPUT_OBJECT
 */
export type review_append_input = { categories?: any | null }

/**
 * @name review_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type review_arr_rel_insert_input = {
  data: review_insert_input[]
  on_conflict?: review_on_conflict | null
}

/**
 * @name review_avg_fields
 * @type OBJECT
 */
export type t_review_avg_fields = FieldsType<
  {
    __typename: t_String<'review_avg_fields'>
    rating?: t_Float | null
    vote?: t_Float | null
  },
  Extension<'review_avg_fields'>
>

/**
 * @name review_avg_order_by
 * @type INPUT_OBJECT
 */
export type review_avg_order_by = {
  rating?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_bool_exp
 * @type INPUT_OBJECT
 */
export type review_bool_exp = {
  _and?: (review_bool_exp | null)[] | null
  _not?: review_bool_exp | null
  _or?: (review_bool_exp | null)[] | null
  authored_at?: timestamptz_comparison_exp | null
  categories?: jsonb_comparison_exp | null
  favorited?: Boolean_comparison_exp | null
  id?: uuid_comparison_exp | null
  location?: geometry_comparison_exp | null
  native_data_unique_key?: String_comparison_exp | null
  rating?: numeric_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  sentiments?: review_tag_sentence_bool_exp | null
  source?: String_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_id?: uuid_comparison_exp | null
  text?: String_comparison_exp | null
  type?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  user?: user_bool_exp | null
  user_id?: uuid_comparison_exp | null
  username?: String_comparison_exp | null
  vote?: numeric_comparison_exp | null
}

/**
 * @name review_constraint
 * @type ENUM
 */
type t_review_constraint = EnumType<
  | 'review_native_data_unique_constraint'
  | 'review_native_data_unique_key_key'
  | 'review_pkey'
  | 'review_username_restaurant_id_tag_id_authored_at_key'
>

/**
 * @name review_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type review_delete_at_path_input = {
  categories?: (string | null)[] | null
}

/**
 * @name review_delete_elem_input
 * @type INPUT_OBJECT
 */
export type review_delete_elem_input = { categories?: number | null }

/**
 * @name review_delete_key_input
 * @type INPUT_OBJECT
 */
export type review_delete_key_input = { categories?: string | null }

/**
 * @name review_inc_input
 * @type INPUT_OBJECT
 */
export type review_inc_input = { rating?: any | null; vote?: any | null }

/**
 * @name review_insert_input
 * @type INPUT_OBJECT
 */
export type review_insert_input = {
  authored_at?: any | null
  categories?: any | null
  favorited?: boolean | null
  id?: any | null
  location?: any | null
  native_data_unique_key?: string | null
  rating?: any | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  sentiments?: review_tag_sentence_arr_rel_insert_input | null
  source?: string | null
  tag?: tag_obj_rel_insert_input | null
  tag_id?: any | null
  text?: string | null
  type?: string | null
  updated_at?: any | null
  user?: user_obj_rel_insert_input | null
  user_id?: any | null
  username?: string | null
  vote?: any | null
}

/**
 * @name review_max_fields
 * @type OBJECT
 */
export type t_review_max_fields = FieldsType<
  {
    __typename: t_String<'review_max_fields'>
    authored_at?: t_timestamptz | null
    id?: t_uuid | null
    native_data_unique_key?: t_String | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    source?: t_String | null
    tag_id?: t_uuid | null
    text?: t_String | null
    type?: t_String | null
    updated_at?: t_timestamptz | null
    user_id?: t_uuid | null
    username?: t_String | null
    vote?: t_numeric | null
  },
  Extension<'review_max_fields'>
>

/**
 * @name review_max_order_by
 * @type INPUT_OBJECT
 */
export type review_max_order_by = {
  authored_at?: order_by | null
  id?: order_by | null
  native_data_unique_key?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  source?: order_by | null
  tag_id?: order_by | null
  text?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
  user_id?: order_by | null
  username?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_min_fields
 * @type OBJECT
 */
export type t_review_min_fields = FieldsType<
  {
    __typename: t_String<'review_min_fields'>
    authored_at?: t_timestamptz | null
    id?: t_uuid | null
    native_data_unique_key?: t_String | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    source?: t_String | null
    tag_id?: t_uuid | null
    text?: t_String | null
    type?: t_String | null
    updated_at?: t_timestamptz | null
    user_id?: t_uuid | null
    username?: t_String | null
    vote?: t_numeric | null
  },
  Extension<'review_min_fields'>
>

/**
 * @name review_min_order_by
 * @type INPUT_OBJECT
 */
export type review_min_order_by = {
  authored_at?: order_by | null
  id?: order_by | null
  native_data_unique_key?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  source?: order_by | null
  tag_id?: order_by | null
  text?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
  user_id?: order_by | null
  username?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_mutation_response
 * @type OBJECT
 */
export type t_review_mutation_response = FieldsType<
  {
    __typename: t_String<'review_mutation_response'>
    affected_rows: t_Int
    returning: t_review[]
  },
  Extension<'review_mutation_response'>
>

/**
 * @name review_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type review_obj_rel_insert_input = {
  data: review_insert_input
  on_conflict?: review_on_conflict | null
}

/**
 * @name review_on_conflict
 * @type INPUT_OBJECT
 */
export type review_on_conflict = {
  constraint: review_constraint
  update_columns: review_update_column[]
  where?: review_bool_exp | null
}

/**
 * @name review_order_by
 * @type INPUT_OBJECT
 */
export type review_order_by = {
  authored_at?: order_by | null
  categories?: order_by | null
  favorited?: order_by | null
  id?: order_by | null
  location?: order_by | null
  native_data_unique_key?: order_by | null
  rating?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  sentiments_aggregate?: review_tag_sentence_aggregate_order_by | null
  source?: order_by | null
  tag?: tag_order_by | null
  tag_id?: order_by | null
  text?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
  user?: user_order_by | null
  user_id?: order_by | null
  username?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_pk_columns_input
 * @type INPUT_OBJECT
 */
export type review_pk_columns_input = { id: any }

/**
 * @name review_prepend_input
 * @type INPUT_OBJECT
 */
export type review_prepend_input = { categories?: any | null }

/**
 * @name review_select_column
 * @type ENUM
 */
type t_review_select_column = EnumType<
  | 'authored_at'
  | 'categories'
  | 'favorited'
  | 'id'
  | 'location'
  | 'native_data_unique_key'
  | 'rating'
  | 'restaurant_id'
  | 'source'
  | 'tag_id'
  | 'text'
  | 'type'
  | 'updated_at'
  | 'user_id'
  | 'username'
  | 'vote'
>

/**
 * @name review_set_input
 * @type INPUT_OBJECT
 */
export type review_set_input = {
  authored_at?: any | null
  categories?: any | null
  favorited?: boolean | null
  id?: any | null
  location?: any | null
  native_data_unique_key?: string | null
  rating?: any | null
  restaurant_id?: any | null
  source?: string | null
  tag_id?: any | null
  text?: string | null
  type?: string | null
  updated_at?: any | null
  user_id?: any | null
  username?: string | null
  vote?: any | null
}

/**
 * @name review_stddev_fields
 * @type OBJECT
 */
export type t_review_stddev_fields = FieldsType<
  {
    __typename: t_String<'review_stddev_fields'>
    rating?: t_Float | null
    vote?: t_Float | null
  },
  Extension<'review_stddev_fields'>
>

/**
 * @name review_stddev_order_by
 * @type INPUT_OBJECT
 */
export type review_stddev_order_by = {
  rating?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_stddev_pop_fields
 * @type OBJECT
 */
export type t_review_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'review_stddev_pop_fields'>
    rating?: t_Float | null
    vote?: t_Float | null
  },
  Extension<'review_stddev_pop_fields'>
>

/**
 * @name review_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type review_stddev_pop_order_by = {
  rating?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_stddev_samp_fields
 * @type OBJECT
 */
export type t_review_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'review_stddev_samp_fields'>
    rating?: t_Float | null
    vote?: t_Float | null
  },
  Extension<'review_stddev_samp_fields'>
>

/**
 * @name review_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type review_stddev_samp_order_by = {
  rating?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_sum_fields
 * @type OBJECT
 */
export type t_review_sum_fields = FieldsType<
  {
    __typename: t_String<'review_sum_fields'>
    rating?: t_numeric | null
    vote?: t_numeric | null
  },
  Extension<'review_sum_fields'>
>

/**
 * @name review_sum_order_by
 * @type INPUT_OBJECT
 */
export type review_sum_order_by = {
  rating?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_tag_sentence
 * @type OBJECT
 */
export type t_review_tag_sentence = FieldsType<
  {
    __typename: t_String<'review_tag_sentence'>
    id: t_uuid
    ml_sentiment?: t_numeric | null
    naive_sentiment: t_numeric
    restaurant_id?: t_uuid | null
    review: t_review
    review_id: t_uuid
    sentence: t_String
    tag: t_tag
    tag_id: t_uuid
  },
  Extension<'review_tag_sentence'>
>

/**
 * @name review_tag_sentence_aggregate
 * @type OBJECT
 */
export type t_review_tag_sentence_aggregate = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_aggregate'>
    aggregate?: t_review_tag_sentence_aggregate_fields | null
    nodes: t_review_tag_sentence[]
  },
  Extension<'review_tag_sentence_aggregate'>
>

/**
 * @name review_tag_sentence_aggregate_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_aggregate_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_aggregate_fields'>
    avg?: t_review_tag_sentence_avg_fields | null
    count: FieldsTypeArg<
      {
        columns?: review_tag_sentence_select_column[] | null
        distinct?: boolean | null
      },
      t_Int | null
    >
    max?: t_review_tag_sentence_max_fields | null
    min?: t_review_tag_sentence_min_fields | null
    stddev?: t_review_tag_sentence_stddev_fields | null
    stddev_pop?: t_review_tag_sentence_stddev_pop_fields | null
    stddev_samp?: t_review_tag_sentence_stddev_samp_fields | null
    sum?: t_review_tag_sentence_sum_fields | null
    var_pop?: t_review_tag_sentence_var_pop_fields | null
    var_samp?: t_review_tag_sentence_var_samp_fields | null
    variance?: t_review_tag_sentence_variance_fields | null
  },
  Extension<'review_tag_sentence_aggregate_fields'>
>

/**
 * @name review_tag_sentence_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_aggregate_order_by = {
  avg?: review_tag_sentence_avg_order_by | null
  count?: order_by | null
  max?: review_tag_sentence_max_order_by | null
  min?: review_tag_sentence_min_order_by | null
  stddev?: review_tag_sentence_stddev_order_by | null
  stddev_pop?: review_tag_sentence_stddev_pop_order_by | null
  stddev_samp?: review_tag_sentence_stddev_samp_order_by | null
  sum?: review_tag_sentence_sum_order_by | null
  var_pop?: review_tag_sentence_var_pop_order_by | null
  var_samp?: review_tag_sentence_var_samp_order_by | null
  variance?: review_tag_sentence_variance_order_by | null
}

/**
 * @name review_tag_sentence_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_arr_rel_insert_input = {
  data: review_tag_sentence_insert_input[]
  on_conflict?: review_tag_sentence_on_conflict | null
}

/**
 * @name review_tag_sentence_avg_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_avg_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_avg_fields'>
    ml_sentiment?: t_Float | null
    naive_sentiment?: t_Float | null
  },
  Extension<'review_tag_sentence_avg_fields'>
>

/**
 * @name review_tag_sentence_avg_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_avg_order_by = {
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
}

/**
 * @name review_tag_sentence_bool_exp
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_bool_exp = {
  _and?: (review_tag_sentence_bool_exp | null)[] | null
  _not?: review_tag_sentence_bool_exp | null
  _or?: (review_tag_sentence_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  ml_sentiment?: numeric_comparison_exp | null
  naive_sentiment?: numeric_comparison_exp | null
  restaurant_id?: uuid_comparison_exp | null
  review?: review_bool_exp | null
  review_id?: uuid_comparison_exp | null
  sentence?: String_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_id?: uuid_comparison_exp | null
}

/**
 * @name review_tag_sentence_constraint
 * @type ENUM
 */
type t_review_tag_sentence_constraint = EnumType<
  'review_tag_pkey' | 'review_tag_tag_id_review_id_sentence_key'
>

/**
 * @name review_tag_sentence_inc_input
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_inc_input = {
  ml_sentiment?: any | null
  naive_sentiment?: any | null
}

/**
 * @name review_tag_sentence_insert_input
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_insert_input = {
  id?: any | null
  ml_sentiment?: any | null
  naive_sentiment?: any | null
  restaurant_id?: any | null
  review?: review_obj_rel_insert_input | null
  review_id?: any | null
  sentence?: string | null
  tag?: tag_obj_rel_insert_input | null
  tag_id?: any | null
}

/**
 * @name review_tag_sentence_max_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_max_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_max_fields'>
    id?: t_uuid | null
    ml_sentiment?: t_numeric | null
    naive_sentiment?: t_numeric | null
    restaurant_id?: t_uuid | null
    review_id?: t_uuid | null
    sentence?: t_String | null
    tag_id?: t_uuid | null
  },
  Extension<'review_tag_sentence_max_fields'>
>

/**
 * @name review_tag_sentence_max_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_max_order_by = {
  id?: order_by | null
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
  restaurant_id?: order_by | null
  review_id?: order_by | null
  sentence?: order_by | null
  tag_id?: order_by | null
}

/**
 * @name review_tag_sentence_min_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_min_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_min_fields'>
    id?: t_uuid | null
    ml_sentiment?: t_numeric | null
    naive_sentiment?: t_numeric | null
    restaurant_id?: t_uuid | null
    review_id?: t_uuid | null
    sentence?: t_String | null
    tag_id?: t_uuid | null
  },
  Extension<'review_tag_sentence_min_fields'>
>

/**
 * @name review_tag_sentence_min_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_min_order_by = {
  id?: order_by | null
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
  restaurant_id?: order_by | null
  review_id?: order_by | null
  sentence?: order_by | null
  tag_id?: order_by | null
}

/**
 * @name review_tag_sentence_mutation_response
 * @type OBJECT
 */
export type t_review_tag_sentence_mutation_response = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_mutation_response'>
    affected_rows: t_Int
    returning: t_review_tag_sentence[]
  },
  Extension<'review_tag_sentence_mutation_response'>
>

/**
 * @name review_tag_sentence_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_obj_rel_insert_input = {
  data: review_tag_sentence_insert_input
  on_conflict?: review_tag_sentence_on_conflict | null
}

/**
 * @name review_tag_sentence_on_conflict
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_on_conflict = {
  constraint: review_tag_sentence_constraint
  update_columns: review_tag_sentence_update_column[]
  where?: review_tag_sentence_bool_exp | null
}

/**
 * @name review_tag_sentence_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_order_by = {
  id?: order_by | null
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
  restaurant_id?: order_by | null
  review?: review_order_by | null
  review_id?: order_by | null
  sentence?: order_by | null
  tag?: tag_order_by | null
  tag_id?: order_by | null
}

/**
 * @name review_tag_sentence_pk_columns_input
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_pk_columns_input = { id: any }

/**
 * @name review_tag_sentence_select_column
 * @type ENUM
 */
type t_review_tag_sentence_select_column = EnumType<
  | 'id'
  | 'ml_sentiment'
  | 'naive_sentiment'
  | 'restaurant_id'
  | 'review_id'
  | 'sentence'
  | 'tag_id'
>

/**
 * @name review_tag_sentence_set_input
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_set_input = {
  id?: any | null
  ml_sentiment?: any | null
  naive_sentiment?: any | null
  restaurant_id?: any | null
  review_id?: any | null
  sentence?: string | null
  tag_id?: any | null
}

/**
 * @name review_tag_sentence_stddev_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_stddev_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_stddev_fields'>
    ml_sentiment?: t_Float | null
    naive_sentiment?: t_Float | null
  },
  Extension<'review_tag_sentence_stddev_fields'>
>

/**
 * @name review_tag_sentence_stddev_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_stddev_order_by = {
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
}

/**
 * @name review_tag_sentence_stddev_pop_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_stddev_pop_fields'>
    ml_sentiment?: t_Float | null
    naive_sentiment?: t_Float | null
  },
  Extension<'review_tag_sentence_stddev_pop_fields'>
>

/**
 * @name review_tag_sentence_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_stddev_pop_order_by = {
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
}

/**
 * @name review_tag_sentence_stddev_samp_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_stddev_samp_fields'>
    ml_sentiment?: t_Float | null
    naive_sentiment?: t_Float | null
  },
  Extension<'review_tag_sentence_stddev_samp_fields'>
>

/**
 * @name review_tag_sentence_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_stddev_samp_order_by = {
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
}

/**
 * @name review_tag_sentence_sum_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_sum_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_sum_fields'>
    ml_sentiment?: t_numeric | null
    naive_sentiment?: t_numeric | null
  },
  Extension<'review_tag_sentence_sum_fields'>
>

/**
 * @name review_tag_sentence_sum_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_sum_order_by = {
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
}

/**
 * @name review_tag_sentence_update_column
 * @type ENUM
 */
type t_review_tag_sentence_update_column = EnumType<
  | 'id'
  | 'ml_sentiment'
  | 'naive_sentiment'
  | 'restaurant_id'
  | 'review_id'
  | 'sentence'
  | 'tag_id'
>

/**
 * @name review_tag_sentence_var_pop_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_var_pop_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_var_pop_fields'>
    ml_sentiment?: t_Float | null
    naive_sentiment?: t_Float | null
  },
  Extension<'review_tag_sentence_var_pop_fields'>
>

/**
 * @name review_tag_sentence_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_var_pop_order_by = {
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
}

/**
 * @name review_tag_sentence_var_samp_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_var_samp_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_var_samp_fields'>
    ml_sentiment?: t_Float | null
    naive_sentiment?: t_Float | null
  },
  Extension<'review_tag_sentence_var_samp_fields'>
>

/**
 * @name review_tag_sentence_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_var_samp_order_by = {
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
}

/**
 * @name review_tag_sentence_variance_fields
 * @type OBJECT
 */
export type t_review_tag_sentence_variance_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sentence_variance_fields'>
    ml_sentiment?: t_Float | null
    naive_sentiment?: t_Float | null
  },
  Extension<'review_tag_sentence_variance_fields'>
>

/**
 * @name review_tag_sentence_variance_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sentence_variance_order_by = {
  ml_sentiment?: order_by | null
  naive_sentiment?: order_by | null
}

/**
 * @name review_update_column
 * @type ENUM
 */
type t_review_update_column = EnumType<
  | 'authored_at'
  | 'categories'
  | 'favorited'
  | 'id'
  | 'location'
  | 'native_data_unique_key'
  | 'rating'
  | 'restaurant_id'
  | 'source'
  | 'tag_id'
  | 'text'
  | 'type'
  | 'updated_at'
  | 'user_id'
  | 'username'
  | 'vote'
>

/**
 * @name review_var_pop_fields
 * @type OBJECT
 */
export type t_review_var_pop_fields = FieldsType<
  {
    __typename: t_String<'review_var_pop_fields'>
    rating?: t_Float | null
    vote?: t_Float | null
  },
  Extension<'review_var_pop_fields'>
>

/**
 * @name review_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type review_var_pop_order_by = {
  rating?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_var_samp_fields
 * @type OBJECT
 */
export type t_review_var_samp_fields = FieldsType<
  {
    __typename: t_String<'review_var_samp_fields'>
    rating?: t_Float | null
    vote?: t_Float | null
  },
  Extension<'review_var_samp_fields'>
>

/**
 * @name review_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type review_var_samp_order_by = {
  rating?: order_by | null
  vote?: order_by | null
}

/**
 * @name review_variance_fields
 * @type OBJECT
 */
export type t_review_variance_fields = FieldsType<
  {
    __typename: t_String<'review_variance_fields'>
    rating?: t_Float | null
    vote?: t_Float | null
  },
  Extension<'review_variance_fields'>
>

/**
 * @name review_variance_order_by
 * @type INPUT_OBJECT
 */
export type review_variance_order_by = {
  rating?: order_by | null
  vote?: order_by | null
}

/**
 * @name setting
 * @type OBJECT
 */
export type t_setting = FieldsType<
  {
    __typename: t_String<'setting'>
    created_at?: t_timestamptz | null
    id: t_uuid
    key: t_String
    updated_at?: t_timestamptz | null
    value: FieldsTypeArg<{ path?: string | null }, t_jsonb>
  },
  Extension<'setting'>
>

/**
 * @name setting_aggregate
 * @type OBJECT
 */
export type t_setting_aggregate = FieldsType<
  {
    __typename: t_String<'setting_aggregate'>
    aggregate?: t_setting_aggregate_fields | null
    nodes: t_setting[]
  },
  Extension<'setting_aggregate'>
>

/**
 * @name setting_aggregate_fields
 * @type OBJECT
 */
export type t_setting_aggregate_fields = FieldsType<
  {
    __typename: t_String<'setting_aggregate_fields'>
    count: FieldsTypeArg<
      { columns?: setting_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_setting_max_fields | null
    min?: t_setting_min_fields | null
  },
  Extension<'setting_aggregate_fields'>
>

/**
 * @name setting_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type setting_aggregate_order_by = {
  count?: order_by | null
  max?: setting_max_order_by | null
  min?: setting_min_order_by | null
}

/**
 * @name setting_append_input
 * @type INPUT_OBJECT
 */
export type setting_append_input = { value?: any | null }

/**
 * @name setting_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type setting_arr_rel_insert_input = {
  data: setting_insert_input[]
  on_conflict?: setting_on_conflict | null
}

/**
 * @name setting_bool_exp
 * @type INPUT_OBJECT
 */
export type setting_bool_exp = {
  _and?: (setting_bool_exp | null)[] | null
  _not?: setting_bool_exp | null
  _or?: (setting_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  key?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  value?: jsonb_comparison_exp | null
}

/**
 * @name setting_constraint
 * @type ENUM
 */
type t_setting_constraint = EnumType<'setting_id_key' | 'setting_pkey'>

/**
 * @name setting_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type setting_delete_at_path_input = { value?: (string | null)[] | null }

/**
 * @name setting_delete_elem_input
 * @type INPUT_OBJECT
 */
export type setting_delete_elem_input = { value?: number | null }

/**
 * @name setting_delete_key_input
 * @type INPUT_OBJECT
 */
export type setting_delete_key_input = { value?: string | null }

/**
 * @name setting_insert_input
 * @type INPUT_OBJECT
 */
export type setting_insert_input = {
  created_at?: any | null
  id?: any | null
  key?: string | null
  updated_at?: any | null
  value?: any | null
}

/**
 * @name setting_max_fields
 * @type OBJECT
 */
export type t_setting_max_fields = FieldsType<
  {
    __typename: t_String<'setting_max_fields'>
    created_at?: t_timestamptz | null
    id?: t_uuid | null
    key?: t_String | null
    updated_at?: t_timestamptz | null
  },
  Extension<'setting_max_fields'>
>

/**
 * @name setting_max_order_by
 * @type INPUT_OBJECT
 */
export type setting_max_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  key?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name setting_min_fields
 * @type OBJECT
 */
export type t_setting_min_fields = FieldsType<
  {
    __typename: t_String<'setting_min_fields'>
    created_at?: t_timestamptz | null
    id?: t_uuid | null
    key?: t_String | null
    updated_at?: t_timestamptz | null
  },
  Extension<'setting_min_fields'>
>

/**
 * @name setting_min_order_by
 * @type INPUT_OBJECT
 */
export type setting_min_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  key?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name setting_mutation_response
 * @type OBJECT
 */
export type t_setting_mutation_response = FieldsType<
  {
    __typename: t_String<'setting_mutation_response'>
    affected_rows: t_Int
    returning: t_setting[]
  },
  Extension<'setting_mutation_response'>
>

/**
 * @name setting_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type setting_obj_rel_insert_input = {
  data: setting_insert_input
  on_conflict?: setting_on_conflict | null
}

/**
 * @name setting_on_conflict
 * @type INPUT_OBJECT
 */
export type setting_on_conflict = {
  constraint: setting_constraint
  update_columns: setting_update_column[]
  where?: setting_bool_exp | null
}

/**
 * @name setting_order_by
 * @type INPUT_OBJECT
 */
export type setting_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  key?: order_by | null
  updated_at?: order_by | null
  value?: order_by | null
}

/**
 * @name setting_pk_columns_input
 * @type INPUT_OBJECT
 */
export type setting_pk_columns_input = { key: string }

/**
 * @name setting_prepend_input
 * @type INPUT_OBJECT
 */
export type setting_prepend_input = { value?: any | null }

/**
 * @name setting_select_column
 * @type ENUM
 */
type t_setting_select_column = EnumType<
  'created_at' | 'id' | 'key' | 'updated_at' | 'value'
>

/**
 * @name setting_set_input
 * @type INPUT_OBJECT
 */
export type setting_set_input = {
  created_at?: any | null
  id?: any | null
  key?: string | null
  updated_at?: any | null
  value?: any | null
}

/**
 * @name setting_update_column
 * @type ENUM
 */
type t_setting_update_column = EnumType<
  'created_at' | 'id' | 'key' | 'updated_at' | 'value'
>

/**
 * @name st_d_within_geography_input
 * @type INPUT_OBJECT
 */
export type st_d_within_geography_input = {
  distance: number
  from: any
  use_spheroid?: boolean | null
}

/**
 * @name st_d_within_input
 * @type INPUT_OBJECT
 */
export type st_d_within_input = { distance: number; from: any }

/**
 * @name subscription_root
 * @type OBJECT
 */
export type t_subscription_root = FieldsType<
  {
    __typename: t_String<'subscription_root'>
    menu_item: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item[]
    >
    menu_item_aggregate: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item_aggregate
    >
    menu_item_by_pk: FieldsTypeArg<{ id: any }, t_menu_item | null>
    opening_hours: FieldsTypeArg<
      {
        distinct_on?: opening_hours_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: opening_hours_order_by[] | null
        where?: opening_hours_bool_exp | null
      },
      t_opening_hours[]
    >
    opening_hours_aggregate: FieldsTypeArg<
      {
        distinct_on?: opening_hours_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: opening_hours_order_by[] | null
        where?: opening_hours_bool_exp | null
      },
      t_opening_hours_aggregate
    >
    opening_hours_by_pk: FieldsTypeArg<{ id: any }, t_opening_hours | null>
    photo: FieldsTypeArg<
      {
        distinct_on?: photo_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photo_order_by[] | null
        where?: photo_bool_exp | null
      },
      t_photo[]
    >
    photo_aggregate: FieldsTypeArg<
      {
        distinct_on?: photo_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photo_order_by[] | null
        where?: photo_bool_exp | null
      },
      t_photo_aggregate
    >
    photo_by_pk: FieldsTypeArg<{ id: any }, t_photo | null>
    photo_xref: FieldsTypeArg<
      {
        distinct_on?: photo_xref_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photo_xref_order_by[] | null
        where?: photo_xref_bool_exp | null
      },
      t_photo_xref[]
    >
    photo_xref_aggregate: FieldsTypeArg<
      {
        distinct_on?: photo_xref_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photo_xref_order_by[] | null
        where?: photo_xref_bool_exp | null
      },
      t_photo_xref_aggregate
    >
    photo_xref_by_pk: FieldsTypeArg<{ id: any }, t_photo_xref | null>
    restaurant: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant[]
    >
    restaurant_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant_aggregate
    >
    restaurant_by_pk: FieldsTypeArg<{ id: any }, t_restaurant | null>
    restaurant_tag: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag[]
    >
    restaurant_tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag_aggregate
    >
    restaurant_tag_by_pk: FieldsTypeArg<
      { restaurant_id: any; tag_id: any },
      t_restaurant_tag | null
    >
    review: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    review_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review_aggregate
    >
    review_by_pk: FieldsTypeArg<{ id: any }, t_review | null>
    review_tag_sentence: FieldsTypeArg<
      {
        distinct_on?: review_tag_sentence_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_sentence_order_by[] | null
        where?: review_tag_sentence_bool_exp | null
      },
      t_review_tag_sentence[]
    >
    review_tag_sentence_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_tag_sentence_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_sentence_order_by[] | null
        where?: review_tag_sentence_bool_exp | null
      },
      t_review_tag_sentence_aggregate
    >
    review_tag_sentence_by_pk: FieldsTypeArg<
      { id: any },
      t_review_tag_sentence | null
    >
    setting: FieldsTypeArg<
      {
        distinct_on?: setting_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: setting_order_by[] | null
        where?: setting_bool_exp | null
      },
      t_setting[]
    >
    setting_aggregate: FieldsTypeArg<
      {
        distinct_on?: setting_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: setting_order_by[] | null
        where?: setting_bool_exp | null
      },
      t_setting_aggregate
    >
    setting_by_pk: FieldsTypeArg<{ key: string }, t_setting | null>
    tag: FieldsTypeArg<
      {
        distinct_on?: tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_order_by[] | null
        where?: tag_bool_exp | null
      },
      t_tag[]
    >
    tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_order_by[] | null
        where?: tag_bool_exp | null
      },
      t_tag_aggregate
    >
    tag_by_pk: FieldsTypeArg<{ id: any }, t_tag | null>
    tag_tag: FieldsTypeArg<
      {
        distinct_on?: tag_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_tag_order_by[] | null
        where?: tag_tag_bool_exp | null
      },
      t_tag_tag[]
    >
    tag_tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: tag_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_tag_order_by[] | null
        where?: tag_tag_bool_exp | null
      },
      t_tag_tag_aggregate
    >
    tag_tag_by_pk: FieldsTypeArg<
      { category_tag_id: any; tag_id: any },
      t_tag_tag | null
    >
    user: FieldsTypeArg<
      {
        distinct_on?: user_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: user_order_by[] | null
        where?: user_bool_exp | null
      },
      t_user[]
    >
    user_aggregate: FieldsTypeArg<
      {
        distinct_on?: user_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: user_order_by[] | null
        where?: user_bool_exp | null
      },
      t_user_aggregate
    >
    user_by_pk: FieldsTypeArg<{ id: any }, t_user | null>
  },
  Extension<'subscription_root'>
>

/**
 * @name tag
 * @type OBJECT
 */
export type t_tag = FieldsType<
  {
    __typename: t_String<'tag'>
    alternates: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    categories: FieldsTypeArg<
      {
        distinct_on?: tag_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_tag_order_by[] | null
        where?: tag_tag_bool_exp | null
      },
      t_tag_tag[]
    >
    categories_aggregate: FieldsTypeArg<
      {
        distinct_on?: tag_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_tag_order_by[] | null
        where?: tag_tag_bool_exp | null
      },
      t_tag_tag_aggregate
    >
    created_at: t_timestamptz
    default_images: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    description?: t_String | null
    displayName?: t_String | null
    frequency?: t_Int | null
    icon?: t_String | null
    id: t_uuid
    is_ambiguous: t_Boolean
    misc: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    name: t_String
    order: t_Int
    parent?: t_tag | null
    parentId?: t_uuid | null
    popularity?: t_Int | null
    restaurant_taxonomies: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag[]
    >
    restaurant_taxonomies_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag_aggregate
    >
    rgb: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    slug?: t_String | null
    type?: t_String | null
    updated_at: t_timestamptz
  },
  Extension<'tag'>
>

/**
 * @name tag_aggregate
 * @type OBJECT
 */
export type t_tag_aggregate = FieldsType<
  {
    __typename: t_String<'tag_aggregate'>
    aggregate?: t_tag_aggregate_fields | null
    nodes: t_tag[]
  },
  Extension<'tag_aggregate'>
>

/**
 * @name tag_aggregate_fields
 * @type OBJECT
 */
export type t_tag_aggregate_fields = FieldsType<
  {
    __typename: t_String<'tag_aggregate_fields'>
    avg?: t_tag_avg_fields | null
    count: FieldsTypeArg<
      { columns?: tag_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_tag_max_fields | null
    min?: t_tag_min_fields | null
    stddev?: t_tag_stddev_fields | null
    stddev_pop?: t_tag_stddev_pop_fields | null
    stddev_samp?: t_tag_stddev_samp_fields | null
    sum?: t_tag_sum_fields | null
    var_pop?: t_tag_var_pop_fields | null
    var_samp?: t_tag_var_samp_fields | null
    variance?: t_tag_variance_fields | null
  },
  Extension<'tag_aggregate_fields'>
>

/**
 * @name tag_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type tag_aggregate_order_by = {
  avg?: tag_avg_order_by | null
  count?: order_by | null
  max?: tag_max_order_by | null
  min?: tag_min_order_by | null
  stddev?: tag_stddev_order_by | null
  stddev_pop?: tag_stddev_pop_order_by | null
  stddev_samp?: tag_stddev_samp_order_by | null
  sum?: tag_sum_order_by | null
  var_pop?: tag_var_pop_order_by | null
  var_samp?: tag_var_samp_order_by | null
  variance?: tag_variance_order_by | null
}

/**
 * @name tag_append_input
 * @type INPUT_OBJECT
 */
export type tag_append_input = {
  alternates?: any | null
  default_images?: any | null
  misc?: any | null
  rgb?: any | null
}

/**
 * @name tag_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type tag_arr_rel_insert_input = {
  data: tag_insert_input[]
  on_conflict?: tag_on_conflict | null
}

/**
 * @name tag_avg_fields
 * @type OBJECT
 */
export type t_tag_avg_fields = FieldsType<
  {
    __typename: t_String<'tag_avg_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
    popularity?: t_Float | null
  },
  Extension<'tag_avg_fields'>
>

/**
 * @name tag_avg_order_by
 * @type INPUT_OBJECT
 */
export type tag_avg_order_by = {
  frequency?: order_by | null
  order?: order_by | null
  popularity?: order_by | null
}

/**
 * @name tag_bool_exp
 * @type INPUT_OBJECT
 */
export type tag_bool_exp = {
  _and?: (tag_bool_exp | null)[] | null
  _not?: tag_bool_exp | null
  _or?: (tag_bool_exp | null)[] | null
  alternates?: jsonb_comparison_exp | null
  categories?: tag_tag_bool_exp | null
  created_at?: timestamptz_comparison_exp | null
  default_images?: jsonb_comparison_exp | null
  description?: String_comparison_exp | null
  displayName?: String_comparison_exp | null
  frequency?: Int_comparison_exp | null
  icon?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_ambiguous?: Boolean_comparison_exp | null
  misc?: jsonb_comparison_exp | null
  name?: String_comparison_exp | null
  order?: Int_comparison_exp | null
  parent?: tag_bool_exp | null
  parentId?: uuid_comparison_exp | null
  popularity?: Int_comparison_exp | null
  restaurant_taxonomies?: restaurant_tag_bool_exp | null
  rgb?: jsonb_comparison_exp | null
  slug?: String_comparison_exp | null
  type?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * @name tag_constraint
 * @type ENUM
 */
type t_tag_constraint = EnumType<
  | 'tag_id_key1'
  | 'tag_order_key'
  | 'tag_parentId_name_key'
  | 'tag_pkey'
  | 'tag_slug_key'
>

/**
 * @name tag_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type tag_delete_at_path_input = {
  alternates?: (string | null)[] | null
  default_images?: (string | null)[] | null
  misc?: (string | null)[] | null
  rgb?: (string | null)[] | null
}

/**
 * @name tag_delete_elem_input
 * @type INPUT_OBJECT
 */
export type tag_delete_elem_input = {
  alternates?: number | null
  default_images?: number | null
  misc?: number | null
  rgb?: number | null
}

/**
 * @name tag_delete_key_input
 * @type INPUT_OBJECT
 */
export type tag_delete_key_input = {
  alternates?: string | null
  default_images?: string | null
  misc?: string | null
  rgb?: string | null
}

/**
 * @name tag_inc_input
 * @type INPUT_OBJECT
 */
export type tag_inc_input = {
  frequency?: number | null
  order?: number | null
  popularity?: number | null
}

/**
 * @name tag_insert_input
 * @type INPUT_OBJECT
 */
export type tag_insert_input = {
  alternates?: any | null
  categories?: tag_tag_arr_rel_insert_input | null
  created_at?: any | null
  default_images?: any | null
  description?: string | null
  displayName?: string | null
  frequency?: number | null
  icon?: string | null
  id?: any | null
  is_ambiguous?: boolean | null
  misc?: any | null
  name?: string | null
  order?: number | null
  parent?: tag_obj_rel_insert_input | null
  parentId?: any | null
  popularity?: number | null
  restaurant_taxonomies?: restaurant_tag_arr_rel_insert_input | null
  rgb?: any | null
  slug?: string | null
  type?: string | null
  updated_at?: any | null
}

/**
 * @name tag_max_fields
 * @type OBJECT
 */
export type t_tag_max_fields = FieldsType<
  {
    __typename: t_String<'tag_max_fields'>
    created_at?: t_timestamptz | null
    description?: t_String | null
    displayName?: t_String | null
    frequency?: t_Int | null
    icon?: t_String | null
    id?: t_uuid | null
    name?: t_String | null
    order?: t_Int | null
    parentId?: t_uuid | null
    popularity?: t_Int | null
    slug?: t_String | null
    type?: t_String | null
    updated_at?: t_timestamptz | null
  },
  Extension<'tag_max_fields'>
>

/**
 * @name tag_max_order_by
 * @type INPUT_OBJECT
 */
export type tag_max_order_by = {
  created_at?: order_by | null
  description?: order_by | null
  displayName?: order_by | null
  frequency?: order_by | null
  icon?: order_by | null
  id?: order_by | null
  name?: order_by | null
  order?: order_by | null
  parentId?: order_by | null
  popularity?: order_by | null
  slug?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name tag_min_fields
 * @type OBJECT
 */
export type t_tag_min_fields = FieldsType<
  {
    __typename: t_String<'tag_min_fields'>
    created_at?: t_timestamptz | null
    description?: t_String | null
    displayName?: t_String | null
    frequency?: t_Int | null
    icon?: t_String | null
    id?: t_uuid | null
    name?: t_String | null
    order?: t_Int | null
    parentId?: t_uuid | null
    popularity?: t_Int | null
    slug?: t_String | null
    type?: t_String | null
    updated_at?: t_timestamptz | null
  },
  Extension<'tag_min_fields'>
>

/**
 * @name tag_min_order_by
 * @type INPUT_OBJECT
 */
export type tag_min_order_by = {
  created_at?: order_by | null
  description?: order_by | null
  displayName?: order_by | null
  frequency?: order_by | null
  icon?: order_by | null
  id?: order_by | null
  name?: order_by | null
  order?: order_by | null
  parentId?: order_by | null
  popularity?: order_by | null
  slug?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name tag_mutation_response
 * @type OBJECT
 */
export type t_tag_mutation_response = FieldsType<
  {
    __typename: t_String<'tag_mutation_response'>
    affected_rows: t_Int
    returning: t_tag[]
  },
  Extension<'tag_mutation_response'>
>

/**
 * @name tag_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type tag_obj_rel_insert_input = {
  data: tag_insert_input
  on_conflict?: tag_on_conflict | null
}

/**
 * @name tag_on_conflict
 * @type INPUT_OBJECT
 */
export type tag_on_conflict = {
  constraint: tag_constraint
  update_columns: tag_update_column[]
  where?: tag_bool_exp | null
}

/**
 * @name tag_order_by
 * @type INPUT_OBJECT
 */
export type tag_order_by = {
  alternates?: order_by | null
  categories_aggregate?: tag_tag_aggregate_order_by | null
  created_at?: order_by | null
  default_images?: order_by | null
  description?: order_by | null
  displayName?: order_by | null
  frequency?: order_by | null
  icon?: order_by | null
  id?: order_by | null
  is_ambiguous?: order_by | null
  misc?: order_by | null
  name?: order_by | null
  order?: order_by | null
  parent?: tag_order_by | null
  parentId?: order_by | null
  popularity?: order_by | null
  restaurant_taxonomies_aggregate?: restaurant_tag_aggregate_order_by | null
  rgb?: order_by | null
  slug?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name tag_pk_columns_input
 * @type INPUT_OBJECT
 */
export type tag_pk_columns_input = { id: any }

/**
 * @name tag_prepend_input
 * @type INPUT_OBJECT
 */
export type tag_prepend_input = {
  alternates?: any | null
  default_images?: any | null
  misc?: any | null
  rgb?: any | null
}

/**
 * @name tag_select_column
 * @type ENUM
 */
type t_tag_select_column = EnumType<
  | 'alternates'
  | 'created_at'
  | 'default_images'
  | 'description'
  | 'displayName'
  | 'frequency'
  | 'icon'
  | 'id'
  | 'is_ambiguous'
  | 'misc'
  | 'name'
  | 'order'
  | 'parentId'
  | 'popularity'
  | 'rgb'
  | 'slug'
  | 'type'
  | 'updated_at'
>

/**
 * @name tag_set_input
 * @type INPUT_OBJECT
 */
export type tag_set_input = {
  alternates?: any | null
  created_at?: any | null
  default_images?: any | null
  description?: string | null
  displayName?: string | null
  frequency?: number | null
  icon?: string | null
  id?: any | null
  is_ambiguous?: boolean | null
  misc?: any | null
  name?: string | null
  order?: number | null
  parentId?: any | null
  popularity?: number | null
  rgb?: any | null
  slug?: string | null
  type?: string | null
  updated_at?: any | null
}

/**
 * @name tag_stddev_fields
 * @type OBJECT
 */
export type t_tag_stddev_fields = FieldsType<
  {
    __typename: t_String<'tag_stddev_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
    popularity?: t_Float | null
  },
  Extension<'tag_stddev_fields'>
>

/**
 * @name tag_stddev_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_order_by = {
  frequency?: order_by | null
  order?: order_by | null
  popularity?: order_by | null
}

/**
 * @name tag_stddev_pop_fields
 * @type OBJECT
 */
export type t_tag_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'tag_stddev_pop_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
    popularity?: t_Float | null
  },
  Extension<'tag_stddev_pop_fields'>
>

/**
 * @name tag_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_pop_order_by = {
  frequency?: order_by | null
  order?: order_by | null
  popularity?: order_by | null
}

/**
 * @name tag_stddev_samp_fields
 * @type OBJECT
 */
export type t_tag_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'tag_stddev_samp_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
    popularity?: t_Float | null
  },
  Extension<'tag_stddev_samp_fields'>
>

/**
 * @name tag_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_samp_order_by = {
  frequency?: order_by | null
  order?: order_by | null
  popularity?: order_by | null
}

/**
 * @name tag_sum_fields
 * @type OBJECT
 */
export type t_tag_sum_fields = FieldsType<
  {
    __typename: t_String<'tag_sum_fields'>
    frequency?: t_Int | null
    order?: t_Int | null
    popularity?: t_Int | null
  },
  Extension<'tag_sum_fields'>
>

/**
 * @name tag_sum_order_by
 * @type INPUT_OBJECT
 */
export type tag_sum_order_by = {
  frequency?: order_by | null
  order?: order_by | null
  popularity?: order_by | null
}

/**
 * @name tag_tag
 * @type OBJECT
 */
export type t_tag_tag = FieldsType<
  {
    __typename: t_String<'tag_tag'>
    category: t_tag
    category_tag_id: t_uuid
    main: t_tag
    tag_id: t_uuid
  },
  Extension<'tag_tag'>
>

/**
 * @name tag_tag_aggregate
 * @type OBJECT
 */
export type t_tag_tag_aggregate = FieldsType<
  {
    __typename: t_String<'tag_tag_aggregate'>
    aggregate?: t_tag_tag_aggregate_fields | null
    nodes: t_tag_tag[]
  },
  Extension<'tag_tag_aggregate'>
>

/**
 * @name tag_tag_aggregate_fields
 * @type OBJECT
 */
export type t_tag_tag_aggregate_fields = FieldsType<
  {
    __typename: t_String<'tag_tag_aggregate_fields'>
    count: FieldsTypeArg<
      { columns?: tag_tag_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_tag_tag_max_fields | null
    min?: t_tag_tag_min_fields | null
  },
  Extension<'tag_tag_aggregate_fields'>
>

/**
 * @name tag_tag_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type tag_tag_aggregate_order_by = {
  count?: order_by | null
  max?: tag_tag_max_order_by | null
  min?: tag_tag_min_order_by | null
}

/**
 * @name tag_tag_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type tag_tag_arr_rel_insert_input = {
  data: tag_tag_insert_input[]
  on_conflict?: tag_tag_on_conflict | null
}

/**
 * @name tag_tag_bool_exp
 * @type INPUT_OBJECT
 */
export type tag_tag_bool_exp = {
  _and?: (tag_tag_bool_exp | null)[] | null
  _not?: tag_tag_bool_exp | null
  _or?: (tag_tag_bool_exp | null)[] | null
  category?: tag_bool_exp | null
  category_tag_id?: uuid_comparison_exp | null
  main?: tag_bool_exp | null
  tag_id?: uuid_comparison_exp | null
}

/**
 * @name tag_tag_constraint
 * @type ENUM
 */
type t_tag_tag_constraint = EnumType<'tag_tag_pkey'>

/**
 * @name tag_tag_insert_input
 * @type INPUT_OBJECT
 */
export type tag_tag_insert_input = {
  category?: tag_obj_rel_insert_input | null
  category_tag_id?: any | null
  main?: tag_obj_rel_insert_input | null
  tag_id?: any | null
}

/**
 * @name tag_tag_max_fields
 * @type OBJECT
 */
export type t_tag_tag_max_fields = FieldsType<
  {
    __typename: t_String<'tag_tag_max_fields'>
    category_tag_id?: t_uuid | null
    tag_id?: t_uuid | null
  },
  Extension<'tag_tag_max_fields'>
>

/**
 * @name tag_tag_max_order_by
 * @type INPUT_OBJECT
 */
export type tag_tag_max_order_by = {
  category_tag_id?: order_by | null
  tag_id?: order_by | null
}

/**
 * @name tag_tag_min_fields
 * @type OBJECT
 */
export type t_tag_tag_min_fields = FieldsType<
  {
    __typename: t_String<'tag_tag_min_fields'>
    category_tag_id?: t_uuid | null
    tag_id?: t_uuid | null
  },
  Extension<'tag_tag_min_fields'>
>

/**
 * @name tag_tag_min_order_by
 * @type INPUT_OBJECT
 */
export type tag_tag_min_order_by = {
  category_tag_id?: order_by | null
  tag_id?: order_by | null
}

/**
 * @name tag_tag_mutation_response
 * @type OBJECT
 */
export type t_tag_tag_mutation_response = FieldsType<
  {
    __typename: t_String<'tag_tag_mutation_response'>
    affected_rows: t_Int
    returning: t_tag_tag[]
  },
  Extension<'tag_tag_mutation_response'>
>

/**
 * @name tag_tag_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type tag_tag_obj_rel_insert_input = {
  data: tag_tag_insert_input
  on_conflict?: tag_tag_on_conflict | null
}

/**
 * @name tag_tag_on_conflict
 * @type INPUT_OBJECT
 */
export type tag_tag_on_conflict = {
  constraint: tag_tag_constraint
  update_columns: tag_tag_update_column[]
  where?: tag_tag_bool_exp | null
}

/**
 * @name tag_tag_order_by
 * @type INPUT_OBJECT
 */
export type tag_tag_order_by = {
  category?: tag_order_by | null
  category_tag_id?: order_by | null
  main?: tag_order_by | null
  tag_id?: order_by | null
}

/**
 * @name tag_tag_pk_columns_input
 * @type INPUT_OBJECT
 */
export type tag_tag_pk_columns_input = { category_tag_id: any; tag_id: any }

/**
 * @name tag_tag_select_column
 * @type ENUM
 */
type t_tag_tag_select_column = EnumType<'category_tag_id' | 'tag_id'>

/**
 * @name tag_tag_set_input
 * @type INPUT_OBJECT
 */
export type tag_tag_set_input = {
  category_tag_id?: any | null
  tag_id?: any | null
}

/**
 * @name tag_tag_update_column
 * @type ENUM
 */
type t_tag_tag_update_column = EnumType<'category_tag_id' | 'tag_id'>

/**
 * @name tag_update_column
 * @type ENUM
 */
type t_tag_update_column = EnumType<
  | 'alternates'
  | 'created_at'
  | 'default_images'
  | 'description'
  | 'displayName'
  | 'frequency'
  | 'icon'
  | 'id'
  | 'is_ambiguous'
  | 'misc'
  | 'name'
  | 'order'
  | 'parentId'
  | 'popularity'
  | 'rgb'
  | 'slug'
  | 'type'
  | 'updated_at'
>

/**
 * @name tag_var_pop_fields
 * @type OBJECT
 */
export type t_tag_var_pop_fields = FieldsType<
  {
    __typename: t_String<'tag_var_pop_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
    popularity?: t_Float | null
  },
  Extension<'tag_var_pop_fields'>
>

/**
 * @name tag_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type tag_var_pop_order_by = {
  frequency?: order_by | null
  order?: order_by | null
  popularity?: order_by | null
}

/**
 * @name tag_var_samp_fields
 * @type OBJECT
 */
export type t_tag_var_samp_fields = FieldsType<
  {
    __typename: t_String<'tag_var_samp_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
    popularity?: t_Float | null
  },
  Extension<'tag_var_samp_fields'>
>

/**
 * @name tag_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type tag_var_samp_order_by = {
  frequency?: order_by | null
  order?: order_by | null
  popularity?: order_by | null
}

/**
 * @name tag_variance_fields
 * @type OBJECT
 */
export type t_tag_variance_fields = FieldsType<
  {
    __typename: t_String<'tag_variance_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
    popularity?: t_Float | null
  },
  Extension<'tag_variance_fields'>
>

/**
 * @name tag_variance_order_by
 * @type INPUT_OBJECT
 */
export type tag_variance_order_by = {
  frequency?: order_by | null
  order?: order_by | null
  popularity?: order_by | null
}

/**
 * @name timestamptz
 * @type SCALAR
 */
type t_timestamptz<T extends any = any> = ScalarType<
  T,
  Extension<'timestamptz'>
>

/**
 * @name timestamptz_comparison_exp
 * @type INPUT_OBJECT
 */
export type timestamptz_comparison_exp = {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * @name tsrange
 * @type SCALAR
 */
type t_tsrange<T extends any = any> = ScalarType<T, Extension<'tsrange'>>

/**
 * @name tsrange_comparison_exp
 * @type INPUT_OBJECT
 */
export type tsrange_comparison_exp = {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * @name user
 * @type OBJECT
 */
export type t_user = FieldsType<
  {
    __typename: t_String<'user'>
    about?: t_String | null
    apple_email?: t_String | null
    apple_refresh_token?: t_String | null
    apple_token?: t_String | null
    apple_uid?: t_String | null
    avatar?: t_String | null
    charIndex: t_Int
    created_at: t_timestamptz
    email?: t_String | null
    has_onboarded: t_Boolean
    id: t_uuid
    location?: t_String | null
    password: t_String
    reviews: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    reviews_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review_aggregate
    >
    role?: t_String | null
    updated_at: t_timestamptz
    username: t_String
  },
  Extension<'user'>
>

/**
 * @name user_aggregate
 * @type OBJECT
 */
export type t_user_aggregate = FieldsType<
  {
    __typename: t_String<'user_aggregate'>
    aggregate?: t_user_aggregate_fields | null
    nodes: t_user[]
  },
  Extension<'user_aggregate'>
>

/**
 * @name user_aggregate_fields
 * @type OBJECT
 */
export type t_user_aggregate_fields = FieldsType<
  {
    __typename: t_String<'user_aggregate_fields'>
    avg?: t_user_avg_fields | null
    count: FieldsTypeArg<
      { columns?: user_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_user_max_fields | null
    min?: t_user_min_fields | null
    stddev?: t_user_stddev_fields | null
    stddev_pop?: t_user_stddev_pop_fields | null
    stddev_samp?: t_user_stddev_samp_fields | null
    sum?: t_user_sum_fields | null
    var_pop?: t_user_var_pop_fields | null
    var_samp?: t_user_var_samp_fields | null
    variance?: t_user_variance_fields | null
  },
  Extension<'user_aggregate_fields'>
>

/**
 * @name user_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type user_aggregate_order_by = {
  avg?: user_avg_order_by | null
  count?: order_by | null
  max?: user_max_order_by | null
  min?: user_min_order_by | null
  stddev?: user_stddev_order_by | null
  stddev_pop?: user_stddev_pop_order_by | null
  stddev_samp?: user_stddev_samp_order_by | null
  sum?: user_sum_order_by | null
  var_pop?: user_var_pop_order_by | null
  var_samp?: user_var_samp_order_by | null
  variance?: user_variance_order_by | null
}

/**
 * @name user_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type user_arr_rel_insert_input = {
  data: user_insert_input[]
  on_conflict?: user_on_conflict | null
}

/**
 * @name user_avg_fields
 * @type OBJECT
 */
export type t_user_avg_fields = FieldsType<
  {
    __typename: t_String<'user_avg_fields'>
    charIndex?: t_Float | null
  },
  Extension<'user_avg_fields'>
>

/**
 * @name user_avg_order_by
 * @type INPUT_OBJECT
 */
export type user_avg_order_by = { charIndex?: order_by | null }

/**
 * @name user_bool_exp
 * @type INPUT_OBJECT
 */
export type user_bool_exp = {
  _and?: (user_bool_exp | null)[] | null
  _not?: user_bool_exp | null
  _or?: (user_bool_exp | null)[] | null
  about?: String_comparison_exp | null
  apple_email?: String_comparison_exp | null
  apple_refresh_token?: String_comparison_exp | null
  apple_token?: String_comparison_exp | null
  apple_uid?: String_comparison_exp | null
  avatar?: String_comparison_exp | null
  charIndex?: Int_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  email?: String_comparison_exp | null
  has_onboarded?: Boolean_comparison_exp | null
  id?: uuid_comparison_exp | null
  location?: String_comparison_exp | null
  password?: String_comparison_exp | null
  reviews?: review_bool_exp | null
  role?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  username?: String_comparison_exp | null
}

/**
 * @name user_constraint
 * @type ENUM
 */
type t_user_constraint = EnumType<
  'user_email_key' | 'user_pkey' | 'user_username_key'
>

/**
 * @name user_inc_input
 * @type INPUT_OBJECT
 */
export type user_inc_input = { charIndex?: number | null }

/**
 * @name user_insert_input
 * @type INPUT_OBJECT
 */
export type user_insert_input = {
  about?: string | null
  apple_email?: string | null
  apple_refresh_token?: string | null
  apple_token?: string | null
  apple_uid?: string | null
  avatar?: string | null
  charIndex?: number | null
  created_at?: any | null
  email?: string | null
  has_onboarded?: boolean | null
  id?: any | null
  location?: string | null
  password?: string | null
  reviews?: review_arr_rel_insert_input | null
  role?: string | null
  updated_at?: any | null
  username?: string | null
}

/**
 * @name user_max_fields
 * @type OBJECT
 */
export type t_user_max_fields = FieldsType<
  {
    __typename: t_String<'user_max_fields'>
    about?: t_String | null
    apple_email?: t_String | null
    apple_refresh_token?: t_String | null
    apple_token?: t_String | null
    apple_uid?: t_String | null
    avatar?: t_String | null
    charIndex?: t_Int | null
    created_at?: t_timestamptz | null
    email?: t_String | null
    id?: t_uuid | null
    location?: t_String | null
    password?: t_String | null
    role?: t_String | null
    updated_at?: t_timestamptz | null
    username?: t_String | null
  },
  Extension<'user_max_fields'>
>

/**
 * @name user_max_order_by
 * @type INPUT_OBJECT
 */
export type user_max_order_by = {
  about?: order_by | null
  apple_email?: order_by | null
  apple_refresh_token?: order_by | null
  apple_token?: order_by | null
  apple_uid?: order_by | null
  avatar?: order_by | null
  charIndex?: order_by | null
  created_at?: order_by | null
  email?: order_by | null
  id?: order_by | null
  location?: order_by | null
  password?: order_by | null
  role?: order_by | null
  updated_at?: order_by | null
  username?: order_by | null
}

/**
 * @name user_min_fields
 * @type OBJECT
 */
export type t_user_min_fields = FieldsType<
  {
    __typename: t_String<'user_min_fields'>
    about?: t_String | null
    apple_email?: t_String | null
    apple_refresh_token?: t_String | null
    apple_token?: t_String | null
    apple_uid?: t_String | null
    avatar?: t_String | null
    charIndex?: t_Int | null
    created_at?: t_timestamptz | null
    email?: t_String | null
    id?: t_uuid | null
    location?: t_String | null
    password?: t_String | null
    role?: t_String | null
    updated_at?: t_timestamptz | null
    username?: t_String | null
  },
  Extension<'user_min_fields'>
>

/**
 * @name user_min_order_by
 * @type INPUT_OBJECT
 */
export type user_min_order_by = {
  about?: order_by | null
  apple_email?: order_by | null
  apple_refresh_token?: order_by | null
  apple_token?: order_by | null
  apple_uid?: order_by | null
  avatar?: order_by | null
  charIndex?: order_by | null
  created_at?: order_by | null
  email?: order_by | null
  id?: order_by | null
  location?: order_by | null
  password?: order_by | null
  role?: order_by | null
  updated_at?: order_by | null
  username?: order_by | null
}

/**
 * @name user_mutation_response
 * @type OBJECT
 */
export type t_user_mutation_response = FieldsType<
  {
    __typename: t_String<'user_mutation_response'>
    affected_rows: t_Int
    returning: t_user[]
  },
  Extension<'user_mutation_response'>
>

/**
 * @name user_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type user_obj_rel_insert_input = {
  data: user_insert_input
  on_conflict?: user_on_conflict | null
}

/**
 * @name user_on_conflict
 * @type INPUT_OBJECT
 */
export type user_on_conflict = {
  constraint: user_constraint
  update_columns: user_update_column[]
  where?: user_bool_exp | null
}

/**
 * @name user_order_by
 * @type INPUT_OBJECT
 */
export type user_order_by = {
  about?: order_by | null
  apple_email?: order_by | null
  apple_refresh_token?: order_by | null
  apple_token?: order_by | null
  apple_uid?: order_by | null
  avatar?: order_by | null
  charIndex?: order_by | null
  created_at?: order_by | null
  email?: order_by | null
  has_onboarded?: order_by | null
  id?: order_by | null
  location?: order_by | null
  password?: order_by | null
  reviews_aggregate?: review_aggregate_order_by | null
  role?: order_by | null
  updated_at?: order_by | null
  username?: order_by | null
}

/**
 * @name user_pk_columns_input
 * @type INPUT_OBJECT
 */
export type user_pk_columns_input = { id: any }

/**
 * @name user_select_column
 * @type ENUM
 */
type t_user_select_column = EnumType<
  | 'about'
  | 'apple_email'
  | 'apple_refresh_token'
  | 'apple_token'
  | 'apple_uid'
  | 'avatar'
  | 'charIndex'
  | 'created_at'
  | 'email'
  | 'has_onboarded'
  | 'id'
  | 'location'
  | 'password'
  | 'role'
  | 'updated_at'
  | 'username'
>

/**
 * @name user_set_input
 * @type INPUT_OBJECT
 */
export type user_set_input = {
  about?: string | null
  apple_email?: string | null
  apple_refresh_token?: string | null
  apple_token?: string | null
  apple_uid?: string | null
  avatar?: string | null
  charIndex?: number | null
  created_at?: any | null
  email?: string | null
  has_onboarded?: boolean | null
  id?: any | null
  location?: string | null
  password?: string | null
  role?: string | null
  updated_at?: any | null
  username?: string | null
}

/**
 * @name user_stddev_fields
 * @type OBJECT
 */
export type t_user_stddev_fields = FieldsType<
  {
    __typename: t_String<'user_stddev_fields'>
    charIndex?: t_Float | null
  },
  Extension<'user_stddev_fields'>
>

/**
 * @name user_stddev_order_by
 * @type INPUT_OBJECT
 */
export type user_stddev_order_by = { charIndex?: order_by | null }

/**
 * @name user_stddev_pop_fields
 * @type OBJECT
 */
export type t_user_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'user_stddev_pop_fields'>
    charIndex?: t_Float | null
  },
  Extension<'user_stddev_pop_fields'>
>

/**
 * @name user_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type user_stddev_pop_order_by = { charIndex?: order_by | null }

/**
 * @name user_stddev_samp_fields
 * @type OBJECT
 */
export type t_user_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'user_stddev_samp_fields'>
    charIndex?: t_Float | null
  },
  Extension<'user_stddev_samp_fields'>
>

/**
 * @name user_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type user_stddev_samp_order_by = { charIndex?: order_by | null }

/**
 * @name user_sum_fields
 * @type OBJECT
 */
export type t_user_sum_fields = FieldsType<
  {
    __typename: t_String<'user_sum_fields'>
    charIndex?: t_Int | null
  },
  Extension<'user_sum_fields'>
>

/**
 * @name user_sum_order_by
 * @type INPUT_OBJECT
 */
export type user_sum_order_by = { charIndex?: order_by | null }

/**
 * @name user_update_column
 * @type ENUM
 */
type t_user_update_column = EnumType<
  | 'about'
  | 'apple_email'
  | 'apple_refresh_token'
  | 'apple_token'
  | 'apple_uid'
  | 'avatar'
  | 'charIndex'
  | 'created_at'
  | 'email'
  | 'has_onboarded'
  | 'id'
  | 'location'
  | 'password'
  | 'role'
  | 'updated_at'
  | 'username'
>

/**
 * @name user_var_pop_fields
 * @type OBJECT
 */
export type t_user_var_pop_fields = FieldsType<
  {
    __typename: t_String<'user_var_pop_fields'>
    charIndex?: t_Float | null
  },
  Extension<'user_var_pop_fields'>
>

/**
 * @name user_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type user_var_pop_order_by = { charIndex?: order_by | null }

/**
 * @name user_var_samp_fields
 * @type OBJECT
 */
export type t_user_var_samp_fields = FieldsType<
  {
    __typename: t_String<'user_var_samp_fields'>
    charIndex?: t_Float | null
  },
  Extension<'user_var_samp_fields'>
>

/**
 * @name user_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type user_var_samp_order_by = { charIndex?: order_by | null }

/**
 * @name user_variance_fields
 * @type OBJECT
 */
export type t_user_variance_fields = FieldsType<
  {
    __typename: t_String<'user_variance_fields'>
    charIndex?: t_Float | null
  },
  Extension<'user_variance_fields'>
>

/**
 * @name user_variance_order_by
 * @type INPUT_OBJECT
 */
export type user_variance_order_by = { charIndex?: order_by | null }

/**
 * @name uuid
 * @type SCALAR
 */
type t_uuid<T extends any = any> = ScalarType<T, Extension<'uuid'>>

/**
 * @name uuid_comparison_exp
 * @type INPUT_OBJECT
 */
export type uuid_comparison_exp = {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * @name Boolean
 * @type SCALAR
 */
export type Boolean = TypeData<t_Boolean>

/**
 * @name Float
 * @type SCALAR
 */
export type Float = TypeData<t_Float>

/**
 * @name ID
 * @type SCALAR
 */
export type ID = TypeData<t_ID>

/**
 * @name Int
 * @type SCALAR
 */
export type Int = TypeData<t_Int>

/**
 * @name String
 * @type SCALAR
 */
export type String = TypeData<t_String>

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

/**
 * @name geography
 * @type SCALAR
 */
export type geography = TypeData<t_geography>

/**
 * @name geometry
 * @type SCALAR
 */
export type geometry = TypeData<t_geometry>

/**
 * @name jsonb
 * @type SCALAR
 */
export type jsonb = TypeData<t_jsonb>

/**
 * @name menu_item
 * @type OBJECT
 */
export type menu_item = TypeData<t_menu_item>

/**
 * @name menu_item_aggregate
 * @type OBJECT
 */
export type menu_item_aggregate = TypeData<t_menu_item_aggregate>

/**
 * @name menu_item_aggregate_fields
 * @type OBJECT
 */
export type menu_item_aggregate_fields = TypeData<t_menu_item_aggregate_fields>

/**
 * @name menu_item_avg_fields
 * @type OBJECT
 */
export type menu_item_avg_fields = TypeData<t_menu_item_avg_fields>

/**
 * @name menu_item_constraint
 * @type ENUM
 */
export enum menu_item_constraint {
  menu_item_pkey = 'menu_item_pkey',
  menu_item_restaurant_id_name_key = 'menu_item_restaurant_id_name_key',
}

/**
 * @name menu_item_max_fields
 * @type OBJECT
 */
export type menu_item_max_fields = TypeData<t_menu_item_max_fields>

/**
 * @name menu_item_min_fields
 * @type OBJECT
 */
export type menu_item_min_fields = TypeData<t_menu_item_min_fields>

/**
 * @name menu_item_mutation_response
 * @type OBJECT
 */
export type menu_item_mutation_response = TypeData<
  t_menu_item_mutation_response
>

/**
 * @name menu_item_select_column
 * @type ENUM
 */
export enum menu_item_select_column {
  created_at = 'created_at',
  description = 'description',
  id = 'id',
  image = 'image',
  location = 'location',
  name = 'name',
  price = 'price',
  restaurant_id = 'restaurant_id',
  updated_at = 'updated_at',
}

/**
 * @name menu_item_stddev_fields
 * @type OBJECT
 */
export type menu_item_stddev_fields = TypeData<t_menu_item_stddev_fields>

/**
 * @name menu_item_stddev_pop_fields
 * @type OBJECT
 */
export type menu_item_stddev_pop_fields = TypeData<
  t_menu_item_stddev_pop_fields
>

/**
 * @name menu_item_stddev_samp_fields
 * @type OBJECT
 */
export type menu_item_stddev_samp_fields = TypeData<
  t_menu_item_stddev_samp_fields
>

/**
 * @name menu_item_sum_fields
 * @type OBJECT
 */
export type menu_item_sum_fields = TypeData<t_menu_item_sum_fields>

/**
 * @name menu_item_update_column
 * @type ENUM
 */
export enum menu_item_update_column {
  created_at = 'created_at',
  description = 'description',
  id = 'id',
  image = 'image',
  location = 'location',
  name = 'name',
  price = 'price',
  restaurant_id = 'restaurant_id',
  updated_at = 'updated_at',
}

/**
 * @name menu_item_var_pop_fields
 * @type OBJECT
 */
export type menu_item_var_pop_fields = TypeData<t_menu_item_var_pop_fields>

/**
 * @name menu_item_var_samp_fields
 * @type OBJECT
 */
export type menu_item_var_samp_fields = TypeData<t_menu_item_var_samp_fields>

/**
 * @name menu_item_variance_fields
 * @type OBJECT
 */
export type menu_item_variance_fields = TypeData<t_menu_item_variance_fields>

/**
 * @name mutation_root
 * @type OBJECT
 */
export type mutation_root = TypeData<t_mutation_root>

/**
 * @name numeric
 * @type SCALAR
 */
export type numeric = TypeData<t_numeric>

/**
 * @name opening_hours
 * @type OBJECT
 */
export type opening_hours = TypeData<t_opening_hours>

/**
 * @name opening_hours_aggregate
 * @type OBJECT
 */
export type opening_hours_aggregate = TypeData<t_opening_hours_aggregate>

/**
 * @name opening_hours_aggregate_fields
 * @type OBJECT
 */
export type opening_hours_aggregate_fields = TypeData<
  t_opening_hours_aggregate_fields
>

/**
 * @name opening_hours_constraint
 * @type ENUM
 */
export enum opening_hours_constraint {
  opening_hours_pkey = 'opening_hours_pkey',
}

/**
 * @name opening_hours_max_fields
 * @type OBJECT
 */
export type opening_hours_max_fields = TypeData<t_opening_hours_max_fields>

/**
 * @name opening_hours_min_fields
 * @type OBJECT
 */
export type opening_hours_min_fields = TypeData<t_opening_hours_min_fields>

/**
 * @name opening_hours_mutation_response
 * @type OBJECT
 */
export type opening_hours_mutation_response = TypeData<
  t_opening_hours_mutation_response
>

/**
 * @name opening_hours_select_column
 * @type ENUM
 */
export enum opening_hours_select_column {
  hours = 'hours',
  id = 'id',
  restaurant_id = 'restaurant_id',
}

/**
 * @name opening_hours_update_column
 * @type ENUM
 */
export enum opening_hours_update_column {
  hours = 'hours',
  id = 'id',
  restaurant_id = 'restaurant_id',
}

/**
 * @name order_by
 * @type ENUM
 */
export enum order_by {
  asc = 'asc',
  asc_nulls_first = 'asc_nulls_first',
  asc_nulls_last = 'asc_nulls_last',
  desc = 'desc',
  desc_nulls_first = 'desc_nulls_first',
  desc_nulls_last = 'desc_nulls_last',
}

/**
 * @name photo
 * @type OBJECT
 */
export type photo = TypeData<t_photo>

/**
 * @name photo_aggregate
 * @type OBJECT
 */
export type photo_aggregate = TypeData<t_photo_aggregate>

/**
 * @name photo_aggregate_fields
 * @type OBJECT
 */
export type photo_aggregate_fields = TypeData<t_photo_aggregate_fields>

/**
 * @name photo_avg_fields
 * @type OBJECT
 */
export type photo_avg_fields = TypeData<t_photo_avg_fields>

/**
 * @name photo_constraint
 * @type ENUM
 */
export enum photo_constraint {
  photo_origin_key = 'photo_origin_key',
  photo_url_key = 'photo_url_key',
  photos_pkey = 'photos_pkey',
}

/**
 * @name photo_max_fields
 * @type OBJECT
 */
export type photo_max_fields = TypeData<t_photo_max_fields>

/**
 * @name photo_min_fields
 * @type OBJECT
 */
export type photo_min_fields = TypeData<t_photo_min_fields>

/**
 * @name photo_mutation_response
 * @type OBJECT
 */
export type photo_mutation_response = TypeData<t_photo_mutation_response>

/**
 * @name photo_select_column
 * @type ENUM
 */
export enum photo_select_column {
  created_at = 'created_at',
  id = 'id',
  origin = 'origin',
  quality = 'quality',
  updated_at = 'updated_at',
  url = 'url',
}

/**
 * @name photo_stddev_fields
 * @type OBJECT
 */
export type photo_stddev_fields = TypeData<t_photo_stddev_fields>

/**
 * @name photo_stddev_pop_fields
 * @type OBJECT
 */
export type photo_stddev_pop_fields = TypeData<t_photo_stddev_pop_fields>

/**
 * @name photo_stddev_samp_fields
 * @type OBJECT
 */
export type photo_stddev_samp_fields = TypeData<t_photo_stddev_samp_fields>

/**
 * @name photo_sum_fields
 * @type OBJECT
 */
export type photo_sum_fields = TypeData<t_photo_sum_fields>

/**
 * @name photo_update_column
 * @type ENUM
 */
export enum photo_update_column {
  created_at = 'created_at',
  id = 'id',
  origin = 'origin',
  quality = 'quality',
  updated_at = 'updated_at',
  url = 'url',
}

/**
 * @name photo_var_pop_fields
 * @type OBJECT
 */
export type photo_var_pop_fields = TypeData<t_photo_var_pop_fields>

/**
 * @name photo_var_samp_fields
 * @type OBJECT
 */
export type photo_var_samp_fields = TypeData<t_photo_var_samp_fields>

/**
 * @name photo_variance_fields
 * @type OBJECT
 */
export type photo_variance_fields = TypeData<t_photo_variance_fields>

/**
 * @name photo_xref
 * @type OBJECT
 */
export type photo_xref = TypeData<t_photo_xref>

/**
 * @name photo_xref_aggregate
 * @type OBJECT
 */
export type photo_xref_aggregate = TypeData<t_photo_xref_aggregate>

/**
 * @name photo_xref_aggregate_fields
 * @type OBJECT
 */
export type photo_xref_aggregate_fields = TypeData<
  t_photo_xref_aggregate_fields
>

/**
 * @name photo_xref_constraint
 * @type ENUM
 */
export enum photo_xref_constraint {
  photos_xref_photos_id_restaurant_id_tag_id_key = 'photos_xref_photos_id_restaurant_id_tag_id_key',
  photos_xref_pkey = 'photos_xref_pkey',
}

/**
 * @name photo_xref_max_fields
 * @type OBJECT
 */
export type photo_xref_max_fields = TypeData<t_photo_xref_max_fields>

/**
 * @name photo_xref_min_fields
 * @type OBJECT
 */
export type photo_xref_min_fields = TypeData<t_photo_xref_min_fields>

/**
 * @name photo_xref_mutation_response
 * @type OBJECT
 */
export type photo_xref_mutation_response = TypeData<
  t_photo_xref_mutation_response
>

/**
 * @name photo_xref_select_column
 * @type ENUM
 */
export enum photo_xref_select_column {
  id = 'id',
  photo_id = 'photo_id',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
  type = 'type',
}

/**
 * @name photo_xref_update_column
 * @type ENUM
 */
export enum photo_xref_update_column {
  id = 'id',
  photo_id = 'photo_id',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
  type = 'type',
}

/**
 * @name query_root
 * @type OBJECT
 */
export type query_root = TypeData<t_query_root>

/**
 * @name restaurant
 * @type OBJECT
 */
export type restaurant = TypeData<t_restaurant>

/**
 * @name restaurant_aggregate
 * @type OBJECT
 */
export type restaurant_aggregate = TypeData<t_restaurant_aggregate>

/**
 * @name restaurant_aggregate_fields
 * @type OBJECT
 */
export type restaurant_aggregate_fields = TypeData<
  t_restaurant_aggregate_fields
>

/**
 * @name restaurant_avg_fields
 * @type OBJECT
 */
export type restaurant_avg_fields = TypeData<t_restaurant_avg_fields>

/**
 * @name restaurant_constraint
 * @type ENUM
 */
export enum restaurant_constraint {
  restaurant_geocoder_id_key = 'restaurant_geocoder_id_key',
  restaurant_name_address_key = 'restaurant_name_address_key',
  restaurant_pkey = 'restaurant_pkey',
  restaurant_slug_key = 'restaurant_slug_key',
}

/**
 * @name restaurant_max_fields
 * @type OBJECT
 */
export type restaurant_max_fields = TypeData<t_restaurant_max_fields>

/**
 * @name restaurant_min_fields
 * @type OBJECT
 */
export type restaurant_min_fields = TypeData<t_restaurant_min_fields>

/**
 * @name restaurant_mutation_response
 * @type OBJECT
 */
export type restaurant_mutation_response = TypeData<
  t_restaurant_mutation_response
>

/**
 * @name restaurant_select_column
 * @type ENUM
 */
export enum restaurant_select_column {
  address = 'address',
  city = 'city',
  created_at = 'created_at',
  description = 'description',
  downvotes = 'downvotes',
  geocoder_id = 'geocoder_id',
  headlines = 'headlines',
  hours = 'hours',
  id = 'id',
  image = 'image',
  location = 'location',
  name = 'name',
  oldest_review_date = 'oldest_review_date',
  photos = 'photos',
  price_range = 'price_range',
  rating = 'rating',
  rating_factors = 'rating_factors',
  score = 'score',
  score_breakdown = 'score_breakdown',
  slug = 'slug',
  source_breakdown = 'source_breakdown',
  sources = 'sources',
  state = 'state',
  summary = 'summary',
  tag_names = 'tag_names',
  telephone = 'telephone',
  updated_at = 'updated_at',
  upvotes = 'upvotes',
  votes_ratio = 'votes_ratio',
  website = 'website',
  zip = 'zip',
}

/**
 * @name restaurant_stddev_fields
 * @type OBJECT
 */
export type restaurant_stddev_fields = TypeData<t_restaurant_stddev_fields>

/**
 * @name restaurant_stddev_pop_fields
 * @type OBJECT
 */
export type restaurant_stddev_pop_fields = TypeData<
  t_restaurant_stddev_pop_fields
>

/**
 * @name restaurant_stddev_samp_fields
 * @type OBJECT
 */
export type restaurant_stddev_samp_fields = TypeData<
  t_restaurant_stddev_samp_fields
>

/**
 * @name restaurant_sum_fields
 * @type OBJECT
 */
export type restaurant_sum_fields = TypeData<t_restaurant_sum_fields>

/**
 * @name restaurant_tag
 * @type OBJECT
 */
export type restaurant_tag = TypeData<t_restaurant_tag>

/**
 * @name restaurant_tag_aggregate
 * @type OBJECT
 */
export type restaurant_tag_aggregate = TypeData<t_restaurant_tag_aggregate>

/**
 * @name restaurant_tag_aggregate_fields
 * @type OBJECT
 */
export type restaurant_tag_aggregate_fields = TypeData<
  t_restaurant_tag_aggregate_fields
>

/**
 * @name restaurant_tag_avg_fields
 * @type OBJECT
 */
export type restaurant_tag_avg_fields = TypeData<t_restaurant_tag_avg_fields>

/**
 * @name restaurant_tag_constraint
 * @type ENUM
 */
export enum restaurant_tag_constraint {
  restaurant_tag_id_key = 'restaurant_tag_id_key',
  restaurant_tag_pkey = 'restaurant_tag_pkey',
}

/**
 * @name restaurant_tag_max_fields
 * @type OBJECT
 */
export type restaurant_tag_max_fields = TypeData<t_restaurant_tag_max_fields>

/**
 * @name restaurant_tag_min_fields
 * @type OBJECT
 */
export type restaurant_tag_min_fields = TypeData<t_restaurant_tag_min_fields>

/**
 * @name restaurant_tag_mutation_response
 * @type OBJECT
 */
export type restaurant_tag_mutation_response = TypeData<
  t_restaurant_tag_mutation_response
>

/**
 * @name restaurant_tag_select_column
 * @type ENUM
 */
export enum restaurant_tag_select_column {
  downvotes = 'downvotes',
  id = 'id',
  photos = 'photos',
  rank = 'rank',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  review_mentions_count = 'review_mentions_count',
  score = 'score',
  score_breakdown = 'score_breakdown',
  source_breakdown = 'source_breakdown',
  tag_id = 'tag_id',
  upvotes = 'upvotes',
  votes_ratio = 'votes_ratio',
}

/**
 * @name restaurant_tag_stddev_fields
 * @type OBJECT
 */
export type restaurant_tag_stddev_fields = TypeData<
  t_restaurant_tag_stddev_fields
>

/**
 * @name restaurant_tag_stddev_pop_fields
 * @type OBJECT
 */
export type restaurant_tag_stddev_pop_fields = TypeData<
  t_restaurant_tag_stddev_pop_fields
>

/**
 * @name restaurant_tag_stddev_samp_fields
 * @type OBJECT
 */
export type restaurant_tag_stddev_samp_fields = TypeData<
  t_restaurant_tag_stddev_samp_fields
>

/**
 * @name restaurant_tag_sum_fields
 * @type OBJECT
 */
export type restaurant_tag_sum_fields = TypeData<t_restaurant_tag_sum_fields>

/**
 * @name restaurant_tag_update_column
 * @type ENUM
 */
export enum restaurant_tag_update_column {
  downvotes = 'downvotes',
  id = 'id',
  photos = 'photos',
  rank = 'rank',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  review_mentions_count = 'review_mentions_count',
  score = 'score',
  score_breakdown = 'score_breakdown',
  source_breakdown = 'source_breakdown',
  tag_id = 'tag_id',
  upvotes = 'upvotes',
  votes_ratio = 'votes_ratio',
}

/**
 * @name restaurant_tag_var_pop_fields
 * @type OBJECT
 */
export type restaurant_tag_var_pop_fields = TypeData<
  t_restaurant_tag_var_pop_fields
>

/**
 * @name restaurant_tag_var_samp_fields
 * @type OBJECT
 */
export type restaurant_tag_var_samp_fields = TypeData<
  t_restaurant_tag_var_samp_fields
>

/**
 * @name restaurant_tag_variance_fields
 * @type OBJECT
 */
export type restaurant_tag_variance_fields = TypeData<
  t_restaurant_tag_variance_fields
>

/**
 * @name restaurant_update_column
 * @type ENUM
 */
export enum restaurant_update_column {
  address = 'address',
  city = 'city',
  created_at = 'created_at',
  description = 'description',
  downvotes = 'downvotes',
  geocoder_id = 'geocoder_id',
  headlines = 'headlines',
  hours = 'hours',
  id = 'id',
  image = 'image',
  location = 'location',
  name = 'name',
  oldest_review_date = 'oldest_review_date',
  photos = 'photos',
  price_range = 'price_range',
  rating = 'rating',
  rating_factors = 'rating_factors',
  score = 'score',
  score_breakdown = 'score_breakdown',
  slug = 'slug',
  source_breakdown = 'source_breakdown',
  sources = 'sources',
  state = 'state',
  summary = 'summary',
  tag_names = 'tag_names',
  telephone = 'telephone',
  updated_at = 'updated_at',
  upvotes = 'upvotes',
  votes_ratio = 'votes_ratio',
  website = 'website',
  zip = 'zip',
}

/**
 * @name restaurant_var_pop_fields
 * @type OBJECT
 */
export type restaurant_var_pop_fields = TypeData<t_restaurant_var_pop_fields>

/**
 * @name restaurant_var_samp_fields
 * @type OBJECT
 */
export type restaurant_var_samp_fields = TypeData<t_restaurant_var_samp_fields>

/**
 * @name restaurant_variance_fields
 * @type OBJECT
 */
export type restaurant_variance_fields = TypeData<t_restaurant_variance_fields>

/**
 * @name review
 * @type OBJECT
 */
export type review = TypeData<t_review>

/**
 * @name review_aggregate
 * @type OBJECT
 */
export type review_aggregate = TypeData<t_review_aggregate>

/**
 * @name review_aggregate_fields
 * @type OBJECT
 */
export type review_aggregate_fields = TypeData<t_review_aggregate_fields>

/**
 * @name review_avg_fields
 * @type OBJECT
 */
export type review_avg_fields = TypeData<t_review_avg_fields>

/**
 * @name review_constraint
 * @type ENUM
 */
export enum review_constraint {
  review_native_data_unique_constraint = 'review_native_data_unique_constraint',
  review_native_data_unique_key_key = 'review_native_data_unique_key_key',
  review_pkey = 'review_pkey',
  review_username_restaurant_id_tag_id_authored_at_key = 'review_username_restaurant_id_tag_id_authored_at_key',
}

/**
 * @name review_max_fields
 * @type OBJECT
 */
export type review_max_fields = TypeData<t_review_max_fields>

/**
 * @name review_min_fields
 * @type OBJECT
 */
export type review_min_fields = TypeData<t_review_min_fields>

/**
 * @name review_mutation_response
 * @type OBJECT
 */
export type review_mutation_response = TypeData<t_review_mutation_response>

/**
 * @name review_select_column
 * @type ENUM
 */
export enum review_select_column {
  authored_at = 'authored_at',
  categories = 'categories',
  favorited = 'favorited',
  id = 'id',
  location = 'location',
  native_data_unique_key = 'native_data_unique_key',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  source = 'source',
  tag_id = 'tag_id',
  text = 'text',
  type = 'type',
  updated_at = 'updated_at',
  user_id = 'user_id',
  username = 'username',
  vote = 'vote',
}

/**
 * @name review_stddev_fields
 * @type OBJECT
 */
export type review_stddev_fields = TypeData<t_review_stddev_fields>

/**
 * @name review_stddev_pop_fields
 * @type OBJECT
 */
export type review_stddev_pop_fields = TypeData<t_review_stddev_pop_fields>

/**
 * @name review_stddev_samp_fields
 * @type OBJECT
 */
export type review_stddev_samp_fields = TypeData<t_review_stddev_samp_fields>

/**
 * @name review_sum_fields
 * @type OBJECT
 */
export type review_sum_fields = TypeData<t_review_sum_fields>

/**
 * @name review_tag_sentence
 * @type OBJECT
 */
export type review_tag_sentence = TypeData<t_review_tag_sentence>

/**
 * @name review_tag_sentence_aggregate
 * @type OBJECT
 */
export type review_tag_sentence_aggregate = TypeData<
  t_review_tag_sentence_aggregate
>

/**
 * @name review_tag_sentence_aggregate_fields
 * @type OBJECT
 */
export type review_tag_sentence_aggregate_fields = TypeData<
  t_review_tag_sentence_aggregate_fields
>

/**
 * @name review_tag_sentence_avg_fields
 * @type OBJECT
 */
export type review_tag_sentence_avg_fields = TypeData<
  t_review_tag_sentence_avg_fields
>

/**
 * @name review_tag_sentence_constraint
 * @type ENUM
 */
export enum review_tag_sentence_constraint {
  review_tag_pkey = 'review_tag_pkey',
  review_tag_tag_id_review_id_sentence_key = 'review_tag_tag_id_review_id_sentence_key',
}

/**
 * @name review_tag_sentence_max_fields
 * @type OBJECT
 */
export type review_tag_sentence_max_fields = TypeData<
  t_review_tag_sentence_max_fields
>

/**
 * @name review_tag_sentence_min_fields
 * @type OBJECT
 */
export type review_tag_sentence_min_fields = TypeData<
  t_review_tag_sentence_min_fields
>

/**
 * @name review_tag_sentence_mutation_response
 * @type OBJECT
 */
export type review_tag_sentence_mutation_response = TypeData<
  t_review_tag_sentence_mutation_response
>

/**
 * @name review_tag_sentence_select_column
 * @type ENUM
 */
export enum review_tag_sentence_select_column {
  id = 'id',
  ml_sentiment = 'ml_sentiment',
  naive_sentiment = 'naive_sentiment',
  restaurant_id = 'restaurant_id',
  review_id = 'review_id',
  sentence = 'sentence',
  tag_id = 'tag_id',
}

/**
 * @name review_tag_sentence_stddev_fields
 * @type OBJECT
 */
export type review_tag_sentence_stddev_fields = TypeData<
  t_review_tag_sentence_stddev_fields
>

/**
 * @name review_tag_sentence_stddev_pop_fields
 * @type OBJECT
 */
export type review_tag_sentence_stddev_pop_fields = TypeData<
  t_review_tag_sentence_stddev_pop_fields
>

/**
 * @name review_tag_sentence_stddev_samp_fields
 * @type OBJECT
 */
export type review_tag_sentence_stddev_samp_fields = TypeData<
  t_review_tag_sentence_stddev_samp_fields
>

/**
 * @name review_tag_sentence_sum_fields
 * @type OBJECT
 */
export type review_tag_sentence_sum_fields = TypeData<
  t_review_tag_sentence_sum_fields
>

/**
 * @name review_tag_sentence_update_column
 * @type ENUM
 */
export enum review_tag_sentence_update_column {
  id = 'id',
  ml_sentiment = 'ml_sentiment',
  naive_sentiment = 'naive_sentiment',
  restaurant_id = 'restaurant_id',
  review_id = 'review_id',
  sentence = 'sentence',
  tag_id = 'tag_id',
}

/**
 * @name review_tag_sentence_var_pop_fields
 * @type OBJECT
 */
export type review_tag_sentence_var_pop_fields = TypeData<
  t_review_tag_sentence_var_pop_fields
>

/**
 * @name review_tag_sentence_var_samp_fields
 * @type OBJECT
 */
export type review_tag_sentence_var_samp_fields = TypeData<
  t_review_tag_sentence_var_samp_fields
>

/**
 * @name review_tag_sentence_variance_fields
 * @type OBJECT
 */
export type review_tag_sentence_variance_fields = TypeData<
  t_review_tag_sentence_variance_fields
>

/**
 * @name review_update_column
 * @type ENUM
 */
export enum review_update_column {
  authored_at = 'authored_at',
  categories = 'categories',
  favorited = 'favorited',
  id = 'id',
  location = 'location',
  native_data_unique_key = 'native_data_unique_key',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  source = 'source',
  tag_id = 'tag_id',
  text = 'text',
  type = 'type',
  updated_at = 'updated_at',
  user_id = 'user_id',
  username = 'username',
  vote = 'vote',
}

/**
 * @name review_var_pop_fields
 * @type OBJECT
 */
export type review_var_pop_fields = TypeData<t_review_var_pop_fields>

/**
 * @name review_var_samp_fields
 * @type OBJECT
 */
export type review_var_samp_fields = TypeData<t_review_var_samp_fields>

/**
 * @name review_variance_fields
 * @type OBJECT
 */
export type review_variance_fields = TypeData<t_review_variance_fields>

/**
 * @name setting
 * @type OBJECT
 */
export type setting = TypeData<t_setting>

/**
 * @name setting_aggregate
 * @type OBJECT
 */
export type setting_aggregate = TypeData<t_setting_aggregate>

/**
 * @name setting_aggregate_fields
 * @type OBJECT
 */
export type setting_aggregate_fields = TypeData<t_setting_aggregate_fields>

/**
 * @name setting_constraint
 * @type ENUM
 */
export enum setting_constraint {
  setting_id_key = 'setting_id_key',
  setting_pkey = 'setting_pkey',
}

/**
 * @name setting_max_fields
 * @type OBJECT
 */
export type setting_max_fields = TypeData<t_setting_max_fields>

/**
 * @name setting_min_fields
 * @type OBJECT
 */
export type setting_min_fields = TypeData<t_setting_min_fields>

/**
 * @name setting_mutation_response
 * @type OBJECT
 */
export type setting_mutation_response = TypeData<t_setting_mutation_response>

/**
 * @name setting_select_column
 * @type ENUM
 */
export enum setting_select_column {
  created_at = 'created_at',
  id = 'id',
  key = 'key',
  updated_at = 'updated_at',
  value = 'value',
}

/**
 * @name setting_update_column
 * @type ENUM
 */
export enum setting_update_column {
  created_at = 'created_at',
  id = 'id',
  key = 'key',
  updated_at = 'updated_at',
  value = 'value',
}

/**
 * @name subscription_root
 * @type OBJECT
 */
export type subscription_root = TypeData<t_subscription_root>

/**
 * @name tag
 * @type OBJECT
 */
export type tag = TypeData<t_tag>

/**
 * @name tag_aggregate
 * @type OBJECT
 */
export type tag_aggregate = TypeData<t_tag_aggregate>

/**
 * @name tag_aggregate_fields
 * @type OBJECT
 */
export type tag_aggregate_fields = TypeData<t_tag_aggregate_fields>

/**
 * @name tag_avg_fields
 * @type OBJECT
 */
export type tag_avg_fields = TypeData<t_tag_avg_fields>

/**
 * @name tag_constraint
 * @type ENUM
 */
export enum tag_constraint {
  tag_id_key1 = 'tag_id_key1',
  tag_order_key = 'tag_order_key',
  tag_parentId_name_key = 'tag_parentId_name_key',
  tag_pkey = 'tag_pkey',
  tag_slug_key = 'tag_slug_key',
}

/**
 * @name tag_max_fields
 * @type OBJECT
 */
export type tag_max_fields = TypeData<t_tag_max_fields>

/**
 * @name tag_min_fields
 * @type OBJECT
 */
export type tag_min_fields = TypeData<t_tag_min_fields>

/**
 * @name tag_mutation_response
 * @type OBJECT
 */
export type tag_mutation_response = TypeData<t_tag_mutation_response>

/**
 * @name tag_select_column
 * @type ENUM
 */
export enum tag_select_column {
  alternates = 'alternates',
  created_at = 'created_at',
  default_images = 'default_images',
  description = 'description',
  displayName = 'displayName',
  frequency = 'frequency',
  icon = 'icon',
  id = 'id',
  is_ambiguous = 'is_ambiguous',
  misc = 'misc',
  name = 'name',
  order = 'order',
  parentId = 'parentId',
  popularity = 'popularity',
  rgb = 'rgb',
  slug = 'slug',
  type = 'type',
  updated_at = 'updated_at',
}

/**
 * @name tag_stddev_fields
 * @type OBJECT
 */
export type tag_stddev_fields = TypeData<t_tag_stddev_fields>

/**
 * @name tag_stddev_pop_fields
 * @type OBJECT
 */
export type tag_stddev_pop_fields = TypeData<t_tag_stddev_pop_fields>

/**
 * @name tag_stddev_samp_fields
 * @type OBJECT
 */
export type tag_stddev_samp_fields = TypeData<t_tag_stddev_samp_fields>

/**
 * @name tag_sum_fields
 * @type OBJECT
 */
export type tag_sum_fields = TypeData<t_tag_sum_fields>

/**
 * @name tag_tag
 * @type OBJECT
 */
export type tag_tag = TypeData<t_tag_tag>

/**
 * @name tag_tag_aggregate
 * @type OBJECT
 */
export type tag_tag_aggregate = TypeData<t_tag_tag_aggregate>

/**
 * @name tag_tag_aggregate_fields
 * @type OBJECT
 */
export type tag_tag_aggregate_fields = TypeData<t_tag_tag_aggregate_fields>

/**
 * @name tag_tag_constraint
 * @type ENUM
 */
export enum tag_tag_constraint {
  tag_tag_pkey = 'tag_tag_pkey',
}

/**
 * @name tag_tag_max_fields
 * @type OBJECT
 */
export type tag_tag_max_fields = TypeData<t_tag_tag_max_fields>

/**
 * @name tag_tag_min_fields
 * @type OBJECT
 */
export type tag_tag_min_fields = TypeData<t_tag_tag_min_fields>

/**
 * @name tag_tag_mutation_response
 * @type OBJECT
 */
export type tag_tag_mutation_response = TypeData<t_tag_tag_mutation_response>

/**
 * @name tag_tag_select_column
 * @type ENUM
 */
export enum tag_tag_select_column {
  category_tag_id = 'category_tag_id',
  tag_id = 'tag_id',
}

/**
 * @name tag_tag_update_column
 * @type ENUM
 */
export enum tag_tag_update_column {
  category_tag_id = 'category_tag_id',
  tag_id = 'tag_id',
}

/**
 * @name tag_update_column
 * @type ENUM
 */
export enum tag_update_column {
  alternates = 'alternates',
  created_at = 'created_at',
  default_images = 'default_images',
  description = 'description',
  displayName = 'displayName',
  frequency = 'frequency',
  icon = 'icon',
  id = 'id',
  is_ambiguous = 'is_ambiguous',
  misc = 'misc',
  name = 'name',
  order = 'order',
  parentId = 'parentId',
  popularity = 'popularity',
  rgb = 'rgb',
  slug = 'slug',
  type = 'type',
  updated_at = 'updated_at',
}

/**
 * @name tag_var_pop_fields
 * @type OBJECT
 */
export type tag_var_pop_fields = TypeData<t_tag_var_pop_fields>

/**
 * @name tag_var_samp_fields
 * @type OBJECT
 */
export type tag_var_samp_fields = TypeData<t_tag_var_samp_fields>

/**
 * @name tag_variance_fields
 * @type OBJECT
 */
export type tag_variance_fields = TypeData<t_tag_variance_fields>

/**
 * @name timestamptz
 * @type SCALAR
 */
export type timestamptz = TypeData<t_timestamptz>

/**
 * @name tsrange
 * @type SCALAR
 */
export type tsrange = TypeData<t_tsrange>

/**
 * @name user
 * @type OBJECT
 */
export type user = TypeData<t_user>

/**
 * @name user_aggregate
 * @type OBJECT
 */
export type user_aggregate = TypeData<t_user_aggregate>

/**
 * @name user_aggregate_fields
 * @type OBJECT
 */
export type user_aggregate_fields = TypeData<t_user_aggregate_fields>

/**
 * @name user_avg_fields
 * @type OBJECT
 */
export type user_avg_fields = TypeData<t_user_avg_fields>

/**
 * @name user_constraint
 * @type ENUM
 */
export enum user_constraint {
  user_email_key = 'user_email_key',
  user_pkey = 'user_pkey',
  user_username_key = 'user_username_key',
}

/**
 * @name user_max_fields
 * @type OBJECT
 */
export type user_max_fields = TypeData<t_user_max_fields>

/**
 * @name user_min_fields
 * @type OBJECT
 */
export type user_min_fields = TypeData<t_user_min_fields>

/**
 * @name user_mutation_response
 * @type OBJECT
 */
export type user_mutation_response = TypeData<t_user_mutation_response>

/**
 * @name user_select_column
 * @type ENUM
 */
export enum user_select_column {
  about = 'about',
  apple_email = 'apple_email',
  apple_refresh_token = 'apple_refresh_token',
  apple_token = 'apple_token',
  apple_uid = 'apple_uid',
  avatar = 'avatar',
  charIndex = 'charIndex',
  created_at = 'created_at',
  email = 'email',
  has_onboarded = 'has_onboarded',
  id = 'id',
  location = 'location',
  password = 'password',
  role = 'role',
  updated_at = 'updated_at',
  username = 'username',
}

/**
 * @name user_stddev_fields
 * @type OBJECT
 */
export type user_stddev_fields = TypeData<t_user_stddev_fields>

/**
 * @name user_stddev_pop_fields
 * @type OBJECT
 */
export type user_stddev_pop_fields = TypeData<t_user_stddev_pop_fields>

/**
 * @name user_stddev_samp_fields
 * @type OBJECT
 */
export type user_stddev_samp_fields = TypeData<t_user_stddev_samp_fields>

/**
 * @name user_sum_fields
 * @type OBJECT
 */
export type user_sum_fields = TypeData<t_user_sum_fields>

/**
 * @name user_update_column
 * @type ENUM
 */
export enum user_update_column {
  about = 'about',
  apple_email = 'apple_email',
  apple_refresh_token = 'apple_refresh_token',
  apple_token = 'apple_token',
  apple_uid = 'apple_uid',
  avatar = 'avatar',
  charIndex = 'charIndex',
  created_at = 'created_at',
  email = 'email',
  has_onboarded = 'has_onboarded',
  id = 'id',
  location = 'location',
  password = 'password',
  role = 'role',
  updated_at = 'updated_at',
  username = 'username',
}

/**
 * @name user_var_pop_fields
 * @type OBJECT
 */
export type user_var_pop_fields = TypeData<t_user_var_pop_fields>

/**
 * @name user_var_samp_fields
 * @type OBJECT
 */
export type user_var_samp_fields = TypeData<t_user_var_samp_fields>

/**
 * @name user_variance_fields
 * @type OBJECT
 */
export type user_variance_fields = TypeData<t_user_variance_fields>

/**
 * @name uuid
 * @type SCALAR
 */
export type uuid = TypeData<t_uuid>
