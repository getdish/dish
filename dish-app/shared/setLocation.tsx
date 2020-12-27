import { autocompleteLocationStore } from './AppAutocomplete'
import { inputStoreLocation } from './InputStore'
import { defaultLocationAutocompleteResults } from './state/defaultLocationAutocompleteResults'
import { setDefaultLocation } from './state/getDefaultLocation'
import { getNavigateItemForState } from './state/getNavigateItemForState'
import { om } from './state/om'
import { router } from './state/router'

export function setLocation(val: string) {
  const current = [
    ...autocompleteLocationStore.results,
    ...defaultLocationAutocompleteResults,
  ]
  inputStoreLocation.setValue(val)
  const exact = current.find((x) => x.name === val)
  if (exact?.center) {
    om.actions.home.updateCurrentState({
      center: { ...exact.center },
      currentLocationName: val,
    })
    const curState = om.state.home.currentState
    const navItem = getNavigateItemForState(curState)
    if (router.getShouldNavigate(navItem)) {
      router.navigate(navItem)
    }
    setDefaultLocation({
      center: exact.center,
      span: curState.span,
    })
  } else {
    console.warn('No center found?')
  }
}
