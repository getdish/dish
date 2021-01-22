import { HomeStateItem } from '../types/homeTypes'
import { memoize } from './memoizeWeak'

export const getActiveTags = memoize((state: Partial<HomeStateItem>) => {
  if (!('activeTags' in state)) return []
  const { activeTags } = state
  return activeTags ? Object.keys(activeTags).filter((x) => activeTags[x]) : []
})
