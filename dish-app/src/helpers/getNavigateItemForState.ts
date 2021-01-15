import { findLast } from 'lodash'

import { homeStore } from '../app/homeStore'
import { tagLenses } from '../constants/localTags'
import { SPLIT_TAG } from '../constants/SPLIT_TAG'
import { NavigateItem, SearchRouteParams, router } from '../router'
import {
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemSearch,
  HomeStateTagNavigable,
} from '../types/homeTypes'
import { getActiveTags } from './getActiveTags'
import { getTagSlug } from './getTagSlug'
import { isHomeState, isSearchState } from './homeStateHelpers'
import { shouldBeOnSearch } from './shouldBeOnSearch'

export const getNavigateItemForState = (
  state: Partial<HomeStateItem> & Pick<HomeStateItem, 'type'>
): NavigateItem => {
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
  // @ts-expect-error
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
  // always go to homeRegion not home
  return 'homeRegion'
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
    const prev = findLast(
      homeStore.states,
      (x) => isHomeState(x) || isSearchState(x)
    ) as HomeStateItemHome | HomeStateItemSearch
    const params: SearchRouteParams = {
      region: state.region ?? prev?.region ?? 'ca-san-francisco',
      tags: tags.length ? tags : '-',
      search: state.searchQuery,
      lense: getTagSlug(lenseTag).replace('lenses__', ''),
    }
    return params
  }

  // none other for now
  return {}
}
