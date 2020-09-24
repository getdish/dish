import { Store } from '@dish/use-store'
import { debounce } from 'lodash'

import { inputGetNode } from './helpers/input'

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
}
