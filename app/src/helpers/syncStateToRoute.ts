import { router } from '../router'
import { HomeStateTagNavigable } from '../types/homeTypes'
import { getNavigateItemForState } from './getNavigateItemForState'
import { getShouldNavigate } from './getShouldNavigate'
import { loopPreventer } from './loopPreventer'

const checkLoop = loopPreventer({
  max: 4,
  per: 0.5,
})

export async function syncStateToRoute(state: HomeStateTagNavigable) {
  const navItem = getNavigateItemForState(state)
  const should = getShouldNavigate(navItem)
  if (should) {
    checkLoop()
    const navItem = getNavigateItemForState(state)
    router.navigate(navItem)
    return true
  }
  return false
}
