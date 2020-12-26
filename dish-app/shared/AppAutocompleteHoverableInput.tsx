import React, { useRef } from 'react'
import { HStack, Hoverable, useMedia } from 'snackui'

import { autocompletesStore } from './AppAutocomplete'
import { useOvermind } from './state/useOvermind'

export const AppAutocompleteHoverableInput = ({
  children,
  input,
  autocompleteTarget,
  backgroundColor,
  borderRadius = 10,
}: {
  children: any
  input?: HTMLInputElement | null
  autocompleteTarget: 'search' | 'location'
  backgroundColor?: string
  borderRadius?: number
}) => {
  const om = useOvermind()
  const tm = useRef<any>(null)
  const tm2 = useRef<any>(null)
  const media = useMedia()

  return (
    <Hoverable
      onHoverOut={() => {
        clearTimeout(tm.current)
        clearTimeout(tm2.current)
      }}
      onHoverMove={() => {
        clearTimeout(tm.current)
        if (om.state.home.currentState.searchQuery) {
          tm.current = setTimeout(() => {
            if (document.activeElement == input) {
              autocompletesStore.setTarget(autocompleteTarget)
            }
          }, 150)
        }
      }}
    >
      {children}
    </Hoverable>
  )
}
