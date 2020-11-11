import { slugify } from '@dish/graph'
import { NavigateItem } from '@dish/router'

import { getRouteFromState } from './getRouteFromState'
import { isHomeState, isSearchState } from './home-helpers'
import { HomeStateTagNavigable } from './home-types'
import { shouldBeOnSearch } from './shouldBeOnSearch'

export const getNavigateItemForState = (
  om: any,
  _nextState: HomeStateTagNavigable
): NavigateItem => {
  const { home, router } = om.state
  const nextState = _nextState ?? home.currentState
  const isHome = isHomeState(nextState)
  const isSearch = isSearchState(nextState)
  const curParams = router.curPage.params

  // we only handle "special" states here (home/search)
  if (!isHome && !isSearch) {
    return {
      name: nextState.type,
      params: curParams,
    }
  }

  // if going home, just go there
  const shouldBeSearching = shouldBeOnSearch(nextState)

  let name = nextState.type
  if (name === 'home' && shouldBeSearching) {
    name = 'search'
  } else if (name === 'search' && !shouldBeSearching) {
    name = 'home'
  }

  const curName = router.curPage.name
  const isChangingType = name !== curName
  const replace = !isChangingType

  if (name === 'home') {
    if (nextState.region) {
      return {
        name: 'homeRegion',
        params: {
          region: nextState.region,
        },
        replace: true,
      }
    }
    return {
      name: 'home',
      replace,
    }
  }

  // build params
  const params = getRouteFromState(nextState)
  if (nextState.searchQuery) {
    params.search = nextState.searchQuery
  }
  if (nextState.type === 'userSearch') {
    params.username = curParams.username
  }

  return {
    name,
    params,
    replace,
  }
}
