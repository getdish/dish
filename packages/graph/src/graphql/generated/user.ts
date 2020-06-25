import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Int } from './Int'
import { order_by } from './order_by'
import {
  review_aggregate_order_by,
  review_arr_rel_insert_input,
  review_bool_exp,
  review_order_by,
  review_select_column,
  t_review,
  t_review_aggregate,
} from './review'
import { String_comparison_exp, t_String } from './String'
import { t_timestamptz, timestamptz_comparison_exp } from './timestamptz'
import { t_uuid, uuid_comparison_exp } from './uuid'

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
export type t_user_constraint = EnumType<'user_pkey' | 'user_username_key'>

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
    id?: t_uuid | null
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
  id?: order_by | null
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
    id?: t_uuid | null
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
  id?: order_by | null
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
 * @name user_pk_columns_input
 * @type INPUT_OBJECT
 */
export type user_pk_columns_input = { id: any }

/**
 * @name user_select_column
 * @type ENUM
 */
export type t_user_select_column = EnumType<
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
export type t_user_update_column = EnumType<
  'created_at' | 'id' | 'password' | 'role' | 'updated_at' | 'username'
>

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
