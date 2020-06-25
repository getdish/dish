import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { Boolean_comparison_exp, t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { t_Int } from './Int'
import { jsonb_comparison_exp, t_jsonb } from './jsonb'
import { numeric_comparison_exp, t_numeric } from './numeric'
import { order_by } from './order_by'
import {
  restaurant_bool_exp,
  restaurant_obj_rel_insert_input,
  restaurant_order_by,
  t_restaurant,
} from './restaurant'
import { String_comparison_exp, t_String } from './String'
import {
  t_tag,
  tag_bool_exp,
  tag_obj_rel_insert_input,
  tag_order_by,
} from './tag'
import { t_timestamptz, timestamptz_comparison_exp } from './timestamptz'
import {
  t_user,
  user_bool_exp,
  user_obj_rel_insert_input,
  user_order_by,
} from './user'
import { t_uuid, uuid_comparison_exp } from './uuid'

/**
 * @name review
 * @type OBJECT
 */
export type t_review = FieldsType<
  {
    __typename: t_String<'review'>
    categories?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    created_at: t_timestamptz
    favorited?: t_Boolean | null
    id: t_uuid
    rating?: t_numeric | null
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
  favorited?: Boolean_comparison_exp | null
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
export type t_review_constraint = EnumType<
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
 * @name review_inc_input
 * @type INPUT_OBJECT
 */
export type review_inc_input = { rating?: any | null }

/**
 * @name review_insert_input
 * @type INPUT_OBJECT
 */
export type review_insert_input = {
  categories?: any | null
  created_at?: any | null
  favorited?: boolean | null
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
    id?: t_uuid | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
    text?: t_String | null
    updated_at?: t_timestamptz | null
    user_id?: t_uuid | null
  },
  Extension<'review_max_fields'>
>

/**
 * @name review_max_order_by
 * @type INPUT_OBJECT
 */
export type review_max_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  text?: order_by | null
  updated_at?: order_by | null
  user_id?: order_by | null
}

/**
 * @name review_min_fields
 * @type OBJECT
 */
export type t_review_min_fields = FieldsType<
  {
    __typename: t_String<'review_min_fields'>
    created_at?: t_timestamptz | null
    id?: t_uuid | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
    text?: t_String | null
    updated_at?: t_timestamptz | null
    user_id?: t_uuid | null
  },
  Extension<'review_min_fields'>
>

/**
 * @name review_min_order_by
 * @type INPUT_OBJECT
 */
export type review_min_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  text?: order_by | null
  updated_at?: order_by | null
  user_id?: order_by | null
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
  favorited?: order_by | null
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
export type t_review_select_column = EnumType<
  | 'categories'
  | 'created_at'
  | 'favorited'
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
  favorited?: boolean | null
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
export type t_review_update_column = EnumType<
  | 'categories'
  | 'created_at'
  | 'favorited'
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
  favorited = 'favorited',
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
  favorited = 'favorited',
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
