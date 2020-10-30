import { HistoryItem } from '@dish/router'
import { capitalize } from 'lodash'

import { FullTag } from './FullTag'
import { TagWithNameAndType, getFullTags } from './getFullTags'
import { SPLIT_TAG, SPLIT_TAG_TYPE } from './SPLIT_TAG'

export const getTagsFromRoute = async (
  item: HistoryItem<'userSearch'>
): Promise<FullTag[]> => {
  const tags: FullTag[] = []
  if (!item?.params) {
    return tags
  }
  const tmpTags: TagWithNameAndType[] = []
  if (item.params.lense) {
    tmpTags.push(getUrlTagInfo(item.params.lense, 'lense'))
  }
  if (item.params.tags) {
    for (const tag of item.params.tags.split(SPLIT_TAG)) {
      if (tag !== '-') {
        tmpTags.push(getUrlTagInfo(tag, 'filter'))
      }
    }
  }
  return await getFullTags(tmpTags)
}

const getUrlTagInfo = (
  part: string,
  defaultType: any = ''
): TagWithNameAndType => {
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
