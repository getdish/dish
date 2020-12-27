import { Store } from '@dish/use-store'
import { debounce } from 'lodash'

import { autocompletesStore } from './AppAutocomplete'
import {
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from './helpers/input'
import { searchPageStore } from './pages/search/SearchPageStore'

export class InputStore extends Store<{ name: 'location' | 'search' }> {
  node: HTMLInputElement | null = null

  setNodeSlow = debounce((view: any) => {
    this.node = view
  })

  moveActive(num: -1 | 1) {
    if (autocompletesStore.active) {
      autocompletesStore.active.move(num)
    } else {
      searchPageStore.setIndex(searchPageStore.index + num, 'key')
    }
  }

  setNode(view: any) {
    if (view) {
      const next = inputGetNode(view)
      if (this.node) {
        // fixes bug on web resizing to small
        this.setNodeSlow(next)
      } else {
        this.node = next
      }
    }
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
