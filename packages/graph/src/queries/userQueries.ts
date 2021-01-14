import { createQueryHelpersFor } from '../helpers/queryHelpers'
import { User } from '../types'

const QueryHelpers = createQueryHelpersFor<User>('user')
export const userInsert = QueryHelpers.insert
export const userUpsert = QueryHelpers.upsert
export const userUpdate = QueryHelpers.update
export const userFindOne = QueryHelpers.findOne
export const userRefresh = QueryHelpers.refresh
