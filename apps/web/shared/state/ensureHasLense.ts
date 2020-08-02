import { HomeActiveTagsRecord } from './home-types'
import { omStatic } from './useOvermind'

export function ensureHasLense(activeTagIds: HomeActiveTagsRecord) {
  if (
    !Object.keys(activeTagIds)
      .filter((k) => activeTagIds[k])
      .some((k) => omStatic.state.home.allTags[k]?.type === 'lense')
  ) {
    // need to add lense!
    activeTagIds['gems'] = true
  }
}
