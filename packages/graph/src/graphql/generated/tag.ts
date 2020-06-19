import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { Boolean_comparison_exp, t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { Int_comparison_exp, t_Int } from './Int'
import { jsonb_comparison_exp, t_jsonb } from './jsonb'
import { order_by } from './order_by'
import {
  restaurant_tag_aggregate_order_by,
  restaurant_tag_arr_rel_insert_input,
  restaurant_tag_bool_exp,
  restaurant_tag_order_by,
  restaurant_tag_select_column,
  t_restaurant_tag,
  t_restaurant_tag_aggregate,
} from './restaurant'
import { String_comparison_exp, t_String } from './String'
import { t_timestamptz, timestamptz_comparison_exp } from './timestamptz'
import { t_uuid, uuid_comparison_exp } from './uuid'

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
    default_images?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    displayName?: t_String | null
    frequency?: t_Int | null
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
  default_images?: any | null
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
    frequency?: t_Float | null
    order?: t_Float | null
  },
  Extension<'tag_avg_fields'>
>

/**
 * @name tag_avg_order_by
 * @type INPUT_OBJECT
 */
export type tag_avg_order_by = {
  frequency?: order_by | null
  order?: order_by | null
}

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
  default_images?: jsonb_comparison_exp | null
  displayName?: String_comparison_exp | null
  frequency?: Int_comparison_exp | null
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
export type t_tag_constraint = EnumType<
  'tag_id_key1' | 'tag_order_key' | 'tag_parentId_name_key' | 'tag_pkey'
>

/**
 * @name tag_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type tag_delete_at_path_input = {
  alternates?: (string | null)[] | null
  default_images?: (string | null)[] | null
  misc?: (string | null)[] | null
  rgb?: (string | null)[] | null
}

/**
 * @name tag_delete_elem_input
 * @type INPUT_OBJECT
 */
export type tag_delete_elem_input = {
  alternates?: number | null
  default_images?: number | null
  misc?: number | null
  rgb?: number | null
}

/**
 * @name tag_delete_key_input
 * @type INPUT_OBJECT
 */
export type tag_delete_key_input = {
  alternates?: string | null
  default_images?: string | null
  misc?: string | null
  rgb?: string | null
}

/**
 * @name tag_inc_input
 * @type INPUT_OBJECT
 */
export type tag_inc_input = { frequency?: number | null; order?: number | null }

/**
 * @name tag_insert_input
 * @type INPUT_OBJECT
 */
export type tag_insert_input = {
  alternates?: any | null
  categories?: tag_tag_arr_rel_insert_input | null
  created_at?: any | null
  default_images?: any | null
  displayName?: string | null
  frequency?: number | null
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
    frequency?: t_Int | null
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
  frequency?: order_by | null
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
    frequency?: t_Int | null
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
  frequency?: order_by | null
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
  default_images?: order_by | null
  displayName?: order_by | null
  frequency?: order_by | null
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
  default_images?: any | null
  misc?: any | null
  rgb?: any | null
}

/**
 * @name tag_select_column
 * @type ENUM
 */
export type t_tag_select_column = EnumType<
  | 'alternates'
  | 'created_at'
  | 'default_images'
  | 'displayName'
  | 'frequency'
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
  default_images?: any | null
  displayName?: string | null
  frequency?: number | null
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
    frequency?: t_Float | null
    order?: t_Float | null
  },
  Extension<'tag_stddev_fields'>
>

/**
 * @name tag_stddev_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_order_by = {
  frequency?: order_by | null
  order?: order_by | null
}

/**
 * @name tag_stddev_pop_fields
 * @type OBJECT
 */
export type t_tag_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'tag_stddev_pop_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
  },
  Extension<'tag_stddev_pop_fields'>
>

/**
 * @name tag_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_pop_order_by = {
  frequency?: order_by | null
  order?: order_by | null
}

/**
 * @name tag_stddev_samp_fields
 * @type OBJECT
 */
export type t_tag_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'tag_stddev_samp_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
  },
  Extension<'tag_stddev_samp_fields'>
>

/**
 * @name tag_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type tag_stddev_samp_order_by = {
  frequency?: order_by | null
  order?: order_by | null
}

/**
 * @name tag_sum_fields
 * @type OBJECT
 */
export type t_tag_sum_fields = FieldsType<
  {
    __typename: t_String<'tag_sum_fields'>
    frequency?: t_Int | null
    order?: t_Int | null
  },
  Extension<'tag_sum_fields'>
>

/**
 * @name tag_sum_order_by
 * @type INPUT_OBJECT
 */
export type tag_sum_order_by = {
  frequency?: order_by | null
  order?: order_by | null
}

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
export type t_tag_tag_constraint = EnumType<'tag_tag_pkey'>

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
export type t_tag_tag_select_column = EnumType<'category_tag_id' | 'tag_id'>

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
export type t_tag_tag_update_column = EnumType<'category_tag_id' | 'tag_id'>

/**
 * @name tag_update_column
 * @type ENUM
 */
export type t_tag_update_column = EnumType<
  | 'alternates'
  | 'created_at'
  | 'default_images'
  | 'displayName'
  | 'frequency'
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
    frequency?: t_Float | null
    order?: t_Float | null
  },
  Extension<'tag_var_pop_fields'>
>

/**
 * @name tag_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type tag_var_pop_order_by = {
  frequency?: order_by | null
  order?: order_by | null
}

/**
 * @name tag_var_samp_fields
 * @type OBJECT
 */
export type t_tag_var_samp_fields = FieldsType<
  {
    __typename: t_String<'tag_var_samp_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
  },
  Extension<'tag_var_samp_fields'>
>

/**
 * @name tag_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type tag_var_samp_order_by = {
  frequency?: order_by | null
  order?: order_by | null
}

/**
 * @name tag_variance_fields
 * @type OBJECT
 */
export type t_tag_variance_fields = FieldsType<
  {
    __typename: t_String<'tag_variance_fields'>
    frequency?: t_Float | null
    order?: t_Float | null
  },
  Extension<'tag_variance_fields'>
>

/**
 * @name tag_variance_order_by
 * @type INPUT_OBJECT
 */
export type tag_variance_order_by = {
  frequency?: order_by | null
  order?: order_by | null
}

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
  default_images = 'default_images',
  displayName = 'displayName',
  frequency = 'frequency',
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
  default_images = 'default_images',
  displayName = 'displayName',
  frequency = 'frequency',
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
