import { getNavigateItemForState } from '../app/state/getNavigateItemForState'
import { HomeStateTagNavigable } from '../app/state/home-types'
import { router } from '../router'

export function getShouldNavigate(state: HomeStateTagNavigable) {
  const navItem = getNavigateItemForState(state)
  return router.getShouldNavigate(navItem)
}
