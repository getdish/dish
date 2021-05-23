import { homeStore } from '../app/homeStore'
import { HomeActiveTagsRecord } from '../types/homeTypes'

export function getActiveTagSlugs(tagsRecord?: HomeActiveTagsRecord) {
  const obj = tagsRecord ?? homeStore.currentState['activeTags'] ?? {}
  return Object.keys(obj).filter((x) => obj[x])
}
