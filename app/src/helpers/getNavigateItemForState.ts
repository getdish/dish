import { isLngLatParam, urlSerializers } from '../app/home/search/urlSerializers'
import { homeStore } from '../app/homeStore'
import { tagLenses } from '../constants/localTags'
import { SPLIT_TAG } from '../constants/SPLIT_TAG'
import { NavigateItem, SearchRouteParams, router } from '../router'
import { HomeStateTagNavigable } from '../types/homeTypes'
import { getActiveTags } from './getActiveTags'
import { isHomeState, isSearchState } from './homeStateHelpers'
import { shouldBeOnSearch } from './shouldBeOnSearch'

export const getNavigateItemForState = (state: HomeStateTagNavigable): NavigateItem => {
  if (!state) {
    throw new Error(`provide currentState at least`)
  }

  const curHomeStateType = homeStore.currentState.type

  // only handle "special" states here (home/search)
  if (!isHomeState(state) && !isSearchState(state)) {
    return {
      name: state.type,
      params: router.curPage.params,
    }
  }

  const params = getParamsForState(state)
  const curState = homeStore.currentState
  const name = getNameForState(state)
  const isChangingType = name !== curHomeStateType
  // for now we change the region into a lng_lat, but that shouldn't create a new state
  const isGeo = isLngLatParam(params.region || '')
  // nullish region = replacing to geo-coordinates
  const isChangingRegion = state.region && state.region !== curState['region']
  const replace = isGeo ? true : !isChangingType && !isChangingRegion

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
          lense = tag.slug.replace('lenses__', '').replace('filters__', 'f_')
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
