import { series, sleep } from '@dish/async'
import { isPresent } from '@dish/helpers'
import { Theme, useDebounceValue } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useCallback, useEffect } from 'react'

import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { AutocompleteItemFull, AutocompleteItemLocation } from '../helpers/createAutocomplete'
import { locationToAutocomplete, searchLocations } from '../helpers/searchLocations'
import { appMapStore } from './appMapStore'
import { AutocompleteFrame } from './AutocompleteFrame'
import { AutocompleteResults } from './AutocompleteResults'
import { autocompleteLocationStore, autocompletesStore } from './AutocompletesStore'
import { drawerStore } from './drawerStore'
import { filterAutocompletes } from './filterAutocompletes'
import { useInputStoreLocation } from './inputStore'
import { setLocationFromAutocomplete } from './setLocation'

export const AppAutocompleteLocation = memo(() => {
  return (
    <Theme name="dark">
      <Suspense fallback={null}>
        <AutocompleteFrame target="location">
          <AutocompleteLocationInner />
        </AutocompleteFrame>
      </Suspense>
    </Theme>
  )
})

const AutocompleteLocationInner = memo(() => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const store = useStoreInstance(autocompleteLocationStore)
  const inputStore = useInputStoreLocation()
  const query = useDebounceValue(inputStore.value, 250)

  useEffect(() => {
    query && store.setIsLoading(true)
  }, [query])

  useEffect(() => {
    store.setResults(defaultLocationAutocompleteResults)
  }, [])

  useEffect(() => {
    if (!query) return
    let results: AutocompleteItemFull[] = []
    const position = appMapStore.position
    return series([
      async () => {
        const locationResults = await searchLocations(query, position.center)
        results = [
          ...locationResults.map(locationToAutocomplete).filter(isPresent),
          ...defaultLocationAutocompleteResults,
        ]
      },
      // allow cancel
      () => sleep(30),
      async () => {
        results = await filterAutocompletes(query, results)
      },
      () => {
        store.setResults(results)
      },
      () => {
        store.setIsLoading(false)
      },
    ])
  }, [query])

  const handleSelect = useCallback((result: AutocompleteItemLocation) => {
    setLocationFromAutocomplete(result.name, result.slug)
    autocompletes.setVisible(false)
    // changing location = change drawer to show
    if (drawerStore.snapIndex === 0) {
      drawerStore.setSnapIndex(1)
    }
  }, [])

  return (
    <>
      <AutocompleteResults target="location" onSelect={handleSelect} />
    </>
  )
})
