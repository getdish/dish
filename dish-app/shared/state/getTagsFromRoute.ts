import { HistoryItem } from '@dish/router'

import { FullTag } from './FullTag'
import { getFullTags } from './getFullTags'
import { SPLIT_TAG, SPLIT_TAG_TYPE } from './SPLIT_TAG'
import { TagWithNameAndType } from './TagWithNameAndType'

export const getTagsFromRoute = async (
  item: HistoryItem<'userSearch'>
): Promise<FullTag[]> => {
  const tags: FullTag[] = []
  if (!item?.params) {
    return tags
  }
  const tmpTags: TagWithNameAndType[] = []
  if (item.params.lense) {
    tmpTags.push(
      getUrlTagInfo(item.params.lense.replace('lenses__', ''), 'lense')
    )
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
    return { type: type as any, name: null, slug: part }
  }
  return { type: defaultType, name: null, slug: part }
}
