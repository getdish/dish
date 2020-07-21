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
  opening_hours_bool_exp,
  opening_hours_order_by,
  opening_hours_select_column,
  t_opening_hours,
  t_opening_hours_aggregate,
} from './opening_hours'
import {
  photos_bool_exp,
  photos_order_by,
  photos_select_column,
  t_photos,
  t_photos_aggregate,
} from './photos'
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
import {
  setting_bool_exp,
  setting_order_by,
  setting_select_column,
  t_setting,
  t_setting_aggregate,
} from './setting'
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
 * @name subscription_root
 * @type OBJECT
 */
export type t_subscription_root = FieldsType<
  {
    __typename: t_String<'subscription_root'>
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
    opening_hours: FieldsTypeArg<
      {
        distinct_on?: opening_hours_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: opening_hours_order_by[] | null
        where?: opening_hours_bool_exp | null
      },
      t_opening_hours[]
    >
    opening_hours_aggregate: FieldsTypeArg<
      {
        distinct_on?: opening_hours_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: opening_hours_order_by[] | null
        where?: opening_hours_bool_exp | null
      },
      t_opening_hours_aggregate
    >
    opening_hours_by_pk?: FieldsTypeArg<{ id: any }, t_opening_hours | null>
    photos: FieldsTypeArg<
      {
        distinct_on?: photos_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photos_order_by[] | null
        where?: photos_bool_exp | null
      },
      t_photos[]
    >
    photos_aggregate: FieldsTypeArg<
      {
        distinct_on?: photos_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: photos_order_by[] | null
        where?: photos_bool_exp | null
      },
      t_photos_aggregate
    >
    photos_by_pk?: FieldsTypeArg<{ id: any }, t_photos | null>
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
    setting: FieldsTypeArg<
      {
        distinct_on?: setting_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: setting_order_by[] | null
        where?: setting_bool_exp | null
      },
      t_setting[]
    >
    setting_aggregate: FieldsTypeArg<
      {
        distinct_on?: setting_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: setting_order_by[] | null
        where?: setting_bool_exp | null
      },
      t_setting_aggregate
    >
    setting_by_pk?: FieldsTypeArg<{ key: string }, t_setting | null>
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
  Extension<'subscription_root'>
>

/**
 * @name subscription_root
 * @type OBJECT
 */
export type subscription_root = TypeData<t_subscription_root>
