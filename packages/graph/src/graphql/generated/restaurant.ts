import { EnumType, FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { geometry_comparison_exp, t_geometry } from './geometry'
import { Int_comparison_exp, t_Int } from './Int'
import { jsonb_comparison_exp, t_jsonb } from './jsonb'
import {
  menu_item_aggregate_order_by,
  menu_item_arr_rel_insert_input,
  menu_item_bool_exp,
  menu_item_order_by,
  menu_item_select_column,
  t_menu_item,
  t_menu_item_aggregate,
} from './menu_item'
import { numeric_comparison_exp, t_numeric } from './numeric'
import { order_by } from './order_by'
import {
  review_aggregate_order_by,
  review_arr_rel_insert_input,
  review_bool_exp,
  review_order_by,
  review_select_column,
  t_review,
  t_review_aggregate,
} from './review'
import { String_comparison_exp, t_String } from './String'
import {
  t_tag,
  tag_bool_exp,
  tag_obj_rel_insert_input,
  tag_order_by,
} from './tag'
import { t_timestamptz, timestamptz_comparison_exp } from './timestamptz'
import { t_uuid, uuid_comparison_exp } from './uuid'

/**
 * @name restaurant
 * @type OBJECT
 */
export type t_restaurant = FieldsType<
  {
    __typename: t_String<'restaurant'>
    address?: t_String | null
    city?: t_String | null
    created_at: t_timestamptz
    description?: t_String | null
    hours?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    id: t_uuid
    image?: t_String | null
    is_open_now?: t_Boolean | null
    location: t_geometry
    menu_items: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item[]
    >
    menu_items_aggregate: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item_aggregate
    >
    name: t_String
    photos?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    price_range?: t_String | null
    rating?: t_numeric | null
    rating_factors?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    reviews: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    reviews_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review_aggregate
    >
    slug: t_String
    sources?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    state?: t_String | null
    tag_names?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    tags: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag[]
    >
    tags_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag_aggregate
    >
    telephone?: t_String | null
    top_tags?: FieldsTypeArg<
      {
        args: restaurant_top_tags_args
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag[] | null
    >
    updated_at: t_timestamptz
    website?: t_String | null
    zip?: t_numeric | null
  },
  Extension<'restaurant'>
>

/**
 * @name restaurant_aggregate
 * @type OBJECT
 */
export type t_restaurant_aggregate = FieldsType<
  {
    __typename: t_String<'restaurant_aggregate'>
    aggregate?: t_restaurant_aggregate_fields | null
    nodes: t_restaurant[]
  },
  Extension<'restaurant_aggregate'>
>

/**
 * @name restaurant_aggregate_fields
 * @type OBJECT
 */
export type t_restaurant_aggregate_fields = FieldsType<
  {
    __typename: t_String<'restaurant_aggregate_fields'>
    avg?: t_restaurant_avg_fields | null
    count?: FieldsTypeArg<
      {
        columns?: restaurant_select_column[] | null
        distinct?: boolean | null
      },
      t_Int | null
    >
    max?: t_restaurant_max_fields | null
    min?: t_restaurant_min_fields | null
    stddev?: t_restaurant_stddev_fields | null
    stddev_pop?: t_restaurant_stddev_pop_fields | null
    stddev_samp?: t_restaurant_stddev_samp_fields | null
    sum?: t_restaurant_sum_fields | null
    var_pop?: t_restaurant_var_pop_fields | null
    var_samp?: t_restaurant_var_samp_fields | null
    variance?: t_restaurant_variance_fields | null
  },
  Extension<'restaurant_aggregate_fields'>
>

/**
 * @name restaurant_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_aggregate_order_by = {
  avg?: restaurant_avg_order_by | null
  count?: order_by | null
  max?: restaurant_max_order_by | null
  min?: restaurant_min_order_by | null
  stddev?: restaurant_stddev_order_by | null
  stddev_pop?: restaurant_stddev_pop_order_by | null
  stddev_samp?: restaurant_stddev_samp_order_by | null
  sum?: restaurant_sum_order_by | null
  var_pop?: restaurant_var_pop_order_by | null
  var_samp?: restaurant_var_samp_order_by | null
  variance?: restaurant_variance_order_by | null
}

/**
 * @name restaurant_append_input
 * @type INPUT_OBJECT
 */
export type restaurant_append_input = {
  hours?: any | null
  photos?: any | null
  rating_factors?: any | null
  sources?: any | null
  tag_names?: any | null
}

/**
 * @name restaurant_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_arr_rel_insert_input = {
  data: restaurant_insert_input[]
  on_conflict?: restaurant_on_conflict | null
}

/**
 * @name restaurant_avg_fields
 * @type OBJECT
 */
export type t_restaurant_avg_fields = FieldsType<
  {
    __typename: t_String<'restaurant_avg_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_avg_fields'>
>

/**
 * @name restaurant_avg_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_avg_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_bool_exp
 * @type INPUT_OBJECT
 */
export type restaurant_bool_exp = {
  _and?: (restaurant_bool_exp | null)[] | null
  _not?: restaurant_bool_exp | null
  _or?: (restaurant_bool_exp | null)[] | null
  address?: String_comparison_exp | null
  city?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  hours?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  image?: String_comparison_exp | null
  location?: geometry_comparison_exp | null
  menu_items?: menu_item_bool_exp | null
  name?: String_comparison_exp | null
  photos?: jsonb_comparison_exp | null
  price_range?: String_comparison_exp | null
  rating?: numeric_comparison_exp | null
  rating_factors?: jsonb_comparison_exp | null
  reviews?: review_bool_exp | null
  slug?: String_comparison_exp | null
  sources?: jsonb_comparison_exp | null
  state?: String_comparison_exp | null
  tag_names?: jsonb_comparison_exp | null
  tags?: restaurant_tag_bool_exp | null
  telephone?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  website?: String_comparison_exp | null
  zip?: numeric_comparison_exp | null
}

/**
 * @name restaurant_constraint
 * @type ENUM
 */
export type t_restaurant_constraint = EnumType<
  'restaurant_name_address_key' | 'restaurant_pkey' | 'restaurant_slug_key'
>

/**
 * @name restaurant_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_at_path_input = {
  hours?: (string | null)[] | null
  photos?: (string | null)[] | null
  rating_factors?: (string | null)[] | null
  sources?: (string | null)[] | null
  tag_names?: (string | null)[] | null
}

/**
 * @name restaurant_delete_elem_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_elem_input = {
  hours?: number | null
  photos?: number | null
  rating_factors?: number | null
  sources?: number | null
  tag_names?: number | null
}

/**
 * @name restaurant_delete_key_input
 * @type INPUT_OBJECT
 */
export type restaurant_delete_key_input = {
  hours?: string | null
  photos?: string | null
  rating_factors?: string | null
  sources?: string | null
  tag_names?: string | null
}

/**
 * @name restaurant_inc_input
 * @type INPUT_OBJECT
 */
export type restaurant_inc_input = { rating?: any | null; zip?: any | null }

/**
 * @name restaurant_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_insert_input = {
  address?: string | null
  city?: string | null
  created_at?: any | null
  description?: string | null
  hours?: any | null
  id?: any | null
  image?: string | null
  location?: any | null
  menu_items?: menu_item_arr_rel_insert_input | null
  name?: string | null
  photos?: any | null
  price_range?: string | null
  rating?: any | null
  rating_factors?: any | null
  reviews?: review_arr_rel_insert_input | null
  slug?: string | null
  sources?: any | null
  state?: string | null
  tag_names?: any | null
  tags?: restaurant_tag_arr_rel_insert_input | null
  telephone?: string | null
  updated_at?: any | null
  website?: string | null
  zip?: any | null
}

/**
 * @name restaurant_max_fields
 * @type OBJECT
 */
export type t_restaurant_max_fields = FieldsType<
  {
    __typename: t_String<'restaurant_max_fields'>
    address?: t_String | null
    city?: t_String | null
    created_at?: t_timestamptz | null
    description?: t_String | null
    id?: t_uuid | null
    image?: t_String | null
    name?: t_String | null
    price_range?: t_String | null
    rating?: t_numeric | null
    slug?: t_String | null
    state?: t_String | null
    telephone?: t_String | null
    updated_at?: t_timestamptz | null
    website?: t_String | null
    zip?: t_numeric | null
  },
  Extension<'restaurant_max_fields'>
>

/**
 * @name restaurant_max_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_max_order_by = {
  address?: order_by | null
  city?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  image?: order_by | null
  name?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  slug?: order_by | null
  state?: order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
  website?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_min_fields
 * @type OBJECT
 */
export type t_restaurant_min_fields = FieldsType<
  {
    __typename: t_String<'restaurant_min_fields'>
    address?: t_String | null
    city?: t_String | null
    created_at?: t_timestamptz | null
    description?: t_String | null
    id?: t_uuid | null
    image?: t_String | null
    name?: t_String | null
    price_range?: t_String | null
    rating?: t_numeric | null
    slug?: t_String | null
    state?: t_String | null
    telephone?: t_String | null
    updated_at?: t_timestamptz | null
    website?: t_String | null
    zip?: t_numeric | null
  },
  Extension<'restaurant_min_fields'>
>

/**
 * @name restaurant_min_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_min_order_by = {
  address?: order_by | null
  city?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  image?: order_by | null
  name?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  slug?: order_by | null
  state?: order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
  website?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_mutation_response
 * @type OBJECT
 */
export type t_restaurant_mutation_response = FieldsType<
  {
    __typename: t_String<'restaurant_mutation_response'>
    affected_rows: t_Int
    returning: t_restaurant[]
  },
  Extension<'restaurant_mutation_response'>
>

/**
 * @name restaurant_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_obj_rel_insert_input = {
  data: restaurant_insert_input
  on_conflict?: restaurant_on_conflict | null
}

/**
 * @name restaurant_on_conflict
 * @type INPUT_OBJECT
 */
export type restaurant_on_conflict = {
  constraint: restaurant_constraint
  update_columns: restaurant_update_column[]
  where?: restaurant_bool_exp | null
}

/**
 * @name restaurant_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_order_by = {
  address?: order_by | null
  city?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  hours?: order_by | null
  id?: order_by | null
  image?: order_by | null
  location?: order_by | null
  menu_items_aggregate?: menu_item_aggregate_order_by | null
  name?: order_by | null
  photos?: order_by | null
  price_range?: order_by | null
  rating?: order_by | null
  rating_factors?: order_by | null
  reviews_aggregate?: review_aggregate_order_by | null
  slug?: order_by | null
  sources?: order_by | null
  state?: order_by | null
  tag_names?: order_by | null
  tags_aggregate?: restaurant_tag_aggregate_order_by | null
  telephone?: order_by | null
  updated_at?: order_by | null
  website?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_pk_columns_input
 * @type INPUT_OBJECT
 */
export type restaurant_pk_columns_input = { id: any }

/**
 * @name restaurant_prepend_input
 * @type INPUT_OBJECT
 */
export type restaurant_prepend_input = {
  hours?: any | null
  photos?: any | null
  rating_factors?: any | null
  sources?: any | null
  tag_names?: any | null
}

/**
 * @name restaurant_select_column
 * @type ENUM
 */
export type t_restaurant_select_column = EnumType<
  | 'address'
  | 'city'
  | 'created_at'
  | 'description'
  | 'hours'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'photos'
  | 'price_range'
  | 'rating'
  | 'rating_factors'
  | 'slug'
  | 'sources'
  | 'state'
  | 'tag_names'
  | 'telephone'
  | 'updated_at'
  | 'website'
  | 'zip'
>

/**
 * @name restaurant_set_input
 * @type INPUT_OBJECT
 */
export type restaurant_set_input = {
  address?: string | null
  city?: string | null
  created_at?: any | null
  description?: string | null
  hours?: any | null
  id?: any | null
  image?: string | null
  location?: any | null
  name?: string | null
  photos?: any | null
  price_range?: string | null
  rating?: any | null
  rating_factors?: any | null
  slug?: string | null
  sources?: any | null
  state?: string | null
  tag_names?: any | null
  telephone?: string | null
  updated_at?: any | null
  website?: string | null
  zip?: any | null
}

/**
 * @name restaurant_stddev_fields
 * @type OBJECT
 */
export type t_restaurant_stddev_fields = FieldsType<
  {
    __typename: t_String<'restaurant_stddev_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_fields'>
>

/**
 * @name restaurant_stddev_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_stddev_pop_fields
 * @type OBJECT
 */
export type t_restaurant_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_stddev_pop_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_pop_fields'>
>

/**
 * @name restaurant_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_pop_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_stddev_samp_fields
 * @type OBJECT
 */
export type t_restaurant_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_stddev_samp_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_stddev_samp_fields'>
>

/**
 * @name restaurant_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_stddev_samp_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_sum_fields
 * @type OBJECT
 */
export type t_restaurant_sum_fields = FieldsType<
  {
    __typename: t_String<'restaurant_sum_fields'>
    rating?: t_numeric | null
    zip?: t_numeric | null
  },
  Extension<'restaurant_sum_fields'>
>

/**
 * @name restaurant_sum_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_sum_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_tag
 * @type OBJECT
 */
export type t_restaurant_tag = FieldsType<
  {
    __typename: t_String<'restaurant_tag'>
    id: t_uuid
    photos?: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    rank?: t_Int | null
    rating?: t_numeric | null
    restaurant: t_restaurant
    restaurant_id: t_uuid
    tag: t_tag
    tag_id: t_uuid
  },
  Extension<'restaurant_tag'>
>

/**
 * @name restaurant_tag_aggregate
 * @type OBJECT
 */
export type t_restaurant_tag_aggregate = FieldsType<
  {
    __typename: t_String<'restaurant_tag_aggregate'>
    aggregate?: t_restaurant_tag_aggregate_fields | null
    nodes: t_restaurant_tag[]
  },
  Extension<'restaurant_tag_aggregate'>
>

/**
 * @name restaurant_tag_aggregate_fields
 * @type OBJECT
 */
export type t_restaurant_tag_aggregate_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_aggregate_fields'>
    avg?: t_restaurant_tag_avg_fields | null
    count?: FieldsTypeArg<
      {
        columns?: restaurant_tag_select_column[] | null
        distinct?: boolean | null
      },
      t_Int | null
    >
    max?: t_restaurant_tag_max_fields | null
    min?: t_restaurant_tag_min_fields | null
    stddev?: t_restaurant_tag_stddev_fields | null
    stddev_pop?: t_restaurant_tag_stddev_pop_fields | null
    stddev_samp?: t_restaurant_tag_stddev_samp_fields | null
    sum?: t_restaurant_tag_sum_fields | null
    var_pop?: t_restaurant_tag_var_pop_fields | null
    var_samp?: t_restaurant_tag_var_samp_fields | null
    variance?: t_restaurant_tag_variance_fields | null
  },
  Extension<'restaurant_tag_aggregate_fields'>
>

/**
 * @name restaurant_tag_aggregate_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_aggregate_order_by = {
  avg?: restaurant_tag_avg_order_by | null
  count?: order_by | null
  max?: restaurant_tag_max_order_by | null
  min?: restaurant_tag_min_order_by | null
  stddev?: restaurant_tag_stddev_order_by | null
  stddev_pop?: restaurant_tag_stddev_pop_order_by | null
  stddev_samp?: restaurant_tag_stddev_samp_order_by | null
  sum?: restaurant_tag_sum_order_by | null
  var_pop?: restaurant_tag_var_pop_order_by | null
  var_samp?: restaurant_tag_var_samp_order_by | null
  variance?: restaurant_tag_variance_order_by | null
}

/**
 * @name restaurant_tag_append_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_append_input = { photos?: any | null }

/**
 * @name restaurant_tag_arr_rel_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_arr_rel_insert_input = {
  data: restaurant_tag_insert_input[]
  on_conflict?: restaurant_tag_on_conflict | null
}

/**
 * @name restaurant_tag_avg_fields
 * @type OBJECT
 */
export type t_restaurant_tag_avg_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_avg_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_avg_fields'>
>

/**
 * @name restaurant_tag_avg_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_avg_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_bool_exp
 * @type INPUT_OBJECT
 */
export type restaurant_tag_bool_exp = {
  _and?: (restaurant_tag_bool_exp | null)[] | null
  _not?: restaurant_tag_bool_exp | null
  _or?: (restaurant_tag_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  photos?: jsonb_comparison_exp | null
  rank?: Int_comparison_exp | null
  rating?: numeric_comparison_exp | null
  restaurant?: restaurant_bool_exp | null
  restaurant_id?: uuid_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_id?: uuid_comparison_exp | null
}

/**
 * @name restaurant_tag_constraint
 * @type ENUM
 */
export type t_restaurant_tag_constraint = EnumType<
  'restaurant_tag_id_key' | 'restaurant_tag_pkey'
>

/**
 * @name restaurant_tag_delete_at_path_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_at_path_input = {
  photos?: (string | null)[] | null
}

/**
 * @name restaurant_tag_delete_elem_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_elem_input = { photos?: number | null }

/**
 * @name restaurant_tag_delete_key_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_delete_key_input = { photos?: string | null }

/**
 * @name restaurant_tag_inc_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_inc_input = {
  rank?: number | null
  rating?: any | null
}

/**
 * @name restaurant_tag_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_insert_input = {
  id?: any | null
  photos?: any | null
  rank?: number | null
  rating?: any | null
  restaurant?: restaurant_obj_rel_insert_input | null
  restaurant_id?: any | null
  tag?: tag_obj_rel_insert_input | null
  tag_id?: any | null
}

/**
 * @name restaurant_tag_max_fields
 * @type OBJECT
 */
export type t_restaurant_tag_max_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_max_fields'>
    id?: t_uuid | null
    rank?: t_Int | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
  },
  Extension<'restaurant_tag_max_fields'>
>

/**
 * @name restaurant_tag_max_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_max_order_by = {
  id?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
}

/**
 * @name restaurant_tag_min_fields
 * @type OBJECT
 */
export type t_restaurant_tag_min_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_min_fields'>
    id?: t_uuid | null
    rank?: t_Int | null
    rating?: t_numeric | null
    restaurant_id?: t_uuid | null
    tag_id?: t_uuid | null
  },
  Extension<'restaurant_tag_min_fields'>
>

/**
 * @name restaurant_tag_min_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_min_order_by = {
  id?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  restaurant_id?: order_by | null
  tag_id?: order_by | null
}

/**
 * @name restaurant_tag_mutation_response
 * @type OBJECT
 */
export type t_restaurant_tag_mutation_response = FieldsType<
  {
    __typename: t_String<'restaurant_tag_mutation_response'>
    affected_rows: t_Int
    returning: t_restaurant_tag[]
  },
  Extension<'restaurant_tag_mutation_response'>
>

/**
 * @name restaurant_tag_obj_rel_insert_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_obj_rel_insert_input = {
  data: restaurant_tag_insert_input
  on_conflict?: restaurant_tag_on_conflict | null
}

/**
 * @name restaurant_tag_on_conflict
 * @type INPUT_OBJECT
 */
export type restaurant_tag_on_conflict = {
  constraint: restaurant_tag_constraint
  update_columns: restaurant_tag_update_column[]
  where?: restaurant_tag_bool_exp | null
}

/**
 * @name restaurant_tag_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_order_by = {
  id?: order_by | null
  photos?: order_by | null
  rank?: order_by | null
  rating?: order_by | null
  restaurant?: restaurant_order_by | null
  restaurant_id?: order_by | null
  tag?: tag_order_by | null
  tag_id?: order_by | null
}

/**
 * @name restaurant_tag_pk_columns_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_pk_columns_input = {
  restaurant_id: any
  tag_id: any
}

/**
 * @name restaurant_tag_prepend_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_prepend_input = { photos?: any | null }

/**
 * @name restaurant_tag_select_column
 * @type ENUM
 */
export type t_restaurant_tag_select_column = EnumType<
  'id' | 'photos' | 'rank' | 'rating' | 'restaurant_id' | 'tag_id'
>

/**
 * @name restaurant_tag_set_input
 * @type INPUT_OBJECT
 */
export type restaurant_tag_set_input = {
  id?: any | null
  photos?: any | null
  rank?: number | null
  rating?: any | null
  restaurant_id?: any | null
  tag_id?: any | null
}

/**
 * @name restaurant_tag_stddev_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_fields'>
>

/**
 * @name restaurant_tag_stddev_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_stddev_pop_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_pop_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_pop_fields'>
>

/**
 * @name restaurant_tag_stddev_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_pop_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_stddev_samp_fields
 * @type OBJECT
 */
export type t_restaurant_tag_stddev_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_stddev_samp_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_stddev_samp_fields'>
>

/**
 * @name restaurant_tag_stddev_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_stddev_samp_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_sum_fields
 * @type OBJECT
 */
export type t_restaurant_tag_sum_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_sum_fields'>
    rank?: t_Int | null
    rating?: t_numeric | null
  },
  Extension<'restaurant_tag_sum_fields'>
>

/**
 * @name restaurant_tag_sum_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_sum_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_update_column
 * @type ENUM
 */
export type t_restaurant_tag_update_column = EnumType<
  'id' | 'photos' | 'rank' | 'rating' | 'restaurant_id' | 'tag_id'
>

/**
 * @name restaurant_tag_var_pop_fields
 * @type OBJECT
 */
export type t_restaurant_tag_var_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_var_pop_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_var_pop_fields'>
>

/**
 * @name restaurant_tag_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_var_pop_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_var_samp_fields
 * @type OBJECT
 */
export type t_restaurant_tag_var_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_var_samp_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_var_samp_fields'>
>

/**
 * @name restaurant_tag_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_var_samp_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_tag_variance_fields
 * @type OBJECT
 */
export type t_restaurant_tag_variance_fields = FieldsType<
  {
    __typename: t_String<'restaurant_tag_variance_fields'>
    rank?: t_Float | null
    rating?: t_Float | null
  },
  Extension<'restaurant_tag_variance_fields'>
>

/**
 * @name restaurant_tag_variance_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_tag_variance_order_by = {
  rank?: order_by | null
  rating?: order_by | null
}

/**
 * @name restaurant_top_tags_args
 * @type INPUT_OBJECT
 */
export type restaurant_top_tags_args = { tag_names?: string | null }

/**
 * @name restaurant_update_column
 * @type ENUM
 */
export type t_restaurant_update_column = EnumType<
  | 'address'
  | 'city'
  | 'created_at'
  | 'description'
  | 'hours'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'photos'
  | 'price_range'
  | 'rating'
  | 'rating_factors'
  | 'slug'
  | 'sources'
  | 'state'
  | 'tag_names'
  | 'telephone'
  | 'updated_at'
  | 'website'
  | 'zip'
>

/**
 * @name restaurant_var_pop_fields
 * @type OBJECT
 */
export type t_restaurant_var_pop_fields = FieldsType<
  {
    __typename: t_String<'restaurant_var_pop_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_var_pop_fields'>
>

/**
 * @name restaurant_var_pop_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_var_pop_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_var_samp_fields
 * @type OBJECT
 */
export type t_restaurant_var_samp_fields = FieldsType<
  {
    __typename: t_String<'restaurant_var_samp_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_var_samp_fields'>
>

/**
 * @name restaurant_var_samp_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_var_samp_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant_variance_fields
 * @type OBJECT
 */
export type t_restaurant_variance_fields = FieldsType<
  {
    __typename: t_String<'restaurant_variance_fields'>
    rating?: t_Float | null
    zip?: t_Float | null
  },
  Extension<'restaurant_variance_fields'>
>

/**
 * @name restaurant_variance_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_variance_order_by = {
  rating?: order_by | null
  zip?: order_by | null
}

/**
 * @name restaurant
 * @type OBJECT
 */
export type restaurant = TypeData<t_restaurant>

/**
 * @name restaurant_aggregate
 * @type OBJECT
 */
export type restaurant_aggregate = TypeData<t_restaurant_aggregate>

/**
 * @name restaurant_aggregate_fields
 * @type OBJECT
 */
export type restaurant_aggregate_fields = TypeData<
  t_restaurant_aggregate_fields
>

/**
 * @name restaurant_avg_fields
 * @type OBJECT
 */
export type restaurant_avg_fields = TypeData<t_restaurant_avg_fields>

/**
 * @name restaurant_constraint
 * @type ENUM
 */
export enum restaurant_constraint {
  restaurant_name_address_key = 'restaurant_name_address_key',
  restaurant_pkey = 'restaurant_pkey',
  restaurant_slug_key = 'restaurant_slug_key',
}

/**
 * @name restaurant_max_fields
 * @type OBJECT
 */
export type restaurant_max_fields = TypeData<t_restaurant_max_fields>

/**
 * @name restaurant_min_fields
 * @type OBJECT
 */
export type restaurant_min_fields = TypeData<t_restaurant_min_fields>

/**
 * @name restaurant_mutation_response
 * @type OBJECT
 */
export type restaurant_mutation_response = TypeData<
  t_restaurant_mutation_response
>

/**
 * @name restaurant_select_column
 * @type ENUM
 */
export enum restaurant_select_column {
  address = 'address',
  city = 'city',
  created_at = 'created_at',
  description = 'description',
  hours = 'hours',
  id = 'id',
  image = 'image',
  location = 'location',
  name = 'name',
  photos = 'photos',
  price_range = 'price_range',
  rating = 'rating',
  rating_factors = 'rating_factors',
  slug = 'slug',
  sources = 'sources',
  state = 'state',
  tag_names = 'tag_names',
  telephone = 'telephone',
  updated_at = 'updated_at',
  website = 'website',
  zip = 'zip',
}

/**
 * @name restaurant_stddev_fields
 * @type OBJECT
 */
export type restaurant_stddev_fields = TypeData<t_restaurant_stddev_fields>

/**
 * @name restaurant_stddev_pop_fields
 * @type OBJECT
 */
export type restaurant_stddev_pop_fields = TypeData<
  t_restaurant_stddev_pop_fields
>

/**
 * @name restaurant_stddev_samp_fields
 * @type OBJECT
 */
export type restaurant_stddev_samp_fields = TypeData<
  t_restaurant_stddev_samp_fields
>

/**
 * @name restaurant_sum_fields
 * @type OBJECT
 */
export type restaurant_sum_fields = TypeData<t_restaurant_sum_fields>

/**
 * @name restaurant_tag
 * @type OBJECT
 */
export type restaurant_tag = TypeData<t_restaurant_tag>

/**
 * @name restaurant_tag_aggregate
 * @type OBJECT
 */
export type restaurant_tag_aggregate = TypeData<t_restaurant_tag_aggregate>

/**
 * @name restaurant_tag_aggregate_fields
 * @type OBJECT
 */
export type restaurant_tag_aggregate_fields = TypeData<
  t_restaurant_tag_aggregate_fields
>

/**
 * @name restaurant_tag_avg_fields
 * @type OBJECT
 */
export type restaurant_tag_avg_fields = TypeData<t_restaurant_tag_avg_fields>

/**
 * @name restaurant_tag_constraint
 * @type ENUM
 */
export enum restaurant_tag_constraint {
  restaurant_tag_id_key = 'restaurant_tag_id_key',
  restaurant_tag_pkey = 'restaurant_tag_pkey',
}

/**
 * @name restaurant_tag_max_fields
 * @type OBJECT
 */
export type restaurant_tag_max_fields = TypeData<t_restaurant_tag_max_fields>

/**
 * @name restaurant_tag_min_fields
 * @type OBJECT
 */
export type restaurant_tag_min_fields = TypeData<t_restaurant_tag_min_fields>

/**
 * @name restaurant_tag_mutation_response
 * @type OBJECT
 */
export type restaurant_tag_mutation_response = TypeData<
  t_restaurant_tag_mutation_response
>

/**
 * @name restaurant_tag_select_column
 * @type ENUM
 */
export enum restaurant_tag_select_column {
  id = 'id',
  photos = 'photos',
  rank = 'rank',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
}

/**
 * @name restaurant_tag_stddev_fields
 * @type OBJECT
 */
export type restaurant_tag_stddev_fields = TypeData<
  t_restaurant_tag_stddev_fields
>

/**
 * @name restaurant_tag_stddev_pop_fields
 * @type OBJECT
 */
export type restaurant_tag_stddev_pop_fields = TypeData<
  t_restaurant_tag_stddev_pop_fields
>

/**
 * @name restaurant_tag_stddev_samp_fields
 * @type OBJECT
 */
export type restaurant_tag_stddev_samp_fields = TypeData<
  t_restaurant_tag_stddev_samp_fields
>

/**
 * @name restaurant_tag_sum_fields
 * @type OBJECT
 */
export type restaurant_tag_sum_fields = TypeData<t_restaurant_tag_sum_fields>

/**
 * @name restaurant_tag_update_column
 * @type ENUM
 */
export enum restaurant_tag_update_column {
  id = 'id',
  photos = 'photos',
  rank = 'rank',
  rating = 'rating',
  restaurant_id = 'restaurant_id',
  tag_id = 'tag_id',
}

/**
 * @name restaurant_tag_var_pop_fields
 * @type OBJECT
 */
export type restaurant_tag_var_pop_fields = TypeData<
  t_restaurant_tag_var_pop_fields
>

/**
 * @name restaurant_tag_var_samp_fields
 * @type OBJECT
 */
export type restaurant_tag_var_samp_fields = TypeData<
  t_restaurant_tag_var_samp_fields
>

/**
 * @name restaurant_tag_variance_fields
 * @type OBJECT
 */
export type restaurant_tag_variance_fields = TypeData<
  t_restaurant_tag_variance_fields
>

/**
 * @name restaurant_update_column
 * @type ENUM
 */
export enum restaurant_update_column {
  address = 'address',
  city = 'city',
  created_at = 'created_at',
  description = 'description',
  hours = 'hours',
  id = 'id',
  image = 'image',
  location = 'location',
  name = 'name',
  photos = 'photos',
  price_range = 'price_range',
  rating = 'rating',
  rating_factors = 'rating_factors',
  slug = 'slug',
  sources = 'sources',
  state = 'state',
  tag_names = 'tag_names',
  telephone = 'telephone',
  updated_at = 'updated_at',
  website = 'website',
  zip = 'zip',
}

/**
 * @name restaurant_var_pop_fields
 * @type OBJECT
 */
export type restaurant_var_pop_fields = TypeData<t_restaurant_var_pop_fields>

/**
 * @name restaurant_var_samp_fields
 * @type OBJECT
 */
export type restaurant_var_samp_fields = TypeData<t_restaurant_var_samp_fields>

/**
 * @name restaurant_variance_fields
 * @type OBJECT
 */
export type restaurant_variance_fields = TypeData<t_restaurant_variance_fields>
