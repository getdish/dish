import { HistoryItem } from '@dish/router'

import { tagLenses } from '../constants/localTags'
import { SPLIT_TAG } from '../constants/SPLIT_TAG'
import { FullTag, NavigableTag } from '../types/tagTypes'
import { getFullTags } from './getFullTags'
import { guessTagName } from './guessTagName'

const typePrefixes = {
  lenses: 'lense',
  filters: 'filter',
}

// not really a sync but i want to match the naming with syncStateToRoute
// TODO refactor this into a more logical structure
export const syncStateFromRoute = (item: HistoryItem<'search'>) => {
  const tags: NavigableTag[] = []
  const searchQuery = item.params.search || ''

  if (!item?.params) {
    return { tags, searchQuery }
  }
  if (item.params.lense) {
    const slug = `lenses__${item.params.lense}`
    let lenseTag = tagLenses.find((x) => x.slug == slug)
    if (!lenseTag) {
      console.warn('No known lense! reverting to default', slug, item.params)
      lenseTag = tagLenses[0]
    }
    tags.push(lenseTag)
  }
  if (item.params.tags) {
    for (const tag of item.params.tags.split(SPLIT_TAG)) {
      if (tag !== '-') {
        tags.push(getUrlTagInfo(tag))
      }
    }
  }
  return { tags, searchQuery }
}

export const getFullTagsFromRoute = async (item: HistoryItem<'search'>): Promise<FullTag[]> => {
  return await getFullTags(syncStateFromRoute(item).tags)
}

const getUrlTagInfo = (part: string): NavigableTag => {
  let type = ''
  let slug = part
  if (part.startsWith('in-')) {
    type = 'country'
    slug = part.replace('in-', '')
  } else {
    const prefix = part.match(/([a-z]+)__/)?.[1] ?? ''
    type = typePrefixes[prefix] ?? 'dish'
  }
  return { type, name: guessTagName(part), slug }
}
