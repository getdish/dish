import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { Boolean_comparison_exp, t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { geometry_comparison_exp, t_geometry } from './geometry'
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
    authored_at: t_timestamptz
    categories?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    favorited?: t_Boolean | null
    id: t_uuid
    location?: t_geometry | null
    native_data_unique_key?: t_String | null
    rating?: t_numeric | null
    restaurant: t_restaurant
    restaurant_id: t_uuid
    sentiments: FieldsTypeArg<
      {
        distinct_on?: review_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_order_by[] | null
        where?: review_tag_bool_exp | null
      },
      t_review_tag[]
    >
    sentiments_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_tag_order_by[] | null
        where?: review_tag_bool_exp | null
      },
      t_review_tag_aggregate
    >
    source: t_String
    tag_id?: t_uuid | null
    taxonomy?: t_tag | null
    text?: t_String | null
    updated_at: t_timestamptz
    user: t_user
    user_id: t_uuid
    username?: t_String | null
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
  authored_at?: timestamptz_comparison_exp | null
  categories?: jsonb_comparison_exp | null
  favorited?: Boolean_comparison_exp | null
  id?: uuid_comparison_exp | null
  location?: geometry_comparison_exp | null
  native_data_unique_key?: String_comparison_exp | null
  rating?: numeric_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  sentiments?: review_tag_bool_exp | null
  source?: String_comparison_exp | null
  tag_id?: uuid_comparison_exp | null
  taxonomy?: tag_bool_exp | null
  text?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  user?: user_bool_exp | null
  user_id?: uuid_comparison_exp | null
  username?: String_comparison_exp | null
}

/**
 * @name review_constraint
 * @type ENUM
 */
export type t_review_constraint = EnumType<
  | 'review_native_data_unique_constraint'
  | 'review_native_data_unique_key_key'
  | 'review_pkey'
  | 'review_username_restaurant_id_tag_id_authored_at_key'
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
  authored_at?: any | null
  categories?: any | null
  favorited?: boolean | null
  id?: any | null
  location?: any | null
  native_data_unique_key?: string | null
  rating?: any | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  sentiments?: review_tag_arr_rel_insert_input | null
  source?: string | null
  tag_id?: any | null
  taxonomy?: tag_obj_rel_insert_input | null
  text?: string | null
  updated_at?: any | null
  user?: user_obj_rel_insert_input | null
  user_id?: any | null
  username?: string | null
}

/**
 * @name review_max_fields
 * @type OBJECT
 */
export type t_review_max_fields = FieldsType<
  {
    __typename: t_String<'review_max_fields'>
    authored_at?: t_timestamptz | null
    id?: t_uuid | null
    native_data_unique_key?: t_String | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    source?: t_String | null
    tag_id?: t_uuid | null
    text?: t_String | null
    updated_at?: t_timestamptz | null
    user_id?: t_uuid | null
    username?: t_String | null
  },
  Extension<'review_max_fields'>
>

/**
 * @name review_max_order_by
 * @type INPUT_OBJECT
 */
export type review_max_order_by = {
  authored_at?: order_by | null
  id?: order_by | null
  native_data_unique_key?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  source?: order_by | null
  tag_id?: order_by | null
  text?: order_by | null
  updated_at?: order_by | null
  user_id?: order_by | null
  username?: order_by | null
}

/**
 * @name review_min_fields
 * @type OBJECT
 */
export type t_review_min_fields = FieldsType<
  {
    __typename: t_String<'review_min_fields'>
    authored_at?: t_timestamptz | null
    id?: t_uuid | null
    native_data_unique_key?: t_String | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    source?: t_String | null
    tag_id?: t_uuid | null
    text?: t_String | null
    updated_at?: t_timestamptz | null
    user_id?: t_uuid | null
    username?: t_String | null
  },
  Extension<'review_min_fields'>
>

/**
 * @name review_min_order_by
 * @type INPUT_OBJECT
 */
export type review_min_order_by = {
  authored_at?: order_by | null
  id?: order_by | null
  native_data_unique_key?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  source?: order_by | null
  tag_id?: order_by | null
  text?: order_by | null
  updated_at?: order_by | null
  user_id?: order_by | null
  username?: order_by | null
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
  authored_at?: order_by | null
  categories?: order_by | null
  favorited?: order_by | null
  id?: order_by | null
  location?: order_by | null
  native_data_unique_key?: order_by | null
  rating?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  sentiments_aggregate?: review_tag_aggregate_order_by | null
  source?: order_by | null
  tag_id?: order_by | null
  taxonomy?: tag_order_by | null
  text?: order_by | null
  updated_at?: order_by | null
  user?: user_order_by | null
  user_id?: order_by | null
  username?: order_by | null
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
  | 'authored_at'
  | 'categories'
  | 'favorited'
  | 'id'
  | 'location'
  | 'native_data_unique_key'
  | 'rating'
  | 'restaurant_id'
  | 'source'
  | 'tag_id'
  | 'text'
  | 'updated_at'
  | 'user_id'
  | 'username'
>

/**
 * @name review_set_input
 * @type INPUT_OBJECT
 */
export type review_set_input = {
  authored_at?: any | null
  categories?: any | null
  favorited?: boolean | null
  id?: any | null
  location?: any | null
  native_data_unique_key?: string | null
  rating?: any | null
  restaurant_id?: any | null
  source?: string | null
  tag_id?: any | null
  text?: string | null
  updated_at?: any | null
  user_id?: any | null
  username?: string | null
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
 * @name review_tag
 * @type OBJECT
 */
export type t_review_tag = FieldsType<
  {
    __typename: t_String<'review_tag'>
    id: t_uuid
    review: t_review
    review_id: t_uuid
    sentence: t_String
    sentiment: t_numeric
    tag: t_tag
    tag_id: t_uuid
  },
  Extension<'review_tag'>
>

/**
 * @name review_tag_aggregate
 * @type OBJECT
 */
export type t_review_tag_aggregate = FieldsType<
  {
    __typename: t_String<'review_tag_aggregate'>
    aggregate?: t_review_tag_aggregate_fields | null
    nodes: t_review_tag[]
  },
  Extension<'review_tag_aggregate'>
>

/**
 * @name review_tag_aggregate_fields
 * @type OBJECT
 */
export type t_review_tag_aggregate_fields = FieldsType<
  {
    __typename: t_String<'review_tag_aggregate_fields'>
    avg?: t_review_tag_avg_fields | null
    count?: FieldsTypeArg<
      {
        columns?: review_tag_select_column[] | null
        distinct?: boolean | null
      },
      t_Int | null
    >
    max?: t_review_tag_max_fields | null
    min?: t_review_tag_min_fields | null
    stddev?: t_review_tag_stddev_fields | null
    stddev_pop?: t_review_tag_stddev_pop_fields | null
    stddev_samp?: t_review_tag_stddev_samp_fields | null
    sum?: t_review_tag_sum_fields | null
    var_pop?: t_review_tag_var_pop_fields | null
    var_samp?: t_review_tag_var_samp_fields | null
    variance?: t_review_tag_variance_fields | null
  },
  Extension<'review_tag_aggregate_fields'>
>

/**
 * @name review_tag_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_aggregate_order_by = {
  avg?: review_tag_avg_order_by | null
  count?: order_by | null
  max?: review_tag_max_order_by | null
  min?: review_tag_min_order_by | null
  stddev?: review_tag_stddev_order_by | null
  stddev_pop?: review_tag_stddev_pop_order_by | null
  stddev_samp?: review_tag_stddev_samp_order_by | null
  sum?: review_tag_sum_order_by | null
  var_pop?: review_tag_var_pop_order_by | null
  var_samp?: review_tag_var_samp_order_by | null
  variance?: review_tag_variance_order_by | null
}

/**
 * @name review_tag_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type review_tag_arr_rel_insert_input = {
  data: review_tag_insert_input[]
  on_conflict?: review_tag_on_conflict | null
}

/**
 * @name review_tag_avg_fields
 * @type OBJECT
 */
export type t_review_tag_avg_fields = FieldsType<
  {
    __typename: t_String<'review_tag_avg_fields'>
    sentiment?: t_Float | null
  },
  Extension<'review_tag_avg_fields'>
>

/**
 * @name review_tag_avg_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_avg_order_by = { sentiment?: order_by | null }

/**
 * @name review_tag_bool_exp
 * @type INPUT_OBJECT
 */
export type review_tag_bool_exp = {
  _and?: (review_tag_bool_exp | null)[] | null
  _not?: review_tag_bool_exp | null
  _or?: (review_tag_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  review?: review_bool_exp | null
  review_id?: uuid_comparison_exp | null
  sentence?: String_comparison_exp | null
  sentiment?: numeric_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_id?: uuid_comparison_exp | null
}

/**
 * @name review_tag_constraint
 * @type ENUM
 */
export type t_review_tag_constraint = EnumType<
  'review_tag_pkey' | 'review_tag_tag_id_review_id_sentence_key'
>

/**
 * @name review_tag_inc_input
 * @type INPUT_OBJECT
 */
export type review_tag_inc_input = { sentiment?: any | null }

/**
 * @name review_tag_insert_input
 * @type INPUT_OBJECT
 */
export type review_tag_insert_input = {
  id?: any | null
  review?: review_obj_rel_insert_input | null
  review_id?: any | null
  sentence?: string | null
  sentiment?: any | null
  tag?: tag_obj_rel_insert_input | null
  tag_id?: any | null
}

/**
 * @name review_tag_max_fields
 * @type OBJECT
 */
export type t_review_tag_max_fields = FieldsType<
  {
    __typename: t_String<'review_tag_max_fields'>
    id?: t_uuid | null
    review_id?: t_uuid | null
    sentence?: t_String | null
    sentiment?: t_numeric | null
    tag_id?: t_uuid | null
  },
  Extension<'review_tag_max_fields'>
>

/**
 * @name review_tag_max_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_max_order_by = {
  id?: order_by | null
  review_id?: order_by | null
  sentence?: order_by | null
  sentiment?: order_by | null
  tag_id?: order_by | null
}

/**
 * @name review_tag_min_fields
 * @type OBJECT
 */
export type t_review_tag_min_fields = FieldsType<
  {
    __typename: t_String<'review_tag_min_fields'>
    id?: t_uuid | null
    review_id?: t_uuid | null
    sentence?: t_String | null
    sentiment?: t_numeric | null
    tag_id?: t_uuid | null
  },
  Extension<'review_tag_min_fields'>
>

/**
 * @name review_tag_min_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_min_order_by = {
  id?: order_by | null
  review_id?: order_by | null
  sentence?: order_by | null
  sentiment?: order_by | null
  tag_id?: order_by | null
}

/**
 * @name review_tag_mutation_response
 * @type OBJECT
 */
export type t_review_tag_mutation_response = FieldsType<
  {
    __typename: t_String<'review_tag_mutation_response'>
    affected_rows: t_Int
    returning: t_review_tag[]
  },
  Extension<'review_tag_mutation_response'>
>

/**
 * @name review_tag_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type review_tag_obj_rel_insert_input = {
  data: review_tag_insert_input
  on_conflict?: review_tag_on_conflict | null
}

/**
 * @name review_tag_on_conflict
 * @type INPUT_OBJECT
 */
export type review_tag_on_conflict = {
  constraint: review_tag_constraint
  update_columns: review_tag_update_column[]
  where?: review_tag_bool_exp | null
}

/**
 * @name review_tag_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_order_by = {
  id?: order_by | null
  review?: review_order_by | null
  review_id?: order_by | null
  sentence?: order_by | null
  sentiment?: order_by | null
  tag?: tag_order_by | null
  tag_id?: order_by | null
}

/**
 * @name review_tag_pk_columns_input
 * @type INPUT_OBJECT
 */
export type review_tag_pk_columns_input = { id: any }

/**
 * @name review_tag_select_column
 * @type ENUM
 */
export type t_review_tag_select_column = EnumType<
  'id' | 'review_id' | 'sentence' | 'sentiment' | 'tag_id'
>

/**
 * @name review_tag_set_input
 * @type INPUT_OBJECT
 */
export type review_tag_set_input = {
  id?: any | null
  review_id?: any | null
  sentence?: string | null
  sentiment?: any | null
  tag_id?: any | null
}

/**
 * @name review_tag_stddev_fields
 * @type OBJECT
 */
export type t_review_tag_stddev_fields = FieldsType<
  {
    __typename: t_String<'review_tag_stddev_fields'>
    sentiment?: t_Float | null
  },
  Extension<'review_tag_stddev_fields'>
>

/**
 * @name review_tag_stddev_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_stddev_order_by = { sentiment?: order_by | null }

/**
 * @name review_tag_stddev_pop_fields
 * @type OBJECT
 */
export type t_review_tag_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'review_tag_stddev_pop_fields'>
    sentiment?: t_Float | null
  },
  Extension<'review_tag_stddev_pop_fields'>
>

/**
 * @name review_tag_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_stddev_pop_order_by = { sentiment?: order_by | null }

/**
 * @name review_tag_stddev_samp_fields
 * @type OBJECT
 */
export type t_review_tag_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'review_tag_stddev_samp_fields'>
    sentiment?: t_Float | null
  },
  Extension<'review_tag_stddev_samp_fields'>
>

/**
 * @name review_tag_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_stddev_samp_order_by = { sentiment?: order_by | null }

/**
 * @name review_tag_sum_fields
 * @type OBJECT
 */
export type t_review_tag_sum_fields = FieldsType<
  {
    __typename: t_String<'review_tag_sum_fields'>
    sentiment?: t_numeric | null
  },
  Extension<'review_tag_sum_fields'>
>

/**
 * @name review_tag_sum_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_sum_order_by = { sentiment?: order_by | null }

/**
 * @name review_tag_update_column
 * @type ENUM
 */
export type t_review_tag_update_column = EnumType<
  'id' | 'review_id' | 'sentence' | 'sentiment' | 'tag_id'
>

/**
 * @name review_tag_var_pop_fields
 * @type OBJECT
 */
export type t_review_tag_var_pop_fields = FieldsType<
  {
    __typename: t_String<'review_tag_var_pop_fields'>
    sentiment?: t_Float | null
  },
  Extension<'review_tag_var_pop_fields'>
>

/**
 * @name review_tag_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_var_pop_order_by = { sentiment?: order_by | null }

/**
 * @name review_tag_var_samp_fields
 * @type OBJECT
 */
export type t_review_tag_var_samp_fields = FieldsType<
  {
    __typename: t_String<'review_tag_var_samp_fields'>
    sentiment?: t_Float | null
  },
  Extension<'review_tag_var_samp_fields'>
>

/**
 * @name review_tag_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_var_samp_order_by = { sentiment?: order_by | null }

/**
 * @name review_tag_variance_fields
 * @type OBJECT
 */
export type t_review_tag_variance_fields = FieldsType<
  {
    __typename: t_String<'review_tag_variance_fields'>
    sentiment?: t_Float | null
  },
  Extension<'review_tag_variance_fields'>
>

/**
 * @name review_tag_variance_order_by
 * @type INPUT_OBJECT
 */
export type review_tag_variance_order_by = { sentiment?: order_by | null }

/**
 * @name review_update_column
 * @type ENUM
 */
export type t_review_update_column = EnumType<
  | 'authored_at'
  | 'categories'
  | 'favorited'
  | 'id'
  | 'location'
  | 'native_data_unique_key'
  | 'rating'
  | 'restaurant_id'
  | 'source'
  | 'tag_id'
  | 'text'
  | 'updated_at'
  | 'user_id'
  | 'username'
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
  review_native_data_unique_constraint = 'review_native_data_unique_constraint',
  review_native_data_unique_key_key = 'review_native_data_unique_key_key',
  review_pkey = 'review_pkey',
  review_username_restaurant_id_tag_id_authored_at_key = 'review_username_restaurant_id_tag_id_authored_at_key',
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
  authored_at = 'authored_at',
  categories = 'categories',
  favorited = 'favorited',
  id = 'id',
  location = 'location',
  native_data_unique_key = 'native_data_unique_key',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  source = 'source',
  tag_id = 'tag_id',
  text = 'text',
  updated_at = 'updated_at',
  user_id = 'user_id',
  username = 'username',
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
 * @name review_tag
 * @type OBJECT
 */
export type review_tag = TypeData<t_review_tag>

/**
 * @name review_tag_aggregate
 * @type OBJECT
 */
export type review_tag_aggregate = TypeData<t_review_tag_aggregate>

/**
 * @name review_tag_aggregate_fields
 * @type OBJECT
 */
export type review_tag_aggregate_fields = TypeData<
  t_review_tag_aggregate_fields
>

/**
 * @name review_tag_avg_fields
 * @type OBJECT
 */
export type review_tag_avg_fields = TypeData<t_review_tag_avg_fields>

/**
 * @name review_tag_constraint
 * @type ENUM
 */
export enum review_tag_constraint {
  review_tag_pkey = 'review_tag_pkey',
  review_tag_tag_id_review_id_sentence_key = 'review_tag_tag_id_review_id_sentence_key',
}

/**
 * @name review_tag_max_fields
 * @type OBJECT
 */
export type review_tag_max_fields = TypeData<t_review_tag_max_fields>

/**
 * @name review_tag_min_fields
 * @type OBJECT
 */
export type review_tag_min_fields = TypeData<t_review_tag_min_fields>

/**
 * @name review_tag_mutation_response
 * @type OBJECT
 */
export type review_tag_mutation_response = TypeData<
  t_review_tag_mutation_response
>

/**
 * @name review_tag_select_column
 * @type ENUM
 */
export enum review_tag_select_column {
  id = 'id',
  review_id = 'review_id',
  sentence = 'sentence',
  sentiment = 'sentiment',
  tag_id = 'tag_id',
}

/**
 * @name review_tag_stddev_fields
 * @type OBJECT
 */
export type review_tag_stddev_fields = TypeData<t_review_tag_stddev_fields>

/**
 * @name review_tag_stddev_pop_fields
 * @type OBJECT
 */
export type review_tag_stddev_pop_fields = TypeData<
  t_review_tag_stddev_pop_fields
>

/**
 * @name review_tag_stddev_samp_fields
 * @type OBJECT
 */
export type review_tag_stddev_samp_fields = TypeData<
  t_review_tag_stddev_samp_fields
>

/**
 * @name review_tag_sum_fields
 * @type OBJECT
 */
export type review_tag_sum_fields = TypeData<t_review_tag_sum_fields>

/**
 * @name review_tag_update_column
 * @type ENUM
 */
export enum review_tag_update_column {
  id = 'id',
  review_id = 'review_id',
  sentence = 'sentence',
  sentiment = 'sentiment',
  tag_id = 'tag_id',
}

/**
 * @name review_tag_var_pop_fields
 * @type OBJECT
 */
export type review_tag_var_pop_fields = TypeData<t_review_tag_var_pop_fields>

/**
 * @name review_tag_var_samp_fields
 * @type OBJECT
 */
export type review_tag_var_samp_fields = TypeData<t_review_tag_var_samp_fields>

/**
 * @name review_tag_variance_fields
 * @type OBJECT
 */
export type review_tag_variance_fields = TypeData<t_review_tag_variance_fields>

/**
 * @name review_update_column
 * @type ENUM
 */
export enum review_update_column {
  authored_at = 'authored_at',
  categories = 'categories',
  favorited = 'favorited',
  id = 'id',
  location = 'location',
  native_data_unique_key = 'native_data_unique_key',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  source = 'source',
  tag_id = 'tag_id',
  text = 'text',
  updated_at = 'updated_at',
  user_id = 'user_id',
  username = 'username',
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
