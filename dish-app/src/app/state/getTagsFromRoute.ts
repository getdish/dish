import { HistoryItem } from '@dish/router'

import { tagLenses } from '../../constants/localTags'
import { SPLIT_TAG, SPLIT_TAG_TYPE } from '../../constants/SPLIT_TAG'
import { getFullTags } from './getFullTags'
import { FullTag, TagWithNameAndType } from './home-types'

export const getTagsFromRoute = async (
  item: HistoryItem<'search'>
): Promise<FullTag[]> => {
  const tags: FullTag[] = []
  if (!item?.params) {
    return tags
  }
  const tmpTags: TagWithNameAndType[] = []
  if (item.params.lense) {
    const slug = `lenses__${item.params.lense}`
    let lenseTag = tagLenses.find((x) => x.slug == slug)
    if (!lenseTag) {
      console.warn('No known lense! reverting to default', slug, item.params)
      lenseTag = tagLenses[0]
    }
    tmpTags.push(lenseTag)
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
