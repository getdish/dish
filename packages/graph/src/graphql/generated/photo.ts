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
 * @name photo
 * @type OBJECT
 */
export type t_photo = FieldsType<
  {
    __typename: t_String<'photo'>
    created_at: t_timestamptz
    id: t_uuid
    origin: t_String
    quality?: t_numeric | null
    updated_at: t_timestamptz
    url: t_String
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
    count?: FieldsTypeArg<
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
export type t_photo_constraint = EnumType<'photo_url_key' | 'photos_pkey'>

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
export type t_photo_select_column = EnumType<
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
export type t_photo_update_column = EnumType<
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
    count?: FieldsTypeArg<
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
}

/**
 * @name photo_xref_constraint
 * @type ENUM
 */
export type t_photo_xref_constraint = EnumType<
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
export type t_photo_xref_select_column = EnumType<
  'id' | 'photo_id' | 'restaurant_id' | 'tag_id'
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
}

/**
 * @name photo_xref_update_column
 * @type ENUM
 */
export type t_photo_xref_update_column = EnumType<
  'id' | 'photo_id' | 'restaurant_id' | 'tag_id'
>

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
}
