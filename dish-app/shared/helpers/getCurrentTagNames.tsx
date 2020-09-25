import { allTags } from '../state/allTags'
import { HomeActiveTagsRecord } from '../state/home-types'
import { omStatic } from '../state/omStatic'

export function getCurrentTagNames(tagsRecord?: HomeActiveTagsRecord) {
  const activeTagIds =
    tagsRecord ?? omStatic.state.home.currentState['activeTagIds'] ?? {}
  return Object.keys(activeTagIds ?? {}).map((tagId) => {
    return allTags[tagId].name
  })
}
