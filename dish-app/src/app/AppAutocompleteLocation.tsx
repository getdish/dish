import { series, sleep } from '@dish/async'
import { isPresent } from '@dish/helpers'
import { useStoreInstance } from '@dish/use-store'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { Theme, useDebounceValue } from 'snackui'

import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { AutocompleteItemFull, AutocompleteItemLocation } from '../helpers/createAutocomplete'
import { locationToAutocomplete, searchLocations } from '../helpers/searchLocations'
import { appMapStore } from './AppMapStore'
import { AutocompleteFrame, AutocompleteResults } from './AutocompleteFrame'
import { autocompleteLocationStore, autocompletesStore } from './AutocompletesStore'
import { drawerStore } from './drawerStore'
import { filterAutocompletes } from './filterAutocompletes'
import { useInputStoreLocation } from './inputStore'
import { setLocation } from './setLocation'

export const AppAutocompleteLocation = memo(() => {
  return (
    <Theme name="dark">
      <AutocompleteFrame target="location">
        {useMemo(
          () => (
            <AutocompleteLocationInner />
          ),
          []
        )}
      </AutocompleteFrame>
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
    setLocation(result.name, result.slug)
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
