import { slugify } from '@dish/graph'
import { NavigateItem } from '@dish/router'

import { getActiveTags } from './getActiveTags'
import { getTagSlug } from './getTagSlug'
import { isHomeState, isSearchState } from './home-helpers'
import { HomeStateTagNavigable } from './home-types'
import { tagLenses } from './localTags.json'
import { SearchRouteParams } from './router'
import { shouldBeOnSearch } from './shouldBeOnSearch'
import { SPLIT_TAG, SPLIT_TAG_TYPE } from './SPLIT_TAG'

export const getNavigateItemForState = (
  om: any,
  _state: HomeStateTagNavigable
): NavigateItem => {
  const { home, router } = om.state
  const state = _state || home.currentState
  const isHome = isHomeState(state)
  const isSearch = isSearchState(state)
  const curParams = router.curPage.params

  // we only handle "special" states here (home/search)
  if (!isHome && !isSearch) {
    return {
      name: state.type,
      params: curParams,
    }
  }
  // if going home, just go there
  const shouldBeSearching = shouldBeOnSearch(state)

  let name = state.type
  if (name === 'home' && shouldBeSearching) {
    name = 'search'
  } else if (name === 'search' && !shouldBeSearching) {
    name = 'home'
  }

  const curName = router.curPage.name
  const isChangingType = name !== curName
  const replace = !isChangingType

  if (name === 'home') {
    return {
      name: 'home',
      replace,
    }
  }

  // build params
  const params = getRouteFromState(state)

  params.location = slugify(
    state.currentLocationName ?? home.currentState.currentLocationName ?? 'here'
  )

  if (state.searchQuery) {
    params.search = state.searchQuery
  }
  if (state.type === 'userSearch') {
    params.username = curParams.username
  }

  return {
    name,
    params,
    replace,
  }
}

const getRouteFromState = (state: HomeStateTagNavigable): SearchRouteParams => {
  if (!isHomeState(state) && !isSearchState(state)) {
    throw new Error(`Getting route on bad state`)
  }
  const allActiveTags = getActiveTags(state)
  // build our final path segment
  const filterTags = allActiveTags.filter((x) => x.type === 'filter')
  const otherTags = allActiveTags.filter(
    (x) => x.type !== 'lense' && x.type !== 'filter'
  )
  let tags = `${filterTags.map((x) => slugify(x.name ?? '')).join(SPLIT_TAG)}`
  if (otherTags.length) {
    if (tags.length) {
      tags += SPLIT_TAG
    }
    tags += `${otherTags
      .map((t) => `${t.type}${SPLIT_TAG_TYPE}${slugify(t.name ?? '')}`)
      .join(SPLIT_TAG)}`
  }
  const params: any = {
    location: slugify(state.currentLocationName ?? 'here'),
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
