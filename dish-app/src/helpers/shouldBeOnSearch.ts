import { isSearchBarTag } from './isSearchBarTag'
import { getActiveTags } from './getActiveTags'
import { homeStore } from '../app/homeStore'
import { HomeStateTagNavigable } from '../types/homeTypes'

export const shouldBeOnSearch = (state: HomeStateTagNavigable) => {
  const realState = state ?? homeStore.currentState
  const tags = getActiveTags(realState)
  const hasSearchTag = tags.some((x) => x.type === 'lense' || isSearchBarTag(x))
  return realState.searchQuery !== '' || hasSearchTag
}
