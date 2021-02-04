import { HistoryItem } from '@dish/router'
import { capitalize } from 'lodash'

import { tagLenses } from '../constants/localTags'
import { SPLIT_TAG, SPLIT_TAG_PARENT } from '../constants/SPLIT_TAG'
import { FullTag, NavigableTag } from '../types/tagTypes'
import { getFullTags } from './getFullTags'

const typePrefixes = {
  lenses: 'lense',
  filters: 'filter',
}

export const getTagsFromRoute = (item: HistoryItem<'search'>) => {
  const tags: NavigableTag[] = []
  if (!item?.params) {
    return tags
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
  return tags
}

export const getFullTagsFromRoute = async (
  item: HistoryItem<'search'>
): Promise<FullTag[]> => {
  // @ts-ignore
  return await getFullTags(getTagsFromRoute(item))
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

export function guessTagName(slug: string) {
  const postfix = slug.split(SPLIT_TAG_PARENT)[1] ?? ''
  // best guess at a name
  return postfix.split('-').map(capitalize).join(' ')
}
