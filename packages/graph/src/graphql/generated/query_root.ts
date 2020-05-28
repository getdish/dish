import { FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { Extension } from './extensionsTypes'
import { t_Int } from './Int'
import {
  menu_item_bool_exp,
  menu_item_order_by,
  menu_item_select_column,
  t_menu_item,
  t_menu_item_aggregate,
} from './menu_item'
import {
  restaurant_bool_exp,
  restaurant_order_by,
  restaurant_select_column,
  restaurant_tag_bool_exp,
  restaurant_tag_order_by,
  restaurant_tag_select_column,
  t_restaurant,
  t_restaurant_aggregate,
  t_restaurant_tag,
  t_restaurant_tag_aggregate,
} from './restaurant'
import {
  review_bool_exp,
  review_order_by,
  review_select_column,
  t_review,
  t_review_aggregate,
} from './review'
import {
  scrape_bool_exp,
  scrape_order_by,
  scrape_select_column,
  t_scrape,
  t_scrape_aggregate,
} from './scrape'
import { t_String } from './String'
import {
  t_tag,
  t_tag_aggregate,
  t_tag_tag,
  t_tag_tag_aggregate,
  tag_bool_exp,
  tag_order_by,
  tag_select_column,
  tag_tag_bool_exp,
  tag_tag_order_by,
  tag_tag_select_column,
} from './tag'
import {
  t_user,
  t_user_aggregate,
  user_bool_exp,
  user_order_by,
  user_select_column,
} from './user'
import { t_uuid } from './uuid'

/**
 * @name query_root
 * @type OBJECT
 */
export type t_query_root = FieldsType<
  {
    __typename: t_String<'query_root'>
    menu_item: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item[]
    >
    menu_item_aggregate: FieldsTypeArg<
      {
        distinct_on?: menu_item_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: menu_item_order_by[] | null
        where?: menu_item_bool_exp | null
      },
      t_menu_item_aggregate
    >
    menu_item_by_pk?: FieldsTypeArg<{ id: any }, t_menu_item | null>
    restaurant: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant[]
    >
    restaurant_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant_aggregate
    >
    restaurant_by_pk?: FieldsTypeArg<{ id: any }, t_restaurant | null>
    restaurant_tag: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag[]
    >
    restaurant_tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: restaurant_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_tag_order_by[] | null
        where?: restaurant_tag_bool_exp | null
      },
      t_restaurant_tag_aggregate
    >
    restaurant_tag_by_pk?: FieldsTypeArg<
      { restaurant_id: any; tag_id: any },
      t_restaurant_tag | null
    >
    review: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    review_aggregate: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review_aggregate
    >
    review_by_pk?: FieldsTypeArg<{ id: any }, t_review | null>
    scrape: FieldsTypeArg<
      {
        distinct_on?: scrape_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: scrape_order_by[] | null
        where?: scrape_bool_exp | null
      },
      t_scrape[]
    >
    scrape_aggregate: FieldsTypeArg<
      {
        distinct_on?: scrape_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: scrape_order_by[] | null
        where?: scrape_bool_exp | null
      },
      t_scrape_aggregate
    >
    scrape_by_pk?: FieldsTypeArg<{ id: any }, t_scrape | null>
    tag: FieldsTypeArg<
      {
        distinct_on?: tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_order_by[] | null
        where?: tag_bool_exp | null
      },
      t_tag[]
    >
    tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_order_by[] | null
        where?: tag_bool_exp | null
      },
      t_tag_aggregate
    >
    tag_by_pk?: FieldsTypeArg<{ id: any }, t_tag | null>
    tag_tag: FieldsTypeArg<
      {
        distinct_on?: tag_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_tag_order_by[] | null
        where?: tag_tag_bool_exp | null
      },
      t_tag_tag[]
    >
    tag_tag_aggregate: FieldsTypeArg<
      {
        distinct_on?: tag_tag_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: tag_tag_order_by[] | null
        where?: tag_tag_bool_exp | null
      },
      t_tag_tag_aggregate
    >
    tag_tag_by_pk?: FieldsTypeArg<
      { category_tag_id: any; tag_id: any },
      t_tag_tag | null
    >
    user: FieldsTypeArg<
      {
        distinct_on?: user_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: user_order_by[] | null
        where?: user_bool_exp | null
      },
      t_user[]
    >
    user_aggregate: FieldsTypeArg<
      {
        distinct_on?: user_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: user_order_by[] | null
        where?: user_bool_exp | null
      },
      t_user_aggregate
    >
    user_by_pk?: FieldsTypeArg<{ id: any }, t_user | null>
  },
  Extension<'query_root'>
>

/**
 * @name query_root
 * @type OBJECT
 */
export type query_root = TypeData<t_query_root>
