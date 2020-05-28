import { menu_item_constraint } from '../graphql'
import { MenuItem } from '../types'
import { createQueryHelpersFor } from './queryHelpers'

const QueryHelpers = createQueryHelpersFor<MenuItem>(
  'menu_item',
  menu_item_constraint.menu_item_restaurant_id_name_key
)
export const menuItemInsert = QueryHelpers.insert
export const menuItemUpsert = QueryHelpers.upsert
export const menuItemUpdate = QueryHelpers.update
export const menuItemFindOne = QueryHelpers.findOne
export const menuItemRefresh = QueryHelpers.refresh
