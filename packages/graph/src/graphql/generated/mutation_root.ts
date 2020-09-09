import { FieldsType, FieldsTypeArg, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { Extension } from './extensionsTypes'
import {
  menu_item_bool_exp,
  menu_item_inc_input,
  menu_item_insert_input,
  menu_item_on_conflict,
  menu_item_pk_columns_input,
  menu_item_set_input,
  t_menu_item,
  t_menu_item_mutation_response,
} from './menu_item'
import {
  opening_hours_bool_exp,
  opening_hours_insert_input,
  opening_hours_on_conflict,
  opening_hours_pk_columns_input,
  opening_hours_set_input,
  t_opening_hours,
  t_opening_hours_mutation_response,
} from './opening_hours'
import {
  photo_bool_exp,
  photo_inc_input,
  photo_insert_input,
  photo_on_conflict,
  photo_pk_columns_input,
  photo_set_input,
  photo_xref_bool_exp,
  photo_xref_insert_input,
  photo_xref_on_conflict,
  photo_xref_pk_columns_input,
  photo_xref_set_input,
  t_photo,
  t_photo_mutation_response,
  t_photo_xref,
  t_photo_xref_mutation_response,
} from './photo'
import {
  restaurant_append_input,
  restaurant_bool_exp,
  restaurant_delete_at_path_input,
  restaurant_delete_elem_input,
  restaurant_delete_key_input,
  restaurant_inc_input,
  restaurant_insert_input,
  restaurant_on_conflict,
  restaurant_pk_columns_input,
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
  restaurant_tag_pk_columns_input,
  restaurant_tag_prepend_input,
  restaurant_tag_set_input,
  t_restaurant,
  t_restaurant_mutation_response,
  t_restaurant_tag,
  t_restaurant_tag_mutation_response,
} from './restaurant'
import {
  review_append_input,
  review_bool_exp,
  review_delete_at_path_input,
  review_delete_elem_input,
  review_delete_key_input,
  review_inc_input,
  review_insert_input,
  review_on_conflict,
  review_pk_columns_input,
  review_prepend_input,
  review_set_input,
  review_tag_sentences_bool_exp,
  review_tag_sentences_inc_input,
  review_tag_sentences_insert_input,
  review_tag_sentences_on_conflict,
  review_tag_sentences_pk_columns_input,
  review_tag_sentences_set_input,
  review_tag_whole_bool_exp,
  review_tag_whole_inc_input,
  review_tag_whole_insert_input,
  review_tag_whole_on_conflict,
  review_tag_whole_pk_columns_input,
  review_tag_whole_set_input,
  t_review,
  t_review_mutation_response,
  t_review_tag_sentences,
  t_review_tag_sentences_mutation_response,
  t_review_tag_whole,
  t_review_tag_whole_mutation_response,
} from './review'
import {
  setting_append_input,
  setting_bool_exp,
  setting_delete_at_path_input,
  setting_delete_elem_input,
  setting_delete_key_input,
  setting_insert_input,
  setting_on_conflict,
  setting_pk_columns_input,
  setting_prepend_input,
  setting_set_input,
  t_setting,
  t_setting_mutation_response,
} from './setting'
import { t_String } from './String'
import {
  t_tag,
  t_tag_mutation_response,
  t_tag_tag,
  t_tag_tag_mutation_response,
  tag_append_input,
  tag_bool_exp,
  tag_delete_at_path_input,
  tag_delete_elem_input,
  tag_delete_key_input,
  tag_inc_input,
  tag_insert_input,
  tag_on_conflict,
  tag_pk_columns_input,
  tag_prepend_input,
  tag_set_input,
  tag_tag_bool_exp,
  tag_tag_insert_input,
  tag_tag_on_conflict,
  tag_tag_pk_columns_input,
  tag_tag_set_input,
} from './tag'
import {
  t_user,
  t_user_mutation_response,
  user_bool_exp,
  user_insert_input,
  user_on_conflict,
  user_pk_columns_input,
  user_set_input,
} from './user'
import { t_uuid } from './uuid'

/**
 * @name mutation_root
 * @type OBJECT
 */
export type t_mutation_root = FieldsType<
  {
    __typename: t_String<'mutation_root'>
    delete_menu_item: FieldsTypeArg<
      { where: menu_item_bool_exp },
      t_menu_item_mutation_response | null
    >
    delete_menu_item_by_pk?: FieldsTypeArg<{ id: any }, t_menu_item | null>
    delete_opening_hours: FieldsTypeArg<
      { where: opening_hours_bool_exp },
      t_opening_hours_mutation_response | null
    >
    delete_opening_hours_by_pk?: FieldsTypeArg<
      { id: any },
      t_opening_hours | null
    >
    delete_photo: FieldsTypeArg<
      { where: photo_bool_exp },
      t_photo_mutation_response | null
    >
    delete_photo_by_pk?: FieldsTypeArg<{ id: any }, t_photo | null>
    delete_photo_xref: FieldsTypeArg<
      { where: photo_xref_bool_exp },
      t_photo_xref_mutation_response | null
    >
    delete_photo_xref_by_pk?: FieldsTypeArg<{ id: any }, t_photo_xref | null>
    delete_restaurant: FieldsTypeArg<
      { where: restaurant_bool_exp },
      t_restaurant_mutation_response | null
    >
    delete_restaurant_by_pk?: FieldsTypeArg<{ id: any }, t_restaurant | null>
    delete_restaurant_tag: FieldsTypeArg<
      { where: restaurant_tag_bool_exp },
      t_restaurant_tag_mutation_response | null
    >
    delete_restaurant_tag_by_pk?: FieldsTypeArg<
      { restaurant_id: any; tag_id: any },
      t_restaurant_tag | null
    >
    delete_review: FieldsTypeArg<
      { where: review_bool_exp },
      t_review_mutation_response | null
    >
    delete_review_by_pk?: FieldsTypeArg<{ id: any }, t_review | null>
    delete_review_tag_sentences: FieldsTypeArg<
      { where: review_tag_sentences_bool_exp },
      t_review_tag_sentences_mutation_response | null
    >
    delete_review_tag_sentences_by_pk?: FieldsTypeArg<
      { id: any },
      t_review_tag_sentences | null
    >
    delete_review_tag_whole: FieldsTypeArg<
      { where: review_tag_whole_bool_exp },
      t_review_tag_whole_mutation_response | null
    >
    delete_review_tag_whole_by_pk?: FieldsTypeArg<
      { id: any },
      t_review_tag_whole | null
    >
    delete_setting: FieldsTypeArg<
      { where: setting_bool_exp },
      t_setting_mutation_response | null
    >
    delete_setting_by_pk?: FieldsTypeArg<{ key: string }, t_setting | null>
    delete_tag: FieldsTypeArg<
      { where: tag_bool_exp },
      t_tag_mutation_response | null
    >
    delete_tag_by_pk?: FieldsTypeArg<{ id: any }, t_tag | null>
    delete_tag_tag: FieldsTypeArg<
      { where: tag_tag_bool_exp },
      t_tag_tag_mutation_response | null
    >
    delete_tag_tag_by_pk?: FieldsTypeArg<
      { category_tag_id: any; tag_id: any },
      t_tag_tag | null
    >
    delete_user: FieldsTypeArg<
      { where: user_bool_exp },
      t_user_mutation_response | null
    >
    delete_user_by_pk?: FieldsTypeArg<{ id: any }, t_user | null>
    insert_menu_item: FieldsTypeArg<
      {
        objects: menu_item_insert_input[]
        on_conflict?: menu_item_on_conflict | null
      },
      t_menu_item_mutation_response | null
    >
    insert_menu_item_one?: FieldsTypeArg<
      {
        object: menu_item_insert_input
        on_conflict?: menu_item_on_conflict | null
      },
      t_menu_item | null
    >
    insert_opening_hours: FieldsTypeArg<
      {
        objects: opening_hours_insert_input[]
        on_conflict?: opening_hours_on_conflict | null
      },
      t_opening_hours_mutation_response | null
    >
    insert_opening_hours_one?: FieldsTypeArg<
      {
        object: opening_hours_insert_input
        on_conflict?: opening_hours_on_conflict | null
      },
      t_opening_hours | null
    >
    insert_photo: FieldsTypeArg<
      { objects: photo_insert_input[]; on_conflict?: photo_on_conflict | null },
      t_photo_mutation_response | null
    >
    insert_photo_one?: FieldsTypeArg<
      { object: photo_insert_input; on_conflict?: photo_on_conflict | null },
      t_photo | null
    >
    insert_photo_xref: FieldsTypeArg<
      {
        objects: photo_xref_insert_input[]
        on_conflict?: photo_xref_on_conflict | null
      },
      t_photo_xref_mutation_response | null
    >
    insert_photo_xref_one?: FieldsTypeArg<
      {
        object: photo_xref_insert_input
        on_conflict?: photo_xref_on_conflict | null
      },
      t_photo_xref | null
    >
    insert_restaurant: FieldsTypeArg<
      {
        objects: restaurant_insert_input[]
        on_conflict?: restaurant_on_conflict | null
      },
      t_restaurant_mutation_response | null
    >
    insert_restaurant_one?: FieldsTypeArg<
      {
        object: restaurant_insert_input
        on_conflict?: restaurant_on_conflict | null
      },
      t_restaurant | null
    >
    insert_restaurant_tag: FieldsTypeArg<
      {
        objects: restaurant_tag_insert_input[]
        on_conflict?: restaurant_tag_on_conflict | null
      },
      t_restaurant_tag_mutation_response | null
    >
    insert_restaurant_tag_one?: FieldsTypeArg<
      {
        object: restaurant_tag_insert_input
        on_conflict?: restaurant_tag_on_conflict | null
      },
      t_restaurant_tag | null
    >
    insert_review: FieldsTypeArg<
      {
        objects: review_insert_input[]
        on_conflict?: review_on_conflict | null
      },
      t_review_mutation_response | null
    >
    insert_review_one?: FieldsTypeArg<
      { object: review_insert_input; on_conflict?: review_on_conflict | null },
      t_review | null
    >
    insert_review_tag_sentences: FieldsTypeArg<
      {
        objects: review_tag_sentences_insert_input[]
        on_conflict?: review_tag_sentences_on_conflict | null
      },
      t_review_tag_sentences_mutation_response | null
    >
    insert_review_tag_sentences_one?: FieldsTypeArg<
      {
        object: review_tag_sentences_insert_input
        on_conflict?: review_tag_sentences_on_conflict | null
      },
      t_review_tag_sentences | null
    >
    insert_review_tag_whole: FieldsTypeArg<
      {
        objects: review_tag_whole_insert_input[]
        on_conflict?: review_tag_whole_on_conflict | null
      },
      t_review_tag_whole_mutation_response | null
    >
    insert_review_tag_whole_one?: FieldsTypeArg<
      {
        object: review_tag_whole_insert_input
        on_conflict?: review_tag_whole_on_conflict | null
      },
      t_review_tag_whole | null
    >
    insert_setting: FieldsTypeArg<
      {
        objects: setting_insert_input[]
        on_conflict?: setting_on_conflict | null
      },
      t_setting_mutation_response | null
    >
    insert_setting_one?: FieldsTypeArg<
      {
        object: setting_insert_input
        on_conflict?: setting_on_conflict | null
      },
      t_setting | null
    >
    insert_tag: FieldsTypeArg<
      { objects: tag_insert_input[]; on_conflict?: tag_on_conflict | null },
      t_tag_mutation_response | null
    >
    insert_tag_one?: FieldsTypeArg<
      { object: tag_insert_input; on_conflict?: tag_on_conflict | null },
      t_tag | null
    >
    insert_tag_tag: FieldsTypeArg<
      {
        objects: tag_tag_insert_input[]
        on_conflict?: tag_tag_on_conflict | null
      },
      t_tag_tag_mutation_response | null
    >
    insert_tag_tag_one?: FieldsTypeArg<
      {
        object: tag_tag_insert_input
        on_conflict?: tag_tag_on_conflict | null
      },
      t_tag_tag | null
    >
    insert_user: FieldsTypeArg<
      { objects: user_insert_input[]; on_conflict?: user_on_conflict | null },
      t_user_mutation_response | null
    >
    insert_user_one?: FieldsTypeArg<
      { object: user_insert_input; on_conflict?: user_on_conflict | null },
      t_user | null
    >
    update_menu_item: FieldsTypeArg<
      {
        _inc?: menu_item_inc_input | null
        _set?: menu_item_set_input | null
        where: menu_item_bool_exp
      },
      t_menu_item_mutation_response | null
    >
    update_menu_item_by_pk?: FieldsTypeArg<
      {
        _inc?: menu_item_inc_input | null
        _set?: menu_item_set_input | null
        pk_columns: menu_item_pk_columns_input
      },
      t_menu_item | null
    >
    update_opening_hours: FieldsTypeArg<
      { _set?: opening_hours_set_input | null; where: opening_hours_bool_exp },
      t_opening_hours_mutation_response | null
    >
    update_opening_hours_by_pk?: FieldsTypeArg<
      {
        _set?: opening_hours_set_input | null
        pk_columns: opening_hours_pk_columns_input
      },
      t_opening_hours | null
    >
    update_photo: FieldsTypeArg<
      {
        _inc?: photo_inc_input | null
        _set?: photo_set_input | null
        where: photo_bool_exp
      },
      t_photo_mutation_response | null
    >
    update_photo_by_pk?: FieldsTypeArg<
      {
        _inc?: photo_inc_input | null
        _set?: photo_set_input | null
        pk_columns: photo_pk_columns_input
      },
      t_photo | null
    >
    update_photo_xref: FieldsTypeArg<
      { _set?: photo_xref_set_input | null; where: photo_xref_bool_exp },
      t_photo_xref_mutation_response | null
    >
    update_photo_xref_by_pk?: FieldsTypeArg<
      {
        _set?: photo_xref_set_input | null
        pk_columns: photo_xref_pk_columns_input
      },
      t_photo_xref | null
    >
    update_restaurant: FieldsTypeArg<
      {
        _append?: restaurant_append_input | null
        _delete_at_path?: restaurant_delete_at_path_input | null
        _delete_elem?: restaurant_delete_elem_input | null
        _delete_key?: restaurant_delete_key_input | null
        _inc?: restaurant_inc_input | null
        _prepend?: restaurant_prepend_input | null
        _set?: restaurant_set_input | null
        where: restaurant_bool_exp
      },
      t_restaurant_mutation_response | null
    >
    update_restaurant_by_pk?: FieldsTypeArg<
      {
        _append?: restaurant_append_input | null
        _delete_at_path?: restaurant_delete_at_path_input | null
        _delete_elem?: restaurant_delete_elem_input | null
        _delete_key?: restaurant_delete_key_input | null
        _inc?: restaurant_inc_input | null
        _prepend?: restaurant_prepend_input | null
        _set?: restaurant_set_input | null
        pk_columns: restaurant_pk_columns_input
      },
      t_restaurant | null
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
    update_restaurant_tag_by_pk?: FieldsTypeArg<
      {
        _append?: restaurant_tag_append_input | null
        _delete_at_path?: restaurant_tag_delete_at_path_input | null
        _delete_elem?: restaurant_tag_delete_elem_input | null
        _delete_key?: restaurant_tag_delete_key_input | null
        _inc?: restaurant_tag_inc_input | null
        _prepend?: restaurant_tag_prepend_input | null
        _set?: restaurant_tag_set_input | null
        pk_columns: restaurant_tag_pk_columns_input
      },
      t_restaurant_tag | null
    >
    update_review: FieldsTypeArg<
      {
        _append?: review_append_input | null
        _delete_at_path?: review_delete_at_path_input | null
        _delete_elem?: review_delete_elem_input | null
        _delete_key?: review_delete_key_input | null
        _inc?: review_inc_input | null
        _prepend?: review_prepend_input | null
        _set?: review_set_input | null
        where: review_bool_exp
      },
      t_review_mutation_response | null
    >
    update_review_by_pk?: FieldsTypeArg<
      {
        _append?: review_append_input | null
        _delete_at_path?: review_delete_at_path_input | null
        _delete_elem?: review_delete_elem_input | null
        _delete_key?: review_delete_key_input | null
        _inc?: review_inc_input | null
        _prepend?: review_prepend_input | null
        _set?: review_set_input | null
        pk_columns: review_pk_columns_input
      },
      t_review | null
    >
    update_review_tag_sentences: FieldsTypeArg<
      {
        _inc?: review_tag_sentences_inc_input | null
        _set?: review_tag_sentences_set_input | null
        where: review_tag_sentences_bool_exp
      },
      t_review_tag_sentences_mutation_response | null
    >
    update_review_tag_sentences_by_pk?: FieldsTypeArg<
      {
        _inc?: review_tag_sentences_inc_input | null
        _set?: review_tag_sentences_set_input | null
        pk_columns: review_tag_sentences_pk_columns_input
      },
      t_review_tag_sentences | null
    >
    update_review_tag_whole: FieldsTypeArg<
      {
        _inc?: review_tag_whole_inc_input | null
        _set?: review_tag_whole_set_input | null
        where: review_tag_whole_bool_exp
      },
      t_review_tag_whole_mutation_response | null
    >
    update_review_tag_whole_by_pk?: FieldsTypeArg<
      {
        _inc?: review_tag_whole_inc_input | null
        _set?: review_tag_whole_set_input | null
        pk_columns: review_tag_whole_pk_columns_input
      },
      t_review_tag_whole | null
    >
    update_setting: FieldsTypeArg<
      {
        _append?: setting_append_input | null
        _delete_at_path?: setting_delete_at_path_input | null
        _delete_elem?: setting_delete_elem_input | null
        _delete_key?: setting_delete_key_input | null
        _prepend?: setting_prepend_input | null
        _set?: setting_set_input | null
        where: setting_bool_exp
      },
      t_setting_mutation_response | null
    >
    update_setting_by_pk?: FieldsTypeArg<
      {
        _append?: setting_append_input | null
        _delete_at_path?: setting_delete_at_path_input | null
        _delete_elem?: setting_delete_elem_input | null
        _delete_key?: setting_delete_key_input | null
        _prepend?: setting_prepend_input | null
        _set?: setting_set_input | null
        pk_columns: setting_pk_columns_input
      },
      t_setting | null
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
    update_tag_by_pk?: FieldsTypeArg<
      {
        _append?: tag_append_input | null
        _delete_at_path?: tag_delete_at_path_input | null
        _delete_elem?: tag_delete_elem_input | null
        _delete_key?: tag_delete_key_input | null
        _inc?: tag_inc_input | null
        _prepend?: tag_prepend_input | null
        _set?: tag_set_input | null
        pk_columns: tag_pk_columns_input
      },
      t_tag | null
    >
    update_tag_tag: FieldsTypeArg<
      { _set?: tag_tag_set_input | null; where: tag_tag_bool_exp },
      t_tag_tag_mutation_response | null
    >
    update_tag_tag_by_pk?: FieldsTypeArg<
      { _set?: tag_tag_set_input | null; pk_columns: tag_tag_pk_columns_input },
      t_tag_tag | null
    >
    update_user: FieldsTypeArg<
      { _set?: user_set_input | null; where: user_bool_exp },
      t_user_mutation_response | null
    >
    update_user_by_pk?: FieldsTypeArg<
      { _set?: user_set_input | null; pk_columns: user_pk_columns_input },
      t_user | null
    >
  },
  Extension<'mutation_root'>
>

/**
 * @name mutation_root
 * @type OBJECT
 */
export type mutation_root = TypeData<t_mutation_root>
