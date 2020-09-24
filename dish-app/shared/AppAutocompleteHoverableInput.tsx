import { Hoverable } from '@dish/ui'
import React, { useRef } from 'react'

import { useOvermind } from './state/om'

export const AppAutocompleteHoverableInput = ({
  children,
  input,
  autocompleteTarget,
}: {
  children: any
  input?: HTMLInputElement | null
  autocompleteTarget: 'search' | 'location'
}) => {
  const om = useOvermind()
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
        if (om.state.home.currentState.searchQuery) {
          tm.current = setTimeout(() => {
            if (document.activeElement == input) {
              om.actions.home.setShowAutocomplete(autocompleteTarget)
            }
          }, 150)
        }
      }}
    >
      {children}
    </Hoverable>
  )
}
