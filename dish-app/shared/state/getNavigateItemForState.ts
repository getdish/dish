import { slugify } from '@dish/graph'
import { NavigateItem } from '@dish/router'

import { getActiveTags } from './getActiveTags'
import { getTagSlug } from './getTagSlug'
import { isHomeState, isSearchState } from './home-helpers'
import { HomeStateItem, HomeStateTagNavigable } from './home-types'
import { tagLenses } from './localTags'
import { SearchRouteParams, router } from './router'
import { shouldBeOnSearch } from './shouldBeOnSearch'
import { SPLIT_TAG } from './SPLIT_TAG'

export const getNavigateItemForState = (state: HomeStateItem): NavigateItem => {
  if (!state) {
    throw new Error(`provide currentState at least`)
  }

  // only handle "special" states here (home/search)
  if (!isHomeState(state) && !isSearchState(state)) {
    return {
      name: state.type,
      params: router.curPage.params,
    }
  }

  const curName = router.curPage.name
  const name = getNameForState(state)
  const isChangingType = name !== curName
  const replace = !isChangingType
  const params = getParamsForState(state)
  return {
    name,
    params,
    replace,
  }
}

const getNameForState = (state: HomeStateTagNavigable) => {
  if (shouldBeOnSearch(state)) {
    return 'search'
  }
  if (state.region) {
    return 'homeRegion'
  }
  return 'home'
}

const getParamsForState = (state: HomeStateTagNavigable) => {
  if (isHomeState(state) || isSearchState(state)) {
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
    const lenseTag =
      allActiveTags.find((x) => x.type === 'lense') ?? tagLenses[0]
    const params: SearchRouteParams = {
      region: state.region ?? slugify(state.currentLocationName ?? 'here'),
      tags: tags.length ? tags : '-',
      search: state.searchQuery,
      lense: getTagSlug(lenseTag).replace('lenses__', ''),
    }
    return params
  }

  // none other for now
  return {}
}
