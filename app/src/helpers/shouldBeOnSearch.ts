import { homeStore } from '../app/homeStore'
import { HomeStateTagNavigable } from '../types/homeTypes'
import { getActiveTags } from './getActiveTags'

export const shouldBeOnSearch = (state: HomeStateTagNavigable) => {
  const realState = state || homeStore.currentState
  const tags = getActiveTags(realState)
  const next = realState.searchQuery !== '' || tags.some((x) => x.type !== 'filter')
  return next
}
