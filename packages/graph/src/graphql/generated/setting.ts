import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Int } from './Int'
import { jsonb_comparison_exp, t_jsonb } from './jsonb'
import { order_by } from './order_by'
import { String_comparison_exp, t_String } from './String'
import { t_timestamptz, timestamptz_comparison_exp } from './timestamptz'
import { t_uuid, uuid_comparison_exp } from './uuid'

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
    count?: FieldsTypeArg<
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
export type t_setting_constraint = EnumType<'setting_id_key' | 'setting_pkey'>

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
export type t_setting_select_column = EnumType<
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
export type t_setting_update_column = EnumType<
  'created_at' | 'id' | 'key' | 'updated_at' | 'value'
>

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
