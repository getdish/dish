import { Store, createStore, useStoreInstance } from '@dish/use-store'
import { debounce, throttle } from 'lodash'

import { inputClearSelection, inputGetNode, inputIsTextSelected } from '../helpers/input'
import { autocompletesStore } from './AutocompletesStore'
import { searchPageStore } from './home/search/SearchPageStore'

export class InputStore extends Store<{ name: 'location' | 'search' }> {
  node: HTMLInputElement | null = null
  value: string | null = null
  isFocused = false

  setIsFocused(val: boolean) {
    this.isFocused = val
  }

  focusNode() {
    this.node?.focus()
  }

  // one way sync to set it externally
  setValue(val: string) {
    this.value = val
  }

  moveActive(num: -1 | 1) {
    if (autocompletesStore.visible) {
      autocompletesStore.activeStore?.move(num)
    } else {
      searchPageStore.setIndex(searchPageStore.index + num, 'key')
    }
  }

  setNode(node: HTMLInputElement) {
    this.node = node
  }

  handleEsc() {
    if (!this.node) return
    // esc
    if (document.activeElement === this.node) {
      this.node.blur()
      if (inputIsTextSelected(this.node)) {
        inputClearSelection(this.node)
      }
    }
    autocompletesStore.setVisible(false)
  }
}

export const inputStoreLocation = createStore(InputStore, { name: 'location' })
export const useInputStoreLocation = () => useStoreInstance(inputStoreLocation)
export const inputStoreSearch = createStore(InputStore, { name: 'search' })
export const useInputStoreSearch = () => useStoreInstance(inputStoreSearch)

export const setNodeOnInputStore = (inputStore: InputStore, view: any) => {
  if (!view) return
  const next = inputGetNode(view)
  if (!next || next === inputStore.node) {
    return
  }
  inputStore.setNode(next)
}
