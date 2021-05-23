import { tagLenses } from '../constants/localTags'
import { HomeActiveTagsRecord } from '../types/homeTypes'

export function ensureLenseTag(tags: HomeActiveTagsRecord) {
  if (!Object.keys(tags).some((x) => tags[x] && x.startsWith('lenses__'))) {
    return {
      ...tags,
      [tagLenses[0].slug]: true,
    }
  }
  return tags
}
