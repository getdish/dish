import { series, sleep } from '@dish/async'
import { reaction } from '@dish/use-store'
import { useEffect } from 'react'

import { autocompletesStore } from '../AppAutocomplete'
import { InputStore } from '../inputStore'

export function useAutocompleteInputFocus(inputStore: InputStore) {
  useEffect(() => {
    return reaction(
      autocompletesStore,
      (store) => store.visible && store.target === inputStore.props.name,
      (visible) => {
        if (!visible) return
        return series([
          () => sleep(100),
          () => {
            inputStore.focusNode()
          },
        ])
      }
    )
  }, [])
}
