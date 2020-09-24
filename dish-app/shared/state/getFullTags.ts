import { Tag } from '@dish/graph'

import { LIVE_SEARCH_DOMAIN } from '../constants'
import { addTagsToCache, allTags } from './allTags'
import { getTagId } from './getTagId'
import { NavigableTag } from './NavigableTag'

export const getFullTags = async (tags: NavigableTag[]): Promise<Tag[]> => {
  return await Promise.all(
    tags.map(async (tag) => {
      const existing = allTags[getTagId(tag)]
      if (!existing?.id) {
        const full = await getFullTag(tag)
        if (full) {
          addTagsToCache([full])
          return full
        }
      }
      return existing ?? tag
    })
  )
}

const getFullTag = (tag: NavigableTag): Promise<Tag | null> =>
  fetch(
    `${LIVE_SEARCH_DOMAIN}/tags?query=${encodeURIComponent(
      tag.name?.replace(/-/g, ' ') ?? ''
    )}&type=${tag.type}&limit=1`
  )
    .then((res) => res.json())
    .then((tags) => tags?.[0] ?? null)
