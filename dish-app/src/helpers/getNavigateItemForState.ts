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
import { NavigableTag } from '../types/tagTypes'
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

// this function is written quite functionally
// and called often, maybe worth profiling
const getParamsForState = (
  state: HomeStateTagNavigable
): SearchRouteParams | any => {
  if (isHomeState(state) || isSearchState(state)) {
    const allActiveTags = getActiveTags(state)
    let tags = ''
    let lense = tagLenses[0].slug
    const addTag = (slug: string) => {
      if (tags.length) tags += SPLIT_TAG
      tags += slug
    }
    for (const tag of allActiveTags) {
      if (!tag.slug) {
        continue
      }
      switch (tag.type) {
        case 'lense': // dont add to tags str its in a diff route segment
          lense = tag.slug.replace('lenses__', '')
          break
        case 'country':
          addTag(`in-${tag.slug}`)
          break
        default:
          addTag(tag.slug)
      }
    }
    const prev = homeStore.lastHomeOrSearchState
    return {
      region: state.region ?? prev?.region ?? 'ca-san-francisco',
      tags: tags.length ? tags : '-',
      search: state.searchQuery,
      lense,
    }
  }

  // none other for now
  return {}
}
