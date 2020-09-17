import { Store } from '@dish/use-store'

import { inputGetNode } from './helpers/input'

export class InputStore extends Store<{ name: 'location' | 'search' }> {
  node: HTMLInputElement | null = null

  setNode(view: any) {
    if (view) {
      this.node = inputGetNode(view)
    }
  }
}
