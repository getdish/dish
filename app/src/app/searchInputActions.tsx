import { isWebIOS } from '../helpers/isIOS'
import { homeStore } from './homeStore'

// avoid first one on iniital focus

export let avoidNextFocus = true
export function setAvoidNextAutocompleteShowOnFocus(val = true) {
  avoidNextFocus = val
}

export const onFocusAnyInput = () => {
  if (homeStore.searchbarFocusedTag) {
    homeStore.setSearchBarFocusedTag(null)
  }
}

export function focusSearchInput() {
  if (isWebIOS) return
  if (avoidNextFocus) {
    avoidNextFocus = false
    return
  }
  searchBar?.focus?.()
}

export let searchBar: HTMLInputElement | null = null
export const setSearchBar = (x: typeof searchBar) => {
  searchBar = x
}

export function blurSearchInput() {
  if (typeof document === 'undefined' || document.activeElement === searchBar) {
    searchBar?.blur()
  }
}

export const getSearchInput = () => {
  return searchBar
}
