import { homeStore } from '../app/homeStore'
import { HomeStateTagNavigable } from '../types/homeTypes'
import { getActiveTags } from './getActiveTags'
import { isSearchBarTag } from './isSearchBarTag'

export const shouldBeOnSearch = (state: HomeStateTagNavigable) => {
  const realState = state ?? homeStore.currentState
  const tags = getActiveTags(realState)
  if (!tags.some) debugger
  const hasSearchTag = tags.some((x) => x.type === 'lense' || isSearchBarTag(x))
  return realState.searchQuery !== '' || hasSearchTag
}
