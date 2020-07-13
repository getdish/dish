import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Int } from './Int'
import { order_by } from './order_by'
import {
  restaurant_bool_exp,
  restaurant_obj_rel_insert_input,
  restaurant_order_by,
  t_restaurant,
} from './restaurant'
import { t_String } from './String'
import { t_tsrange, tsrange_comparison_exp } from './tsrange'
import { t_uuid, uuid_comparison_exp } from './uuid'

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
    count?: FieldsTypeArg<
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
export type t_opening_hours_constraint = EnumType<'opening_hours_pkey'>

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
export type t_opening_hours_select_column = EnumType<
  'hours' | 'id' | 'restaurant_id'
>

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
export type t_opening_hours_update_column = EnumType<
  'hours' | 'id' | 'restaurant_id'
>

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
