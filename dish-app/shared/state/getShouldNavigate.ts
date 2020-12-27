import { getNavigateItemForState } from './getNavigateItemForState'
import { HomeStateTagNavigable } from './home-types'
import { router } from './router'

export function getShouldNavigate(state: HomeStateTagNavigable) {
  const navItem = getNavigateItemForState(state)
  return router.getShouldNavigate(navItem)
}
