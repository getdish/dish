import { getActiveTags, isSearchBarTag } from './home-tag-helpers'
import { HomeStateTagNavigable } from './home-types'
import { omStatic } from './om'

export const shouldBeOnHome = (state: HomeStateTagNavigable) => {
  const realState =
    state ?? omStatic.state.home.states[omStatic.state.home.states.length - 1]
  return (
    realState.searchQuery === '' &&
    getActiveTags(realState).every((tag) => !isSearchBarTag(tag))
  )
}
