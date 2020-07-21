import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { t_Int } from './Int'
import { numeric_comparison_exp, t_numeric } from './numeric'
import { order_by } from './order_by'
import { String_comparison_exp, t_String } from './String'
import { t_timestamptz, timestamptz_comparison_exp } from './timestamptz'
import { t_uuid, uuid_comparison_exp } from './uuid'

/**
 * @name photos
 * @type OBJECT
 */
export type t_photos = FieldsType<
  {
    __typename: t_String<'photos'>
    created_at: t_timestamptz
    id: t_uuid
    quality?: t_numeric | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
    updated_at: t_timestamptz
    url: t_String
  },
  Extension<'photos'>
>

/**
 * @name photos_aggregate
 * @type OBJECT
 */
export type t_photos_aggregate = FieldsType<
  {
    __typename: t_String<'photos_aggregate'>
    aggregate?: t_photos_aggregate_fields | null
    nodes: t_photos[]
  },
  Extension<'photos_aggregate'>
>

/**
 * @name photos_aggregate_fields
 * @type OBJECT
 */
export type t_photos_aggregate_fields = FieldsType<
  {
    __typename: t_String<'photos_aggregate_fields'>
    avg?: t_photos_avg_fields | null
    count?: FieldsTypeArg<
      { columns?: photos_select_column[] | null; distinct?: boolean | null },
      t_Int | null
    >
    max?: t_photos_max_fields | null
    min?: t_photos_min_fields | null
    stddev?: t_photos_stddev_fields | null
    stddev_pop?: t_photos_stddev_pop_fields | null
    stddev_samp?: t_photos_stddev_samp_fields | null
    sum?: t_photos_sum_fields | null
    var_pop?: t_photos_var_pop_fields | null
    var_samp?: t_photos_var_samp_fields | null
    variance?: t_photos_variance_fields | null
  },
  Extension<'photos_aggregate_fields'>
>

/**
 * @name photos_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type photos_aggregate_order_by = {
  avg?: photos_avg_order_by | null
  count?: order_by | null
  max?: photos_max_order_by | null
  min?: photos_min_order_by | null
  stddev?: photos_stddev_order_by | null
  stddev_pop?: photos_stddev_pop_order_by | null
  stddev_samp?: photos_stddev_samp_order_by | null
  sum?: photos_sum_order_by | null
  var_pop?: photos_var_pop_order_by | null
  var_samp?: photos_var_samp_order_by | null
  variance?: photos_variance_order_by | null
}

/**
 * @name photos_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type photos_arr_rel_insert_input = {
  data: photos_insert_input[]
  on_conflict?: photos_on_conflict | null
}

/**
 * @name photos_avg_fields
 * @type OBJECT
 */
export type t_photos_avg_fields = FieldsType<
  {
    __typename: t_String<'photos_avg_fields'>
    quality?: t_Float | null
  },
  Extension<'photos_avg_fields'>
>

/**
 * @name photos_avg_order_by
 * @type INPUT_OBJECT
 */
export type photos_avg_order_by = { quality?: order_by | null }

/**
 * @name photos_bool_exp
 * @type INPUT_OBJECT
 */
export type photos_bool_exp = {
  _and?: (photos_bool_exp | null)[] | null
  _not?: photos_bool_exp | null
  _or?: (photos_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  quality?: numeric_comparison_exp | null
  restaurant_id?: uuid_comparison_exp | null
  tag_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  url?: String_comparison_exp | null
}

/**
 * @name photos_constraint
 * @type ENUM
 */
export type t_photos_constraint = EnumType<
  'photos_pkey' | 'photos_restaurant_id_url_key' | 'photos_tag_id_url_key'
>

/**
 * @name photos_inc_input
 * @type INPUT_OBJECT
 */
export type photos_inc_input = { quality?: any | null }

/**
 * @name photos_insert_input
 * @type INPUT_OBJECT
 */
export type photos_insert_input = {
  created_at?: any | null
  id?: any | null
  quality?: any | null
  restaurant_id?: any | null
  tag_id?: any | null
  updated_at?: any | null
  url?: string | null
}

/**
 * @name photos_max_fields
 * @type OBJECT
 */
export type t_photos_max_fields = FieldsType<
  {
    __typename: t_String<'photos_max_fields'>
    created_at?: t_timestamptz | null
    id?: t_uuid | null
    quality?: t_numeric | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
    updated_at?: t_timestamptz | null
    url?: t_String | null
  },
  Extension<'photos_max_fields'>
>

/**
 * @name photos_max_order_by
 * @type INPUT_OBJECT
 */
export type photos_max_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  quality?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  updated_at?: order_by | null
  url?: order_by | null
}

/**
 * @name photos_min_fields
 * @type OBJECT
 */
export type t_photos_min_fields = FieldsType<
  {
    __typename: t_String<'photos_min_fields'>
    created_at?: t_timestamptz | null
    id?: t_uuid | null
    quality?: t_numeric | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
    updated_at?: t_timestamptz | null
    url?: t_String | null
  },
  Extension<'photos_min_fields'>
>

/**
 * @name photos_min_order_by
 * @type INPUT_OBJECT
 */
export type photos_min_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  quality?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  updated_at?: order_by | null
  url?: order_by | null
}

/**
 * @name photos_mutation_response
 * @type OBJECT
 */
export type t_photos_mutation_response = FieldsType<
  {
    __typename: t_String<'photos_mutation_response'>
    affected_rows: t_Int
    returning: t_photos[]
  },
  Extension<'photos_mutation_response'>
>

/**
 * @name photos_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type photos_obj_rel_insert_input = {
  data: photos_insert_input
  on_conflict?: photos_on_conflict | null
}

/**
 * @name photos_on_conflict
 * @type INPUT_OBJECT
 */
export type photos_on_conflict = {
  constraint: photos_constraint
  update_columns: photos_update_column[]
  where?: photos_bool_exp | null
}

/**
 * @name photos_order_by
 * @type INPUT_OBJECT
 */
export type photos_order_by = {
  created_at?: order_by | null
  id?: order_by | null
  quality?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
  updated_at?: order_by | null
  url?: order_by | null
}

/**
 * @name photos_pk_columns_input
 * @type INPUT_OBJECT
 */
export type photos_pk_columns_input = { id: any }

/**
 * @name photos_select_column
 * @type ENUM
 */
export type t_photos_select_column = EnumType<
  | 'created_at'
  | 'id'
  | 'quality'
  | 'restaurant_id'
  | 'tag_id'
  | 'updated_at'
  | 'url'
>

/**
 * @name photos_set_input
 * @type INPUT_OBJECT
 */
export type photos_set_input = {
  created_at?: any | null
  id?: any | null
  quality?: any | null
  restaurant_id?: any | null
  tag_id?: any | null
  updated_at?: any | null
  url?: string | null
}

/**
 * @name photos_stddev_fields
 * @type OBJECT
 */
export type t_photos_stddev_fields = FieldsType<
  {
    __typename: t_String<'photos_stddev_fields'>
    quality?: t_Float | null
  },
  Extension<'photos_stddev_fields'>
>

/**
 * @name photos_stddev_order_by
 * @type INPUT_OBJECT
 */
export type photos_stddev_order_by = { quality?: order_by | null }

/**
 * @name photos_stddev_pop_fields
 * @type OBJECT
 */
export type t_photos_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'photos_stddev_pop_fields'>
    quality?: t_Float | null
  },
  Extension<'photos_stddev_pop_fields'>
>

/**
 * @name photos_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type photos_stddev_pop_order_by = { quality?: order_by | null }

/**
 * @name photos_stddev_samp_fields
 * @type OBJECT
 */
export type t_photos_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'photos_stddev_samp_fields'>
    quality?: t_Float | null
  },
  Extension<'photos_stddev_samp_fields'>
>

/**
 * @name photos_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type photos_stddev_samp_order_by = { quality?: order_by | null }

/**
 * @name photos_sum_fields
 * @type OBJECT
 */
export type t_photos_sum_fields = FieldsType<
  {
    __typename: t_String<'photos_sum_fields'>
    quality?: t_numeric | null
  },
  Extension<'photos_sum_fields'>
>

/**
 * @name photos_sum_order_by
 * @type INPUT_OBJECT
 */
export type photos_sum_order_by = { quality?: order_by | null }

/**
 * @name photos_update_column
 * @type ENUM
 */
export type t_photos_update_column = EnumType<
  | 'created_at'
  | 'id'
  | 'quality'
  | 'restaurant_id'
  | 'tag_id'
  | 'updated_at'
  | 'url'
>

/**
 * @name photos_var_pop_fields
 * @type OBJECT
 */
export type t_photos_var_pop_fields = FieldsType<
  {
    __typename: t_String<'photos_var_pop_fields'>
    quality?: t_Float | null
  },
  Extension<'photos_var_pop_fields'>
>

/**
 * @name photos_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type photos_var_pop_order_by = { quality?: order_by | null }

/**
 * @name photos_var_samp_fields
 * @type OBJECT
 */
export type t_photos_var_samp_fields = FieldsType<
  {
    __typename: t_String<'photos_var_samp_fields'>
    quality?: t_Float | null
  },
  Extension<'photos_var_samp_fields'>
>

/**
 * @name photos_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type photos_var_samp_order_by = { quality?: order_by | null }

/**
 * @name photos_variance_fields
 * @type OBJECT
 */
export type t_photos_variance_fields = FieldsType<
  {
    __typename: t_String<'photos_variance_fields'>
    quality?: t_Float | null
  },
  Extension<'photos_variance_fields'>
>

/**
 * @name photos_variance_order_by
 * @type INPUT_OBJECT
 */
export type photos_variance_order_by = { quality?: order_by | null }

/**
 * @name photos
 * @type OBJECT
 */
export type photos = TypeData<t_photos>

/**
 * @name photos_aggregate
 * @type OBJECT
 */
export type photos_aggregate = TypeData<t_photos_aggregate>

/**
 * @name photos_aggregate_fields
 * @type OBJECT
 */
export type photos_aggregate_fields = TypeData<t_photos_aggregate_fields>

/**
 * @name photos_avg_fields
 * @type OBJECT
 */
export type photos_avg_fields = TypeData<t_photos_avg_fields>

/**
 * @name photos_constraint
 * @type ENUM
 */
export enum photos_constraint {
  photos_pkey = 'photos_pkey',
  photos_restaurant_id_url_key = 'photos_restaurant_id_url_key',
  photos_tag_id_url_key = 'photos_tag_id_url_key',
}

/**
 * @name photos_max_fields
 * @type OBJECT
 */
export type photos_max_fields = TypeData<t_photos_max_fields>

/**
 * @name photos_min_fields
 * @type OBJECT
 */
export type photos_min_fields = TypeData<t_photos_min_fields>

/**
 * @name photos_mutation_response
 * @type OBJECT
 */
export type photos_mutation_response = TypeData<t_photos_mutation_response>

/**
 * @name photos_select_column
 * @type ENUM
 */
export enum photos_select_column {
  created_at = 'created_at',
  id = 'id',
  quality = 'quality',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
  updated_at = 'updated_at',
  url = 'url',
}

/**
 * @name photos_stddev_fields
 * @type OBJECT
 */
export type photos_stddev_fields = TypeData<t_photos_stddev_fields>

/**
 * @name photos_stddev_pop_fields
 * @type OBJECT
 */
export type photos_stddev_pop_fields = TypeData<t_photos_stddev_pop_fields>

/**
 * @name photos_stddev_samp_fields
 * @type OBJECT
 */
export type photos_stddev_samp_fields = TypeData<t_photos_stddev_samp_fields>

/**
 * @name photos_sum_fields
 * @type OBJECT
 */
export type photos_sum_fields = TypeData<t_photos_sum_fields>

/**
 * @name photos_update_column
 * @type ENUM
 */
export enum photos_update_column {
  created_at = 'created_at',
  id = 'id',
  quality = 'quality',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
  updated_at = 'updated_at',
  url = 'url',
}

/**
 * @name photos_var_pop_fields
 * @type OBJECT
 */
export type photos_var_pop_fields = TypeData<t_photos_var_pop_fields>

/**
 * @name photos_var_samp_fields
 * @type OBJECT
 */
export type photos_var_samp_fields = TypeData<t_photos_var_samp_fields>

/**
 * @name photos_variance_fields
 * @type OBJECT
 */
export type photos_variance_fields = TypeData<t_photos_variance_fields>
