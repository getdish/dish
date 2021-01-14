import { createQueryHelpersFor } from '../helpers/queryHelpers'
import { TagTag } from '../types'

const QueryHelpers = createQueryHelpersFor<TagTag>('tag_tag')
export const tagTagInsert = QueryHelpers.insert
export const tagTagUpsert = QueryHelpers.upsert
export const tagTagUpdate = QueryHelpers.update
export const tagTagFindOne = QueryHelpers.findOne
export const tagTagRefresh = QueryHelpers.refresh
