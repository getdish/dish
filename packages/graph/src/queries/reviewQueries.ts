import { Scalars, review_constraint } from '../graphql'
import { createQueryHelpersFor } from '../helpers/queryHelpers'
import { Review } from '../types'

export type uuid = Scalars['uuid']

const QueryHelpers = createQueryHelpersFor<Review>('review', review_constraint.review_pkey)
export const reviewInsert = QueryHelpers.insert
export const reviewUpsert = QueryHelpers.upsert
export const reviewUpdate = QueryHelpers.update
export const reviewFindOne = QueryHelpers.findOne
export const reviewRefresh = QueryHelpers.refresh
export const reviewDelete = QueryHelpers.delete
