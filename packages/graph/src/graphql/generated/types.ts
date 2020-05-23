import {
  EnumType,
  FieldsData,
  FieldsType,
  FieldsTypeArg,
  ScalarType,
  Type,
  TypeData,
} from 'gqless'

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
 * @name dish
 * @type OBJECT
 */
export type t_dish = FieldsType<
  {
    __typename: t_String<'dish'>
    created_at: t_timestamptz
    description?: t_String | null
    id: t_uuid
    image?: t_String | null
    name: t_String
    price?: t_Int | null
    restaurant: t_restaurant
    restaurant_id: t_uuid
    restaurant_parent: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant[]
    >
    restaurant_parent_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant_aggregate
    >
    updated_at: t_timestamptz
  },
  Extension<'dish'>
>

/**
 * @name dish_aggregate
 * @type OBJECT
 */
export type t_dish_aggregate = FieldsType<
  {
    __typename: t_String<'dish_aggregate'>
    aggregate?: t_dish_aggregate_fields | null
    nodes: t_dish[]
  },
  Extension<'dish_aggregate'>
>

/**
 * @name dish_aggregate_fields
 * @type OBJECT
 */
export type t_dish_aggregate_fields = FieldsType<
  {
    __typename: t_String<'dish_aggregate_fields'>
    avg?: t_dish_avg_fields | null
    count?: FieldsTypeArg<
      { columns?: dish_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_dish_max_fields | null
    min?: t_dish_min_fields | null
    stddev?: t_dish_stddev_fields | null
    stddev_pop?: t_dish_stddev_pop_fields | null
    stddev_samp?: t_dish_stddev_samp_fields | null
    sum?: t_dish_sum_fields | null
    var_pop?: t_dish_var_pop_fields | null
    var_samp?: t_dish_var_samp_fields | null
    variance?: t_dish_variance_fields | null
  },
  Extension<'dish_aggregate_fields'>
>

/**
 * @name dish_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type dish_aggregate_order_by = {
  avg?: dish_avg_order_by | null
  count?: order_by | null
  max?: dish_max_order_by | null
  min?: dish_min_order_by | null
  stddev?: dish_stddev_order_by | null
  stddev_pop?: dish_stddev_pop_order_by | null
  stddev_samp?: dish_stddev_samp_order_by | null
  sum?: dish_sum_order_by | null
  var_pop?: dish_var_pop_order_by | null
  var_samp?: dish_var_samp_order_by | null
  variance?: dish_variance_order_by | null
}

/**
 * @name dish_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type dish_arr_rel_insert_input = {
  data: dish_insert_input[]
  on_conflict?: dish_on_conflict | null
}

/**
 * @name dish_avg_fields
 * @type OBJECT
 */
export type t_dish_avg_fields = FieldsType<
  {
    __typename: t_String<'dish_avg_fields'>
    price?: t_Float | null
  },
  Extension<'dish_avg_fields'>
>

/**
 * @name dish_avg_order_by
 * @type INPUT_OBJECT
 */
export type dish_avg_order_by = { price?: order_by | null }

/**
 * @name dish_bool_exp
 * @type INPUT_OBJECT
 */
export type dish_bool_exp = {
  _and?: (dish_bool_exp | null)[] | null
  _not?: dish_bool_exp | null
  _or?: (dish_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  image?: String_comparison_exp | null
  name?: String_comparison_exp | null
  price?: Int_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  restaurant_parent?: restaurant_bool_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * @name dish_constraint
 * @type ENUM
 */
type t_dish_constraint = EnumType<
  'dish_id_key1' | 'dish_pkey' | 'dish_restaurant_id_name_key'
>

/**
 * @name dish_inc_input
 * @type INPUT_OBJECT
 */
export type dish_inc_input = { price?: number | null }

/**
 * @name dish_insert_input
 * @type INPUT_OBJECT
 */
export type dish_insert_input = {
  created_at?: any | null
  description?: string | null
  id?: any | null
  image?: string | null
  name?: string | null
  price?: number | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  restaurant_parent?: restaurant_arr_rel_insert_input | null
  updated_at?: any | null
}

/**
 * @name dish_max_fields
 * @type OBJECT
 */
export type t_dish_max_fields = FieldsType<
  {
    __typename: t_String<'dish_max_fields'>
    created_at?: t_timestamptz | null
    description?: t_String | null
    image?: t_String | null
    name?: t_String | null
    price?: t_Int | null
    updated_at?: t_timestamptz | null
  },
  Extension<'dish_max_fields'>
>

/**
 * @name dish_max_order_by
 * @type INPUT_OBJECT
 */
export type dish_max_order_by = {
  created_at?: order_by | null
  description?: order_by | null
  image?: order_by | null
  name?: order_by | null
  price?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name dish_min_fields
 * @type OBJECT
 */
export type t_dish_min_fields = FieldsType<
  {
    __typename: t_String<'dish_min_fields'>
    created_at?: t_timestamptz | null
    description?: t_String | null
    image?: t_String | null
    name?: t_String | null
    price?: t_Int | null
    updated_at?: t_timestamptz | null
  },
  Extension<'dish_min_fields'>
>

/**
 * @name dish_min_order_by
 * @type INPUT_OBJECT
 */
export type dish_min_order_by = {
  created_at?: order_by | null
  description?: order_by | null
  image?: order_by | null
  name?: order_by | null
  price?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name dish_mutation_response
 * @type OBJECT
 */
export type t_dish_mutation_response = FieldsType<
  {
    __typename: t_String<'dish_mutation_response'>
    affected_rows: t_Int
    returning: t_dish[]
  },
  Extension<'dish_mutation_response'>
>

/**
 * @name dish_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type dish_obj_rel_insert_input = {
  data: dish_insert_input
  on_conflict?: dish_on_conflict | null
}

/**
 * @name dish_on_conflict
 * @type INPUT_OBJECT
 */
export type dish_on_conflict = {
  constraint: dish_constraint
  update_columns: dish_update_column[]
  where?: dish_bool_exp | null
}

/**
 * @name dish_order_by
 * @type INPUT_OBJECT
 */
export type dish_order_by = {
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  image?: order_by | null
  name?: order_by | null
  price?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  restaurant_parent_aggregate?: restaurant_aggregate_order_by | null
  updated_at?: order_by | null
}

/**
 * @name dish_select_column
 * @type ENUM
 */
type t_dish_select_column = EnumType<
  | 'created_at'
  | 'description'
  | 'id'
  | 'image'
  | 'name'
  | 'price'
  | 'restaurant_id'
  | 'updated_at'
>

/**
 * @name dish_set_input
 * @type INPUT_OBJECT
 */
export type dish_set_input = {
  created_at?: any | null
  description?: string | null
  id?: any | null
  image?: string | null
  name?: string | null
  price?: number | null
  restaurant_id?: any | null
  updated_at?: any | null
}

/**
 * @name dish_stddev_fields
 * @type OBJECT
 */
export type t_dish_stddev_fields = FieldsType<
  {
    __typename: t_String<'dish_stddev_fields'>
    price?: t_Float | null
  },
  Extension<'dish_stddev_fields'>
>

/**
 * @name dish_stddev_order_by
 * @type INPUT_OBJECT
 */
export type dish_stddev_order_by = { price?: order_by | null }

/**
 * @name dish_stddev_pop_fields
 * @type OBJECT
 */
export type t_dish_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'dish_stddev_pop_fields'>
    price?: t_Float | null
  },
  Extension<'dish_stddev_pop_fields'>
>

/**
 * @name dish_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type dish_stddev_pop_order_by = { price?: order_by | null }

/**
 * @name dish_stddev_samp_fields
 * @type OBJECT
 */
export type t_dish_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'dish_stddev_samp_fields'>
    price?: t_Float | null
  },
  Extension<'dish_stddev_samp_fields'>
>

/**
 * @name dish_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type dish_stddev_samp_order_by = { price?: order_by | null }

/**
 * @name dish_sum_fields
 * @type OBJECT
 */
export type t_dish_sum_fields = FieldsType<
  {
    __typename: t_String<'dish_sum_fields'>
    price?: t_Int | null
  },
  Extension<'dish_sum_fields'>
>

/**
 * @name dish_sum_order_by
 * @type INPUT_OBJECT
 */
export type dish_sum_order_by = { price?: order_by | null }

/**
 * @name dish_update_column
 * @type ENUM
 */
type t_dish_update_column = EnumType<
  | 'created_at'
  | 'description'
  | 'id'
  | 'image'
  | 'name'
  | 'price'
  | 'restaurant_id'
  | 'updated_at'
>

/**
 * @name dish_var_pop_fields
 * @type OBJECT
 */
export type t_dish_var_pop_fields = FieldsType<
  {
    __typename: t_String<'dish_var_pop_fields'>
    price?: t_Float | null
  },
  Extension<'dish_var_pop_fields'>
>

/**
 * @name dish_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type dish_var_pop_order_by = { price?: order_by | null }

/**
 * @name dish_var_samp_fields
 * @type OBJECT
 */
export type t_dish_var_samp_fields = FieldsType<
  {
    __typename: t_String<'dish_var_samp_fields'>
    price?: t_Float | null
  },
  Extension<'dish_var_samp_fields'>
>

/**
 * @name dish_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type dish_var_samp_order_by = { price?: order_by | null }

/**
 * @name dish_variance_fields
 * @type OBJECT
 */
export type t_dish_variance_fields = FieldsType<
  {
    __typename: t_String<'dish_variance_fields'>
    price?: t_Float | null
  },
  Extension<'dish_variance_fields'>
>

/**
 * @name dish_variance_order_by
 * @type INPUT_OBJECT
 */
export type dish_variance_order_by = { price?: order_by | null }

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
 * @name mutation_root
 * @type OBJECT
 */
export type t_mutation_root = FieldsType<
  {
    __typename: t_String<'mutation_root'>
    delete_dish?: FieldsTypeArg<
      { where: dish_bool_exp },
      t_dish_mutation_response | null
    >
    delete_restaurant?: FieldsTypeArg<
      { where: restaurant_bool_exp },
      t_restaurant_mutation_response | null
    >
    delete_restaurant_tag?: FieldsTypeArg<
      { where: restaurant_tag_bool_exp },
      t_restaurant_tag_mutation_response | null
    >
    delete_review?: FieldsTypeArg<
      { where: review_bool_exp },
      t_review_mutation_response | null
    >
    delete_scrape?: FieldsTypeArg<
      { where: scrape_bool_exp },
      t_scrape_mutation_response | null
    >
    delete_tag?: FieldsTypeArg<
      { where: tag_bool_exp },
      t_tag_mutation_response | null
    >
    delete_tag_tag?: FieldsTypeArg<
      { where: tag_tag_bool_exp },
      t_tag_tag_mutation_response | null
    >
    delete_user?: FieldsTypeArg<
      { where: user_bool_exp },
      t_user_mutation_response | null
    >
    insert_dish?: FieldsTypeArg<
      { objects: dish_insert_input[]; on_conflict?: dish_on_conflict | null },
      t_dish_mutation_response | null
    >
    insert_restaurant?: FieldsTypeArg<
      {
        objects: restaurant_insert_input[]
        on_conflict?: restaurant_on_conflict | null
      },
      t_restaurant_mutation_response | null
    >
    insert_restaurant_tag?: FieldsTypeArg<
      {
        objects: restaurant_tag_insert_input[]
        on_conflict?: restaurant_tag_on_conflict | null
      },
      t_restaurant_tag_mutation_response | null
    >
    insert_review?: FieldsTypeArg<
      {
        objects: review_insert_input[]
        on_conflict?: review_on_conflict | null
      },
      t_review_mutation_response | null
    >
    insert_scrape?: FieldsTypeArg<
      {
        objects: scrape_insert_input[]
        on_conflict?: scrape_on_conflict | null
      },
      t_scrape_mutation_response | null
    >
    insert_tag?: FieldsTypeArg<
      { objects: tag_insert_input[]; on_conflict?: tag_on_conflict | null },
      t_tag_mutation_response | null
    >
    insert_tag_tag?: FieldsTypeArg<
      {
        objects: tag_tag_insert_input[]
        on_conflict?: tag_tag_on_conflict | null
      },
      t_tag_tag_mutation_response | null
    >
    insert_user?: FieldsTypeArg<
      { objects: user_insert_input[]; on_conflict?: user_on_conflict | null },
      t_user_mutation_response | null
    >
    update_dish?: FieldsTypeArg<
      {
        _inc?: dish_inc_input | null
        _set?: dish_set_input | null
        where: dish_bool_exp
      },
      t_dish_mutation_response | null
    >
    update_restaurant?: FieldsTypeArg<
      {
        _append?: restaurant_append_input | null
        _delete_at_path?: restaurant_delete_at_path_input | null
        _delete_elem?: restaurant_delete_elem_input | null
        _delete_key?: restaurant_delete_key_input | null
        _prepend?: restaurant_prepend_input | null
        _set?: restaurant_set_input | null
        where: restaurant_bool_exp
      },
      t_restaurant_mutation_response | null
    >
    update_restaurant_tag?: FieldsTypeArg<
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
    update_review?: FieldsTypeArg<
      {
        _append?: review_append_input | null
        _delete_at_path?: review_delete_at_path_input | null
        _delete_elem?: review_delete_elem_input | null
        _delete_key?: review_delete_key_input | null
        _prepend?: review_prepend_input | null
        _set?: review_set_input | null
        where: review_bool_exp
      },
      t_review_mutation_response | null
    >
    update_scrape?: FieldsTypeArg<
      {
        _append?: scrape_append_input | null
        _delete_at_path?: scrape_delete_at_path_input | null
        _delete_elem?: scrape_delete_elem_input | null
        _delete_key?: scrape_delete_key_input | null
        _prepend?: scrape_prepend_input | null
        _set?: scrape_set_input | null
        where: scrape_bool_exp
      },
      t_scrape_mutation_response | null
    >
    update_tag?: FieldsTypeArg<
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
    update_tag_tag?: FieldsTypeArg<
      { _set?: tag_tag_set_input | null; where: tag_tag_bool_exp },
      t_tag_tag_mutation_response | null
    >
    update_user?: FieldsTypeArg<
      { _set?: user_set_input | null; where: user_bool_exp },
      t_user_mutation_response | null
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
 * @name query_root
 * @type OBJECT
 */
export type t_query_root = FieldsType<
  {
    __typename: t_String<'query_root'>
    dish: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish[]
    >
    dish_aggregate: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish_aggregate
    >
    dish_by_pk?: FieldsTypeArg<{ id: any }, t_dish | null>
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
    restaurant_by_pk?: FieldsTypeArg<{ id: any }, t_restaurant | null>
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
    restaurant_tag_by_pk?: FieldsTypeArg<
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
    review_by_pk?: FieldsTypeArg<{ id: any }, t_review | null>
    scrape: FieldsTypeArg<
      {
        distinct_on?: scrape_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: scrape_order_by[] | null
        where?: scrape_bool_exp | null
      },
      t_scrape[]
    >
    scrape_aggregate: FieldsTypeArg<
      {
        distinct_on?: scrape_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: scrape_order_by[] | null
        where?: scrape_bool_exp | null
      },
      t_scrape_aggregate
    >
    scrape_by_pk?: FieldsTypeArg<{ id: any }, t_scrape | null>
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
    tag_by_pk?: FieldsTypeArg<{ id: any }, t_tag | null>
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
    tag_tag_by_pk?: FieldsTypeArg<
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
    user_by_pk?: FieldsTypeArg<{ id: any }, t_user | null>
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
    dishes: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish[]
    >
    dishes_aggregate: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish_aggregate
    >
    hours?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    id: t_uuid
    image?: t_String | null
    is_open_now?: t_Boolean | null
    location: t_geometry
    name: t_String
    photos?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    price_range?: t_String | null
    rating?: t_numeric | null
    rating_factors?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
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
    scrapes: FieldsTypeArg<
      {
        distinct_on?: scrape_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: scrape_order_by[] | null
        where?: scrape_bool_exp | null
      },
      t_scrape[]
    >
    scrapes_aggregate: FieldsTypeArg<
      {
        distinct_on?: scrape_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: scrape_order_by[] | null
        where?: scrape_bool_exp | null
      },
      t_scrape_aggregate
    >
    slug: t_String
    sources?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    state?: t_String | null
    tag_names?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
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
    updated_at: t_timestamptz
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
    count?: FieldsTypeArg<
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
  hours?: any | null
  photos?: any | null
  rating_factors?: any | null
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
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_avg_fields'>
>

/**
 * @name restaurant_avg_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_avg_order_by = {
  rating?: order_by | null
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
  dishes?: dish_bool_exp | null
  hours?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  image?: String_comparison_exp | null
  location?: geometry_comparison_exp | null
  name?: String_comparison_exp | null
  photos?: jsonb_comparison_exp | null
  price_range?: String_comparison_exp | null
  rating?: numeric_comparison_exp | null
  rating_factors?: jsonb_comparison_exp | null
  reviews?: review_bool_exp | null
  scrapes?: scrape_bool_exp | null
  slug?: String_comparison_exp | null
  sources?: jsonb_comparison_exp | null
  state?: String_comparison_exp | null
  tag_names?: jsonb_comparison_exp | null
  tags?: restaurant_tag_bool_exp | null
  telephone?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  website?: String_comparison_exp | null
  zip?: numeric_comparison_exp | null
}

/**
 * @name restaurant_constraint
 * @type ENUM
 */
type t_restaurant_constraint = EnumType<
  'restaurant_name_address_key' | 'restaurant_pkey' | 'restaurant_slug_key'
>

/**
 * @name restaurant_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_at_path_input = {
  hours?: (string | null)[] | null
  photos?: (string | null)[] | null
  rating_factors?: (string | null)[] | null
  sources?: (string | null)[] | null
  tag_names?: (string | null)[] | null
}

/**
 * @name restaurant_delete_elem_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_elem_input = {
  hours?: number | null
  photos?: number | null
  rating_factors?: number | null
  sources?: number | null
  tag_names?: number | null
}

/**
 * @name restaurant_delete_key_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_key_input = {
  hours?: string | null
  photos?: string | null
  rating_factors?: string | null
  sources?: string | null
  tag_names?: string | null
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
  dishes?: dish_arr_rel_insert_input | null
  hours?: any | null
  id?: any | null
  image?: string | null
  location?: any | null
  name?: string | null
  photos?: any | null
  price_range?: string | null
  rating?: any | null
  rating_factors?: any | null
  reviews?: review_arr_rel_insert_input | null
  scrapes?: scrape_arr_rel_insert_input | null
  slug?: string | null
  sources?: any | null
  state?: string | null
  tag_names?: any | null
  tags?: restaurant_tag_arr_rel_insert_input | null
  telephone?: string | null
  updated_at?: any | null
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
    image?: t_String | null
    name?: t_String | null
    price_range?: t_String | null
    rating?: t_numeric | null
    slug?: t_String | null
    state?: t_String | null
    telephone?: t_String | null
    updated_at?: t_timestamptz | null
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
  image?: order_by | null
  name?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  slug?: order_by | null
  state?: order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
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
    image?: t_String | null
    name?: t_String | null
    price_range?: t_String | null
    rating?: t_numeric | null
    slug?: t_String | null
    state?: t_String | null
    telephone?: t_String | null
    updated_at?: t_timestamptz | null
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
  image?: order_by | null
  name?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  slug?: order_by | null
  state?: order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
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
  dishes_aggregate?: dish_aggregate_order_by | null
  hours?: order_by | null
  id?: order_by | null
  image?: order_by | null
  location?: order_by | null
  name?: order_by | null
  photos?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  rating_factors?: order_by | null
  reviews_aggregate?: review_aggregate_order_by | null
  scrapes_aggregate?: scrape_aggregate_order_by | null
  slug?: order_by | null
  sources?: order_by | null
  state?: order_by | null
  tag_names?: order_by | null
  tags_aggregate?: restaurant_tag_aggregate_order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
  website?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_prepend_input
 * @type INPUT_OBJECT
 */
export type restaurant_prepend_input = {
  hours?: any | null
  photos?: any | null
  rating_factors?: any | null
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
  | 'hours'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'photos'
  | 'price_range'
  | 'rating'
  | 'rating_factors'
  | 'slug'
  | 'sources'
  | 'state'
  | 'tag_names'
  | 'telephone'
  | 'updated_at'
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
  hours?: any | null
  id?: any | null
  image?: string | null
  location?: any | null
  name?: string | null
  photos?: any | null
  price_range?: string | null
  rating?: any | null
  rating_factors?: any | null
  slug?: string | null
  sources?: any | null
  state?: string | null
  tag_names?: any | null
  telephone?: string | null
  updated_at?: any | null
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
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_fields'>
>

/**
 * @name restaurant_stddev_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_stddev_pop_fields
 * @type OBJECT
 */
export type t_restaurant_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_stddev_pop_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_pop_fields'>
>

/**
 * @name restaurant_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_pop_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_stddev_samp_fields
 * @type OBJECT
 */
export type t_restaurant_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_stddev_samp_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_samp_fields'>
>

/**
 * @name restaurant_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_samp_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_sum_fields
 * @type OBJECT
 */
export type t_restaurant_sum_fields = FieldsType<
  {
    __typename: t_String<'restaurant_sum_fields'>
    rating?: t_numeric | null
    zip?: t_numeric | null
  },
  Extension<'restaurant_sum_fields'>
>

/**
 * @name restaurant_sum_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_sum_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_tag
 * @type OBJECT
 */
export type t_restaurant_tag = FieldsType<
  {
    __typename: t_String<'restaurant_tag'>
    photos?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    rank?: t_Int | null
    rating?: t_numeric | null
    restaurant: t_restaurant
    restaurant_id: t_uuid
    tag: t_tag
    tag_id: t_uuid
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
    count?: FieldsTypeArg<
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
export type restaurant_tag_append_input = { photos?: any | null }

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
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_avg_fields'>
>

/**
 * @name restaurant_tag_avg_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_avg_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_bool_exp
 * @type INPUT_OBJECT
 */
export type restaurant_tag_bool_exp = {
  _and?: (restaurant_tag_bool_exp | null)[] | null
  _not?: restaurant_tag_bool_exp | null
  _or?: (restaurant_tag_bool_exp | null)[] | null
  photos?: jsonb_comparison_exp | null
  rank?: Int_comparison_exp | null
  rating?: numeric_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_id?: uuid_comparison_exp | null
}

/**
 * @name restaurant_tag_constraint
 * @type ENUM
 */
type t_restaurant_tag_constraint = EnumType<'restaurant_tag_pkey'>

/**
 * @name restaurant_tag_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_at_path_input = {
  photos?: (string | null)[] | null
}

/**
 * @name restaurant_tag_delete_elem_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_elem_input = { photos?: number | null }

/**
 * @name restaurant_tag_delete_key_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_key_input = { photos?: string | null }

/**
 * @name restaurant_tag_inc_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_inc_input = { rank?: number | null }

/**
 * @name restaurant_tag_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_insert_input = {
  photos?: any | null
  rank?: number | null
  rating?: any | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  tag?: tag_obj_rel_insert_input | null
  tag_id?: any | null
}

/**
 * @name restaurant_tag_max_fields
 * @type OBJECT
 */
export type t_restaurant_tag_max_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_max_fields'>
    rank?: t_Int | null
    rating?: t_numeric | null
  },
  Extension<'restaurant_tag_max_fields'>
>

/**
 * @name restaurant_tag_max_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_max_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_min_fields
 * @type OBJECT
 */
export type t_restaurant_tag_min_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_min_fields'>
    rank?: t_Int | null
    rating?: t_numeric | null
  },
  Extension<'restaurant_tag_min_fields'>
>

/**
 * @name restaurant_tag_min_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_min_order_by = {
  rank?: order_by | null
  rating?: order_by | null
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
  photos?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  tag?: tag_order_by | null
  tag_id?: order_by | null
}

/**
 * @name restaurant_tag_prepend_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_prepend_input = { photos?: any | null }

/**
 * @name restaurant_tag_select_column
 * @type ENUM
 */
type t_restaurant_tag_select_column = EnumType<
  'photos' | 'rank' | 'rating' | 'restaurant_id' | 'tag_id'
>

/**
 * @name restaurant_tag_set_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_set_input = {
  photos?: any | null
  rank?: number | null
  rating?: any | null
  restaurant_id?: any | null
  tag_id?: any | null
}

/**
 * @name restaurant_tag_stddev_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_fields'>
>

/**
 * @name restaurant_tag_stddev_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_stddev_pop_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_pop_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_pop_fields'>
>

/**
 * @name restaurant_tag_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_pop_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_stddev_samp_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_samp_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_samp_fields'>
>

/**
 * @name restaurant_tag_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_samp_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_sum_fields
 * @type OBJECT
 */
export type t_restaurant_tag_sum_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_sum_fields'>
    rank?: t_Int | null
    rating?: t_numeric | null
  },
  Extension<'restaurant_tag_sum_fields'>
>

/**
 * @name restaurant_tag_sum_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_sum_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_update_column
 * @type ENUM
 */
type t_restaurant_tag_update_column = EnumType<
  'photos' | 'rank' | 'rating' | 'restaurant_id' | 'tag_id'
>

/**
 * @name restaurant_tag_var_pop_fields
 * @type OBJECT
 */
export type t_restaurant_tag_var_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_var_pop_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_var_pop_fields'>
>

/**
 * @name restaurant_tag_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_var_pop_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_var_samp_fields
 * @type OBJECT
 */
export type t_restaurant_tag_var_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_var_samp_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_var_samp_fields'>
>

/**
 * @name restaurant_tag_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_var_samp_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_variance_fields
 * @type OBJECT
 */
export type t_restaurant_tag_variance_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_variance_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_variance_fields'>
>

/**
 * @name restaurant_tag_variance_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_variance_order_by = {
  rank?: order_by | null
  rating?: order_by | null
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
  | 'hours'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'photos'
  | 'price_range'
  | 'rating'
  | 'rating_factors'
  | 'slug'
  | 'sources'
  | 'state'
  | 'tag_names'
  | 'telephone'
  | 'updated_at'
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
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_var_pop_fields'>
>

/**
 * @name restaurant_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_var_pop_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_var_samp_fields
 * @type OBJECT
 */
export type t_restaurant_var_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_var_samp_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_var_samp_fields'>
>

/**
 * @name restaurant_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_var_samp_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_variance_fields
 * @type OBJECT
 */
export type t_restaurant_variance_fields = FieldsType<
  {
    __typename: t_String<'restaurant_variance_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_variance_fields'>
>

/**
 * @name restaurant_variance_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_variance_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name review
 * @type OBJECT
 */
export type t_review = FieldsType<
  {
    __typename: t_String<'review'>
    categories?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    created_at: t_timestamptz
    id: t_uuid
    rating: t_numeric
    restaurant: t_restaurant
    restaurant_id: t_uuid
    tag_id?: t_uuid | null
    taxonomy?: t_tag | null
    text?: t_String | null
    updated_at: t_timestamptz
    user: t_user
    user_id: t_uuid
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
    count?: FieldsTypeArg<
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
  },
  Extension<'review_avg_fields'>
>

/**
 * @name review_avg_order_by
 * @type INPUT_OBJECT
 */
export type review_avg_order_by = { rating?: order_by | null }

/**
 * @name review_bool_exp
 * @type INPUT_OBJECT
 */
export type review_bool_exp = {
  _and?: (review_bool_exp | null)[] | null
  _not?: review_bool_exp | null
  _or?: (review_bool_exp | null)[] | null
  categories?: jsonb_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  rating?: numeric_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  tag_id?: uuid_comparison_exp | null
  taxonomy?: tag_bool_exp | null
  text?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  user?: user_bool_exp | null
  user_id?: uuid_comparison_exp | null
}

/**
 * @name review_constraint
 * @type ENUM
 */
type t_review_constraint = EnumType<
  'review_pkey' | 'review_user_id_restaurant_id_taxonomy_id_key'
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
 * @name review_insert_input
 * @type INPUT_OBJECT
 */
export type review_insert_input = {
  categories?: any | null
  created_at?: any | null
  id?: any | null
  rating?: any | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  tag_id?: any | null
  taxonomy?: tag_obj_rel_insert_input | null
  text?: string | null
  updated_at?: any | null
  user?: user_obj_rel_insert_input | null
  user_id?: any | null
}

/**
 * @name review_max_fields
 * @type OBJECT
 */
export type t_review_max_fields = FieldsType<
  {
    __typename: t_String<'review_max_fields'>
    created_at?: t_timestamptz | null
    rating?: t_numeric | null
    text?: t_String | null
    updated_at?: t_timestamptz | null
  },
  Extension<'review_max_fields'>
>

/**
 * @name review_max_order_by
 * @type INPUT_OBJECT
 */
export type review_max_order_by = {
  created_at?: order_by | null
  rating?: order_by | null
  text?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name review_min_fields
 * @type OBJECT
 */
export type t_review_min_fields = FieldsType<
  {
    __typename: t_String<'review_min_fields'>
    created_at?: t_timestamptz | null
    rating?: t_numeric | null
    text?: t_String | null
    updated_at?: t_timestamptz | null
  },
  Extension<'review_min_fields'>
>

/**
 * @name review_min_order_by
 * @type INPUT_OBJECT
 */
export type review_min_order_by = {
  created_at?: order_by | null
  rating?: order_by | null
  text?: order_by | null
  updated_at?: order_by | null
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
  categories?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  rating?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  taxonomy?: tag_order_by | null
  text?: order_by | null
  updated_at?: order_by | null
  user?: user_order_by | null
  user_id?: order_by | null
}

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
  | 'categories'
  | 'created_at'
  | 'id'
  | 'rating'
  | 'restaurant_id'
  | 'tag_id'
  | 'text'
  | 'updated_at'
  | 'user_id'
>

/**
 * @name review_set_input
 * @type INPUT_OBJECT
 */
export type review_set_input = {
  categories?: any | null
  created_at?: any | null
  id?: any | null
  rating?: any | null
  restaurant_id?: any | null
  tag_id?: any | null
  text?: string | null
  updated_at?: any | null
  user_id?: any | null
}

/**
 * @name review_stddev_fields
 * @type OBJECT
 */
export type t_review_stddev_fields = FieldsType<
  {
    __typename: t_String<'review_stddev_fields'>
    rating?: t_Float | null
  },
  Extension<'review_stddev_fields'>
>

/**
 * @name review_stddev_order_by
 * @type INPUT_OBJECT
 */
export type review_stddev_order_by = { rating?: order_by | null }

/**
 * @name review_stddev_pop_fields
 * @type OBJECT
 */
export type t_review_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'review_stddev_pop_fields'>
    rating?: t_Float | null
  },
  Extension<'review_stddev_pop_fields'>
>

/**
 * @name review_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type review_stddev_pop_order_by = { rating?: order_by | null }

/**
 * @name review_stddev_samp_fields
 * @type OBJECT
 */
export type t_review_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'review_stddev_samp_fields'>
    rating?: t_Float | null
  },
  Extension<'review_stddev_samp_fields'>
>

/**
 * @name review_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type review_stddev_samp_order_by = { rating?: order_by | null }

/**
 * @name review_sum_fields
 * @type OBJECT
 */
export type t_review_sum_fields = FieldsType<
  {
    __typename: t_String<'review_sum_fields'>
    rating?: t_numeric | null
  },
  Extension<'review_sum_fields'>
>

/**
 * @name review_sum_order_by
 * @type INPUT_OBJECT
 */
export type review_sum_order_by = { rating?: order_by | null }

/**
 * @name review_update_column
 * @type ENUM
 */
type t_review_update_column = EnumType<
  | 'categories'
  | 'created_at'
  | 'id'
  | 'rating'
  | 'restaurant_id'
  | 'tag_id'
  | 'text'
  | 'updated_at'
  | 'user_id'
>

/**
 * @name review_var_pop_fields
 * @type OBJECT
 */
export type t_review_var_pop_fields = FieldsType<
  {
    __typename: t_String<'review_var_pop_fields'>
    rating?: t_Float | null
  },
  Extension<'review_var_pop_fields'>
>

/**
 * @name review_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type review_var_pop_order_by = { rating?: order_by | null }

/**
 * @name review_var_samp_fields
 * @type OBJECT
 */
export type t_review_var_samp_fields = FieldsType<
  {
    __typename: t_String<'review_var_samp_fields'>
    rating?: t_Float | null
  },
  Extension<'review_var_samp_fields'>
>

/**
 * @name review_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type review_var_samp_order_by = { rating?: order_by | null }

/**
 * @name review_variance_fields
 * @type OBJECT
 */
export type t_review_variance_fields = FieldsType<
  {
    __typename: t_String<'review_variance_fields'>
    rating?: t_Float | null
  },
  Extension<'review_variance_fields'>
>

/**
 * @name review_variance_order_by
 * @type INPUT_OBJECT
 */
export type review_variance_order_by = { rating?: order_by | null }

/**
 * @name scrape
 * @type OBJECT
 */
export type t_scrape = FieldsType<
  {
    __typename: t_String<'scrape'>
    created_at: t_timestamptz
    data?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    id: t_uuid
    id_from_source: t_String
    location?: t_geometry | null
    restaurant?: t_restaurant | null
    restaurant_id?: t_uuid | null
    source: t_String
    updated_at: t_timestamptz
  },
  Extension<'scrape'>
>

/**
 * @name scrape_aggregate
 * @type OBJECT
 */
export type t_scrape_aggregate = FieldsType<
  {
    __typename: t_String<'scrape_aggregate'>
    aggregate?: t_scrape_aggregate_fields | null
    nodes: t_scrape[]
  },
  Extension<'scrape_aggregate'>
>

/**
 * @name scrape_aggregate_fields
 * @type OBJECT
 */
export type t_scrape_aggregate_fields = FieldsType<
  {
    __typename: t_String<'scrape_aggregate_fields'>
    count?: FieldsTypeArg<
      { columns?: scrape_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_scrape_max_fields | null
    min?: t_scrape_min_fields | null
  },
  Extension<'scrape_aggregate_fields'>
>

/**
 * @name scrape_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type scrape_aggregate_order_by = {
  count?: order_by | null
  max?: scrape_max_order_by | null
  min?: scrape_min_order_by | null
}

/**
 * @name scrape_append_input
 * @type INPUT_OBJECT
 */
export type scrape_append_input = { data?: any | null }

/**
 * @name scrape_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type scrape_arr_rel_insert_input = {
  data: scrape_insert_input[]
  on_conflict?: scrape_on_conflict | null
}

/**
 * @name scrape_bool_exp
 * @type INPUT_OBJECT
 */
export type scrape_bool_exp = {
  _and?: (scrape_bool_exp | null)[] | null
  _not?: scrape_bool_exp | null
  _or?: (scrape_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  id_from_source?: String_comparison_exp | null
  location?: geometry_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  source?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * @name scrape_constraint
 * @type ENUM
 */
type t_scrape_constraint = EnumType<'scrape_pkey'>

/**
 * @name scrape_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type scrape_delete_at_path_input = { data?: (string | null)[] | null }

/**
 * @name scrape_delete_elem_input
 * @type INPUT_OBJECT
 */
export type scrape_delete_elem_input = { data?: number | null }

/**
 * @name scrape_delete_key_input
 * @type INPUT_OBJECT
 */
export type scrape_delete_key_input = { data?: string | null }

/**
 * @name scrape_insert_input
 * @type INPUT_OBJECT
 */
export type scrape_insert_input = {
  created_at?: any | null
  data?: any | null
  id?: any | null
  id_from_source?: string | null
  location?: any | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  source?: string | null
  updated_at?: any | null
}

/**
 * @name scrape_max_fields
 * @type OBJECT
 */
export type t_scrape_max_fields = FieldsType<
  {
    __typename: t_String<'scrape_max_fields'>
    created_at?: t_timestamptz | null
    id_from_source?: t_String | null
    source?: t_String | null
    updated_at?: t_timestamptz | null
  },
  Extension<'scrape_max_fields'>
>

/**
 * @name scrape_max_order_by
 * @type INPUT_OBJECT
 */
export type scrape_max_order_by = {
  created_at?: order_by | null
  id_from_source?: order_by | null
  source?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name scrape_min_fields
 * @type OBJECT
 */
export type t_scrape_min_fields = FieldsType<
  {
    __typename: t_String<'scrape_min_fields'>
    created_at?: t_timestamptz | null
    id_from_source?: t_String | null
    source?: t_String | null
    updated_at?: t_timestamptz | null
  },
  Extension<'scrape_min_fields'>
>

/**
 * @name scrape_min_order_by
 * @type INPUT_OBJECT
 */
export type scrape_min_order_by = {
  created_at?: order_by | null
  id_from_source?: order_by | null
  source?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name scrape_mutation_response
 * @type OBJECT
 */
export type t_scrape_mutation_response = FieldsType<
  {
    __typename: t_String<'scrape_mutation_response'>
    affected_rows: t_Int
    returning: t_scrape[]
  },
  Extension<'scrape_mutation_response'>
>

/**
 * @name scrape_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type scrape_obj_rel_insert_input = {
  data: scrape_insert_input
  on_conflict?: scrape_on_conflict | null
}

/**
 * @name scrape_on_conflict
 * @type INPUT_OBJECT
 */
export type scrape_on_conflict = {
  constraint: scrape_constraint
  update_columns: scrape_update_column[]
  where?: scrape_bool_exp | null
}

/**
 * @name scrape_order_by
 * @type INPUT_OBJECT
 */
export type scrape_order_by = {
  created_at?: order_by | null
  data?: order_by | null
  id?: order_by | null
  id_from_source?: order_by | null
  location?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  source?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name scrape_prepend_input
 * @type INPUT_OBJECT
 */
export type scrape_prepend_input = { data?: any | null }

/**
 * @name scrape_select_column
 * @type ENUM
 */
type t_scrape_select_column = EnumType<
  | 'created_at'
  | 'data'
  | 'id'
  | 'id_from_source'
  | 'location'
  | 'restaurant_id'
  | 'source'
  | 'updated_at'
>

/**
 * @name scrape_set_input
 * @type INPUT_OBJECT
 */
export type scrape_set_input = {
  created_at?: any | null
  data?: any | null
  id?: any | null
  id_from_source?: string | null
  location?: any | null
  restaurant_id?: any | null
  source?: string | null
  updated_at?: any | null
}

/**
 * @name scrape_update_column
 * @type ENUM
 */
type t_scrape_update_column = EnumType<
  | 'created_at'
  | 'data'
  | 'id'
  | 'id_from_source'
  | 'location'
  | 'restaurant_id'
  | 'source'
  | 'updated_at'
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
    dish: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish[]
    >
    dish_aggregate: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish_aggregate
    >
    dish_by_pk?: FieldsTypeArg<{ id: any }, t_dish | null>
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
    restaurant_by_pk?: FieldsTypeArg<{ id: any }, t_restaurant | null>
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
    restaurant_tag_by_pk?: FieldsTypeArg<
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
    review_by_pk?: FieldsTypeArg<{ id: any }, t_review | null>
    scrape: FieldsTypeArg<
      {
        distinct_on?: scrape_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: scrape_order_by[] | null
        where?: scrape_bool_exp | null
      },
      t_scrape[]
    >
    scrape_aggregate: FieldsTypeArg<
      {
        distinct_on?: scrape_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: scrape_order_by[] | null
        where?: scrape_bool_exp | null
      },
      t_scrape_aggregate
    >
    scrape_by_pk?: FieldsTypeArg<{ id: any }, t_scrape | null>
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
    tag_by_pk?: FieldsTypeArg<{ id: any }, t_tag | null>
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
    tag_tag_by_pk?: FieldsTypeArg<
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
    user_by_pk?: FieldsTypeArg<{ id: any }, t_user | null>
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
    alternates?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
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
    displayName?: t_String | null
    icon?: t_String | null
    id: t_uuid
    is_ambiguous: t_Boolean
    misc?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    name: t_String
    order: t_Int
    parent?: t_tag | null
    parentId?: t_uuid | null
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
    rgb?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
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
    count?: FieldsTypeArg<
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
    order?: t_Float | null
  },
  Extension<'tag_avg_fields'>
>

/**
 * @name tag_avg_order_by
 * @type INPUT_OBJECT
 */
export type tag_avg_order_by = { order?: order_by | null }

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
  displayName?: String_comparison_exp | null
  icon?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_ambiguous?: Boolean_comparison_exp | null
  misc?: jsonb_comparison_exp | null
  name?: String_comparison_exp | null
  order?: Int_comparison_exp | null
  parent?: tag_bool_exp | null
  parentId?: uuid_comparison_exp | null
  restaurant_taxonomies?: restaurant_tag_bool_exp | null
  rgb?: jsonb_comparison_exp | null
  type?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * @name tag_constraint
 * @type ENUM
 */
type t_tag_constraint = EnumType<
  'tag_id_key1' | 'tag_order_key' | 'tag_parentId_name_key' | 'tag_pkey'
>

/**
 * @name tag_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type tag_delete_at_path_input = {
  alternates?: (string | null)[] | null
  misc?: (string | null)[] | null
  rgb?: (string | null)[] | null
}

/**
 * @name tag_delete_elem_input
 * @type INPUT_OBJECT
 */
export type tag_delete_elem_input = {
  alternates?: number | null
  misc?: number | null
  rgb?: number | null
}

/**
 * @name tag_delete_key_input
 * @type INPUT_OBJECT
 */
export type tag_delete_key_input = {
  alternates?: string | null
  misc?: string | null
  rgb?: string | null
}

/**
 * @name tag_inc_input
 * @type INPUT_OBJECT
 */
export type tag_inc_input = { order?: number | null }

/**
 * @name tag_insert_input
 * @type INPUT_OBJECT
 */
export type tag_insert_input = {
  alternates?: any | null
  categories?: tag_tag_arr_rel_insert_input | null
  created_at?: any | null
  displayName?: string | null
  icon?: string | null
  id?: any | null
  is_ambiguous?: boolean | null
  misc?: any | null
  name?: string | null
  order?: number | null
  parent?: tag_obj_rel_insert_input | null
  parentId?: any | null
  restaurant_taxonomies?: restaurant_tag_arr_rel_insert_input | null
  rgb?: any | null
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
    displayName?: t_String | null
    icon?: t_String | null
    name?: t_String | null
    order?: t_Int | null
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
  displayName?: order_by | null
  icon?: order_by | null
  name?: order_by | null
  order?: order_by | null
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
    displayName?: t_String | null
    icon?: t_String | null
    name?: t_String | null
    order?: t_Int | null
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
  displayName?: order_by | null
  icon?: order_by | null
  name?: order_by | null
  order?: order_by | null
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
  displayName?: order_by | null
  icon?: order_by | null
  id?: order_by | null
  is_ambiguous?: order_by | null
  misc?: order_by | null
  name?: order_by | null
  order?: order_by | null
  parent?: tag_order_by | null
  parentId?: order_by | null
  restaurant_taxonomies_aggregate?: restaurant_tag_aggregate_order_by | null
  rgb?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
}

/**
 * @name tag_prepend_input
 * @type INPUT_OBJECT
 */
export type tag_prepend_input = {
  alternates?: any | null
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
  | 'displayName'
  | 'icon'
  | 'id'
  | 'is_ambiguous'
  | 'misc'
  | 'name'
  | 'order'
  | 'parentId'
  | 'rgb'
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
  displayName?: string | null
  icon?: string | null
  id?: any | null
  is_ambiguous?: boolean | null
  misc?: any | null
  name?: string | null
  order?: number | null
  parentId?: any | null
  rgb?: any | null
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
    order?: t_Float | null
  },
  Extension<'tag_stddev_fields'>
>

/**
 * @name tag_stddev_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_order_by = { order?: order_by | null }

/**
 * @name tag_stddev_pop_fields
 * @type OBJECT
 */
export type t_tag_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'tag_stddev_pop_fields'>
    order?: t_Float | null
  },
  Extension<'tag_stddev_pop_fields'>
>

/**
 * @name tag_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_pop_order_by = { order?: order_by | null }

/**
 * @name tag_stddev_samp_fields
 * @type OBJECT
 */
export type t_tag_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'tag_stddev_samp_fields'>
    order?: t_Float | null
  },
  Extension<'tag_stddev_samp_fields'>
>

/**
 * @name tag_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_samp_order_by = { order?: order_by | null }

/**
 * @name tag_sum_fields
 * @type OBJECT
 */
export type t_tag_sum_fields = FieldsType<
  {
    __typename: t_String<'tag_sum_fields'>
    order?: t_Int | null
  },
  Extension<'tag_sum_fields'>
>

/**
 * @name tag_sum_order_by
 * @type INPUT_OBJECT
 */
export type tag_sum_order_by = { order?: order_by | null }

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
    count?: FieldsTypeArg<
      { columns?: tag_tag_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
  },
  Extension<'tag_tag_aggregate_fields'>
>

/**
 * @name tag_tag_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type tag_tag_aggregate_order_by = { count?: order_by | null }

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
  | 'displayName'
  | 'icon'
  | 'id'
  | 'is_ambiguous'
  | 'misc'
  | 'name'
  | 'order'
  | 'parentId'
  | 'rgb'
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
    order?: t_Float | null
  },
  Extension<'tag_var_pop_fields'>
>

/**
 * @name tag_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type tag_var_pop_order_by = { order?: order_by | null }

/**
 * @name tag_var_samp_fields
 * @type OBJECT
 */
export type t_tag_var_samp_fields = FieldsType<
  {
    __typename: t_String<'tag_var_samp_fields'>
    order?: t_Float | null
  },
  Extension<'tag_var_samp_fields'>
>

/**
 * @name tag_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type tag_var_samp_order_by = { order?: order_by | null }

/**
 * @name tag_variance_fields
 * @type OBJECT
 */
export type t_tag_variance_fields = FieldsType<
  {
    __typename: t_String<'tag_variance_fields'>
    order?: t_Float | null
  },
  Extension<'tag_variance_fields'>
>

/**
 * @name tag_variance_order_by
 * @type INPUT_OBJECT
 */
export type tag_variance_order_by = { order?: order_by | null }

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
 * @name user
 * @type OBJECT
 */
export type t_user = FieldsType<
  {
    __typename: t_String<'user'>
    created_at: t_timestamptz
    id: t_uuid
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
    count?: FieldsTypeArg<
      { columns?: user_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_user_max_fields | null
    min?: t_user_min_fields | null
  },
  Extension<'user_aggregate_fields'>
>

/**
 * @name user_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type user_aggregate_order_by = {
  count?: order_by | null
  max?: user_max_order_by | null
  min?: user_min_order_by | null
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
 * @name user_bool_exp
 * @type INPUT_OBJECT
 */
export type user_bool_exp = {
  _and?: (user_bool_exp | null)[] | null
  _not?: user_bool_exp | null
  _or?: (user_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
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
type t_user_constraint = EnumType<'user_pkey' | 'user_username_key'>

/**
 * @name user_insert_input
 * @type INPUT_OBJECT
 */
export type user_insert_input = {
  created_at?: any | null
  id?: any | null
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
    created_at?: t_timestamptz | null
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
  created_at?: order_by | null
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
    created_at?: t_timestamptz | null
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
  created_at?: order_by | null
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
  created_at?: order_by | null
  id?: order_by | null
  password?: order_by | null
  reviews_aggregate?: review_aggregate_order_by | null
  role?: order_by | null
  updated_at?: order_by | null
  username?: order_by | null
}

/**
 * @name user_select_column
 * @type ENUM
 */
type t_user_select_column = EnumType<
  'created_at' | 'id' | 'password' | 'role' | 'updated_at' | 'username'
>

/**
 * @name user_set_input
 * @type INPUT_OBJECT
 */
export type user_set_input = {
  created_at?: any | null
  id?: any | null
  password?: string | null
  role?: string | null
  updated_at?: any | null
  username?: string | null
}

/**
 * @name user_update_column
 * @type ENUM
 */
type t_user_update_column = EnumType<
  'created_at' | 'id' | 'password' | 'role' | 'updated_at' | 'username'
>

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
 * @name dish
 * @type OBJECT
 */
export type dish = TypeData<t_dish>

/**
 * @name dish_aggregate
 * @type OBJECT
 */
export type dish_aggregate = TypeData<t_dish_aggregate>

/**
 * @name dish_aggregate_fields
 * @type OBJECT
 */
export type dish_aggregate_fields = TypeData<t_dish_aggregate_fields>

/**
 * @name dish_avg_fields
 * @type OBJECT
 */
export type dish_avg_fields = TypeData<t_dish_avg_fields>

/**
 * @name dish_constraint
 * @type ENUM
 */
export enum dish_constraint {
  dish_id_key1 = 'dish_id_key1',
  dish_pkey = 'dish_pkey',
  dish_restaurant_id_name_key = 'dish_restaurant_id_name_key',
}

/**
 * @name dish_max_fields
 * @type OBJECT
 */
export type dish_max_fields = TypeData<t_dish_max_fields>

/**
 * @name dish_min_fields
 * @type OBJECT
 */
export type dish_min_fields = TypeData<t_dish_min_fields>

/**
 * @name dish_mutation_response
 * @type OBJECT
 */
export type dish_mutation_response = TypeData<t_dish_mutation_response>

/**
 * @name dish_select_column
 * @type ENUM
 */
export enum dish_select_column {
  created_at = 'created_at',
  description = 'description',
  id = 'id',
  image = 'image',
  name = 'name',
  price = 'price',
  restaurant_id = 'restaurant_id',
  updated_at = 'updated_at',
}

/**
 * @name dish_stddev_fields
 * @type OBJECT
 */
export type dish_stddev_fields = TypeData<t_dish_stddev_fields>

/**
 * @name dish_stddev_pop_fields
 * @type OBJECT
 */
export type dish_stddev_pop_fields = TypeData<t_dish_stddev_pop_fields>

/**
 * @name dish_stddev_samp_fields
 * @type OBJECT
 */
export type dish_stddev_samp_fields = TypeData<t_dish_stddev_samp_fields>

/**
 * @name dish_sum_fields
 * @type OBJECT
 */
export type dish_sum_fields = TypeData<t_dish_sum_fields>

/**
 * @name dish_update_column
 * @type ENUM
 */
export enum dish_update_column {
  created_at = 'created_at',
  description = 'description',
  id = 'id',
  image = 'image',
  name = 'name',
  price = 'price',
  restaurant_id = 'restaurant_id',
  updated_at = 'updated_at',
}

/**
 * @name dish_var_pop_fields
 * @type OBJECT
 */
export type dish_var_pop_fields = TypeData<t_dish_var_pop_fields>

/**
 * @name dish_var_samp_fields
 * @type OBJECT
 */
export type dish_var_samp_fields = TypeData<t_dish_var_samp_fields>

/**
 * @name dish_variance_fields
 * @type OBJECT
 */
export type dish_variance_fields = TypeData<t_dish_variance_fields>

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
  hours = 'hours',
  id = 'id',
  image = 'image',
  location = 'location',
  name = 'name',
  photos = 'photos',
  price_range = 'price_range',
  rating = 'rating',
  rating_factors = 'rating_factors',
  slug = 'slug',
  sources = 'sources',
  state = 'state',
  tag_names = 'tag_names',
  telephone = 'telephone',
  updated_at = 'updated_at',
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
  photos = 'photos',
  rank = 'rank',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
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
  photos = 'photos',
  rank = 'rank',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
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
  hours = 'hours',
  id = 'id',
  image = 'image',
  location = 'location',
  name = 'name',
  photos = 'photos',
  price_range = 'price_range',
  rating = 'rating',
  rating_factors = 'rating_factors',
  slug = 'slug',
  sources = 'sources',
  state = 'state',
  tag_names = 'tag_names',
  telephone = 'telephone',
  updated_at = 'updated_at',
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
  review_pkey = 'review_pkey',
  review_user_id_restaurant_id_taxonomy_id_key = 'review_user_id_restaurant_id_taxonomy_id_key',
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
  categories = 'categories',
  created_at = 'created_at',
  id = 'id',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
  text = 'text',
  updated_at = 'updated_at',
  user_id = 'user_id',
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
 * @name review_update_column
 * @type ENUM
 */
export enum review_update_column {
  categories = 'categories',
  created_at = 'created_at',
  id = 'id',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
  text = 'text',
  updated_at = 'updated_at',
  user_id = 'user_id',
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
 * @name scrape
 * @type OBJECT
 */
export type scrape = TypeData<t_scrape>

/**
 * @name scrape_aggregate
 * @type OBJECT
 */
export type scrape_aggregate = TypeData<t_scrape_aggregate>

/**
 * @name scrape_aggregate_fields
 * @type OBJECT
 */
export type scrape_aggregate_fields = TypeData<t_scrape_aggregate_fields>

/**
 * @name scrape_constraint
 * @type ENUM
 */
export enum scrape_constraint {
  scrape_pkey = 'scrape_pkey',
}

/**
 * @name scrape_max_fields
 * @type OBJECT
 */
export type scrape_max_fields = TypeData<t_scrape_max_fields>

/**
 * @name scrape_min_fields
 * @type OBJECT
 */
export type scrape_min_fields = TypeData<t_scrape_min_fields>

/**
 * @name scrape_mutation_response
 * @type OBJECT
 */
export type scrape_mutation_response = TypeData<t_scrape_mutation_response>

/**
 * @name scrape_select_column
 * @type ENUM
 */
export enum scrape_select_column {
  created_at = 'created_at',
  data = 'data',
  id = 'id',
  id_from_source = 'id_from_source',
  location = 'location',
  restaurant_id = 'restaurant_id',
  source = 'source',
  updated_at = 'updated_at',
}

/**
 * @name scrape_update_column
 * @type ENUM
 */
export enum scrape_update_column {
  created_at = 'created_at',
  data = 'data',
  id = 'id',
  id_from_source = 'id_from_source',
  location = 'location',
  restaurant_id = 'restaurant_id',
  source = 'source',
  updated_at = 'updated_at',
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
  displayName = 'displayName',
  icon = 'icon',
  id = 'id',
  is_ambiguous = 'is_ambiguous',
  misc = 'misc',
  name = 'name',
  order = 'order',
  parentId = 'parentId',
  rgb = 'rgb',
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
  displayName = 'displayName',
  icon = 'icon',
  id = 'id',
  is_ambiguous = 'is_ambiguous',
  misc = 'misc',
  name = 'name',
  order = 'order',
  parentId = 'parentId',
  rgb = 'rgb',
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
 * @name user_constraint
 * @type ENUM
 */
export enum user_constraint {
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
  created_at = 'created_at',
  id = 'id',
  password = 'password',
  role = 'role',
  updated_at = 'updated_at',
  username = 'username',
}

/**
 * @name user_update_column
 * @type ENUM
 */
export enum user_update_column {
  created_at = 'created_at',
  id = 'id',
  password = 'password',
  role = 'role',
  updated_at = 'updated_at',
  username = 'username',
}

/**
 * @name uuid
 * @type SCALAR
 */
export type uuid = TypeData<t_uuid>
