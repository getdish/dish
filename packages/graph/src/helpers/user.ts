import { User } from '../types'
import {
  findOne,
  insert,
  update,
  upsert,
  upsertConstraints,
} from './queryHelpers'

export async function userInsert(users: User[]): Promise<User[]> {
  return await insert<User>('user', users)
}

export async function userUpsert(objects: User[]): Promise<User[]> {
  return await upsert<User>('user', '', objects)
}

export async function userUpdate(user: User): Promise<User[]> {
  return await update<User>('user', user)
}

export async function userFindOne(user: Partial<User>): Promise<User> {
  return await findOne<User>('user', user)
}
