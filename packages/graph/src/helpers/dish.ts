import { Dish } from '../types'
import {
  findOne,
  insert,
  update,
  upsert,
  upsertConstraints,
} from './queryHelpers'

export async function dishInsert(dishs: Dish[]): Promise<Dish[]> {
  return await insert<Dish>('dish', dishs)
}

export async function dishUpsert(objects: Dish[]): Promise<Dish[]> {
  return await upsert<Dish>(
    'dish',
    upsertConstraints.dish_restaurant_id_name_key,
    objects
  )
}

export async function dishUpdate(dish: Dish): Promise<Dish[]> {
  return await update<Dish>('dish', dish)
}

export async function dishFindOne(dish: Partial<Dish>): Promise<Dish> {
  return await findOne<Dish>('dish', dish)
}
