import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { setDefaultLocation } from '../constants/initialHomeState'
import { getNavigateItemForState } from '../helpers/getNavigateItemForState'
import { router } from '../router'
import { AppMapPosition } from '../types/mapTypes'
import { autocompleteLocationStore } from './AutocompletesStore'
import { appMapStore } from './appMapStore'
import { setKnownLocationSlug } from './home/search/urlSerializers'
import { homeStore } from './homeStore'
import { inputStoreLocation } from './inputStore'

export async function setLocationFromAutocomplete(name: string, region?: string) {
  const current = [...autocompleteLocationStore.results, ...defaultLocationAutocompleteResults]
  const exact = current.find((x) => x.name === name)
  if (!exact) return
  if (!('center' in exact)) {
    console.warn('No center found?')
  }
  setLocation({ region, ...exact, name })
}

export async function setLocation(
  props: Partial<AppMapPosition> & { region?: string; name: string }
) {
  const { name, region, center, span, ...position } = props
  inputStoreLocation.setValue(name)
  appMapStore.setPosition({ center, span, ...position })
  if (region && center && span) {
    setKnownLocationSlug(region, { center, span })
  }
  setDefaultLocation({
    center,
    span,
  })
  const navItem = getNavigateItemForState(
    {
      ...homeStore.lastHomeOrSearchState,
      center,
      span,
      ...(region && { region }),
    },
    homeStore.currentState
  )
  if (router.getShouldNavigate(navItem)) {
    router.navigate({
      ...navItem,
      data: { name },
    })
  }
}
