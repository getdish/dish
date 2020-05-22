import { dish_constraint } from '../graphql'
import { Dish, DishWithId } from '../types'
import { findOne, insert, update, upsert } from './queryHelpers'

export async function dishInsert(dish: Dish[]) {
  return await insert<Dish>('dish', dish)
}

export async function dishUpsert(
  objects: Dish[],
  constraint = dish_constraint.dish_restaurant_id_name_key
) {
  return await upsert<Dish>('dish', constraint, objects)
}

export async function dishUpdate(dish: DishWithId) {
  return await update<DishWithId>('dish', dish)
}

export async function dishFindOne(dish: Partial<Dish>) {
  return await findOne<DishWithId>('dish', dish)
}
