import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { Int_comparison_exp, t_Int } from './Int'
import { order_by } from './order_by'
import {
  restaurant_aggregate_order_by,
  restaurant_arr_rel_insert_input,
  restaurant_bool_exp,
  restaurant_obj_rel_insert_input,
  restaurant_order_by,
  restaurant_select_column,
  t_restaurant,
  t_restaurant_aggregate,
} from './restaurant'
import { String_comparison_exp, t_String } from './String'
import { t_timestamptz, timestamptz_comparison_exp } from './timestamptz'
import { t_uuid, uuid_comparison_exp } from './uuid'

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
export type t_dish_constraint = EnumType<
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
export type t_dish_select_column = EnumType<
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
export type t_dish_update_column = EnumType<
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
