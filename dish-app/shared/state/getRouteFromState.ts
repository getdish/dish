import { slugify } from '@dish/graph'

import { getActiveTags } from './getActiveTags'
import { getTagSlug } from './getTagSlug'
import { isHomeState, isSearchState } from './home-helpers'
import { HomeStateTagNavigable } from './home-types'
import { tagLenses } from './localTags.json'
import { SearchRouteParams } from './router'
import { SPLIT_TAG, SPLIT_TAG_TYPE } from './SPLIT_TAG'

export const getRouteFromState = (
  state: HomeStateTagNavigable
): SearchRouteParams => {
  if (!isHomeState(state) && !isSearchState(state)) {
    throw new Error(`Getting route on bad state`)
  }
  const allActiveTags = getActiveTags(state)
  // build our final path segment
  const filterTags = allActiveTags.filter((x) => x.type === 'filter')
  const otherTags = allActiveTags.filter(
    (x) => x.type !== 'lense' && x.type !== 'filter'
  )
  let tags = `${filterTags.map((x) => x.slug).join(SPLIT_TAG)}`
  if (otherTags.length) {
    if (tags.length) {
      tags += SPLIT_TAG
    }
    tags += `${otherTags.map((t) => t.slug).join(SPLIT_TAG)}`
  }
  const params: any = {
    region: state.region ?? slugify(state.currentLocationName ?? 'here'),
  }
  const lenseTag = allActiveTags.find((x) => x.type === 'lense') ?? tagLenses[0]

  if (lenseTag) {
    params.lense = getTagSlug(lenseTag).replace('lenses__', '')
  }
  if (tags.length) {
    params.tags = tags
  } else {
    params.tags = '-'
  }
  return params
}
