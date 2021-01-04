import { homeStore } from '../app/homeStore'
import { HomeActiveTagsRecord } from '../types/homeTypes'

export function getActiveTagSlugs(tagsRecord?: HomeActiveTagsRecord) {
  return Object.keys(tagsRecord ?? homeStore.currentState['activeTags'] ?? {})
}
