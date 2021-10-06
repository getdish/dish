import { LngLat } from '@dish/graph'
import { HistoryItem } from '@dish/router'

import { isLngLatParam, urlSerializers } from '../app/home/search/urlSerializers'
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
  const searchQuery = item.params?.search || ''

  if (!item?.params) {
    return { tags, searchQuery }
  }

  let region = ''
  let center: LngLat | null = null
  let span: LngLat | null = null
  if (item.params.region) {
    const res = urlSerializers.search.region.deserialize(item.params.region)
    if (typeof res === 'string') {
      region = res
    } else {
      center = res.center
      span = res.span
    }
  }

  if (item.params.lense) {
    const slug = item.params.lense.startsWith('lenses__')
      ? item.params.lense
      : `lenses__${item.params.lense}`
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

  return { tags, searchQuery, center, span, region }
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
