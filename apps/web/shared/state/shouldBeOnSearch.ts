import { getActiveTags, isSearchBarTag } from './home-tag-helpers'
import { HomeStateTagNavigable } from './home-types'
import { omStatic } from './om'

export const shouldBeOnSearch = (state: HomeStateTagNavigable) => {
  const realState = state ?? omStatic.state.home.currentState
  const hasSearchTag = getActiveTags(realState).some(
    (x) => x.type === 'lense' || isSearchBarTag(x)
  )
  return realState.searchQuery !== '' || hasSearchTag
}
