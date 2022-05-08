import { isLngLatParam, urlSerializers } from '../app/home/search/urlSerializers'
import { homeStore } from '../app/homeStore'
import { SPLIT_TAG } from '../constants/SPLIT_TAG'
import { initialHomeState } from '../constants/initialHomeState'
import { tagLenses } from '../constants/localTags'
import { NavigateItem, SearchRouteParams, router } from '../router'
import { HomeStateItem, HomeStateTagNavigable } from '../types/homeTypes'
import { getActiveTags } from './getActiveTags'
import { isHomeState, isSearchState } from './homeStateHelpers'
import { shouldBeOnSearch } from './shouldBeOnSearch'

export const getNavigateItemForState = (
  inState: HomeStateTagNavigable,
  currentState: HomeStateItem
): NavigateItem => {
  if (!inState) {
    throw new Error(`provide currentState at least`)
  }

  const curHomeStateType = currentState.type

  // only handle "special" states here (home/search)
  if (!isHomeState(inState) && !isSearchState(inState)) {
    return {
      name: inState.type,
      params: router.curPage.params,
    }
  }

  const state = {
    ...inState,
    region:
      inState.region ??
      currentState['region'] ??
      homeStore.lastHomeOrSearchState.region ??
      initialHomeState.region,
  }

  const params = getParamsForState(state)
  const name = getNameForState(state)
  const isChangingType = name !== curHomeStateType
  // for now we change the region into a lng_lat, but that shouldn't create a new state

  const isGeo = isLngLatParam(state.region)
  // nullish region = replacing to geo-coordinates
  const isChangingRegion = state.region && state.region !== curState['region']
  const replace = isGeo ? true : isChangingType || isChangingRegion ? false : true

  return {
    name,
    params,
    replace,
    data: state,
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
const getParamsForState = (state: HomeStateTagNavigable): SearchRouteParams | any => {
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
          lense = tag.slug.replace('lenses__', '').replace('filters__', 'f_') as any
          break
        case 'country':
          addTag(`in-${tag.slug}`)
          break
        default:
          addTag(tag.slug)
      }
    }

    const serializer = urlSerializers[state.type]
    if (!serializer) {
      throw new Error(`no serializer`)
    }
    return {
      region: serializer.region.serialize(state as any),
      tags: tags || '-',
      search: state.searchQuery,
      lense,
    }
  }

  // none other for now
  return {}
}
