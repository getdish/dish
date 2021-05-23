import { router } from '../router'
import { HomeStateTagNavigable } from '../types/homeTypes'
import { getNavigateItemForState } from './getNavigateItemForState'

export function getShouldNavigate(state: HomeStateTagNavigable) {
  const navItem = getNavigateItemForState(state)
  return router.getShouldNavigate(navItem)
}
