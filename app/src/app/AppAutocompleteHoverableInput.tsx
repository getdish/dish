import React, { useRef } from 'react'
import { Hoverable, isTouchDevice } from 'snackui'

import { autocompletesStore } from './AutocompletesStore'
import { homeStore } from './homeStore'

export function AppAutocompleteHoverableInput({
  children,
  input,
  autocompleteTarget,
}: {
  children: any
  input?: HTMLInputElement | null
  autocompleteTarget: 'search' | 'location'
}) {
  if (isTouchDevice) {
    return children
  }
  const tm = useRef<any>(null)
  const tm2 = useRef<any>(null)
  return (
    <Hoverable
      onHoverOut={() => {
        clearTimeout(tm.current)
        clearTimeout(tm2.current)
      }}
      onHoverMove={() => {
        clearTimeout(tm.current)
        tm.current = setTimeout(() => {
          if (homeStore.currentState.searchQuery) {
            if (document.activeElement == input) {
              autocompletesStore.setTarget(autocompleteTarget)
            }
          }
        }, 150)
      }}
    >
      {children}
    </Hoverable>
  )
}
