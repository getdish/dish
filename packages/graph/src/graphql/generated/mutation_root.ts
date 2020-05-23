import { FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import {
  dish_bool_exp,
  dish_inc_input,
  dish_insert_input,
  dish_on_conflict,
  dish_set_input,
  t_dish_mutation_response,
} from './dish'
import { Extension } from './extensionsTypes'
import {
  restaurant_append_input,
  restaurant_bool_exp,
  restaurant_delete_at_path_input,
  restaurant_delete_elem_input,
  restaurant_delete_key_input,
  restaurant_insert_input,
  restaurant_on_conflict,
  restaurant_prepend_input,
  restaurant_set_input,
  restaurant_tag_append_input,
  restaurant_tag_bool_exp,
  restaurant_tag_delete_at_path_input,
  restaurant_tag_delete_elem_input,
  restaurant_tag_delete_key_input,
  restaurant_tag_inc_input,
  restaurant_tag_insert_input,
  restaurant_tag_on_conflict,
  restaurant_tag_prepend_input,
  restaurant_tag_set_input,
  t_restaurant_mutation_response,
  t_restaurant_tag_mutation_response,
} from './restaurant'
import {
  review_append_input,
  review_bool_exp,
  review_delete_at_path_input,
  review_delete_elem_input,
  review_delete_key_input,
  review_insert_input,
  review_on_conflict,
  review_prepend_input,
  review_set_input,
  t_review_mutation_response,
} from './review'
import {
  scrape_append_input,
  scrape_bool_exp,
  scrape_delete_at_path_input,
  scrape_delete_elem_input,
  scrape_delete_key_input,
  scrape_insert_input,
  scrape_on_conflict,
  scrape_prepend_input,
  scrape_set_input,
  t_scrape_mutation_response,
} from './scrape'
import { t_String } from './String'
import {
  t_tag_mutation_response,
  t_tag_tag_mutation_response,
  tag_append_input,
  tag_bool_exp,
  tag_delete_at_path_input,
  tag_delete_elem_input,
  tag_delete_key_input,
  tag_inc_input,
  tag_insert_input,
  tag_on_conflict,
  tag_prepend_input,
  tag_set_input,
  tag_tag_bool_exp,
  tag_tag_insert_input,
  tag_tag_on_conflict,
  tag_tag_set_input,
} from './tag'
import {
  t_user_mutation_response,
  user_bool_exp,
  user_insert_input,
  user_on_conflict,
  user_set_input,
} from './user'

/**
 * @name mutation_root
 * @type OBJECT
 */
export type t_mutation_root = FieldsType<
  {
    __typename: t_String<'mutation_root'>
    delete_dish: FieldsTypeArg<
      { where: dish_bool_exp },
      t_dish_mutation_response | null
    >
    delete_restaurant: FieldsTypeArg<
      { where: restaurant_bool_exp },
      t_restaurant_mutation_response | null
    >
    delete_restaurant_tag: FieldsTypeArg<
      { where: restaurant_tag_bool_exp },
      t_restaurant_tag_mutation_response | null
    >
    delete_review: FieldsTypeArg<
      { where: review_bool_exp },
      t_review_mutation_response | null
    >
    delete_scrape: FieldsTypeArg<
      { where: scrape_bool_exp },
      t_scrape_mutation_response | null
    >
    delete_tag: FieldsTypeArg<
      { where: tag_bool_exp },
      t_tag_mutation_response | null
    >
    delete_tag_tag: FieldsTypeArg<
      { where: tag_tag_bool_exp },
      t_tag_tag_mutation_response | null
    >
    delete_user: FieldsTypeArg<
      { where: user_bool_exp },
      t_user_mutation_response | null
    >
    insert_dish: FieldsTypeArg<
      { objects: dish_insert_input[]; on_conflict?: dish_on_conflict | null },
      t_dish_mutation_response | null
    >
    insert_restaurant: FieldsTypeArg<
      {
        objects: restaurant_insert_input[]
        on_conflict?: restaurant_on_conflict | null
      },
      t_restaurant_mutation_response | null
    >
    insert_restaurant_tag: FieldsTypeArg<
      {
        objects: restaurant_tag_insert_input[]
        on_conflict?: restaurant_tag_on_conflict | null
      },
      t_restaurant_tag_mutation_response | null
    >
    insert_review: FieldsTypeArg<
      {
        objects: review_insert_input[]
        on_conflict?: review_on_conflict | null
      },
      t_review_mutation_response | null
    >
    insert_scrape: FieldsTypeArg<
      {
        objects: scrape_insert_input[]
        on_conflict?: scrape_on_conflict | null
      },
      t_scrape_mutation_response | null
    >
    insert_tag: FieldsTypeArg<
      { objects: tag_insert_input[]; on_conflict?: tag_on_conflict | null },
      t_tag_mutation_response | null
    >
    insert_tag_tag: FieldsTypeArg<
      {
        objects: tag_tag_insert_input[]
        on_conflict?: tag_tag_on_conflict | null
      },
      t_tag_tag_mutation_response | null
    >
    insert_user: FieldsTypeArg<
      { objects: user_insert_input[]; on_conflict?: user_on_conflict | null },
      t_user_mutation_response | null
    >
    update_dish: FieldsTypeArg<
      {
        _inc?: dish_inc_input | null
        _set?: dish_set_input | null
        where: dish_bool_exp
      },
      t_dish_mutation_response | null
    >
    update_restaurant: FieldsTypeArg<
      {
        _append?: restaurant_append_input | null
        _delete_at_path?: restaurant_delete_at_path_input | null
        _delete_elem?: restaurant_delete_elem_input | null
        _delete_key?: restaurant_delete_key_input | null
        _prepend?: restaurant_prepend_input | null
        _set?: restaurant_set_input | null
        where: restaurant_bool_exp
      },
      t_restaurant_mutation_response | null
    >
    update_restaurant_tag: FieldsTypeArg<
      {
        _append?: restaurant_tag_append_input | null
        _delete_at_path?: restaurant_tag_delete_at_path_input | null
        _delete_elem?: restaurant_tag_delete_elem_input | null
        _delete_key?: restaurant_tag_delete_key_input | null
        _inc?: restaurant_tag_inc_input | null
        _prepend?: restaurant_tag_prepend_input | null
        _set?: restaurant_tag_set_input | null
        where: restaurant_tag_bool_exp
      },
      t_restaurant_tag_mutation_response | null
    >
    update_review: FieldsTypeArg<
      {
        _append?: review_append_input | null
        _delete_at_path?: review_delete_at_path_input | null
        _delete_elem?: review_delete_elem_input | null
        _delete_key?: review_delete_key_input | null
        _prepend?: review_prepend_input | null
        _set?: review_set_input | null
        where: review_bool_exp
      },
      t_review_mutation_response | null
    >
    update_scrape: FieldsTypeArg<
      {
        _append?: scrape_append_input | null
        _delete_at_path?: scrape_delete_at_path_input | null
        _delete_elem?: scrape_delete_elem_input | null
        _delete_key?: scrape_delete_key_input | null
        _prepend?: scrape_prepend_input | null
        _set?: scrape_set_input | null
        where: scrape_bool_exp
      },
      t_scrape_mutation_response | null
    >
    update_tag: FieldsTypeArg<
      {
        _append?: tag_append_input | null
        _delete_at_path?: tag_delete_at_path_input | null
        _delete_elem?: tag_delete_elem_input | null
        _delete_key?: tag_delete_key_input | null
        _inc?: tag_inc_input | null
        _prepend?: tag_prepend_input | null
        _set?: tag_set_input | null
        where: tag_bool_exp
      },
      t_tag_mutation_response | null
    >
    update_tag_tag: FieldsTypeArg<
      { _set?: tag_tag_set_input | null; where: tag_tag_bool_exp },
      t_tag_tag_mutation_response | null
    >
    update_user: FieldsTypeArg<
      { _set?: user_set_input | null; where: user_bool_exp },
      t_user_mutation_response | null
    >
  },
  Extension<'mutation_root'>
>

/**
 * @name mutation_root
 * @type OBJECT
 */
export type mutation_root = TypeData<t_mutation_root>
