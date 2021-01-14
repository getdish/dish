import { createQueryHelpersFor } from '../helpers/queryHelpers'
import { List } from '../types'

const QueryHelpers = createQueryHelpersFor<List>('list')
export const listInsert = QueryHelpers.insert
export const listUpsert = QueryHelpers.upsert
export const listUpdate = QueryHelpers.update
export const listFindOne = QueryHelpers.findOne
export const listRefresh = QueryHelpers.refresh
