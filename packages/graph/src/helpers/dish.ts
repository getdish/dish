import { Dish, DishWithId } from '../types'
import {
  findOne,
  insert,
  update,
  upsert,
  upsertConstraints,
} from './queryHelpers'

export async function dishInsert(dishs: Dish[]) {
  return await insert<Dish>('dish', dishs)
}

export async function dishUpsert(objects: Dish[]) {
  return await upsert<Dish>(
    'dish',
    upsertConstraints.dish_restaurant_id_name_key,
    objects
  )
}

export async function dishUpdate(dish: DishWithId) {
  return await update<DishWithId>('dish', dish)
}

export async function dishFindOne(dish: Partial<Dish>) {
  return await findOne<DishWithId>('dish', dish)
}
