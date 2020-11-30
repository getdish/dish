import { getActiveTags } from './getActiveTags'
import { HomeStateTagNavigable } from './home-types'
import { isSearchBarTag } from './isSearchBarTag'

// CANNOT IMPORT omStatic causes big issue, must be cylical dep?????

export const shouldBeOnSearch = (state: HomeStateTagNavigable) => {
  const realState = state ?? window['om']?.state.home.currentState
  const hasSearchTag = getActiveTags(realState).some(
    (x) => x.type === 'lense' || isSearchBarTag(x)
  )
  return realState.searchQuery !== '' || hasSearchTag
}
