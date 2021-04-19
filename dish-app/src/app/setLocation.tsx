import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { setDefaultLocation } from '../constants/initialHomeState'
import { getNavigateItemForState } from '../helpers/getNavigateItemForState'
import { router } from '../router'
import { appMapStore } from './AppMapStore'
import { autocompleteLocationStore } from './AutocompletesStore'
import { homeStore } from './homeStore'
import { inputStoreLocation } from './inputStore'

export async function setLocation(val: string, region?: string) {
  const current = [...autocompleteLocationStore.results, ...defaultLocationAutocompleteResults]
  inputStoreLocation.setValue(val)
  const exact = current.find((x) => x.name === val)
  if (!exact) return
  if ('center' in exact) {
    const center = exact.center
    const span = exact.span
    appMapStore.setPosition(exact)
    setDefaultLocation({
      center,
      span,
    })
    const navItem = getNavigateItemForState({
      ...homeStore.lastHomeOrSearchState,
      center,
      span,
      ...(region && { region }),
    })
    if (router.getShouldNavigate(navItem)) {
      router.navigate(navItem)
    }
  } else {
    console.warn('No center found?')
  }
}
