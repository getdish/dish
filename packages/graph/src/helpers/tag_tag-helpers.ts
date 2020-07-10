import { tag_tag_constraint } from '../graphql'
import { TagTag } from '../types'
import { createQueryHelpersFor } from './queryHelpers'

const QueryHelpers = createQueryHelpersFor<TagTag>('tag_tag')
export const tagTagInsert = QueryHelpers.insert
export const tagTagUpsert = QueryHelpers.upsert
export const tagTagUpdate = QueryHelpers.update
export const tagTagFindOne = QueryHelpers.findOne
export const tagTagRefresh = QueryHelpers.refresh
