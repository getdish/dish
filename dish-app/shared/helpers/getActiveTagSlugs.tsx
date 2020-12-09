import { HomeActiveTagsRecord } from '../state/home-types'
import { omStatic } from '../state/omStatic'

export function getActiveTagSlugs(tagsRecord?: HomeActiveTagsRecord) {
  return Object.keys(
    tagsRecord ?? omStatic.state.home.currentState['activeTags'] ?? {}
  )
}
