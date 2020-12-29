import { isSearchBarTag } from '../../helpers/isSearchBarTag'
import { getActiveTags } from './getActiveTags'
import { HomeStateTagNavigable } from './home-types'

export const shouldBeOnSearch = (state: HomeStateTagNavigable) => {
  const realState = state ?? window['om']?.state.home.currentState
  const tags = getActiveTags(realState)
  const hasSearchTag = tags.some((x) => x.type === 'lense' || isSearchBarTag(x))
  return realState.searchQuery !== '' || hasSearchTag
}
