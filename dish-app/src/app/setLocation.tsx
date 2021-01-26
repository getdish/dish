import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { setDefaultLocation } from '../constants/initialHomeState'
import { getNavigateItemForState } from '../helpers/getNavigateItemForState'
import { router } from '../router'
import { autocompleteLocationStore } from './AppAutocomplete'
import { appMapStore } from './AppMapStore'
import { homeStore } from './homeStore'
import { inputStoreLocation } from './inputStore'

export async function setLocation(val: string) {
  const current = [
    ...autocompleteLocationStore.results,
    ...defaultLocationAutocompleteResults,
  ]
  inputStoreLocation.setValue(val)
  const exact = current.find((x) => x.name === val)
  if (!exact) return
  if ('center' in exact) {
    const curState = homeStore.currentState
    const center = exact.center
    const span = exact.span
    console.log('need to set info', val)
    appMapStore.setPosition(exact)
    setDefaultLocation({
      center,
      span,
    })
    const navItem = getNavigateItemForState(curState)
    if (router.getShouldNavigate(navItem)) {
      router.navigate(navItem)
    }
  } else {
    console.warn('No center found?')
  }
}
