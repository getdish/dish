import { user_constraint } from '../graphql'
import { User } from '../types'
import { createQueryHelpersFor } from './queryHelpers'

const QueryHelpers = createQueryHelpersFor<User>(
  'user',
  user_constraint.user_username_key
)
export const userInsert = QueryHelpers.insert
export const userUpsert = QueryHelpers.upsert
export const userUpdate = QueryHelpers.update
export const userFindOne = QueryHelpers.findOne
export const userRefresh = QueryHelpers.refresh
