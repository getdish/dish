import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { geometry_comparison_exp, t_geometry } from './geometry'
import { t_Int } from './Int'
import { jsonb_comparison_exp, t_jsonb } from './jsonb'
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
export type t_scrape_constraint = EnumType<'scrape_pkey'>

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
    id?: t_uuid | null
    id_from_source?: t_String | null
    restaurant_id?: t_uuid | null
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
  id?: order_by | null
  id_from_source?: order_by | null
  restaurant_id?: order_by | null
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
    id?: t_uuid | null
    id_from_source?: t_String | null
    restaurant_id?: t_uuid | null
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
  id?: order_by | null
  id_from_source?: order_by | null
  restaurant_id?: order_by | null
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
 * @name scrape_pk_columns_input
 * @type INPUT_OBJECT
 */
export type scrape_pk_columns_input = { id: any }

/**
 * @name scrape_prepend_input
 * @type INPUT_OBJECT
 */
export type scrape_prepend_input = { data?: any | null }

/**
 * @name scrape_select_column
 * @type ENUM
 */
export type t_scrape_select_column = EnumType<
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
export type t_scrape_update_column = EnumType<
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
