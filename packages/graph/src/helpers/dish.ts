import { dish_constraint } from '../graphql'
import { Dish } from '../types'
import { createQueryHelpersFor } from './queryHelpers'

const QueryHelpers = createQueryHelpersFor<Dish>(
  'dish',
  dish_constraint.dish_restaurant_id_name_key
)
export const dishInsert = QueryHelpers.insert
export const dishUpsert = QueryHelpers.upsert
export const dishUpdate = QueryHelpers.update
export const dishFindOne = QueryHelpers.findOne
export const dishRefresh = QueryHelpers.refresh
