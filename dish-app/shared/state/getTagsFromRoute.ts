import { HistoryItem } from '@dish/router'
import { capitalize } from 'lodash'

import { getFullTags } from './getFullTags'
import { NavigableTag } from './NavigableTag'
import { SPLIT_TAG, SPLIT_TAG_TYPE } from './SPLIT_TAG'

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
      if (tag !== '-') {
        tags.push(getUrlTagInfo(tag, 'filter'))
      }
    }
  }
  getFullTags(tags)
  return tags
}

const getUrlTagInfo = (part: string, defaultType: any = ''): NavigableTag => {
  if (part.indexOf(SPLIT_TAG_TYPE) > -1) {
    const [type, nameLower] = part.split(SPLIT_TAG_TYPE)
    const name = nameLower
      .split('-')
      .map((x) => capitalize(x))
      .join(' ')
    return { type: type as any, name }
  }
  return { type: defaultType, name: part }
}
