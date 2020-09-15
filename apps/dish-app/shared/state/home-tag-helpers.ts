import { Tag, slugify } from '@dish/graph'
import { HistoryItem } from '@dish/router'

import { LIVE_SEARCH_DOMAIN } from '../constants'
import { addTagsToCache, allTags } from './allTags'
import { getActiveTags } from './getActiveTags'
import { getTagId } from './getTagId'
import { isHomeState, isSearchState } from './home-helpers'
import { HomeStateTagNavigable } from './home-types'
import { NavigableTag } from './NavigableTag'
import { omStatic } from './omStatic'
import { SearchRouteParams } from './router'
import { SPLIT_TAG, SPLIT_TAG_TYPE } from './SPLIT_TAG'
import { tagLenses } from './tagLenses'

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

export const getTagsFromRoute = (
  item: HistoryItem<'userSearch'>
): NavigableTag[] => {
  const tags: NavigableTag[] = []
  if (!item?.params) {
    return tags
  }
  if (item.params.lense) {
    tags.push(getUrlTagInfo(item.params.lense, 'lense'))
  }
  if (item.params.tags) {
    for (const tag of item.params.tags.split(SPLIT_TAG)) {
      tags.push(getUrlTagInfo(tag, 'filter'))
    }
  }
  return tags
}

const getUrlTagInfo = (part: string, defaultType: any = ''): NavigableTag => {
  if (part.indexOf(SPLIT_TAG_TYPE) > -1) {
    const [type, name] = part.split(SPLIT_TAG_TYPE)
    return { type: type as any, name }
  }
  return { type: defaultType, name: part }
}

const getFullTag = (tag: NavigableTag): Promise<Tag | null> =>
  fetch(
    `${LIVE_SEARCH_DOMAIN}/tags?query=${encodeURIComponent(
      tag.name?.replace(/-/g, ' ') ?? ''
    )}&type=${tag.type}&limit=1`
  )
    .then((res) => res.json())
    .then((tags) => tags?.[0] ?? null)
