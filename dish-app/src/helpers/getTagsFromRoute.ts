import { HistoryItem } from '@dish/router'

import { tagLenses } from '../constants/localTags'
import { SPLIT_TAG, SPLIT_TAG_TYPE } from '../constants/SPLIT_TAG'
import { FullTag, TagWithNameAndType } from '../types/tagTypes'
import { getFullTags } from './getFullTags'

export const getTagSlugsFromRoute = (item: HistoryItem<'search'>) => {
  const tags: FullTag[] = []
  if (!item?.params) {
    return tags
  }
  const slugs: TagWithNameAndType[] = []
  if (item.params.lense) {
    const slug = `lenses__${item.params.lense}`
    let lenseTag = tagLenses.find((x) => x.slug == slug)
    if (!lenseTag) {
      console.warn('No known lense! reverting to default', slug, item.params)
      lenseTag = tagLenses[0]
    }
    slugs.push(lenseTag)
  }
  if (item.params.tags) {
    for (const tag of item.params.tags.split(SPLIT_TAG)) {
      if (tag !== '-') {
        slugs.push(getUrlTagInfo(tag, 'filter'))
      }
    }
  }
  return slugs
}

export const getTagsFromRoute = async (
  item: HistoryItem<'search'>
): Promise<FullTag[]> => {
  return await getFullTags(getTagSlugsFromRoute(item))
}

const getUrlTagInfo = (
  part: string,
  defaultType: any = ''
): TagWithNameAndType => {
  if (part.indexOf(SPLIT_TAG_TYPE) > -1) {
    const [type, nameLower] = part.split(SPLIT_TAG_TYPE)
    return { type: type as any, name: null, slug: part }
  }
  return { type: defaultType, name: null, slug: part }
}
