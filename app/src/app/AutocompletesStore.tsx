import { Store, createStore, useStoreInstance } from '@dish/use-store'
import { clamp, debounce } from 'lodash'
import { useEffect } from 'react'
import { Keyboard } from 'react-native'

import { AutocompleteItem } from '../helpers/createAutocomplete'
import { useRouterCurPage } from '../router'

class AutocompletesStore extends Store {
  visible: 'partial' | true | false = false
  target: AutocompleteTarget = 'search'

  setVisible(n: boolean) {
    this.visible = n
  }

  setTarget(n: AutocompleteTarget, fullyVisible = !!n) {
    this.visible = fullyVisible == false ? 'partial' : true
    this.target = n
  }

  get activeStore() {
    if (!this.visible) return null
    if (this.target === 'location') return autocompleteLocationStore
    return autocompleteSearchStore
  }
}

export type ShowAutocomplete = 'search' | 'location' | false

export type AutocompleteTarget = 'search' | 'location'

export const autocompletesStore = createStore(AutocompletesStore)

export class AutocompleteStore extends Store<{ target: AutocompleteTarget }> {
  index = 0
  query = ''
  results: AutocompleteItem[] = []
  isLoading = false

  get activeResult() {
    return this.results[this.index]
  }

  setQuery(next: string) {
    this.query = next
  }

  setIsLoading(n: boolean) {
    this.isLoading = n
  }

  setResults(results: AutocompleteItem[]) {
    this.index = 0
    this.results = results ?? []
  }

  move(val: -1 | 1) {
    this.setIndex(this.index + val)
  }

  setIndex(val: number) {
    this.index = clamp(val, 0, this.results.length - 1)
  }
}

export const autocompleteLocationStore = createStore(AutocompleteStore, {
  target: 'location',
})

export const autocompleteSearchStore = createStore(AutocompleteStore, {
  target: 'search',
})

export function AutocompleteEffects() {
  useAppAutocompleteEffects()
  return null
}

export const useAppAutocompleteEffects = () => {
  const autocompletes = useStoreInstance(autocompletesStore)

  useEffect(() => {
    // debounce to go after press event
    // ⚠️ NOTE: if your software keyboard is off on simulator, this will flicker and kill autocomplete right away
    const handleHide = () => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('this may be just because software keyboard is off! turn it on')
      }
      autocompletes.setVisible(false)
    }
    const handleShow = () => {
      // handleHide.cancel()
    }
    Keyboard.addListener('keyboardWillHide', handleHide)
    Keyboard.addListener('keyboardWillShow', handleShow)
    return () => {
      Keyboard.removeListener('keyboardWillHide', handleHide)
      Keyboard.removeListener('keyboardWillShow', handleShow)
    }
  }, [])

  const curPage = useRouterCurPage()
  useEffect(() => {
    autocompletes.setVisible(false)
  }, [curPage])
}
