import { getNavigateItemForState } from './getNavigateItemForState'
import { HomeStateTagNavigable } from '../types/homeTypes'
import { router } from '../router'

export function getShouldNavigate(state: HomeStateTagNavigable) {
  const navItem = getNavigateItemForState(state)
  return router.getShouldNavigate(navItem)
}
