import { Store } from '@dish/use-store'
import { debounce } from 'lodash'

import {
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from './helpers/input'
import { omStatic } from './state/omStatic'

export class InputStore extends Store<{ name: 'location' | 'search' }> {
  node: HTMLInputElement | null = null

  setNodeSlow = debounce((view: any) => {
    this.node = view
  })

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
    if (omStatic.state.home.showAutocomplete) {
      omStatic.actions.home.setShowAutocomplete(false)
    }
  }
}
