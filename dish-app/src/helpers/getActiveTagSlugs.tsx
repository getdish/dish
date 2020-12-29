import { HomeActiveTagsRecord } from '../app/state/home-types'
import { om } from '../app/state/om'

export function getActiveTagSlugs(tagsRecord?: HomeActiveTagsRecord) {
  return Object.keys(
    tagsRecord ?? om.state.home.currentState['activeTags'] ?? {}
  )
}
