import { TagTag } from '../types'
import { upsert } from './queryHelpers'

export async function tagTagUpsert(objects: TagTag[]) {
  return await upsert<TagTag>('tag_tag', 'tag_tag_pkey', objects)
}
