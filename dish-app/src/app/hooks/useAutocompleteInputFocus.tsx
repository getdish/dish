import { series, sleep } from '@dish/async'
import { reaction } from '@dish/use-store'
import { useEffect } from 'react'

import { isWeb } from '../../constants/constants'
import { autocompletesStore } from '../AutocompletesStore'
import { InputStore } from '../inputStore'

export function useAutocompleteInputFocus(inputStore: InputStore) {
  useEffect(() => {
    return reaction(
      autocompletesStore,
      (store) => store.visible && store.target === inputStore.props.name,
      function autocompleteVisibleToFocus(visible) {
        if (!visible) return
        return series([
          () => sleep(isWeb ? 200 : 30),
          () => {
            console.log('focusing input')
            inputStore.focusNode()
          },
        ])
      }
    )
  }, [])
}
