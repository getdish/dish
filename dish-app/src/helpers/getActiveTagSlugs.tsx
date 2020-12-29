import { HomeActiveTagsRecord } from '../app/state/home-types'
import { omStatic } from '../app/state/omStatic'

export function getActiveTagSlugs(tagsRecord?: HomeActiveTagsRecord) {
  return Object.keys(
    tagsRecord ?? omStatic.state.home.currentState['activeTags'] ?? {}
  )
}
