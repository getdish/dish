import { homeStore } from '../app/state/home'
import { HomeActiveTagsRecord } from '../app/state/home-types'

export function getActiveTagSlugs(tagsRecord?: HomeActiveTagsRecord) {
  return Object.keys(tagsRecord ?? homeStore.currentState['activeTags'] ?? {})
}
