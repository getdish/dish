import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { geometry_comparison_exp, t_geometry } from './geometry'
import { Int_comparison_exp, t_Int } from './Int'
import { order_by } from './order_by'
import {
  restaurant_bool_exp,
  restaurant_obj_rel_insert_input,
  restaurant_order_by,
  t_restaurant,
} from './restaurant'
import { String_comparison_exp, t_String } from './String'
import { t_timestamptz, timestamptz_comparison_exp } from './timestamptz'
import { t_uuid, uuid_comparison_exp } from './uuid'

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
    count?: FieldsTypeArg<
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
export type t_menu_item_constraint = EnumType<
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
export type t_menu_item_select_column = EnumType<
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
export type t_menu_item_update_column = EnumType<
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
