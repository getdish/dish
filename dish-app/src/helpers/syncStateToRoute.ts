import { router } from '../router'
import { HomeStateTagNavigable } from '../types/homeTypes'
import { getNavigateItemForState } from './getNavigateItemForState'
import { getShouldNavigate } from './getShouldNavigate'

// avoid nasty two way sync bugs as much as possible

let recentTries = 0
let synctm

export async function syncStateToRoute(state: HomeStateTagNavigable) {
  const should = getShouldNavigate(state)
  if (should) {
    recentTries++
    clearTimeout(synctm)
    if (recentTries > 3) {
      console.warn('bailing loop')
      recentTries = 0
      // break loop
      return false
    }
    synctm = setTimeout(() => {
      recentTries = 0
    }, 200)
    const navItem = getNavigateItemForState(state)
    router.navigate(navItem)
    return true
  }
  return false
}
