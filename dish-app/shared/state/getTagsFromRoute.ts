import { HistoryItem } from '@dish/router'

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
  return tags
}

const getUrlTagInfo = (part: string, defaultType: any = ''): NavigableTag => {
  if (part.indexOf(SPLIT_TAG_TYPE) > -1) {
    const [type, name] = part.split(SPLIT_TAG_TYPE)
    return { type: type as any, name }
  }
  return { type: defaultType, name: part }
}
