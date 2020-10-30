import { allTags } from '../state/allTags'
import { HomeActiveTagsRecord } from '../state/home-types'
import { omStatic } from '../state/omStatic'

export function getCurrentTagNames(tagsRecord?: HomeActiveTagsRecord) {
  const activeTags =
    tagsRecord ?? omStatic.state.home.currentState['activeTags'] ?? {}
  return Object.keys(activeTags ?? {}).map((tagId) => {
    return allTags[tagId].name
  })
}
