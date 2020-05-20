import { upsert } from '../helpers'
import { TagTag } from '../types'

export async function tagTagUpsert(objects: TagTag[]) {
  return await upsert<TagTag>('tag_tag', 'tag_tag_pkey', objects)
}

