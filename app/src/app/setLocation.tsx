import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { setDefaultLocation } from '../constants/initialHomeState'
import { getNavigateItemForState } from '../helpers/getNavigateItemForState'
import { router } from '../router'
import { appMapStore } from './AppMap'
import { autocompleteLocationStore } from './AutocompletesStore'
import { setKnownLocationSlug } from './home/search/urlSerializers'
import { homeStore } from './homeStore'
import { inputStoreLocation } from './inputStore'

export async function setLocation(name: string, region?: string) {
  const current = [...autocompleteLocationStore.results, ...defaultLocationAutocompleteResults]
  inputStoreLocation.setValue(name)
  const exact = current.find((x) => x.name === name)
  if (!exact) return
  if ('center' in exact) {
    const center = exact.center
    const span = exact.span
    appMapStore.setPosition(exact)
    if (region && center && span) {
      setKnownLocationSlug(region, { center, span })
    }
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
      router.navigate({
        ...navItem,
        data: { name },
      })
    }
  } else {
    console.warn('No center found?')
  }
}
