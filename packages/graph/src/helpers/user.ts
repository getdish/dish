import { User, UserWithId } from '../types'
import { findOne, insert, update, upsert } from './queryHelpers'

export async function userInsert(users: User[]) {
  return await insert<User>('user', users)
}

export async function userUpsert(objects: User[]) {
  return await upsert<User>('user', '', objects)
}

export async function userUpdate(user: UserWithId) {
  return await update<UserWithId>('user', user)
}

export async function userFindOne(user: Partial<User>) {
  return await findOne<User>('user', user)
}
