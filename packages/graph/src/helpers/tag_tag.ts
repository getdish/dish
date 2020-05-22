import { tag_tag_constraint } from '../graphql'
import { TagTag } from '../types'
import { upsert } from './queryHelpers'

export async function tagTagUpsert(
  objects: TagTag[],
  constraint = tag_tag_constraint.tag_tag_pkey
) {
  return await upsert<TagTag>('tag_tag', constraint, objects)
}
