import { TagTag } from '../types'
import { upsert, upsertConstraints } from './queryHelpers'

export async function tagTagUpsert(objects: TagTag[]) {
  return await upsert<TagTag>(
    'tag_tag',
    upsertConstraints.tag_tag_pkey,
    objects
  )
}
